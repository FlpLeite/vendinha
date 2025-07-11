import React from 'react'
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export default function Dashboard({ stats }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Total de Clientes</p>
                            <p className="text-2xl font-bold text-white mt-1">{stats.totalClientes}</p>
                        </div>
                        <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Dívidas Ativas</p>
                            <p className="text-2xl font-bold text-white mt-1">{stats.totalDividas}</p>
                        </div>
                        <div className="bg-orange-600 p-3 rounded-lg shadow-lg">
                            <ShoppingCart className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Total em Aberto</p>
                            <p className="text-2xl font-bold text-red-400 mt-1">
                                R$ {stats.valorTotalPendente.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-red-600 p-3 rounded-lg shadow-lg">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Total Recebido</p>
                            <p className="text-2xl font-bold text-emerald-400 mt-1">
                                R$ {stats.valorTotalPago.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-emerald-600 p-3 rounded-lg shadow-lg">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Resumo Financeiro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Valor Total das Dívidas:</span>
                            <span className="font-medium text-white">R$ {(stats.valorTotalPendente + stats.valorTotalPago).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Valor Recebido:</span>
                            <span className="font-medium text-emerald-400">R$ {stats.valorTotalPago.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Valor Pendente:</span>
                            <span className="font-medium text-red-400">R$ {stats.valorTotalPendente.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="text-sm text-gray-400">Taxa de Recebimento</div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                                style={{
                                    width: `${stats.valorTotalPago + stats.valorTotalPendente > 0
                                        ? (stats.valorTotalPago / (stats.valorTotalPago + stats.valorTotalPendente)) * 100
                                        : 0}%`
                                }}
                            ></div>
                        </div>
                        <div className="text-sm text-gray-400">
                            {stats.valorTotalPago + stats.valorTotalPendente > 0
                                ? `${((stats.valorTotalPago / (stats.valorTotalPago + stats.valorTotalPendente)) * 100).toFixed(1)}%`
                                : '0%'} recebido
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
