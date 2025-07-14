import React, { useRef } from 'react'
import { X, Printer } from 'lucide-react'

export default function ReciboModal({ recibo, onClose }) {
    const printRef = useRef()
    const format = date => new Date(date).toLocaleDateString('pt-BR')

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML
        const printWindow = window.open('', '', 'width=600,height=600')
        printWindow.document.write(`
            <html>
            <head>
                <title>Recibo de Pagamento</title>
                <style>
                    body { font-family: monospace; padding: 20px; }
                    h2 { text-align: center; }
                    p { margin: 0 0 4px; }
                    hr { margin: 10px 0; }
                </style>
            </head>
            <body>${printContents}</body>
            </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-gray-800 text-white w-full max-w-md p-6 rounded-lg border border-gray-700 space-y-2 relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold mx-auto">Vendinha do Zé</h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="text-gray-400 hover:text-white">
                            <Printer className="h-5 w-5" />
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <hr className="border-gray-700" />
                <div ref={printRef}>
                    <p>Cliente: {recibo.clienteNome}</p>
                    {recibo.clienteCpf && <p>CPF: {recibo.clienteCpf}</p>}
                    <p>Compra: {recibo.descricao}</p>
                    <p>Valor: R$ {recibo.valor.toFixed(2)}</p>
                    <p>Data da compra: {format(recibo.dataCompra)}</p>
                    <p>Data do pagamento: {format(recibo.dataPagamento)}</p>
                    <p>Atendido por: {recibo.atendenteNome}</p>
                    <p className="pt-4 text-center">Obrigado pela preferência!</p>
                    <hr className="border-gray-700" />
                </div>
            </div>
        </div>
    )
}
