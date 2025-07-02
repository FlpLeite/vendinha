import React, { useState } from 'react'

export default function DividaForm({ clienteId, clienteNome, onSave, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded">
                <h2 className="mb-4">Nova Dívida para {clienteNome}</h2>
                <button onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    )
}
