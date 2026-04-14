import React, { useState, useEffect } from "react";
import "../../css/ObeReport.css";
import jmclogo from "../../assets/jmclogo.png";
import axios from "axios";
import {
    FileText,
    Download,
    RefreshCw,
    Calendar,
    AlertCircle,
    CheckCircle,
    XCircle,
    BarChart3,
    Layers,
    Target,
    BookOpen,
    Award,
    Loader2,
    FileBarChart,
    ChevronDown,
} from "lucide-react";

function ObeReport() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [attainmentSpecData, setAttainmentSpecData] = useState({});
    const [poRawData, setPoRawData] = useState(null); // stores {UG, PG} for PO
    const [loading, setLoading] = useState(false);
    const [reportFetched, setReportFetched] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState("");
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [debugInfo, setDebugInfo] = useState("");
    const [expandedDepartments, setExpandedDepartments] = useState({});
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [reportType, setReportType] = useState('pso');

    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/academic-years`);
                setAcademicYears(response.data);
                if (response.data.length > 0) setSelectedYear(response.data[0]);
            } catch (error) {
                showNotification('error', 'Failed to fetch academic years');
            }
        };
        fetchAcademicYears();
    }, [apiUrl]);

    useEffect(() => {
        resetReport();
    }, [reportType]);

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    };

    const fetchReport = async () => {
        if (!selectedYear) {
            showNotification('error', 'Please select an academic year');
            return;
        }
        try {
            setLoading(true);
            setDebugInfo(`Fetching ${reportType.toUpperCase()} report data...`);
            const endpoint = reportType === 'pso' ? '/api/psoReport' : '/api/poReport';
            const response = await axios.get(`${apiUrl}${endpoint}`, {
                params: { academic_year: selectedYear }
            });
            const data = response.data;

            if (reportType === 'po' && (data.UG || data.PG)) {
                // Store raw PO data for simple table rendering
                setPoRawData(data);
                setReportFetched(true);
                setDebugInfo(`PO data loaded: UG=${data.UG?.length || 0}, PG=${data.PG?.length || 0}`);
                showNotification('success', 'PO report generated successfully');
            } else if (reportType === 'pso') {
                if (Object.keys(data).length === 0) {
                    setDebugInfo('No PSO data found');
                    showNotification('warning', 'No PSO data for selected year');
                } else {
                    setAttainmentSpecData(data);
                    setReportFetched(true);
                    setDebugInfo(`Found ${Object.keys(data).length} departments for PSO`);
                    showNotification('success', 'PSO report generated');
                    const firstDept = Object.keys(data)[0];
                    if (firstDept) setExpandedDepartments({ [firstDept]: true });
                }
            } else {
                setDebugInfo(`No ${reportType.toUpperCase()} data found`);
                showNotification('warning', `No data found for ${reportType.toUpperCase()}`);
            }
        } catch (error) {
            console.error(error);
            setDebugInfo(`Error fetching ${reportType.toUpperCase()} data`);
            showNotification('error', `Failed to fetch ${reportType.toUpperCase()} report`);
        } finally {
            setLoading(false);
        }
    };

    const downloadWord = async () => {
        try {
            setLoading(true);
            setDownloadProgress("Generating Word document...");
            const endpoint = reportType === 'pso' ? '/api/psoReport/download-word' : '/api/poReport/download-word';
            const response = await axios.get(`${apiUrl}${endpoint}`, {
                params: { academic_year: selectedYear },
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            const timestamp = new Date().toISOString().slice(0, 10);
            link.setAttribute("download", `${reportType.toUpperCase()} Report ${selectedYear}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setDownloadProgress("Downloaded!");
            showNotification('success', `${reportType.toUpperCase()} report downloaded`);
            setTimeout(() => setDownloadProgress(""), 2000);
        } catch (error) {
            console.error("Word Generation Error:", error);
            showNotification('error', 'Failed to generate Word document');
        } finally {
            setLoading(false);
        }
    };

    const resetReport = () => {
        setAttainmentSpecData({});
        setPoRawData(null);
        setReportFetched(false);
        setDebugInfo("");
        setExpandedDepartments({});
        showNotification('info', 'Report reset');
    };

    const getAttainmentLevel = (avg) => {
        if (avg >= 3.5) return { level: 'Excellent', color: '#10b981', bg: '#d1fae5' };
        if (avg >= 2.5) return { level: 'High', color: '#f59e0b', bg: '#fef3c7' };
        if (avg >= 1.5) return { level: 'Moderate', color: '#f97316', bg: '#ffedd5' };
        return { level: 'Low', color: '#ef4444', bg: '#fee2e2' };
    };

    const calculatePeriodOfStudy = (academicYear) => {
        if (!academicYear) return "2022 – 2024";
        const match = academicYear.match(/^(\d{4})/);
        if (match) {
            const startYear = parseInt(match[1]);
            return `${startYear} – ${startYear + 2}`;
        }
        return academicYear;
    };

    // Simple stats for PO (departments count)
    const getPoStats = () => {
        if (!poRawData) return null;
        const ugCount = poRawData.UG?.length || 0;
        const pgCount = poRawData.PG?.length || 0;
        return { ugCount, pgCount, total: ugCount + pgCount };
    };
    const poStats = getPoStats();

    const mainTitle = reportType === 'pso' ? "Programme Specific Outcome Report" : "Programme Outcome Report";
    const outcomeLabel = reportType === 'pso' ? "PSO" : "PO";
    const avgStatLabel = reportType === 'pso' ? "Avg. PSO" : "Avg. PO";

    return (
        <div className="obe-report-container">
            {/* Toggle Buttons */}
            <div className="report-type-toggle-container">
                <div className="report-type-toggle">
                    <button className={`toggle-btn ${reportType === 'pso' ? 'active' : ''}`} onClick={() => setReportType('pso')} disabled={loading}>
                        <Target size={16} /><span>PSO</span>
                    </button>
                    <button className={`toggle-btn ${reportType === 'po' ? 'active' : ''}`} onClick={() => setReportType('po')} disabled={loading}>
                        <BarChart3 size={16} /><span>PO</span>
                    </button>
                </div>
            </div>

            {/* Header Section (same for both) */}
            <div className="report-header-section">
                <div className="header-content">
                    <div className="title-section">
                        <h1 className="report-main-title">{mainTitle}</h1>
                        <p className="report-subtitle">Outcome-Based Education (OBE) Attainment Analysis</p>
                    </div>
                    <div className="filter-section">
                        <div className="year-selector-wrapper">
                            <Calendar size={18} className="input-icon" />
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} disabled={loading}>
                                <option value="">Select Academic Year</option>
                                {academicYears.map((year, idx) => <option key={idx} value={year}>{year}</option>)}
                            </select>
                            <ChevronDown size={16} className="dropdown-arrow" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards - different for PO */}
                {reportType === 'pso' && (
                    (() => {
                        let totalCourses = 0, totalOutcomeScore = 0, deptCount = 0;
                        Object.values(attainmentSpecData).forEach(dept => {
                            if (dept.overall) totalCourses += Object.keys(dept.overall).length;
                            const meanScore = dept.meanScores?.pso;
                            if (meanScore) { totalOutcomeScore += meanScore; deptCount++; }
                        });
                        const stats = { departments: Object.keys(attainmentSpecData).length, courses: totalCourses, avgOutcome: deptCount ? (totalOutcomeScore / deptCount).toFixed(2) : 0 };
                        return stats.departments ? (
                            <div className="stats-grid">
                                <div className="stat-card"><div className="stat-icon-wrapper blue"><Layers size={20} /></div><div className="stat-content"><span className="stat-label">Departments</span><span className="stat-value">{stats.departments}</span></div></div>
                                <div className="stat-card"><div className="stat-icon-wrapper green"><BookOpen size={20} /></div><div className="stat-content"><span className="stat-label">Courses</span><span className="stat-value">{stats.courses}</span></div></div>
                                <div className="stat-card"><div className="stat-icon-wrapper orange"><Award size={20} /></div><div className="stat-content"><span className="stat-label">{avgStatLabel}</span><span className="stat-value">{stats.avgOutcome}</span></div></div>
                            </div>
                        ) : null;
                    })()
                )}
                {reportType === 'po' && poStats && poStats.total > 0 && (
                    <div className="stats-grid">
                        <div className="stat-card"><div className="stat-icon-wrapper blue"><Layers size={20} /></div><div className="stat-content"><span className="stat-label">UG Programmes</span><span className="stat-value">{poStats.ugCount}</span></div></div>
                        <div className="stat-card"><div className="stat-icon-wrapper green"><BookOpen size={20} /></div><div className="stat-content"><span className="stat-label">PG Programmes</span><span className="stat-value">{poStats.pgCount}</span></div></div>
                        <div className="stat-card"><div className="stat-icon-wrapper orange"><Award size={20} /></div><div className="stat-content"><span className="stat-label">Total</span><span className="stat-value">{poStats.total}</span></div></div>
                    </div>
                )}

                {/* Action Bar */}
                <div className="action-bar">
                    {!reportFetched ? (
                        <button onClick={fetchReport} className="btn btn-primary" disabled={loading || !selectedYear}>
                            {loading ? <><Loader2 size={18} className="spinner" /><span>Processing...</span></> : <><FileBarChart size={18} /><span>Generate Report</span></>}
                        </button>
                    ) : (
                        <div className="download-controls">
                            <button onClick={downloadWord} className="btn btn-success" disabled={loading}>
                                {loading ? <><Loader2 size={18} className="spinner" /><span>{downloadProgress || "Generating..."}</span></> : <><Download size={18} /><span>Download Word</span></>}
                            </button>
                            <button onClick={resetReport} className="btn btn-outline" disabled={loading}><RefreshCw size={18} /></button>
                        </div>
                    )}
                </div>
                {debugInfo && <div className="debug-info"><AlertCircle size={14} /><small>{debugInfo}</small></div>}
            </div>

            {/* Notification */}
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' && <CheckCircle size={20} />}
                    {notification.type === 'error' && <XCircle size={20} />}
                    {notification.type === 'warning' && <AlertCircle size={20} />}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Report Preview - conditional rendering for PO vs PSO */}
            <div className="report-preview">
                {!reportFetched ? (
                    <div className="empty-state">
                        <div className="empty-icon-wrapper"><FileText size={40} className="empty-icon" /></div>
                        <h3>No {reportType.toUpperCase()} Report Generated</h3>
                        <p>Select an academic year and click "Generate Report"</p>
                    </div>
                ) : reportType === 'pso' ? (
                    // ========== PSO RENDERING (unchanged, keep your existing code) ==========
                    Object.entries(attainmentSpecData).map(([deptId, deptData]) => {
                        const meanScoreValue = deptData.meanScores?.pso;
                        return (
                            <div key={deptId} className="department-container">
                                <div className="department-header" onClick={() => setExpandedDepartments(prev => ({ ...prev, [deptId]: !prev[deptId] }))}>
                                    <div className="department-header-left">
                                        <ChevronDown size={20} className={`chevron ${expandedDepartments[deptId] ? 'expanded' : ''}`} />
                                        <div className="department-info"><h3 className="department-name">{deptId}</h3><span className="department-badge">{deptData.graduate || "PG"}</span></div>
                                    </div>
                                    {meanScoreValue && <div className="department-score"><span className="score-label">PSO Average:</span><span className="score-value" style={{ color: getAttainmentLevel(meanScoreValue).color, background: getAttainmentLevel(meanScoreValue).bg }}>{meanScoreValue.toFixed(2)}</span></div>}
                                </div>
                                {expandedDepartments[deptId] && (
                                    <div className="department-content">
                                        {/* PAGE 1: Methodology (same as before) */}
                                        <div className="report-page1">
                                            <div className="page-header"><img src={jmclogo} alt="JMC Logo" className="college-logo" /><div className="header-text"><h1>JAMAL MOHAMED COLLEGE (Autonomous)</h1><h2>TIRUCHIRAPPALLI - 620 020</h2><h3>OFFICE OF THE CONTROLLER OF EXAMINATIONS</h3></div></div>
                                            <div className="page-content">
                                                <h3 className="section-title"><BarChart3 size={24} className="section-icon" />Steps to Calculate the Attainment of Programme Specific Outcome</h3>
                                                <ol className="steps-list"><li>The CIA and ESE marks are normalized to a common scale value of 100.</li><li>From the above normalized values, a weightage of 40% is assigned to the CIA Component and a weightage of 60% is assigned to the ESE component.</li><li>These values are summed up to get a OBE score. A OBE scale value of 1 to 4 and the level of attainment (Low, Moderate, High and Excellent) by a student on a specific course is determined based on this score. This is shown in Table 1.</li><li>A mean of the OBE scale value for all the students indicate the attainment level of the particular course. This is shown in Table 2.</li><li>The mean of the OBE scale value for all the courses of a specific programme determines attainment level of that specific programme. This is shown in Table 3.</li></ol>
                                                <h4 className="table-captions">Table 1 : Weightage by students and scale used to assess the attainment for {deptData.graduate || "PG"}</h4>
                                                <table className="data-table methodology-table"><thead><tr><th>Weightage obtained</th><th>Scale used</th><th>Level of attainment of Outcome</th></tr></thead><tbody><tr><td>0 - 49</td><td>1</td><td>Low</td></tr><tr><td>50 - 74</td><td>2</td><td>Moderate</td></tr><tr><td>75 – 94</td><td>3</td><td>High</td></tr><tr><td>95 - 100</td><td>4</td><td>Excellent</td></tr></tbody></table>
                                                <h4 className="table-captions">Table 2 : Scale used to assess the Course Outcome for {deptData.graduate || "PG"}</h4>
                                                <table className="data-table methodology-table"><thead><tr><th>Scale used</th><th>Level of attainment of Outcome</th></tr></thead><tbody><tr><td>0 – 1.0</td><td>Low</td></tr><tr><td>1.1 – 2.0</td><td>Moderate</td></tr><tr><td>2.1 – 3.0</td><td>High</td></tr><tr><td>3.1 – 4.0</td><td>Excellent</td></tr></tbody></table>
                                                <h4 className="table-captions">Table 3 : Scale used to assess the Programme Specific Outcome for {deptData.graduate || "PG"}</h4>
                                                <table className="data-table methodology-table"><thead><tr><th>Scale used</th><th>Level of attainment of Outcome</th></tr></thead><tbody><tr><td>0 – 1.0</td><td>Low</td></tr><tr><td>1.1 – 2.0</td><td>Moderate</td></tr><tr><td>2.1 – 3.0</td><td>High</td></tr><tr><td>3.1 – 4.0</td><td>Excellent</td></tr></tbody></table>
                                            </div>
                                        </div>
                                        {/* PAGE 2: Course table */}
                                        <div className="report-page2">
                                            <div className="page-header"><img src={jmclogo} alt="JMC Logo" className="college-logo" /><div className="header-text"><h1>JAMAL MOHAMED COLLEGE (Autonomous)</h1><h2>TIRUCHIRAPPALLI - 620 020</h2><h3>OFFICE OF THE CONTROLLER OF EXAMINATIONS</h3></div></div>
                                            <div className="page-content">
                                                <h3 className="section-title centered underline">Attainment of Course Outcome</h3>
                                                <div className="programme-info"><strong>Programme :</strong> {deptId} ({deptData.graduate || "PG"})<strong>Period of Study :</strong> {calculatePeriodOfStudy(selectedYear)}</div>
                                                <table className="data-table main-table"><thead><tr><th>S. No</th><th>Course Code</th><th>Course Name</th><th>OBE Level</th><th>Course Outcome</th></tr></thead><tbody>
                                                    {deptData.overall && Object.keys(deptData.overall).map((code, idx) => {
                                                        const avgScore = deptData.avgOverallScore?.[code];
                                                        const score = avgScore != null ? avgScore.toFixed(2) : "—";
                                                        const attainment = avgScore != null ? getAttainmentLevel(avgScore) : { level: "N/A", color: '#6b7280', bg: '#f3f4f6' };
                                                        const outcome = deptData.grade?.[code] || attainment.level;
                                                        const courseName = deptData.courseNames?.[code] || "N/A";
                                                        return (<tr key={code}><td className="text-center">{idx + 1}</td><td className="text-center"><span className="course-code">{code}</span></td><td>{courseName}</td><td className="text-center"><span className="obe-score">{score}</span></td><td className="text-center"><span className="attainment-badge" style={{ backgroundColor: attainment.bg, color: attainment.color }}>{outcome}</span></td></tr>);
                                                    })}
                                                    {meanScoreValue && (<tr className="pso-summary-row"><td colSpan="3" className="text-right"><strong>Programme Specific Outcome (PSO)</strong></td><td className="text-center"><strong className="pso-score">{meanScoreValue.toFixed(2)}</strong></td><td className="text-center">{(() => { const a = getAttainmentLevel(meanScoreValue); return <span className="attainment-badge pso-badge" style={{ backgroundColor: a.bg, color: a.color }}>{a.level}</span>; })()}</td></tr>)}
                                                </tbody></table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    // ========== PO RENDERING: Simple table as per image ==========
                    <div className="po-simple-report">
                        {/* Optional: college header (same as PSO) */}
                        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                            <img src={jmclogo} alt="JMC Logo" className="college-logo" />
                            <div className="header-text">
                                <h1>JAMAL MOHAMED COLLEGE (Autonomous)</h1>
                                <h2>TIRUCHIRAPPALLI - 620 020</h2>
                                <h3>OFFICE OF THE CONTROLLER OF EXAMINATIONS</h3>
                            </div>
                        </div>
                        <h3 className="section-title centered underline" style={{ marginBottom: '1rem' }}>Programme Outcome Attainment</h3>
                        <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Academic Year: <strong>{selectedYear}</strong> | Period of Study: <strong>{calculatePeriodOfStudy(selectedYear)}</strong></p>

                        {poRawData?.UG && poRawData.UG.length > 0 && (
                            <>
                                <h4 className="table-captions" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>UNDERGRADUATE PROGRAMMES</h4>
                                <table className="data-table main-table">
                                    <thead>
                                        <tr><th>S. No</th><th>Programme</th><th>OBE Level</th><th>Programme Outcome</th></tr>
                                    </thead>
                                    <tbody>
                                        {poRawData.UG.map((item) => (
                                            <tr key={item.sNo}>
                                                <td className="text-center">{item.sNo}</td>
                                                <td>{item.programme}</td>
                                                <td className="text-center">{item.obeLevel}</td>
                                                <td className="text-center">
                                                    <span className="attainment-badge" style={{ backgroundColor: getAttainmentLevel(parseFloat(item.obeLevel)).bg, color: getAttainmentLevel(parseFloat(item.obeLevel)).color }}>
                                                        {item.outcome}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {poRawData?.PG && poRawData.PG.length > 0 && (
                            <>
                                <h4 className="table-captions" style={{ fontSize: '1.2rem', marginTop: '2rem' }}>POSTGRADUATE PROGRAMMES</h4>
                                <table className="data-table main-table">
                                    <thead>
                                        <tr><th>S. No</th><th>Programme</th><th>OBE Level</th><th>Programme Outcome</th></tr>
                                    </thead>
                                    <tbody>
                                        {poRawData.PG.map((item) => (
                                            <tr key={item.sNo}>
                                                <td className="text-center">{item.sNo}</td>
                                                <td>{item.programme}</td>
                                                <td className="text-center">{item.obeLevel}</td>
                                                <td className="text-center">
                                                    <span className="attainment-badge" style={{ backgroundColor: getAttainmentLevel(parseFloat(item.obeLevel)).bg, color: getAttainmentLevel(parseFloat(item.obeLevel)).color }}>
                                                        {item.outcome}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {(!poRawData?.UG?.length && !poRawData?.PG?.length) && (
                            <div className="empty-state"><p>No PO data available for the selected year.</p></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ObeReport;