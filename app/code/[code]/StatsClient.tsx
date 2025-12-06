"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

export default function StatsClient({ code: propCode }: { code?: string }) {
    const params = useParams();
    const code = propCode ?? (params as any)?.code;
    const [stats, setStats] = useState<any>(null);

    console.log("⚡ StatsClient resolved code:", code);

    useEffect(() => {
        if (!code) {
            console.warn("No code available, skipping stats load");
            return;
        }

        async function loadStats() {
            try {
                const res = await fetch(`/api/stats/${encodeURIComponent(code)}`);
                if (!res.ok) {
                    const text = await res.text();
                    console.error("Stats API error:", res.status, text);
                    return;
                }
                const json = await res.json();
                setStats(json);
            } catch (err) {
                console.error("Stats load failed:", err);
            }
        }

        loadStats();
    }, [code]);

    if (!code) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Missing link code
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading stats...
            </div>
        );
    }

    if (!stats.link) {
        return <div className="text-center text-red-500 mt-10">Link not found</div>;
    }

    const chartData = {
        labels: Object.keys(stats.dailyClicks),
        datasets: [
            {
                label: "Clicks per day",
                data: Object.values(stats.dailyClicks),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.3)",
                tension: 0.2,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50 px-10 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Stats for <span className="text-blue-600">{code}</span>
            </h1>

            <div className="bg-white p-6 rounded-lg shadow mb-8 space-y-2">
                <p><strong>Target URL:</strong> {stats.link.targetUrl}</p>
                <p><strong>Total Clicks:</strong> {stats.link.clicks}</p>
                <p><strong>Last Clicked:</strong> {stats.link.lastClicked || "Never"}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Daily Clicks</h2>
                <Line data={chartData} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Click Logs</h2>

                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">#</th>
                            <th className="p-3">Timestamp</th>
                        </tr>
                    </thead>

                    <tbody>
                        {stats.events.map((e: any, i: number) => (
                            <tr key={e.id} className="border-t">
                                <td className="p-3">{i + 1}</td>
                                <td className="p-3">{new Date(e.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}