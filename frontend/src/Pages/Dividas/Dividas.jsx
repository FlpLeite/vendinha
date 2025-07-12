import React, { useMemo, useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { fetchDashboardStats } from '../../services/dashboardService'
import Dashboard from '../../components/Dashboard'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057'
export default function Dividas({ onMarcarPago, refreshKey }) {
    const [dividas, setDividas] = useState([])
    const [page, setPage] = useState(1)
    const [filtro, setFiltro] = useState('todas')
    const [stats, setStats] = useState({
        totalClientes: 0,
        totalDividas: 0,
        valorTotalPendente: 0,
        valorTotalPago: 0,
    })

    useEffect(() => {
        async function loadStats() {
            try {
                const { status, data } = await fetchDashboardStats()
                if (status === 200) {
                    setStats({
                        totalClientes: data.totalClientes ?? data.TotalClientes ?? 0,
                        totalDividas: data.totalDividas ?? data.TotalDividas ?? 0,
                        valorTotalPendente:
                            data.valorTotalPendente ?? data.ValorTotalPendente ?? 0,
                        valorTotalPago: data.valorTotalPago ?? data.ValorTotalPago ?? 0,
                    })
                }
            } catch (err) {
                console.error('Erro ao buscar estatísticas:', err)
            }
        }
        async function loadDividas() {
            try {
                const res = await fetch(`${baseUrl}/api/dividas?page=${page}`)
                const data = await res.json()
                if (res.ok) setDividas(data.items ?? data.Items ?? data)
            } catch (err) {
                console.error('Erro ao buscar dívidas:', err)
            }
        }
        loadStats()
        loadDividas()
    }, [page, refreshKey])

    const ordenadas = useMemo(
        () =>
            [...dividas].sort((a, b) => {
                const nA = (a.clienteNome ?? '').toLowerCase()
                const nB = (b.clienteNome ?? '').toLowerCase()
                if (nA < nB) return -1
                if (nA > nB) return 1
                return new Date(b.dataCriacao) - new Date(a.dataCriacao)
            }),
        [dividas]
    )

    const filtradas = useMemo(
        () =>
            ordenadas.filter(d => {
                if (filtro === 'pendentes') return !d.situacao
                if (filtro === 'pagas') return d.situacao
                return true
            }),
        [ordenadas, filtro]
    )

    const total = useMemo(
        () => filtradas.reduce((sum, d) => sum + d.valor, 0),
        [filtradas]
    )

    return (
        <div className="text-white space-y-6">
            <Dashboard stats={stats} />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">Dívidas</h2>
                <div className="flex gap-2">
                    {['todas', 'pendentes', 'pagas'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${
                                filtro === f ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <thead className="bg-gray-700 text-left">
                    <tr>
                        <th className="px-4 py-2">Nome</th>
                        <th className="px-4 py-2">Descrição</th>
                        <th className="px-4 py-2 text-right">Valor (R$)</th>
                        <th className="px-4 py-2">Data</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2" />
                    </tr>
                    </thead>

                    <tbody>
                    {filtradas.map(divida => (
                        <tr key={divida.id} className="border-t border-gray-700">
                            <td className="px-4 py-2">{divida.clienteNome}</td>
                            <td className="px-4 py-2">{divida.descricao}</td>
                            <td className="px-4 py-2 text-right">
                                R$ {divida.valor.toFixed(2)}
                            </td>
                            <td className="px-4 py-2">
                                {new Date(divida.dataCriacao).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-4 py-2 text-center">
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        divida.situacao
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-yellow-500 text-black'
                                    }`}
                                >
                                    {divida.situacao ? 'Pago' : 'Pendente'}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                                {!divida.situacao && (
                                    <button
                                        onClick={() => onMarcarPago(divida.clienteId ?? divida.ClienteId, divida.id ?? divida.Id)}
                                        title="Marcar como pago"
                                        className="hover:text-green-400"
                                    >
                                        <Check />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}

                    {ordenadas.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-6 text-center text-gray-400"
                            >
                                Nenhuma dívida encontrada.
                            </td>
                        </tr>
                    )}
                    </tbody>

                    <tfoot className="bg-gray-700 font-semibold">
                    <tr>
                        <td className="px-4 py-2 text-right" colSpan={2}>Total:</td>
                        <td className="px-4 py-2 text-right" colSpan={3}>
                            R$ {total.toFixed(2)}
                        </td>
                        <td />
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div className="mt-4 space-x-2">
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
        </div>
    )
}
