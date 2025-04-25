'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
)

const DashboardChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const [salesData, setSalesData] = useState(Array(12).fill(0))

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await fetch('/api/monthlySales')
                const data = await res.json()
                setSalesData(data.monthlySales || Array(12).fill(0))
            } catch (err) {
                console.error('Error fetching chart data:', err)
            }
        }
        fetchSales()
    }, [])

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#333',
                bodyColor: '#666',
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed.y.toLocaleString()}`
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f0f0f0' },
                ticks: {
                    callback: function (value) {
                        return `${value}`
                    },
                },
            },
            x: {
                grid: { display: false },
            },
        },
        elements: {
            line: { tension: 0.4 },
            point: { radius: 0, hitRadius: 10, hoverRadius: 5 },
        },
    }

    const data = {
        labels: months,
        datasets: [
            {
                fill: true,
                data: salesData,
                borderColor: '#ff7d66',
                backgroundColor: 'rgba(255, 125, 102, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#ff7d66',
            },
        ],
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-1">
                        <div className="text-2xl font-semibold text-[var(--primaryColor)]">Monthly Sales Growth</div>
                    </div>
                </div>
            </div>
            <div className="relative">
                <Line options={options} data={data} height={80} />
            </div>
        </div>
    )
}

export default DashboardChart
