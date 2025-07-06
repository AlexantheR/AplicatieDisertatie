
import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, Title, BarElement, ArcElement, Chart, Legend, LineElement, PointElement } from 'chart.js';
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
            const chartData = prepareChartData(monthlySoldItems);
            const options = prepareChartOptions(monthlySoldItems);
            const totalAmount = calculateTotalAmount(monthlySoldItems);
            setMonthlyChartData({ data: chartData, options: options });
            setTotalAmount(totalAmount);

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

            const perClient = calculateOrdersPerClient(orders);
            setOrdersPerClientData({
                labels: perClient.labels,
                datasets: [
                    {
                        label: 'Comenzi per client',
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        data: perClient.data,
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
        const monthlySoldItems = {
            Ianuarie: 0,
            Februarie: 0,
            Martie: 0,
            Aprilie: 0,
            Mai: 0,
            Iunie: 0,
            Iulie: 0,
            August: 0,
            Septembrie: 0,
            Octombrie: 0,
            Noiembrie: 0,
            Decembrie: 0,
        };

        orders.forEach((order) => {
            const month = new Date(order.createdAt).getMonth();
            const orderItems = order.orderItems;

            orderItems.forEach((item) => {
                monthlySoldItems[Object.keys(monthlySoldItems)[month]] += item.price;
            });
        });

        return monthlySoldItems;
    };

    const prepareChartData = (monthlySoldItems) => {
        const labels = Object.keys(monthlySoldItems);
        const data = Object.values(monthlySoldItems);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Total comenzi lunare',
                    backgroundColor: 'rgba(0,0,205,0.3)',
                    borderColor: 'rgba(0, 0, 191, 1)',
                    borderWidth: 2,
                    fill: true,
                    data: data,
                },
            ],
        };
    };

    const prepareChartOptions = () => ({
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 12 } } },
            y: {
                grid: { color: '#e0e0e0' },
                ticks: { font: { size: 12 }, maxTicksLimit: 10 },
            },
        },
        plugins: {
            legend: { position: 'top' },
        },
    });

    const calculateTotalAmount = (monthlySoldItems) => Object.values(monthlySoldItems).reduce((a, b) => a + b, 0);

    const calculateTopProducts = (orders) => {
        const productCount = {};

        orders.forEach(order =>
            order.orderItems.forEach(item => {
                productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
            })
        );

        const sorted = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return { labels: sorted.map(([name]) => name), data: sorted.map(([, qty]) => qty) };
    };

    const calculateOrdersPerClient = (orders) => {
        const clientOrders = {};

        orders.forEach(order => {
            const email = order.currentUser?.email || 'Necunoscut';
            clientOrders[email] = (clientOrders[email] || 0) + 1;
        });

        const sorted = Object.entries(clientOrders).sort((a, b) => b[1] - a[1]).slice(0, 5);
        return { labels: sorted.map(([email]) => email), data: sorted.map(([, count]) => Math.round(count)) };
    };

    const calculateClientType = (users) => {
        let premium = 0, nonPremium = 0;

        users.forEach(user => (user.isPremium ? premium++ : nonPremium++));

        const pieData = {
            labels: [
                `Clienti Premium (${premium})`,
                `Clienti Non-Premium (${nonPremium})`
            ],
            datasets: [{
                data: [premium, nonPremium],
                backgroundColor: ['#25add7', 'rgb(0,0,205)'],
            }],
        };

        setPieChartData(pieData);
    };

    return (
        <div>
            {totalAmount > 0 && <h3 className="total-comenzi">Total comenzi: {totalAmount.toFixed(2)} RON</h3>}
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
                    {ordersPerClientData && <Bar data={ordersPerClientData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, ticks: { stepSize: 1 } }
                        }
                    }} />}
                </div>
            </div>
        </div>
    );
}
