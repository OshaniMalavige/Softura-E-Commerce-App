"use client";

import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import AdminLayout from "@/components/AdminLayout.js";
import notifications from "@/components/alerts/alerts.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const MonthlySalesReport = () => {
    const [report, setReport] = useState([]);
    const [startMonth, setStartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        if (!startMonth || !endMonth) {
            notifications.error("Please select both start and end month.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/reports?start=${startMonth}&end=${endMonth}`);
            const data = await res.json();
            setReport(data);
        } catch (err) {
            console.error("Error fetching report:", err);
            notifications.error(err);
        } finally {
            setLoading(false);
        }
    };

    const labels = Array.isArray(report) ? report.map((r) => r.month) : [];
    const salesData = Array.isArray(report) ? report.map((r) => r.totalSales) : [];
    const ordersData = Array.isArray(report) ? report.map((r) => r.totalOrders) : [];

    const barChartData = {
        labels,
        datasets: [
            {
                label: "Total Sales (LKR)",
                data: salesData,
                backgroundColor: "#3b82f6",
            },
        ],
    };

    const lineChartData = {
        labels,
        datasets: [
            {
                label: "Total Orders",
                data: ordersData,
                borderColor: "#10b981",
                backgroundColor: "#10b98133",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
        },
    };

    return (
        <AdminLayout>
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-[var(--primaryColor)] text-center ">Generate Monthly Sales Report</h2>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Month</label>
                        <input
                            type="month"
                            value={startMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                            className="border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Month</label>
                        <input
                            type="month"
                            value={endMonth}
                            onChange={(e) => setEndMonth(e.target.value)}
                            className="border p-2 rounded"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={fetchReport}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {loading ? "Loading..." : "Generate"}
                        </button>
                    </div>
                </div>

                {report.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Total Sales (Bar Chart)</h3>
                            <Bar data={barChartData} options={options} />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Total Orders (Line Chart)</h3>
                            <Line data={lineChartData} options={options} />
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default MonthlySalesReport;
