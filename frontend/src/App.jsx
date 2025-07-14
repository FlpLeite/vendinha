import React, { useState } from 'react'
import {Store, Users, BarChart3} from 'lucide-react'
import Dividas from './Pages/Dividas/Dividas'
import ClientesList from './Pages/Clientes/ClientesList'
import ClienteForm from './components/ClienteForm'
import DividaForm from './components/DividaForm'
import ClientePerfilModal from './components/ClientePerfilModal'
import {criarDivida, listarDividas, pagarDivida, excluirCliente, atualizarCliente,  obterCliente} from './services/clienteService'
import LoginForm from './Pages/Auth/LoginForm'
import CadastroForm from './Pages/Auth/CadastroForm'
import { login as loginUsuario, cadastrar as cadastrarUsuario } from './services/usuarioService'
import ErrorModal from './components/ErroModal'
import ReciboModal from './components/ReciboModal'

export default function App() {
    const [usuario, setUsuario] = useState(() => {
        const u = localStorage.getItem('usuario');
        return u ? JSON.parse(u) : null;
    })
    const [mostrarCadastro, setMostrarCadastro] = useState(false)
    const [telaAtiva, setTelaAtiva] = useState('dashboard')
    const [clientes, setClientes] = useState([])
    const [dividas, setDividas] = useState([])
    const [pagamentos] = useState([])
    const [mostrarFormCliente, setMostrarFormCliente] = useState(false)
    const [mostrarFormDivida, setMostrarFormDivida] = useState(false)
    const [clienteFormDivida, setClienteFormDivida] = useState('')
    const [perfilAberto, setPerfilAberto] = useState(false)
    const [clienteSelecionado, setClienteSelecionado] = useState(null)
    const [erro, setErro] = useState('')
    const [refreshClientes, setRefreshClientes] = useState(0)
    const [refreshDividas, setRefreshDividas] = useState(0)
    const [reciboInfo, setReciboInfo] = useState(null)

    async function handleLogin(dados) {
        const { status, data } = await loginUsuario(dados.email, dados.password)
        if (status === 200) {
            setUsuario(data)
            localStorage.setItem('usuario', JSON.stringify(data))
        } else {
            const msg = typeof data === 'string' ? data : JSON.stringify(data)
            setErro(`Erro ${status}: ${msg}`)
        }
    }

    async function handleCadastro(dados) {
        const { status, data } = await cadastrarUsuario({
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone,
            password: dados.password,
        })
        if (status === 200) {
            setUsuario(data)
            localStorage.setItem('usuario', JSON.stringify(data))
            setMostrarCadastro(false)
        } else {
            const msg = typeof data === 'string' ? data : JSON.stringify(data)
            setErro(`Erro ${status}: ${msg}`)
        }
    }

    function handleLogout() {
        setUsuario(null)
        localStorage.removeItem('usuario')
    }

    function calcularStats() {
        const pendentes = dividas.filter(d => !d.situacao)
        const pagos = dividas.filter(d => d.situacao)
        return {
            totalClientes: clientes.length,
            totalDividas: pendentes.length,
            valorTotalPendente: pendentes.reduce((sum, d) => sum + d.valor, 0),
            valorTotalPago: pagos.reduce((sum, d) => sum + d.valor, 0),
        }
    }

    function handleSalvarCliente(novo) {
        setClientes(prev => [...prev, { ...novo, id: Date.now().toString() }])
        setMostrarFormCliente(false)
        setRefreshClientes(c => c + 1)
        setRefreshDividas(d => d + 1)
    }

    async function handleSalvarDivida({clienteId, descricao, valor}) {
        const {status, data} = await criarDivida(clienteId, {descricao, valor, usuarioId: usuario.id})
        if (status === 201) {
            setDividas(prev => [
                ...prev,
                {
                    id: data.id.toString(),
                    clienteId,
                    descricao: data.descricao,
                    valor: data.valor,
                    situacao: data.situacao,
                    dataCriacao: data.dataCriacao,
                    dataPagamento: data.dataPagamento,
                },
            ])
            setMostrarFormDivida(false)
            setPerfilAberto(true)
            setRefreshDividas(d => d + 1)
            setRefreshClientes(c => c + 1)
            setErro('')
        } else {
            const msg = typeof data === 'string' ? data : JSON.stringify(data)
            setErro(`Erro ${status}: ${msg}`)
        }
    }

    async function handleMarcarPago(clienteId, id) {
        const {status, data} = await pagarDivida(clienteId, id, usuario.id)
        if (status === 200) {
            if (clienteSelecionado && clienteSelecionado.id === clienteId) {
                setDividas(prev =>
                    prev.map(d =>
                        d.id === id
                            ? {
                                ...d,
                                situacao: true,
                                dataPagamento: data.dataPagamento,
                            }
                            : d
                    )
                )
            }
            setRefreshDividas(d => d + 1)
            setRefreshClientes(c => c + 1)

            let cliente = clientes.find(c => c.id === clienteId)
            if (!cliente) {
                const res = await obterCliente(clienteId)
                if (res.status === 200) cliente = res.data
            }
            setReciboInfo({
                clienteNome: cliente?.nomeCompleto ?? data.clienteNome,
                clienteCpf: cliente?.cpf,
                descricao: data.descricao,
                valor: data.valor,
                dataCompra: data.dataCriacao,
                dataPagamento: data.dataPagamento,
                atendenteNome: usuario.nome,
            })
        } else {
            const msg = typeof data === 'string' ? data : JSON.stringify(data)
            setErro(`Erro ${status}: ${msg}`)
        }
    }

    function handleNovaDivida(clienteId) {
        setPerfilAberto(false)
        setClienteFormDivida(clienteId)
        setMostrarFormDivida(true)
    }

async function handleExcluirCliente(id) {
        const { status, data } = await excluirCliente(id)
        if (status === 204 || status === 200) {
            setClientes(prev => prev.filter(c => c.id !== id))
            setDividas(prev => prev.filter(d => d.clienteId !== id))
            setPerfilAberto(false)
            setClienteSelecionado(null)
            setRefreshClientes(c => c + 1)
            setRefreshDividas(d => d + 1)
        } else {
            const msg = typeof data === 'string' ? data : JSON.stringify(data)
            setErro(`Erro ${status}: ${msg}`)
        }
    }
    async function handleAtualizarCliente(id, dados) {
        const { status, data } = await atualizarCliente(id, dados)
        if (status === 200) {
            setClientes(prev => prev.map(c => (c.id === id ? data : c)))
            setClienteSelecionado(data)
        } else {
            const msg = typeof data === "string" ? data : JSON.stringify(data)
            setErro(`Erro ${status}: ${msg}`)
        }
    }

    async function handleClienteSelect(cliente) {
        setClienteSelecionado(cliente)
        try {
            const {status, data} = await listarDividas(cliente.id)
            if (status === 200) {
                setDividas(data)
            } else {
                setDividas([])
            }
        } catch {
            setDividas([])
        }
        setPerfilAberto(true)
    }

    const stats = calcularStats()

    if (!usuario) {
        return (
            <>
                {mostrarCadastro ? (
                    <CadastroForm onCadastro={handleCadastro} onToggleForm={() => setMostrarCadastro(false)} />
                ) : (
                    <LoginForm onLogin={handleLogin} onToggleForm={() => setMostrarCadastro(true)} />
                )}
                {erro && <ErrorModal message={erro} onClose={() => setErro('')} />}
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-600 p-2 rounded-lg shadow-lg">
                                <Store className="h-6 w-6 text-white"/>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Vendinha do Zé</h1>
                                <p className="text-sm text-gray-300">Controle de Contas</p>
                            </div>
                        </div>
                        <nav className="flex gap-1 items-center">
                            <button
                                onClick={() => setTelaAtiva('dashboard')}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 duration-200 ${
                                    telaAtiva === 'dashboard'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <BarChart3 className="h-4 w-4"/> Dívidas
                            </button>
                            <button
                                onClick={() => setTelaAtiva('clientes')}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 duration-200 ${
                                    telaAtiva === 'clientes'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <Users className="h-4 w-4"/> Clientes
                            </button>
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                            >
                                Sair
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {telaAtiva === 'dashboard' && (
                    <Dividas onMarcarPago={handleMarcarPago} refreshKey={refreshDividas} />
                )}
                {telaAtiva === 'clientes' && (
                    <ClientesList
                        onClienteSelect={handleClienteSelect}
                        onNovoCliente={() => setMostrarFormCliente(true)}
                        refreshKey={refreshClientes}
                    />
                )}
            </main>

            {mostrarFormCliente && (
                <ClienteForm
                    onSave={handleSalvarCliente}
                    onCancel={() => setMostrarFormCliente(false)}
                />
            )}
            {mostrarFormDivida && (
                <DividaForm
                    clienteId={clienteFormDivida}
                    clienteNome={
                        clientes.find(c => c.id === clienteFormDivida)?.nomeCompleto || ''
                    }
                    onSave={handleSalvarDivida}
                    onCancel={() => setMostrarFormDivida(false)}
                />
            )}
            {perfilAberto && clienteSelecionado && (
                <ClientePerfilModal
                    cliente={clienteSelecionado}
                    dividas={dividas}
                    pagamentos={pagamentos}
                    onClose={() => setPerfilAberto(false)}
                    onNovaDivida={handleNovaDivida}
                    onNovoPagamento={() => {
                    }}
                    onMarcarPago={handleMarcarPago}
                    onExcluirCliente={handleExcluirCliente}
                    onAtualizarCliente={handleAtualizarCliente}
                />
            )}
            {erro && (
                <ErrorModal message={erro} onClose={() => setErro('')}/>
            )}
            {reciboInfo && (
                <ReciboModal recibo={reciboInfo} onClose={() => setReciboInfo(null)} />
            )}
        </div>
    )
}