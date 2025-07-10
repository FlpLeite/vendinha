import React, { useMemo } from 'react'
import { Check } from 'lucide-react'

export default function Dividas({ dividas = [], onMarcarPago }) {
    const ordenadas = useMemo(
        () => [...dividas].sort((a, b) => b.valor - a.valor),
        [dividas]
    )
    const total = useMemo(
        () => ordenadas.reduce((sum, d) => sum + d.valor, 0),
        [ordenadas]
    )

    return (
        <div className="text-white space-y-4">
            <h2 className="text-2xl font-bold">Dívidas</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <thead className="bg-gray-700 text-left">
                    <tr>
                        <th className="px-4 py-2">Descrição</th>
                        <th className="px-4 py-2 text-right">Valor (R$)</th>
                        <th className="px-4 py-2">Data</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2" />
                    </tr>
                    </thead>
                    <tbody>
                    {ordenadas.map(divida => (
                        <tr key={divida.id} className="border-t border-gray-700">
                            <td className="px-4 py-2">{divida.descricao}</td>
                            <td className="px-4 py-2 text-right">R$ {divida.valor.toFixed(2)}</td>
                            <td className="px-4 py-2">
                                {new Date(divida.dataCriacao).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {divida.situacao ? 'Pago' : 'Pendente'}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {!divida.situacao && (
                                    <button
                                        onClick={() => onMarcarPago && onMarcarPago(divida.id)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                                    >
                                        <Check className="h-4 w-4" />
                                        Pagar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {ordenadas.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-6 text-center text-gray-400">
                                Nenhuma dívida encontrada.
                            </td>
                        </tr>
                    )}
                    </tbody>
                    <tfoot className="bg-gray-700 font-semibold">
                    <tr>
                        <td colSpan="3" className="px-4 py-2 text-right">
                            Total
                        </td>
                        <td colSpan="2" className="px-4 py-2 text-right">
                            R$ {total.toFixed(2)}
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
