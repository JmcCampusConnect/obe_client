import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import './Piechart.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Piechart1 = () => 
{
    const apiUrl = import.meta.env.VITE_API_URL;
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        const fetchData = async () => 
        {
            setLoading(true);
            try 
            {
                const response = await axios.get(`${apiUrl}/api/studentpiechart`);
                const result = response.data;
                
                if (result && result.categories) 
                {
                    const labels = result.categories.map(
                        item => `${item.label} - ${item.count}` 
                    )

                    const data = result.categories.map(item => item.count);

                    setChartData (
                    {
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                                backgroundColor: [
                                    'rgb(10, 161, 116)',  // AIDED
                                    'rgb(224, 5, 5)',     // SFM
                                    'rgb(146, 0, 236)',   // SFW
                                ],
                                hoverBackgroundColor: [
                                    'rgb(11, 110, 81)',   // AIDED Hover
                                    'rgb(202, 7, 7)',     // SFM Hover
                                    'rgb(108, 7, 172)',   // SFW Hover
                                ],
                                borderColor: 'rgba(255, 255, 255, 1)',
                                borderWidth: 2,
                            },
                        ],
                    });
                }
            }  
            catch (error) {
                console.error('Error Fetching Data:', error);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [apiUrl]);

    const options = 
    {
        plugins: 
        {
            legend: 
            {
                display: true,
                position: 'bottom',
                align: 'center',
                labels: 
                {
                    color: '#333',
                    font: {
                        size: 17,
                    },
                    padding: 20,
                    boxWidth: 20,
                    boxHeight: 20,
                },
            },
            tooltip: 
            {
                callbacks: 
                {
                    label: function (context) 
                    {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}`;
                    },
                },
            },
            datalabels: 
            {
                color: '#fff',
                font: {
                    size: 15,
                    weight: 'bold',
                },
                display: (context) => true,
                formatter: (value, context) => 
                {
                    const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`;
                },
            },
        },
        responsive: true,
        maintainAspectRatio: true,
    }
    
    return (
        <div style={{ width: '320px', height: '350px', margin: '10px' }}>
            <h3 className="pie-heading">STUDENT</h3>
            {loading ? (
                <p>Loading ...</p>
            ) : chartData.labels.length > 0 ? (
                <Pie data={chartData} options={options} />
            ) : (
                <p>No Data Available</p>
            )}
        </div>
    )
}

export default Piechart1;