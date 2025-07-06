
import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    CategoryScale,
    LinearScale,
    Title,
    BarElement,
    ArcElement,
    Chart,
    Legend,
    LineElement,
    PointElement,
} from 'chart.js';
import 'chartjs-plugin-datalabels';

Chart.register(CategoryScale, LinearScale, Title, BarElement, ArcElement, Legend, LineElement, PointElement);

export default function Graph({ orders = [], users = [] }) {
    const [monthlyChartData, setMonthlyChartData] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pieChartData, setPieChartData] = useState(null);
    const [topProductsData, setTopProductsData] = useState(null);
    const [ordersPerClientData, setOrdersPerClientData] = useState(null);

    useEffect(() => {
        if (orders.length > 0) {
            const monthlySoldItems = calculateMonthlySoldItems(orders);
            setTotalAmount(calculateTotalAmount(monthlySoldItems));
            setMonthlyChartData({
                data: prepareChartData(monthlySoldItems),
                options: prepareChartOptions(),
            });

            const topProducts = calculateTopProducts(orders);
            setTopProductsData({
                labels: topProducts.labels,
                datasets: [
                    {
                        label: 'Cele mai comandate produse',
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        data: topProducts.data,
                    },
                ],
            });

            const ordersPerClient = calculateOrdersPerClient(orders);
            setOrdersPerClientData({
                labels: ordersPerClient.labels,
                datasets: [
                    {
                        label: 'Comenzi per client',
                        backgroundColor: 'rgba(135, 206, 250, 0.7)',
                        borderColor: 'rgba(135, 206, 250, 1)',
                        borderWidth: 1,
                        data: ordersPerClient.data,
                    },
                ],
            });
        }
    }, [orders]);

    useEffect(() => {
        if (users.length > 0) {
            calculateClientType(users);
        }
    }, [users]);

    const calculateMonthlySoldItems = (orders) => {
        const monthly = {
            Ianuarie: 0, Februarie: 0, Martie: 0, Aprilie: 0,
            Mai: 0, Iunie: 0, Iulie: 0, August: 0,
            Septembrie: 0, Octombrie: 0, Noiembrie: 0, Decembrie: 0,
        };
        orders.forEach((order) => {
            const month = new Date(order.createdAt).getMonth();
            order.orderItems.forEach((item) => {
                monthly[Object.keys(monthly)[month]] += item.price;
            });
        });
        return monthly;
    };

    const calculateTotalAmount = (monthly) =>
        Object.values(monthly).reduce((a, b) => a + b, 0);

    const prepareChartData = (monthly) => ({
        labels: Object.keys(monthly),
        datasets: [
            {
                label: 'Total comenzi lunare',
                backgroundColor: 'rgba(0,0,205,0.3)',
                borderColor: 'rgba(0, 0, 191, 1)',
                borderWidth: 2,
                fill: true,
                data: Object.values(monthly),
            },
        ],
    });

    const prepareChartOptions = () => ({
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 12 } } },
            y: { grid: { color: '#e0e0e0' }, ticks: { font: { size: 12 }, maxTicksLimit: 10 } },
        },
        plugins: { legend: { position: 'top' } },
    });

    const calculateTopProducts = (orders) => {
        const count = {};
        orders.forEach(order =>
            order.orderItems.forEach(item => {
                count[item.name] = (count[item.name] || 0) + item.quantity;
            })
        );
        const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return { labels: sorted.map(([n]) => n), data: sorted.map(([, q]) => q) };
    };

    const calculateOrdersPerClient = (orders) => {
        const clientOrderCounts = {};
        orders.forEach(order => {
            const email = order.email;
            if (email) {
                clientOrderCounts[email] = (clientOrderCounts[email] || 0) + 1;
            }
        });
        const sorted = Object.entries(clientOrderCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        return {
            labels: sorted.map(([email]) => email),
            data: sorted.map(([, count]) => count),
        };
    };

    const calculateClientType = (users) => {
        let premium = 0, nonPremium = 0;
        users.forEach(u => (u.isPremium ? premium++ : nonPremium++));
        setPieChartData({
            labels: [
                `Clienti Premium (${premium})`,
                `Clienti Non-Premium (${nonPremium})`,
            ],
            datasets: [{
                data: [premium, nonPremium],
                backgroundColor: ['#25add7', 'rgb(0,0,205)'],
            }],
        });
    };

    const exportToCSV = () => {
        const headers = ['Tip Grafic', 'Eticheta', 'Valoare'];
        const rows = [];

        if (monthlyChartData) {
            monthlyChartData.data.labels.forEach((label, index) => {
                rows.push(['Comenzi lunare', label, monthlyChartData.data.datasets[0].data[index]]);
            });
        }

        if (topProductsData) {
            topProductsData.labels.forEach((label, index) => {
                rows.push(['Top produse', label, topProductsData.datasets[0].data[index]]);
            });
        }

        if (ordersPerClientData) {
            ordersPerClientData.labels.forEach((label, index) => {
                rows.push(['Comenzi per client', label, ordersPerClientData.datasets[0].data[index]]);
            });
        }

        if (pieChartData) {
            pieChartData.labels.forEach((label, index) => {
                rows.push(['Distribuție clienți', label, pieChartData.datasets[0].data[index]]);
            });
        }

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'dashboard_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {totalAmount > 0 && <h3 className="total-comenzi">Total comenzi: {totalAmount.toFixed(2)} RON</h3>}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button onClick={exportToCSV} className="btn btn-primary">Exportă datele în CSV</button>
            </div>
            <div className="dashboard-grid">
                <div className="chart-box">
                    <h4 className="text-center">Comenzi lunare</h4>
                    {monthlyChartData && <Line data={monthlyChartData.data} options={monthlyChartData.options} />}
                </div>
                <div className="chart-box">
                    <h4 className="text-center">Distribuție clienți</h4>
                    {pieChartData && <Pie data={pieChartData} />}
                </div>
                <div className="chart-box">
                    <h4 className="text-center">Top produse comandate</h4>
                    {topProductsData && <Bar data={topProductsData} options={{ responsive: true, maintainAspectRatio: false }} />}
                </div>
                <div className="chart-box">
                    <h4 className="text-center">Comenzi pe client</h4>
                    {ordersPerClientData && <Bar
                        data={ordersPerClientData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: true } },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { precision: 0, font: { size: 12 } }
                                },
                                x: {
                                    ticks: { font: { size: 12 } }
                                }
                            }
                        }}
                    />}
                </div>
            </div>
        </div>
    );
}
