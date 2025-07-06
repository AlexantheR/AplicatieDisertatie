import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { CategoryScale, LinearScale, Title, BarElement, ArcElement, Chart, Legend } from 'chart.js';
import 'chartjs-plugin-datalabels';

Chart.register(CategoryScale, LinearScale, Title, BarElement, ArcElement, Legend);

export default function Graph({ orders = [], users = [] }) {
    const [chartData, setChartData] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pieChartData, setPieChartData] = useState(null);
    const [topProductsData, setTopProductsData] = useState(null);
    const [ordersPerClientData, setOrdersPerClientData] = useState(null);

    useEffect(() => {
        if (orders.length > 0) {
            const monthlySoldItems = calculateMonthlySoldItems(orders);
            const chartData = prepareChartData(monthlySoldItems);
            const options = prepareChartOptions(monthlySoldItems);
            const totalAmount = calculateTotalAmount(monthlySoldItems);
            setChartData({ data: chartData, options });
            setTotalAmount(totalAmount);

            setTopProductsData(prepareTopProductsData(orders));
            setOrdersPerClientData(prepareOrdersPerClientData(orders));
        }
    }, [orders]);

    useEffect(() => {
        if (users.length > 0) {
            calculateClientType(users);
        }
    }, [users]);

    const calculateMonthlySoldItems = (orders) => {
        const monthly = Array.from({ length: 12 }, () => 0);
        orders.forEach(order => {
            const month = new Date(order.createdAt).getMonth();
            order.orderItems.forEach(item => {
                monthly[month] += item.price;
            });
        });

        return Object.fromEntries([
            'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
            'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
        ].map((month, idx) => [month, monthly[idx]]));
    };

    const prepareChartData = (monthly) => ({
        labels: Object.keys(monthly),
        datasets: [{
            label: 'Total comenzi lunare',
            backgroundColor: 'rgb(0,0,205)',
            data: Object.values(monthly)
        }]
    });

    const prepareChartOptions = () => ({
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 12 } } },
            y: { grid: { color: '#e0e0e0' }, ticks: { font: { size: 12 }, maxTicksLimit: 10 } }
        },
        plugins: {
            legend: { position: 'right' },
        }
    });

    const calculateTotalAmount = (monthly) => Object.values(monthly).reduce((a, b) => a + b, 0);

    const prepareTopProductsData = (orders) => {
        const count = {};
        for (const order of orders) {
            for (const item of order.orderItems) {
                count[item.name] = (count[item.name] || 0) + item.quantity;
            }
        }
        const top = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return {
            labels: top.map(p => p[0]),
            datasets: [{
                label: 'Top 5 Produse',
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                data: top.map(p => p[1])
            }]
        };
    };

    const prepareOrdersPerClientData = (orders) => {
        const count = {};
        orders.forEach(order => {
            const userEmail = order.email || order.user?.email || "Necunoscut";
            count[userEmail] = (count[userEmail] || 0) + 1;
        });

        const topClients = Object.entries(count)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return {
            labels: topClients.map(c => c[0]),
            datasets: [{
                label: 'Comenzi per Client',
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                data: topClients.map(c => c[1])
            }]
        };
    };

    const calculateClientType = (users) => {
        const [premium, nonPremium] = users.reduce(([p, n], user) => (
            user.isPremium ? [p + 1, n] : [p, n + 1]
        ), [0, 0]);

        setPieChartData({
            labels: [
                `Clienti Premium (${premium})`,
                `Clienti Non-Premium (${nonPremium})`
            ],
            datasets: [{
                data: [premium, nonPremium],
                backgroundColor: ['#25add7', 'rgb(0,0,205)'],
            }],
        });
    };

    return (
        <div>
            {totalAmount > 0 && <h3 className="text-center">Total comenzi: {totalAmount.toFixed(2)} RON</h3>}

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '30px'
            }}>
                <div style={{ width: '45%', minWidth: '300px', height: '300px' }}>
                    {chartData && <Bar data={chartData.data} options={chartData.options} />}
                </div>

                <div style={{ width: '45%', minWidth: '300px', height: '300px' }}>
                    {pieChartData && <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                </div>

                <div style={{ width: '45%', minWidth: '300px', height: '300px' }}>
                    {topProductsData && <Bar data={topProductsData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />}
                </div>

                <div style={{ width: '45%', minWidth: '300px', height: '300px' }}>
                    {ordersPerClientData && <Bar data={ordersPerClientData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />}
                </div>
            </div>
        </div>
    );
}
