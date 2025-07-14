const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057';

export async function login(email, password) {
    const res = await fetch(`${baseUrl}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
}

export async function cadastrar(dados) {
    const res = await fetch(`${baseUrl}/api/usuarios/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
}