import React, { useState, useRef } from "react";
import "../../css/ObeReport.css";
import jmclogo from "../../assets/jmclogo.png";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ObeReport() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [attainmentSpecData, setAttainmentSpecData] = useState({});
    const [loading, setLoading] = useState(false);
    const [reportFetched, setReportFetched] = useState(false);
    const reportRef = useRef(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/specReport`);
            setAttainmentSpecData(response.data);
            setReportFetched(true);
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadpdf = async () => {
        const elements = document.querySelectorAll(".pro-a4-container");

        if (elements.length === 0) {
            alert("No report data found to download.");
            return;
        }

        setLoading(true);

        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Helper function to ensure images are loaded
            const waitForImages = (el) => {
                const imgs = Array.from(el.querySelectorAll('img'));
                const promises = imgs.map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
                });
                return Promise.all(promises);
            };

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];

                // 1. Ensure images inside this page are ready
                await waitForImages(element);

                // 2. Capture the element
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                    // Ensures we capture the full height of the element
                    height: element.offsetHeight,
                    width: element.offsetWidth
                });

                const imgData = canvas.toDataURL("image/png");

                // 3. If not the first page, add a new page to PDF
                if (i > 0) {
                    pdf.addPage();
                }

                // 4. Add the image scaled to fit A4 width
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            }

            // 5. Finalize download
            pdf.save(`OBE_Report_${new Date().getTime()}.pdf`);

        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pro-main-bg">
            <div className="pro-controls">
                <h1 className="dashboard-title">Programme Specific Outcome</h1>
                <div className="pro-btn-group">
                    {!reportFetched ? (
                        <button onClick={fetchReport} className="btn-primary" disabled={loading}>
                            {loading ? "Processing..." : "Generate Report"}
                        </button>
                    ) : (
                        <button onClick={downloadpdf} className="btn-success" disabled={loading}>
                            {loading ? "Exporting PDF..." : "Download Professional PDF"}
                        </button>
                    )}
                </div>
            </div>

            <div className="report-preview-area" ref={reportRef}>
                {Object.entries(attainmentSpecData).map(([deptId, deptData]) => (
                    <div key={deptId} className="dept-wrapper">
                        {/* PAGE 1: Procedures */}
                        <div className="pro-a4-container">
                            <div className="report-header">
                                <img src={jmclogo} alt="Logo" className="report-logo" />
                                <div className="header-text">
                                    <h2>JAMAL MOHAMED COLLEGE (Autonomous)</h2>
                                    <p>TIRUCHIRAPPALLI - 620 020.</p>
                                    <p className="sub-dept">OFFICE OF THE CONTROLLER OF EXAMINATIONS</p>
                                </div>
                            </div>

                            <div className="report-body">
                                <h3 className="section-title">Methodology for PSO Attainment</h3>
                                <div className="method-box">
                                    <p>The attainment of Programme Specific Outcomes is calculated based on the following framework:</p>
                                    <ul>
                                        <li>Normalization of CIA and ESE marks to a 100-point scale.</li>
                                        <li>Weighted average applied: <strong>40% CIA</strong> and <strong>60% ESE</strong>.</li>
                                        <li>Calculation of Mean OBE scale for course-level attainment.</li>
                                    </ul>
                                </div>

                                <div className="table-section">
                                    <h4>Table 1: Student Outcome Assessment Scale</h4>
                                    <table className="professional-table">
                                        <thead>
                                            <tr>
                                                <th>Weightage Range</th>
                                                <th>Scale Value</th>
                                                <th>Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>0 - 50</td><td>1</td><td>Low</td></tr>
                                            <tr><td>51 - 80</td><td>2</td><td>Moderate</td></tr>
                                            <tr><td>81 - 100</td><td>3</td><td>High</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="table-section">
                                    <h4>Table 2: Course Attainment Interpretation</h4>
                                    <table className="professional-table">
                                        <thead>
                                            <tr>
                                                <th>Mean Scale Range</th>
                                                <th>Attainment Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>0.0 - 1.0</td><td>Low</td></tr>
                                            <tr><td>1.1 - 2.0</td><td>Moderate</td></tr>
                                            <tr><td>2.1 - 3.0</td><td>High</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* PAGE 2: Data */}
                        <div className="pro-a4-container">
                            <div className="report-header">
                                <img src={jmclogo} alt="Logo" className="report-logo" />
                                <div className="header-text">
                                    <h2>JAMAL MOHAMED COLLEGE (Autonomous)</h2>
                                    <p>OFFICE OF THE CONTROLLER OF EXAMINATIONS</p>
                                </div>
                            </div>

                            <div className="report-body">
                                <div className="report-info-bar">
                                    <span><strong>Programme:</strong> {deptId}</span>
                                    <span><strong>Academic Period:</strong> 2023 - 2026</span>
                                </div>

                                <h3 className="attainment-title">Course Outcome Attainment Report</h3>

                                <table className="professional-table data-table">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Course Code</th>
                                            <th>OBE Score</th>
                                            <th>Attainment Level</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(deptData.overall || {}).map((code, idx) => (
                                            <tr key={code}>
                                                <td>{idx + 1}</td>
                                                <td>{code}</td>
                                                <td>{deptData.avgOverallScore[code]?.toFixed(2)}</td>
                                                <td className={`level-${deptData.grade[code]?.toLowerCase()}`}>
                                                    {deptData.grade[code]}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="summary-row">
                                            <td colSpan={3}>Programme Specific Outcome (PSO) Average</td>
                                            <td>{deptData.meanScores?.pso?.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="signature-section">
                                    <div className="sig-block">
                                        <div className="sig-line"></div>
                                        <p>Controller of Examinations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ObeReport;