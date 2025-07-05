export async function listarClientes(busca = '', page = 1) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057';
    const res = await fetch(
        `${baseUrl}/clientes?page=${page}&name=${encodeURIComponent(busca)}`
    );
    const data = await res.json();
    return { status: res.status, data };
}

export async function criarCliente(dados) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057';
    const res = await fetch(`${baseUrl}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    });
    const data = await res.json();
    return { status: res.status, data };
}