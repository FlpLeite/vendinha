import React, {useState} from 'react';
import {X, ShoppingCart, DollarSign, Calendar} from 'lucide-react';

export default function DividaForm({
                                       clienteId,
                                       clienteNome,
                                       onSave,
                                       onCancel
                                   }) {
    const [formData, setFormData] = useState({
        descricao: '',
        valor: '',
        dataCompra: new Date().toISOString().split('T')[0]
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = e => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
        if (!formData.valor || parseFloat(formData.valor) <= 0) newErrors.valor = 'Valor deve ser maior que zero';
        if (!formData.dataCompra) newErrors.dataCompra = 'Data da compra é obrigatória';

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        onSave({
            clienteId,
            descricao: formData.descricao.trim(),
            valor: parseFloat(formData.valor)
        });
    };

    const handleChange = (field, val) => {
        setFormData(prev => ({...prev, [field]: val}));
        if (errors[field]) setErrors(prev => ({...prev, [field]: ''}));
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Nova Dívida</h2>
                        <p className="text-sm text-gray-400 mt-1">Cliente: {clienteNome}</p>
                    </div>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <ShoppingCart className="h-4 w-4"/> Descrição *
                        </label>
                        <input
                            type="text"
                            value={formData.descricao}
                            onChange={e => handleChange('descricao', e.target.value)}
                            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 ${
                                errors.descricao ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="Ex: Compras do mês"
                        />
                        {errors.descricao && <p className="text-red-400 text-sm">{errors.descricao}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <DollarSign className="h-4 w-4"/> Valor *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.valor}
                            onChange={e => handleChange('valor', e.target.value)}
                            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 ${
                                errors.valor ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="0,00"
                        />
                        {errors.valor && <p className="text-red-400 text-sm">{errors.valor}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Calendar className="h-4 w-4"/> Data da Compra *
                        </label>
                        <input
                            type="date"
                            value={formData.dataCompra}
                            onChange={e => handleChange('dataCompra', e.target.value)}
                            className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white ${
                                errors.dataCompra ? 'border-red-500' : 'border-gray-600'
                            }`}
                        />
                        {errors.dataCompra && <p className="text-red-400 text-sm">{errors.dataCompra}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-lg"
                        >
                            Adicionar Dívida
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}