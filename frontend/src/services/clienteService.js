const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057'

export async function listarClientes(busca = '', page = 1) {
    const res = await fetch(
        `${baseUrl}/api/clientes?page=${page}&name=${encodeURIComponent(busca)}`
    )
    const data = await res.json()
    return {status: res.status, data}
}

export async function criarCliente(dados) {
    const res = await fetch(`${baseUrl}/api/clientes`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dados),
    })
    const data = await res.json()
    return {status: res.status, data}
}

export async function criarDivida(clienteId, {descricao, valor, usuarioId}) {
    const res = await fetch(`${baseUrl}/clientes/${clienteId}/dividas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({descricao, valor, criadoPorId: usuarioId}),
    })
    const text = await res.text()
    let data
    try {
        data = JSON.parse(text)
    } catch {
        data = text
    }
    return {status: res.status, data}
}

export async function listarDividas(clienteId) {
    const res = await fetch(`${baseUrl}/clientes/${clienteId}/dividas`)
    const json = await res.json()
    return { status: res.status, data: json.dividas ?? [] }
}

export async function pagarDivida(clienteId, id, usuarioId) {
    const res = await fetch(
        `${baseUrl}/clientes/${clienteId}/dividas/${id}/pagar?usuarioId=${usuarioId}`,
        { method: 'PUT' }
    )
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data }
}

export async function excluirCliente(id) {
    const res = await fetch(`${baseUrl}/api/clientes/${id}`, { method: 'DELETE' })
    const text = await res.text()
    let data
    try {
        data = JSON.parse(text)
    } catch {
        data = text
    }
    return { status: res.status, data }
}
export async function atualizarCliente(id, dados) {
    const res = await fetch(`${baseUrl}/api/clientes/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dados),
    })
    const text = await res.text()
    let data
    try {
        data = JSON.parse(text)
    } catch {
        data = text
    }
    return { status: res.status, data }
}