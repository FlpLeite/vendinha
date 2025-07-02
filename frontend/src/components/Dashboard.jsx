import React from 'react'

export default function Dashboard({ stats }) {
    return (
        <div className="text-white">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
    )
}
