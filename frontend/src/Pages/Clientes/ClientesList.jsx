import React, {useEffect, useState} from 'react'
import useDebounce from '../../hooks/useDebounce'
import {Search, Plus, User, Calendar} from 'lucide-react'
import {listarClientes} from '../../services/clienteService'

export default function ClientesList({onNovoCliente, onClienteSelect, refreshKey}) {
    const [clientes, setClientes] = useState([])
    const [buscaInput, setBuscaInput] = useState('')
    const busca = useDebounce(buscaInput, 500)
    const [page, setPage] = useState(1)
    const [totalDebtSum, setTotalDebtSum] = useState(0)
    const [isLastPage, setIsLastPage] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchClientes = async () => {
        setLoading(true)
        try {
            const resultado = await listarClientes(busca, page)
            if (resultado.status === 200) {
                const json = resultado.data
                const items = json.items ?? json.Items ?? []
                const size = json.pageSize ?? json.PageSize ?? 10
                setClientes(items)
                setTotalDebtSum(json.totalDebtSum ?? json.TotalDebtSum ?? 0)
                setIsLastPage(items.length < size)
            }
        } catch (err) {
            console.error('Erro ao buscar clientes:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClientes()
    }, [busca, page, refreshKey])

    const filtrados = clientes.filter(c =>
        c.nomeCompleto.toLowerCase().includes(busca.toLowerCase())
    )
    const getValorPendente = id => clientes
        .find(c => c.id === id)?.totalDebt ?? 0

    const calcularIdade = data => {
        const hoje = new Date()
        const nascimento = new Date(data)
        let idade = hoje.getFullYear() - nascimento.getFullYear()
        const mes = hoje.getMonth() - nascimento.getMonth()
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--
        }
        return idade
    }

    return (<div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Clientes</h2>
            <button
                onClick={onNovoCliente}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl duration-200"
            >
                <Plus className="h-4 w-4"/>
                Novo Cliente
            </button>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
            <input
                type="text"
                placeholder="Buscar cliente por nome"
                value={buscaInput}
                onChange={e => {
                    setBuscaInput(e.target.value)
                    setPage(1)
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400 duration-200"
            />
        </div>

        {loading ? (<p className="text-white">Carregando clientes…</p>) : (<>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {filtrados.map(c => {
                    const pendente = c.totalDebt ?? getValorPendente(c.id)
                    return (<div
                        key={c.id}
                        onClick={() => onClienteSelect(c)}
                        className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 cursor-pointer hover:shadow-xl hover:border-emerald-500 duration-200 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-emerald-600 p-3 rounded-lg shadow-lg">
                                <User className="h-6 w-6 text-white"/>
                            </div>
                            {pendente > 0 && (
                                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                        Em débito
                      </span>)}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {c.nomeCompleto}
                        </h3>
                        <div className="space-y-2 mb-4 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4"/>
                                {c.age ?? calcularIdade(c.dataNascimento)} anos
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
                                <span className={pendente > 0 ? 'text-red-400' : 'text-emerald-400'}>
                        R$ {pendente.toFixed(2)}
                      </span>
                            </div>
                        </div>
                    </div>)
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
                        disabled={isLastPage}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
                    >
                        Próxima ▶
                    </button>
                </div>
                <div className="mt-2 md:mt-0 font-semibold text-white">
                    Total geral em aberto: R$ {totalDebtSum.toFixed(2)}
                </div>
            </div>
        </>)}
    </div>)
}
