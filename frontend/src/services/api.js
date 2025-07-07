import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5057'
})

export default api

export async function listarClientes(busca = '', page = 1) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057';
    const res = await fetch(
        `${baseUrl}/clientes?page=${page}&name=${encodeURIComponent(busca)}`
    );
    const data = await res.json();
    return {status: res.status, data};
}