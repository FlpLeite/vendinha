import React, { useState } from 'react'

export default function ClienteForm({ onSave, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded">
                <h2 className="mb-4">Formulário de Cliente</h2>
                <button onClick={onCancel}>Cancelar</button>
            </div>
        </div>
    )
}
