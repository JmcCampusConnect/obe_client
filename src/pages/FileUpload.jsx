import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, Download, FileText } from "lucide-react";
import "../css/FileUpload.css";

function FileUpload() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRefs = useRef({});
    const [stats, setStats] = useState({ processed: 0, total: 0, failed: 0, errors: [] });

    // ---------------- FILE SELECT ----------------

    const handleFileChange = (e) => {
        const { id, files: selectedFiles } = e.target;
        setFiles((prev) => ({ ...prev, [id]: selectedFiles[0] }));
    };

    // ---------------- UPLOAD + PROGRESS ----------------

    const handleUpload = async (e, file, type) => {

        e.preventDefault();

        if (!file) {
            alert("Please select a file");
            return;
        }

        setLoading(true);
        setProgress(0);
        setStats({
            processed: 0,
            total: 0,
            failed: 0,
            errors: []
        });

        const formData = new FormData();
        formData.append("file", file);

        try {
            setFinished(false);
            await axios.post(`${apiUrl}/api/${type}`, formData);
            const eventSource = new EventSource(
                `${apiUrl}/api/progress/${type}`
            );
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const processed = data.processed || 0;
                    const failed = data.failed || 0;
                    const total = data.total || 0;
                    setStats(data);

                    if (total > 0) {
                        const totalDone = processed + failed;
                        const percent = Math.round(
                            (totalDone / total) * 100
                        );
                        setProgress(percent);
                        if (percent >= 100) {
                            eventSource.close();
                            if (percent >= 100) {
                                eventSource.close();
                                setFinished(true);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Failed to parse SSE data : ", err);
                }
            };

            eventSource.onerror = () => {
                eventSource.close();
                setLoading(false);
            };

        } catch (error) {
            console.error("Upload failed:", error);
            setLoading(false);
        }
    };

    // ---------------- DOWNLOAD ----------------

    const handleDownload = (e, fileType, fileName) => {
        e.preventDefault();

        const link = document.createElement("a");
        link.href = `${apiUrl}/api/download/${fileType}`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };


    // ---------------- LOADING MODAL ----------------

    const LoadingModal = () => {

        if (!loading) return null;

        return (
            <div className="overlay">
                <div className="modal-card">

                    {/* Header */}
                    <div className="header">
                        {!finished ? (
                            <div className="spinner-container">
                                <div className="file-loader"></div>
                                <span className="pulse-dot"></span>
                            </div>
                        ) : (
                            <div className="success-icon">✓</div>
                        )}

                        <div className="header-text">
                            <h3 className="title">
                                {finished ? "Data Sync Complete" : "Uploading Records..."}
                            </h3>
                            <p className="subtitle">
                                {finished ? "Review the summary below" : "Please keep this window open"}
                            </p>
                        </div>

                        <div className="percentage-badge">{progress}%</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-container">
                        <div
                            className={`progress-fill ${finished && stats.failed > 0 ? "warning" : "primary"}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    {/* Metrics */}
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <span className="metric-label">SUCCESS : </span>
                            <span className="metric-value success">{stats.processed}</span>
                        </div>

                        <div className="metric-card">
                            <span className="metric-label">FAILED : </span>
                            <span
                                className={`metric-value ${stats.failed > 0 ? "error" : "muted"}`}
                            >
                                {stats.failed}
                            </span>
                        </div>

                        <div className="metric-card">
                            <span className="metric-label">TOTAL ROWS : </span>
                            <span className="metric-value">{stats.total}</span>
                        </div>
                    </div>

                    {/* Error Log */}
                    {stats.errors?.length > 0 && (
                        <div className="error-container">
                            <div className="error-title-row">
                                <span className="error-indicator"></span>
                                <span className="error-text">
                                    Error Log ({stats.failed} issues)
                                </span>
                            </div>

                            <div className="table-wrapper">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ROW</th>
                                            <th>REFERENCE</th>
                                            <th>ISSUE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.errors.map((err, idx) => (
                                            <tr key={idx}>
                                                <td><code>#{err.row}</code></td>
                                                <td>{err.identifier || "-"}</td>
                                                <td className="error-message">
                                                    {err.message}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {finished && (
                        <button
                            className="primary-button"
                            onClick={() => {
                                setLoading(false);
                                setFinished(false);
                                setProgress(0);
                                setStats({ processed: 0, total: 0, failed: 0, errors: [] });
                                setFiles({});
                                Object.values(fileInputRefs.current).forEach(input => {
                                    if (input) input.value = "";
                                });
                            }}
                        >
                            Confirm & Close
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // ---------------- FILE CONFIG ----------------

    const fileConfigs = [
        { id: "file1", key: "coursemaster", label: "Course Master", download: "coursemaster", model: "coursemastermodel" },
        { id: "file2", key: "staffmaster", label: "Staff Master", download: "staff", model: "staffmodel" },
        { id: "file3", key: "coursemapping", label: "Staff Course Mapping", download: "coursemap", model: "coursemapmodel" },
        { id: "file4", key: "studentmaster", label: "Student Master", download: "studentmaster", model: "studentmastermodel" },
        { id: "file5", key: "hod", label: "HOD Master", download: "hod", model: "hodmodel" },
        { id: "file6", key: "mentor", label: "Mentor Master", download: "mentor", model: "mentormodel" },
        { id: "file7", key: "markentry", label: "Student Course Mapping", download: "mark", model: "markmodel" },
        { id: "file8", key: "ese", label: "ESE Mark", download: "ese", model: "esemodel" },
    ];

    // ---------------- UI ----------------

    return (
        <div className="file-wrapper">

            <h2 className="file-title">📂 File Management</h2>
            <p className="file-subtitle">
                Upload, download, and manage system files securely
            </p>

            <LoadingModal />

            <div className="file-content">
                <div className="file-header">
                    <p>Name</p>
                    <p>File</p>
                    <p>Upload</p>
                    <p>Download</p>
                    <p>Sample</p>
                </div>

                {fileConfigs.map((f, idx) => (
                    <div
                        key={f.id}
                        className={`file-row ${idx % 2 === 0 ? "even" : "odd"}`}
                    >
                        <div className="file-name-label">{f.label}</div>

                        <div className="file-input-wrapper">
                            <label htmlFor={f.id} className="file-input-label">
                                Choose
                            </label>
                            <input
                                type="file"
                                id={f.id}
                                ref={(el) => (fileInputRefs.current[f.id] = el)}
                                onChange={handleFileChange}
                            />
                            <span className="file-selected">
                                {files[f.id]?.name || "No file chosen"}
                            </span>
                        </div>

                        <button
                            className="file-btn file-upload"
                            onClick={(e) => handleUpload(e, files[f.id], f.key)}
                        >
                            <Upload size={18} /> Upload
                        </button>

                        <button
                            className="file-btn file-download"
                            onClick={(e) =>
                                handleDownload(e, f.download, `${f.label}.xlsx`)
                            }
                        >
                            <Download size={18} /> Download
                        </button>

                        <button
                            className="file-btn file-sample"
                            onClick={(e) =>
                                handleDownload(e, f.model, `${f.label} Sample.xlsx`)
                            }
                        >
                            <FileText size={18} /> Sample
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileUpload;