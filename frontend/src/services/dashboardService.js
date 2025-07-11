const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5057';

export async function fetchDashboardStats() {
    const res = await fetch(`${baseUrl}/api/dashboard`);
    const data = await res.json();
    return { status: res.status, data };
}