import React, { useMemo, useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { fetchDashboardStats } from '../../services/dashboardService'
import Dashboard from '../../components/Dashboard'

export default function Dividas({ dividas = [], onMarcarPago }) {
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
        loadStats()
    }, [])

    const ordenadas = useMemo(
        () => [...dividas].sort((a, b) => b.valor - a.valor),
        [dividas]
    )

    const total = useMemo(
        () => ordenadas.reduce((sum, d) => sum + d.valor, 0),
        [ordenadas]
    )

    return (
        <div className="text-white space-y-6">
            <Dashboard stats={stats} />

            <h2 className="text-2xl font-bold">Dívidas</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <thead className="bg-gray-700 text-left">
                    <tr>
                        <th className="px-4 py-2">Descrição</th>
                        <th className="px-4 py-2 text-right">Valor (R$)</th>
                        <th className="px-4 py-2">Data</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2" /> {/* coluna para ação */}
                    </tr>
                    </thead>

                    <tbody>
                    {ordenadas.map(divida => (
                        <tr key={divida.id} className="border-t border-gray-700">
                            <td className="px-4 py-2">{divida.descricao}</td>
                            <td className="px-4 py-2 text-right">
                                R$ {divida.valor.toFixed(2)}
                            </td>
                            <td className="px-4 py-2">
                                {new Date(divida.dataCriacao).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {divida.situacao ? 'Pago' : 'Pendente'}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {!divida.situacao && (
                                    <button
                                        onClick={() => onMarcarPago(divida.id)}
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
                                colSpan={5}
                                className="py-6 text-center text-gray-400"
                            >
                                Nenhuma dívida encontrada.
                            </td>
                        </tr>
                    )}
                    </tbody>

                    <tfoot className="bg-gray-700 font-semibold">
                    <tr>
                        <td
                            colSpan={1}
                            className="px-4 py-2 text-right"
                        >
                            Total
                        </td>
                        <td className="px-4 py-2 text-right">
                            R$ {total.toFixed(2)}
                        </td>
                        <td colSpan={3} />
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
