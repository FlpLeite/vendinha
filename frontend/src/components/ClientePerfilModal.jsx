import React, {useState} from 'react'
import {
    X, User, Mail, CreditCard, Calendar, Plus, DollarSign, Check, Clock, Trash, Pencil, Save,
} from 'lucide-react'
import { atualizarCliente } from '../services/clienteService'

export default function ClientePerfilModal({
    cliente,
    dividas = [],
    pagamentos = [],
    onClose,
    onNovaDivida,
    onMarcarPago,
    onExcluirCliente,
    onAtualizarCliente,
                                           }) {
    const [filtro, setFiltro] = useState('todas')
    const [editando, setEditando] = useState(false)
    const [formData, setFormData] = useState({
        nomeCompleto: cliente.nomeCompleto,
        cpf: cliente.cpf,
        dataNascimento: cliente.dataNascimento?.split('T')[0] || '',
        email: cliente.email ?? '',
    })
    const [salvando, setSalvando] = useState(false)
    const dividasCliente = dividas.filter(d => !d.clienteId || d.clienteId === cliente.id)
    const pagamentosCliente = pagamentos.filter(p => !p.clienteId || p.clienteId === cliente.id)

    const calcularIdade = (data) => {
        const hoje = new Date()
        const nascimento = new Date(data)
        let idade = hoje.getFullYear() - nascimento.getFullYear()
        const mes = hoje.getMonth() - nascimento.getMonth()
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--
        }
        return idade
    }

    const formatarCpf = cpf => {
        const limpo = cpf.toString().replace(/\D/g, '')
        if (limpo.length !== 11) return cpf
        return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    const cpfFormatado = cliente.cpf ? formatarCpf(cliente.cpf) : null
    const idade = calcularIdade(cliente.dataNascimento)

    const dividasFiltradas = dividasCliente.filter(d => {
        if (filtro === 'pendentes') return !d.situacao
        if (filtro === 'pagas') return d.situacao
        return true
    })

    const valorTotalDividas = dividasCliente.reduce((sum, d) => sum + d.valor, 0)
    const valorTotalPagamentos = dividasCliente
        .filter(d => d.situacao)
        .reduce((sum, d) => sum + d.valor, 0)

    const valorDevido = Math.max(0, valorTotalDividas - valorTotalPagamentos)
    const valorPendenteDividas = dividasCliente
        .filter(d => !d.situacao)
        .reduce((sum, d) => sum + d.valor, 0)

    const historico = [...dividasCliente.map(d => ({
        id: d.id,
        tipo: 'divida',
        descricao: d.descricao,
        valor: d.valor,
        status: d.situacao ? 'pago' : 'pendente',
        dataCriacao: d.dataCriacao,
        dataPagamento: d.dataPagamento,
        data: d.dataCriacao,
    })), ...pagamentosCliente.map(p => ({
        id: p.id,
        tipo: 'pagamento',
        descricao: p.observacao || 'Pagamento',
        valor: p.valor,
        status: 'pago',
        data: p.dataPagamento
    }))].sort((a, b) => new Date(b.data) - new Date(a.data))

    const historicoFiltrado = historico.filter(item => {
        if (filtro === 'pendentes') return item.tipo === 'divida' && item.status === 'pendente'
        if (filtro === 'pagas') return item.status === 'pago'
        return true
    })


    const handleExcluir = async () => {
        const confirmar = window.confirm('Deseja mesmo excluir esse cliente?')
        if (confirmar && onExcluirCliente) {
            await onExcluirCliente(cliente.id)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSalvar = async () => {
        setSalvando(true)
        const payload = {
            nomeCompleto: formData.nomeCompleto,
            cpf: formData.cpf,
            dataNascimento: formData.dataNascimento,
            email: formData.email === '' ? null : formData.email,
        }
        const { status, data } = await atualizarCliente(cliente.id, payload)
        setSalvando(false)
        if (status === 200) {
            setEditando(false)
            if (onAtualizarCliente) onAtualizarCliente(cliente.id, data)
        } else {
            const msg = typeof data === 'string' ? data : JSON.stringify(data)
            alert(`Erro ${status}: ${msg}`)
        }
    }

    return (<div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
        <div
            className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] border border-gray-700 flex flex-col"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 p-3 rounded-lg shadow-lg">
                        <User className="h-6 w-6 text-white"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-white">{cliente.nomeCompleto}</h2>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg"
                >
                    <X className="h-6 w-6"/>
                </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-700 flex flex-col">
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Informações</h3>
                            {!editando && (
                                <button
                                    onClick={() => setEditando(true)}
                                    className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
                                >
                                    <Pencil className="h-4 w-4"/> Editar
                                </button>
                            )}
                        </div>

                        {!editando && (
                            <div className="space-y-4 mb-6 text-sm text-gray-400">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5"/>
                                    <span className="font-medium text-white truncate">Nome: {cliente.nomeCompleto}</span>
                                </div>
                                {cliente.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5"/>
                                        <span className="font-medium text-white truncate">Email: {cliente.email}</span>
                                    </div>
                                )}
                                {cliente.cpf && (
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5"/>
                                        <span className="font-medium text-white">CPF: {cpfFormatado}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5"/>
                                    <span className="font-medium text-white"> Data de nascimento: {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5"/>
                                    <span className="font-medium text-white">Idade: {idade} anos</span>
                                </div>
                            </div>
                        )}
                        {editando && (
                            <div className="space-y-4 mb-6 text-sm text-gray-200">
                                <div>
                                    <label className="block mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={formData.nomeCompleto}
                                        onChange={e => handleChange('nomeCompleto', e.target.value)}
                                        className="w-full bg-gray-700 p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">CPF</label>
                                    <input
                                        type="text"
                                        value={formData.cpf}
                                        onChange={e => handleChange('cpf', e.target.value)}
                                        className="w-full bg-gray-700 p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        value={formData.dataNascimento}
                                        onChange={e => handleChange('dataNascimento', e.target.value)}
                                        className="w-full bg-gray-700 p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                        className="w-full bg-gray-700 p-2 rounded"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        className="flex-1 bg-gray-600 rounded p-2"
                                        onClick={() => setEditando(false)}
                                        type="button"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="flex-1 bg-emerald-600 rounded p-2 text-white flex items-center justify-center gap-1"
                                        onClick={handleSalvar}
                                        type="button"
                                        disabled={salvando}
                                    >
                                        <Save className="h-4 w-4"/>
                                        {salvando ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleExcluir}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg mb-6"
                        >
                            <Trash className="h-5 w-5"/>
                            Excluir cliente
                        </button>

                        <div className="border-t border-gray-700 pt-6">
                            <h4 className="text-md font-semibold text-white mb-4">Resumo Financeiro</h4>
                            <div className="space-y-3 text-gray-400 text-sm">
                                <div className="flex justify-between">
                                    <span>Total dívidas:</span>
                                    <span className="text-white">{dividasCliente.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Valor dívidas (total):</span>
                                    <span className="text-white">R$ {valorTotalDividas.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total pagos:</span>
                                    <span className="text-emerald-400">R$ {valorTotalPagamentos.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-700 pt-3">
                                    <span className="font-medium">Saldo devedor:</span>
                                    <span
                                        className={`font-bold text-lg ${valorDevido > 0 ? 'text-red-400' : 'text-emerald-400'}`}
                                    >
                      R$ {valorDevido.toFixed(2)}
                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-700 space-y-3">
                        <button
                            onClick={() => onNovaDivida(cliente.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Plus className="h-5 w-5"/>
                            Nova Dívida
                        </button>
                    </div>
                </div>

                <div className="lg:w-2/3 flex flex-col min-h-0">
                    <div className="p-6 border-b border-gray-700 flex-shrink-0">
                        <div
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="text-lg font-semibold text-white">
                                Histórico Financeiro
                            </h3>
                            <div className="flex gap-2">
                                {['todas', 'pendentes', 'pagas'].map(f => (<button
                                    key={f}
                                    onClick={() => setFiltro(f)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${filtro === f ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                >
                                    {f}
                                </button>))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-700">
                        {historicoFiltrado.length === 0 ? (<div className="p-8 text-center text-gray-400">
                            <DollarSign className="h-12 w-12 mx-auto mb-4"/>
                            <h4 className="text-lg text-white mb-2">
                                Nenhum registro encontrado
                            </h4>
                            <p className="mb-4">
                                {filtro === 'todas' ? 'Sem histórico financeiro.' : filtro === 'pendentes' ? 'Nenhuma dívida pendente.' : 'Nenhum pagamento registrado.'}
                            </p>
                        </div>) : (historicoFiltrado.map(item => (<div
                            key={`${item.tipo}-${item.id}`}
                            className="p-6 hover:bg-gray-750 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className={`p-2 rounded-lg ${item.tipo === 'pagamento' || item.status === 'pago' ? 'bg-emerald-600' : 'bg-red-600'}`}
                                        >
                                            {item.tipo === 'pagamento' ? (<Check className="h-4 w-4 text-white"/>) : (
                                                <Clock className="h-4 w-4 text-white"/>)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">
                                                {item.descricao}
                                            </h4>
                                            <span
                                                className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1 mt-1 bg-gray-700 text-gray-200">
                              {item.tipo === 'pagamento' ? 'Pagamento' : item.status === 'pago' ? 'Pago' : 'Pendente'}
                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm text-gray-400 ml-12">
                                        {item.tipo === 'divida' && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4"/>
                                                <div>Dívida feita em:</div>
                                                {new Date(item.dataCriacao ?? item.data).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                        {(item.tipo === 'divida' && item.status === 'pago') && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4"/>
                                                <div>Pago em:</div>
                                                {new Date(item.dataPagamento).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                        {item.tipo === 'pagamento' && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4"/>
                                                <div>Pago em:</div>
                                                {new Date(item.data).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <p
                                        className={`text-xl font-bold ${item.tipo === 'pagamento' ? 'text-emerald-400' : 'text-white'}`}
                                    >
                                        {item.tipo === 'pagamento' ? '-' : '+'}R${' '}
                                        {item.valor.toFixed(2)}
                                    </p>
                                    {item.tipo === 'divida' && item.status === 'pendente' && (
                                        <button
                                        onClick={() => onMarcarPago(cliente.id, item.id ?? item.Id)}
                                        className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg flex items-center gap-1"
                                    >
                                        <Check className="h-3 w-3"/>
                                        Marcar como Pago
                                    </button>)}
                                </div>
                            </div>
                        </div>)))}
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
