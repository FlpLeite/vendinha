import React, { useState, useEffect } from 'react'
import { Store, Users, BarChart3 } from 'lucide-react'
import Dashboard from './Pages/Dashboard/Dashboard'
import ClientesList from './Pages/Clientes/ClientesList'
import ClienteForm from './components/ClienteForm'
import DividaForm from './components/DividaForm'

function App() {
    const [telaAtiva, setTelaAtiva] = useState('dashboard')
    const [clientes, setClientes] = useState([])
    const [dividas, setDividas] = useState([])
    const [mostrarFormCliente, setMostrarFormCliente] = useState(false)
    const [mostrarFormDivida, setMostrarFormDivida] = useState(false)
    const [clienteFormDivida, setClienteFormDivida] = useState('')

    useEffect(() => {
        setClientes([
            {
                id: '1',
                nome: 'Maria Silva',
                telefone: '(11) 99999-1111',
                endereco: 'Rua das Flores, 123',
                dataCadastro: '2024-01-15T00:00:00.000Z',
            },
            {
                id: '2',
                nome: 'João Santos',
                telefone: '(11) 99999-2222',
                endereco: 'Av. Principal, 456',
                dataCadastro: '2024-02-10T00:00:00.000Z',
            },
        ])
        setDividas([
            {
                id: '1',
                clienteId: '1',
                descricao: 'Compras do mês - leite, pão e ovos',
                valor: 25.5,
                dataCompra: '2024-12-01T00:00:00.000Z',
                status: 'pendente',
            },
            {
                id: '2',
                clienteId: '1',
                descricao: 'Refrigerante e biscoitos',
                valor: 15.8,
                dataCompra: '2024-11-28T00:00:00.000Z',
                status: 'pago',
                dataPagamento: '2024-12-05T00:00:00.000Z',
            },
            {
                id: '3',
                clienteId: '2',
                descricao: 'Cigarro e café',
                valor: 35.0,
                dataCompra: '2024-12-03T00:00:00.000Z',
                status: 'pendente',
            },
        ])
    }, [])

    function calcularStats() {
        const pendentes = dividas.filter(d => d.status === 'pendente')
        const pagos = dividas.filter(d => d.status === 'pago')
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

    function handleNovaDivida(clienteId) {
        setClienteFormDivida(clienteId)
        setMostrarFormDivida(true)
    }

    function handleSalvarDivida(dados) {
        setDividas(prev => [
            ...prev,
            { ...dados, id: Date.now().toString(), status: 'pendente' },
        ])
        setMostrarFormDivida(false)
    }

    function handleMarcarPago(id) {
        setDividas(prev =>
            prev.map(d =>
                d.id === id ? { ...d, status: 'pago', dataPagamento: new Date().toISOString() } : d
            )
        )
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
                                <BarChart3 className="h-4 w-4" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => setTelaAtiva('clientes')}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 duration-200 ${
                                    telaAtiva === 'clientes'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                <Users className="h-4 w-4" />
                                Clientes
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {telaAtiva === 'dashboard' && <Dashboard stats={stats} />}

                {telaAtiva === 'clientes' && (
                    <ClientesList
                        clientes={clientes}
                        dividas={dividas}
                        onClienteSelect={handleNovaDivida}
                        onNovoCliente={() => setMostrarFormCliente(true)}
                    />
                )}
            </main>

            {/* Modals */}
            {mostrarFormCliente && (
                <ClienteForm
                    onSave={handleSalvarCliente}
                    onCancel={() => setMostrarFormCliente(false)}
                />
            )}
            {mostrarFormDivida && (
                <DividaForm
                    clienteId={clienteFormDivida}
                    clienteNome={clientes.find(c => c.id === clienteFormDivida)?.nome || ''}
                    onSave={handleSalvarDivida}
                    onCancel={() => setMostrarFormDivida(false)}
                />
            )}
        </div>
    )
}

export default App
