import React, { useState } from 'react'
import { Search, Plus, User, Phone, MapPin, Calendar } from 'lucide-react'

export default function ClientesList({ clientes, dividas, onClienteSelect, onNovoCliente }) {
  const [busca, setBusca] = useState('')

  const filtrados = clientes.filter(c =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (c.telefone && c.telefone.includes(busca))
  )

  const getValorPendente = id =>
      dividas
          .filter(d => d.clienteId === id && d.status === 'pendente')
          .reduce((sum, d) => sum + d.valor, 0)

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
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-400 duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map(c => {
            const pendente = getValorPendente(c.id)
            return (
                <div
                    key={c.id}
                    onClick={() => onClienteSelect(c)}
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

                  <h3 className="text-lg font-semibold text-white mb-2">{c.nome}</h3>

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
                      Desde {new Date(c.dataCadastro).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Total de dívidas:</span>
                      <span className="text-white">{dividas.filter(d => d.clienteId === c.id).length}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 mt-1">
                      <span>Valor pendente:</span>
                      <span className={pendente > 0 ? 'text-red-400' : 'text-emerald-400'}>
                    R$ {pendente.toFixed(2)}
                  </span>
                    </div>
                  </div>
                </div>
            )
          })}
        </div>

        {filtrados.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <User className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg text-white mb-2">Nenhum cliente encontrado</h3>
              <p className="mb-4">
                {busca ? 'Tente uma busca diferente' : 'Comece cadastrando seu primeiro cliente'}
              </p>
              {!busca && (
                  <button
                      onClick={onNovoCliente}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    Cadastrar Cliente
                  </button>
              )}
            </div>
        )}
      </div>
  )
}
