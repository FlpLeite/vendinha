import React, {useState} from 'react';
import {criarCliente} from '../services/clienteService';

export default function ClienteForm({onSave, onCancel}) {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [email, setEmail] = useState(null);
    const [submetendo, setSubmetendo] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        if (!form.reportValidity()) return;

        setSubmetendo(true);
        try {
            const {status, data} = await criarCliente({
                nomeCompleto, cpf, dataNascimento, email,
            });
            if (status === 201 || status === 200) {
                onSave(data);
            } else {
                alert('Erro ao criar cliente');
            }
        } catch (err) {
            console.error(err);
            alert('Erro de conexão');
        } finally {
            setSubmetendo(false);
        }
    };

    const overlayClick = () => {
        if (!submetendo) onCancel();
    };

    return (<div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={overlayClick}
    >
        <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md space-y-4"
        >
            <h2 className="text-xl font-semibold">Novo Cliente</h2>

            <div>
                <label className="block mb-1">Nome Completo *</label>
                <input
                    type="text"
                    required
                    value={nomeCompleto}
                    onChange={e => setNomeCompleto(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label className="block mb-1">CPF *</label>
                <input
                    type="text"
                    required
                    pattern="\d{11}"
                    title="Exatamente 11 dígitos numéricos"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label className="block mb-1">Data de Nascimento *</label>
                <input
                    type="date"
                    required
                    value={dataNascimento}
                    onChange={e => setDataNascimento(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label className="block mb-1">E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value === '' ? null : e.currentTarget.value)}
                    className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submetendo}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={submetendo}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded disabled:opacity-50"
                >
                    {submetendo ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
    </div>);
}
