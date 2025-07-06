import React, { useState } from 'react'
import { Store, Users, BarChart3 } from 'lucide-react'
import Dashboard from './Pages/Dashboard/Dashboard'
import ClientesList from './Pages/Clientes/ClientesList'
import ClienteForm from './components/ClienteForm'
import DividaForm from './components/DividaForm'
import ClientePerfilModal from './components/ClientePerfilModal'
import { criarDivida, listarDividas } from './services/clienteService'

export default function App() {
    const [telaAtiva, setTelaAtiva] = useState('dashboard')
    const [clientes, setClientes] = useState([])
    const [dividas, setDividas] = useState([])
    const [pagamentos] = useState([])
    const [mostrarFormCliente, setMostrarFormCliente] = useState(false)
    const [mostrarFormDivida, setMostrarFormDivida] = useState(false)
    const [clienteFormDivida, setClienteFormDivida] = useState('')
    const [perfilAberto, setPerfilAberto] = useState(false)
    const [clienteSelecionado, setClienteSelecionado] = useState(null)

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
    }

    async function handleSalvarDivida({ clienteId, descricao, valor }) {
        const { status, data } = await criarDivida(clienteId, { descricao, valor })
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
        } else {
            alert(`Erro ${status}: ${JSON.stringify(data)}`)
        }
    }

    function handleMarcarPago(id) {
        setDividas(prev =>
            prev.map(d =>
                d.id === id
                    ? { ...d, situacao: true, dataPagamento: new Date().toISOString() }
                    : d
            )
        )
    }

    function handleNovaDivida(clienteId) {
        setPerfilAberto(false)
        setClienteFormDivida(clienteId)
        setMostrarFormDivida(true)
    }

    async function handleClienteSelect(cliente) {
        setClienteSelecionado(cliente)
        try {
            const { status, data } = await listarDividas(cliente.id)
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

    return (
        <div className="min-h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-600 p-2 rounded-lg shadow-lg">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Vendinha do Zé</h1>
                                <p className="text-sm text-gray-300">Controle de Contas</p>
                            </div>
                        </div>
                        <nav className="flex gap-1">
                            <button
                                onClick={() => setTelaAtiva('dashboard')}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 duration-200 ${
                                    telaAtiva === 'dashboard'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <BarChart3 className="h-4 w-4" /> Dashboard
                            </button>
                            <button
                                onClick={() => setTelaAtiva('clientes')}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 duration-200 ${
                                    telaAtiva === 'clientes'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <Users className="h-4 w-4" /> Clientes
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {telaAtiva === 'dashboard' && <Dashboard stats={stats} />}
                {telaAtiva === 'clientes' && (
                    <ClientesList
                        onClienteSelect={handleClienteSelect}
                        onNovoCliente={() => setMostrarFormCliente(true)}
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
                    onNovoPagamento={() => {}}
                    onMarcarPago={handleMarcarPago}
                />
            )}
        </div>
    )
}
