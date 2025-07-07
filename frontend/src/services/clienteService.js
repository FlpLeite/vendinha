const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057'

export async function listarClientes(busca = '', page = 1) {
    const res = await fetch(`${baseUrl}/clientes?page=${page}&name=${encodeURIComponent(busca)}`)
    const data = await res.json()
    return { status: res.status, data }
}

export async function criarCliente(dados) {
    const res = await fetch(`${baseUrl}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    const data = await res.json()
    return { status: res.status, data }
}

export async function criarDivida(clienteId, { descricao, valor }) {
    const res = await fetch(`${baseUrl}/clientes/${clienteId}/dividas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao, valor }),
    })
    const data = await res.json()
    return { status: res.status, data }
}

export async function listarDividas(clienteId) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057'
          const res = await fetch(`${baseUrl}/clientes/${clienteId}/dividas`)
          const json = await res.json()
          // no JSON vem "dividas" em lowercase
          return { status: res.status, data: json.dividas ?? [] }
}

export async function pagarDivida(clienteId, id) {
    const res = await fetch(
        `${baseUrl}/clientes/${clienteId}/dividas/${id}/pagar`,
        { method: 'PUT' }
    )
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data }
}