import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/BarChart.css';

const BarChart = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [componentReport, setComponentReport] = useState({});
    const [cia1, setCia1] = useState(0);
    const [cia2, setCia2] = useState(0);
    const [ass1, setAss1] = useState(0);
    const [ass2, setAss2] = useState(0);
    const [ese, setEse] = useState(0);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/componentreport`, {});
                const responseData = response.data;
                setComponentReport(responseData);
                const totalCount = responseData.totalCount;

                const cia1Percentage = parseInt((responseData.cia_1 / totalCount) * 100);
                const cia2Percentage = parseInt((responseData.cia_2 / totalCount) * 100);
                const ass1Percentage = parseInt((responseData.ass_1 / totalCount) * 100);
                const ass2Percentage = parseInt((responseData.ass_2 / totalCount) * 100);
                // const esePercentage = parseInt((responseData.ese / totalCount) * 100);

                setCia1(cia1Percentage);
                setCia2(cia2Percentage);
                setAss1(ass1Percentage);
                setAss2(ass2Percentage);
                // setEse(esePercentage);
            }
            catch (err) {
                alert('Error Fetching Status Report.');
                console.log('Error Fetching Data:', err);
            }
        }
        fetchProgress();
    }, []);

    return (
        <div className='dash-barchart-main'>
            <div className='dash-barchart-heading'>
                CIA 1 COMPONENT
                <span className="progress-label">{componentReport.cia_1} / {componentReport.totalCount}</span>
            </div>
            <div className="dash-progress-container">
                <div className="dash-progress-bar progress-cia1" style={{ width: `${cia1}%` }}>
                    {cia1}%
                </div>
            </div>

            <div className='dash-barchart-heading'>
                CIA 2 COMPONENT
                <span className="progress-label">{componentReport.cia_2} / {componentReport.totalCount}</span>
            </div>
            <div className="dash-progress-container">
                <div className="dash-progress-bar progress-cia2" style={{ width: `${cia2}%` }}>
                    {cia2}%
                </div>
            </div>

            <div className='dash-barchart-heading'>
                ASS 1 COMPONENT
                <span className="progress-label">{componentReport.ass_1} / {componentReport.totalCount}</span>
            </div>
            <div className="dash-progress-container">
                <div className="dash-progress-bar progress-ass1" style={{ width: `${ass1}%` }}>
                    {ass1}%
                </div>
            </div>

            <div className='dash-barchart-heading'>
                ASS 2 COMPONENT
                <span className="progress-label">{componentReport.ass_2} / {componentReport.totalCount}</span>
            </div>
            <div className="dash-progress-container">
                <div className="dash-progress-bar progress-ass2" style={{ width: `${ass2}%` }}>
                    {ass2}%
                </div>
            </div>

            {/* If you want to enable ESE later */}
            {/* <div className='dash-barchart-heading'>
                ESE COMPONENT
                <span className="progress-label">{componentReport.ese} / {componentReport.totalCount}</span>
            </div>
            <div className="dash-progress-container">
                <div className="dash-progress-bar progress-ese" style={{ width: `${ese}%` }}>
                    {ese}%
                </div>
            </div> */}
        </div>

    )
}

export default BarChart;