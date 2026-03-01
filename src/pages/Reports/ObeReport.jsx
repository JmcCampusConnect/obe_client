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
    Printer,
    Eye,
    ChevronDown,
} from "lucide-react";

function ObeReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [attainmentSpecData, setAttainmentSpecData] = useState({});
    const [loading, setLoading] = useState(false);
    const [reportFetched, setReportFetched] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState("");
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [debugInfo, setDebugInfo] = useState("");
    const [previewMode, setPreviewMode] = useState(false);
    const [expandedDepartments, setExpandedDepartments] = useState({});
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/academic-years`);
                setAcademicYears(response.data);
                if (response.data.length > 0) {
                    setSelectedYear(response.data[0]);
                }
            } catch (error) {
                showNotification('error', 'Failed to fetch academic years');
                console.error("Error fetching academic years:", error);
            }
        };
        fetchAcademicYears();
    }, [apiUrl]);

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
            setDebugInfo("Fetching report data...");

            const response = await axios.get(`${apiUrl}/api/specReport`, {
                params: { academic_year: selectedYear }
            });

            if (Object.keys(response.data).length === 0) {
                setDebugInfo("No data found for selected year");
                showNotification('warning', 'No data found for the selected academic year');
            } else {
                setAttainmentSpecData(response.data);
                setReportFetched(true);
                setDebugInfo(`Found ${Object.keys(response.data).length} departments`);
                showNotification('success', 'Report generated successfully');
                const firstDept = Object.keys(response.data)[0];
                if (firstDept) {
                    setExpandedDepartments({ [firstDept]: true });
                }
            }
        } catch (error) {
            console.error("Error fetching report:", error);
            setDebugInfo("Error fetching data");
            showNotification('error', 'Failed to fetch report data');
        } finally {
            setLoading(false);
        }
    };

    const downloadWord = async () => {

        try {

            setLoading(true);
            setDownloadProgress("Generating Word document...");
            const response = await axios.get(
                `${apiUrl}/api/specReport/download-word`,
                {
                    params: { academic_year: selectedYear },
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            const timestamp = new Date().toISOString().slice(0, 10);
            link.setAttribute("download", `PSO_Report_${selectedYear}_${timestamp}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setDownloadProgress("Downloaded!");
            showNotification('success', 'Report downloaded successfully');
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
        setReportFetched(false);
        setDebugInfo("");
        setExpandedDepartments({});
        showNotification('info', 'Report reset');
    };

    const toggleDepartment = (deptId) => {
        setExpandedDepartments(prev => ({
            ...prev,
            [deptId]: !prev[deptId]
        }));
    };

    const printReport = () => {
        window.print();
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
        if (match && match[1]) {
            const startYear = parseInt(match[1]);
            const endYear = startYear + 2;
            return `${startYear} – ${endYear}`;
        }
        return academicYear;
    };

    const getStatistics = () => {
        if (!attainmentSpecData || Object.keys(attainmentSpecData).length === 0) return null;

        let totalCourses = 0;
        let totalPSO = 0;
        let deptCount = 0;

        Object.values(attainmentSpecData).forEach(dept => {
            if (dept.overall) {
                totalCourses += Object.keys(dept.overall).length;
            }
            if (dept.meanScores?.pso) {
                totalPSO += dept.meanScores.pso;
                deptCount++;
            }
        });

        return {
            departments: Object.keys(attainmentSpecData).length,
            courses: totalCourses,
            avgPSO: deptCount > 0 ? (totalPSO / deptCount).toFixed(2) : 0
        };
    };

    const stats = getStatistics();

    return (
        <div className="obe-report-container">
            {/* Header with Gradient Background */}
            <div className="report-header-section">
                <div className="header-content">
                    <div className="title-section">
                        <div>
                            <h1 className="report-main-title">
                                Programme Specific Outcome Report
                            </h1>
                            <p className="report-subtitle">
                                Outcome-Based Education (OBE) Attainment Analysis
                            </p>
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="year-selector-wrapper">
                            <Calendar size={18} className="input-icon" />
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="academic-dropdown"
                                disabled={loading}
                            >
                                <option value="">Select Academic Year</option>
                                {academicYears.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="dropdown-arrow" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon-wrapper blue">
                                <Layers size={20} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Departments</span>
                                <span className="stat-value">{stats.departments}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper green">
                                <BookOpen size={20} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Courses</span>
                                <span className="stat-value">{stats.courses}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper orange">
                                <Award size={20} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Avg. PSO</span>
                                <span className="stat-value">{stats.avgPSO}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Bar */}
                <div className="action-bar">
                    {!reportFetched ? (
                        <button
                            onClick={fetchReport}
                            className="btn btn-primary"
                            disabled={loading || !selectedYear}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="spinner" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <FileBarChart size={18} />
                                    <span>Generate Report</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="download-controls">
                            <button
                                onClick={downloadWord}
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="spinner" />
                                        <span>{downloadProgress || "Generating..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        <span>Download Word</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={printReport}
                                className="btn btn-outline"
                                disabled={loading}
                                title="Print Report"
                            >
                                <Printer size={18} />
                            </button>
                            <button
                                onClick={() => setPreviewMode(!previewMode)}
                                className={`btn btn-outline ${previewMode ? 'active' : ''}`}
                                disabled={loading}
                                title="Toggle Preview Mode"
                            >
                                <Eye size={18} />
                            </button>
                            <button
                                onClick={resetReport}
                                className="btn btn-outline"
                                disabled={loading}
                                title="Reset"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Debug Info */}
                {debugInfo && (
                    <div className="debug-info">
                        <AlertCircle size={14} />
                        <small>{debugInfo}</small>
                    </div>
                )}
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

            {/* Report Preview */}
            <div className={`report-preview ${previewMode ? 'compact' : ''}`}>
                {Object.keys(attainmentSpecData).length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon-wrapper">
                            <FileText size={40} className="empty-icon" />
                        </div>
                        <h3>No Report Generated</h3>
                        <p>Select an academic year and click "Generate Report" to create a new Programme Specific Outcome report</p>
                        <button
                            onClick={fetchReport}
                            className="btn btn-primary btn-large"
                            disabled={!selectedYear}
                        >
                            <FileBarChart size={18} />
                            Generate Report
                        </button>
                    </div>
                ) : (
                    Object.entries(attainmentSpecData).map(([deptId, deptData], deptIndex) => (
                        <div key={deptId} className="department-container">
                            {/* Department Header */}
                            <div
                                className="department-header"
                                onClick={() => toggleDepartment(deptId)}
                            >
                                <div className="department-header-left">
                                    <ChevronDown
                                        size={20}
                                        className={`chevron ${expandedDepartments[deptId] ? 'expanded' : ''}`}
                                    />
                                    <div className="department-info">
                                        <h3 className="department-name">{deptId}</h3>
                                        <span className="department-badge">
                                            {deptData.graduate || "PG"}
                                        </span>
                                    </div>
                                </div>
                                {deptData.meanScores?.pso && (
                                    <div className="department-score">
                                        <span className="score-label">PSO Average:</span>
                                        <span
                                            className="score-value"
                                            style={{
                                                color: getAttainmentLevel(deptData.meanScores.pso).color,
                                                background: getAttainmentLevel(deptData.meanScores.pso).bg
                                            }}
                                        >
                                            {deptData.meanScores.pso.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Department Content */}
                            {expandedDepartments[deptId] && (
                                <div className="department-content">
                                    {/* PAGE 1: Methodology */}
                                    <div className="report-page1">
                                        <div className="page-header">
                                            <img src={jmclogo} alt="JMC Logo" className="college-logo" />
                                            <div className="header-text">
                                                <h1>JAMAL MOHAMED COLLEGE (Autonomous)</h1>
                                                <h2>TIRUCHIRAPPALLI - 620 020</h2>
                                                <h3>OFFICE OF THE CONTROLLER OF EXAMINATIONS</h3>
                                            </div>
                                        </div>

                                        <div className="page-content">
                                            <h3 className="section-title">
                                                <BarChart3 size={24} className="section-icon" />
                                                Steps to Calculate the Attainment of Programme Specific Outcome
                                            </h3>

                                            <ol className="steps-list">
                                                <li>The CIA and ESE marks are normalized to a common scale value of 100.</li>
                                                <li>From the above normalized values, a weightage of 40% is assigned to the CIA Component and a weightage of 60% is assigned to the ESE component.</li>
                                                <li>These values are summed up to get a OBE score. A OBE scale value of 1 to 4 and the level of attainment (Low, Moderate, High and Excellent) by a student on a specific course is determined based on this score. This is shown in Table 1.</li>
                                                <li>A mean of the OBE scale value for all the students indicate the attainment level of the particular course. This is shown in Table 2.</li>
                                                <li>The mean of the OBE scale value for all the courses of a specific programme determines attainment level of that specific programme. This is shown in Table 3.</li>
                                            </ol>

                                            {/* Table 1 */}
                                            <h4 className="table-captions">
                                                Table 1 : Weightage by students and scale used to assess the attainment for {deptData.graduate || "PG"}
                                            </h4>
                                            <table className="data-table methodology-table">
                                                <thead>
                                                    <tr>
                                                        <th>Weightage obtained</th>
                                                        <th>Scale used</th>
                                                        <th>Level of attainment of Outcome</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td>0 - 49</td><td>1</td><td>Low</td></tr>
                                                    <tr><td>50 - 74</td><td>2</td><td>Moderate</td></tr>
                                                    <tr><td>75 – 94</td><td>3</td><td>High</td></tr>
                                                    <tr><td>95 - 100</td><td>4</td><td>Excellent</td></tr>
                                                </tbody>
                                            </table>

                                            {/* Table 2 */}
                                            <h4 className="table-captions">
                                                Table 2 : Scale used to assess the Course Outcome for {deptData.graduate || "PG"}
                                            </h4>
                                            <table className="data-table methodology-table">
                                                <thead>
                                                    <tr>
                                                        <th>Scale used</th>
                                                        <th>Level of attainment of Outcome</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td>0 – 1.0</td><td>Low</td></tr>
                                                    <tr><td>1.1 – 2.0</td><td>Moderate</td></tr>
                                                    <tr><td>2.1 – 3.0</td><td>High</td></tr>
                                                    <tr><td>3.1 – 4.0</td><td>Excellent</td></tr>
                                                </tbody>
                                            </table>

                                            {/* Table 3 */}
                                            <h4 className="table-captions">
                                                Table 3 : Scale used to assess the Program Specific Outcome for {deptData.graduate || "PG"}
                                            </h4>
                                            <table className="data-table methodology-table">
                                                <thead>
                                                    <tr>
                                                        <th>Scale used</th>
                                                        <th>Level of attainment of Outcome</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td>0 – 1.0</td><td>Low</td></tr>
                                                    <tr><td>1.1 – 2.0</td><td>Moderate</td></tr>
                                                    <tr><td>2.1 – 3.0</td><td>High</td></tr>
                                                    <tr><td>3.1 – 4.0</td><td>Excellent</td></tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* PAGE 2: Data */}
                                    <div className="report-page2">
                                        <div className="page-header">
                                            <img src={jmclogo} alt="JMC Logo" className="college-logo" />
                                            <div className="header-text">
                                                <h1>JAMAL MOHAMED COLLEGE (Autonomous)</h1>
                                                <h2>TIRUCHIRAPPALLI - 620 020</h2>
                                                <h3>OFFICE OF THE CONTROLLER OF EXAMINATIONS</h3>
                                            </div>
                                        </div>

                                        <div className="page-content">
                                            <h3 className="section-title centered underline">
                                                Attainment of Course Outcome
                                            </h3>

                                            <div className="programme-info">
                                                <strong>Programme :</strong> {deptId} ({deptData.graduate || "PG"})
                                                <strong>Period of Study :</strong> {calculatePeriodOfStudy(selectedYear)}
                                            </div>

                                            <table className="data-table main-table">
                                                <thead>
                                                    <tr>
                                                        <th>S. No</th>
                                                        <th>Course Code</th>
                                                        <th>Course Name</th>
                                                        <th>OBE Level</th>
                                                        <th>Course Outcome</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {deptData.overall && Object.keys(deptData.overall).map((code, idx) => {
                                                        const avgScore = deptData.avgOverallScore?.[code];
                                                        const score = avgScore != null ? avgScore.toFixed(2) : "—";
                                                        const attainment = avgScore != null ? getAttainmentLevel(avgScore) : { level: "N/A", color: '#6b7280', bg: '#f3f4f6' };
                                                        const outcome = deptData.grade?.[code] || attainment.level;
                                                        const courseName = deptData.courseNames?.[code] || "N/A";

                                                        return (
                                                            <tr key={code}>
                                                                <td className="text-center">{idx + 1}</td>
                                                                <td className="text-center">
                                                                    <span className="course-code">{code}</span>
                                                                </td>
                                                                <td>{courseName}</td>
                                                                <td className="text-center">
                                                                    <span className="obe-score">{score}</span>
                                                                </td>
                                                                <td className="text-center">
                                                                    <span
                                                                        className="attainment-badge"
                                                                        style={{
                                                                            backgroundColor: attainment.bg,
                                                                            color: attainment.color,
                                                                            borderColor: attainment.color
                                                                        }}
                                                                    >
                                                                        {outcome}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}

                                                    <tr className="empty-row">
                                                        <td colSpan="5"></td>
                                                    </tr>

                                                    {deptData.meanScores && (
                                                        <tr className="pso-summary-row">
                                                            <td colSpan="3" className="text-right">
                                                                <strong>Programme Specific Outcome (PSO)</strong>
                                                            </td>
                                                            <td className="text-center">
                                                                <strong className="pso-score">
                                                                    {deptData.meanScores.pso?.toFixed(2) || "—"}
                                                                </strong>
                                                            </td>
                                                            <td className="text-center">
                                                                {(() => {
                                                                    const attainment = getAttainmentLevel(deptData.meanScores.pso);
                                                                    return (
                                                                        <span
                                                                            className="attainment-badge pso-badge"
                                                                            style={{
                                                                                backgroundColor: attainment.bg,
                                                                                color: attainment.color,
                                                                                borderColor: attainment.color
                                                                            }}
                                                                        >
                                                                            {attainment.level}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ObeReport;