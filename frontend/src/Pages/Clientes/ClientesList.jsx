// src/components/ClientesList.jsx
import React, { useEffect, useState } from 'react'
import { Search, Plus, User, Phone, MapPin, Calendar } from 'lucide-react'
import { listarClientes } from '../../services/clienteService'

export default function ClientesList({ onNovoCliente, onClienteSelect }) {
    const [clientes, setClientes]       = useState([])
    const [busca, setBusca]             = useState('')
    const [page, setPage]               = useState(1)
    const [totalDebtSum, setTotalDebtSum] = useState(0)
    const [loading, setLoading]         = useState(false)

    const fetchClientes = async () => {
        setLoading(true)
        try {
            const resultado = await listarClientes(busca, page)
            if (resultado.status === 200) {
                const json = resultado.data
                setClientes(json.items ?? json.Items ?? [])
                setTotalDebtSum(json.totalDebtSum ?? json.TotalDebtSum ?? 0)
            }
        } catch (err) {
            console.error('Erro ao buscar clientes:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // debounce de 500ms para não bombardear a API
        const timeout = setTimeout(fetchClientes, 500)
        return () => clearTimeout(timeout)
    }, [busca, page])

    const filtrados = clientes.filter(c =>
        c.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
        (c.telefone && c.telefone.includes(busca))
    )

    const getValorPendente = id =>
        // se seu JSON já traz totalDebt, pode usar c.totalDebt
        clientes
            .find(c => c.id === id)
            ?.totalDebt ?? 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Clientes</h2>
                <button
                    onClick={onNovoCliente}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl duration-200"
                >
                    <Plus className="h-4 w-4" />
                    Novo Cliente
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Buscar cliente por nome ou telefone..."
                    value={busca}
                    onChange={e => {
                        setBusca(e.target.value)
                        setPage(1)
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400 duration-200"
                />
            </div>

            {loading ? (
                <p className="text-white">Carregando clientes…</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtrados.map(c => {
                            const pendente = c.totalDebt ?? getValorPendente(c.id)
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => onClienteSelect(c.id)}
                                    className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 cursor-pointer hover:shadow-xl hover:border-emerald-500 duration-200 hover:-translate-y-1"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-emerald-600 p-3 rounded-lg shadow-lg">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                        {pendente > 0 && (
                                            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                        Em débito
                      </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {c.nomeCompleto}
                                    </h3>
                                    <div className="space-y-2 mb-4 text-gray-400 text-sm">
                                        {c.telefone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {c.telefone}
                                            </div>
                                        )}
                                        {c.endereco && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {c.endereco}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Desde{' '}
                                            {new Date(c.dataNascimento).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-700 pt-4 text-sm">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Total de dívidas:</span>
                                            <span className="text-white">
                        {c.totalDebtCount ?? c.dividas?.length ?? 0}
                      </span>
                                        </div>
                                        <div className="flex justify-between text-gray-400 mt-1">
                                            <span>Valor pendente:</span>
                                            <span
                                                className={
                                                    pendente > 0 ? 'text-red-400' : 'text-emerald-400'
                                                }
                                            >
                        R$ {pendente.toFixed(2)}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                            >
                                ◀ Anterior
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 bg-gray-700 rounded"
                            >
                                Próxima ▶
                            </button>
                        </div>
                        <div className="mt-2 md:mt-0 font-semibold text-white">
                            Total geral em aberto: R$ {totalDebtSum.toFixed(2)}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
