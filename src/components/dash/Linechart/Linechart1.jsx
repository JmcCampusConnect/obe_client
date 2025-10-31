import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const apiUrl = import.meta.env.VITE_API_URL;

const BarChart = () => 
{
    const [chartData, setChartData] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => 
    {
        const fetchChartData = async () => 
        {
            try 
            {
                const response = await axios.post(`${apiUrl}/api/processedChartData`, {});
                const data = response.data;
                setTotal(response.data.countUniqueCourseCodes);

                setChartData(
                {
                    categories: ['CIA 1', 'CIA 2', 'ASS 1', 'ASS 2', 'ESE'],
                    data: [
                        data.counts.cia_1,
                        data.counts.cia_2,
                        data.counts.ass_1,
                        data.counts.ass_2,
                        data.counts.ese,
                    ],
                    total,
                })
            } 
            catch (error) {
                console.error('Error Fetching Chart Data :', error);
            }
        }
        fetchChartData();
    }, []);

    if (!chartData) return <p>Loading Chart Data...</p>;

    const options = 
    {
        chart: {
            type: 'column',
        },
        title: 
        {
            text: `COMPLETION STATUS of ${total} COURSES`,            
            align: 'center', 
            style: {
                fontSize: '15px', 
                fontWeight: 'bolder', 
            },
        },
        xAxis: 
        {
            categories: chartData.categories,
            labels: {
                rotation: 0,
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
            },
            gridLineWidth: 0,
        },
        // yAxis: {
        //     title: {
        //         text: 'COUNTS',
        //         margin: 20,
        //     },
        //     max: Math.max(...chartData.data), 
        //     endOnTick: true,
        //     tickInterval: Math.ceil(Math.max(...chartData.data) / 5),
        //     labels: {
        //         enabled: true,
        //         style: {
        //             fontSize: '12px',
        //             fontWeight: 'bold',
        //         },
        //     },
        //     gridLineWidth: 0,
        // },
        yAxis: 
        {
            title: {
                text: 'COUNTS',
                margin: 20,
            },
            max: total,
            endOnTick: false,
            tickInterval: Math.ceil(Math.max(total) / 8),
            labels: 
            {
                enabled: true,
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
            },
            gridLineWidth: 0,
        },
        plotOptions: 
        {
            column: 
            {
                colorByPoint: true,
                dataLabels: 
                {
                    enabled: true,
                    color: '#000',
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                    },
                    verticalAlign: 'bottom',
                    y: -10,
                    formatter: function () {
                        return `${this.y}`;
                    },
                },
            },
        },
        series: [
            {
                name: '', 
                data: chartData.data,
                colors: ['rgb(0, 81, 255)', 'rgb(224, 5, 5)', 'rgb(146, 0, 236)', '#ea9a0d', 'rgb(10, 161, 116)'],
                showInLegend: false, 
            },
        ],
        credits: {
            enabled: false,
        },
    }

    return (
        <div style={{ width: '300px', height: '100%' }}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}

export default BarChart;