import React, { useState } from "react";
import axios from "axios";
import { Upload, Download, FileText } from "lucide-react";
import "../css/FileUpload.css";

function FileUpload() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState({});

    const handleFileChange = (e) => {
        const { name, files: selected } = e.target;
        setFiles((prev) => ({ ...prev, [name]: selected[0] }));
    };

    const handleUpload = async (e, file, endpoint) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`${apiUrl}/api/${endpoint}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(res.data);
        } catch (error) {
            console.error(error);
            alert("File upload failed");
        } finally { setLoading(false) }
    }

    const handleDownload = async (e, fileType, fileName) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${apiUrl}/api/download/${fileType}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download the file.");
        }
    }

    const LoadingModal = ({ loading }) => {
        if (!loading) return null;
        return (
            <div className="file-loading-modal">
                <div className="file-loading-content">
                    <div className="file-loader"></div>
                    <h3>Processing...</h3>
                </div>
            </div>
        )
    }

    const fileConfigs = [
        { id: "file1", key: "coursemaster", label: "Course Master", download: "coursemaster", model: "coursemastermodel" },
        { id: "file2", key: "staffmaster", label: "Staff Master", download: "staff", model: "staffmodel" },
        { id: "file3", key: "coursemapping", label: "Staff Course Mapping", download: "coursemap", model: "coursemapmodel" },
        { id: "file4", key: "studentmaster", label: "Student Master", download: "studentmaster", model: "studentmastermodel" },
        { id: "file5", key: "hod", label: "HOD Master", download: "hod", model: "hodmodel" },
        { id: "file6", key: "mentor", label: "Mentor Master", download: "mentor", model: "mentormodel" },
        { id: "file7", key: "markentry", label: "Student Course Mapping", download: "mark", model: "markmodel" },
        { id: "file8", key: "ese", label: "ESE Mark", download: "ese", model: "esemodel" },
        { id: "file9", key: "scope", label: "Scope Master", download: "scope", model: "scopemodel" },
    ]

    return (
        <div className="file-wrapper">
            <h2 className="file-title">📂 File Management</h2>
            <p className="file-subtitle">Upload, download, and manage system files securely</p>
            <div className="file-content">
                <LoadingModal loading={loading} />
                {fileConfigs.length === 0 ? (
                    <div className="file-empty">
                        <p>No files configured yet 🚀</p>
                    </div>
                ) : (
                    <>
                        <div className="file-header">
                            <p>Name</p>
                            <p>File</p>
                            <p>Upload</p>
                            <p>Download</p>
                            <p>Sample</p>
                        </div>
                        {fileConfigs.map((f, idx) => (
                            <div key={f.id} className={`file-row ${idx % 2 === 0 ? "even" : "odd"}`}>
                                <div className="file-name-label">
                                    {f.label}
                                </div>
                                <div className="file-input-wrapper">
                                    <label htmlFor={f.id} className="file-input-label">Choose</label>
                                    <input type="file" id={f.id} name={f.id} onChange={handleFileChange} />
                                    <span className="file-selected" title={files[f.id]?.name}>
                                        {files[f.id]?.name || "No file chosen"}
                                    </span>
                                </div>
                                <button
                                    className="file-btn file-upload"
                                    title="Upload File"
                                    onClick={(e) => handleUpload(e, files[f.id], f.key)}
                                >
                                    <Upload size={18} /> Upload
                                </button>
                                <button
                                    className="file-btn file-download"
                                    title="Download Data"
                                    onClick={(e) =>
                                        handleDownload(e, f.download, `${f.label} Data.xlsx`)
                                    }
                                >
                                    <Download size={18} /> Download
                                </button>
                                <button
                                    className="file-btn file-sample"
                                    title="Download Sample Format"
                                    onClick={(e) =>
                                        handleDownload(e, f.model, `${f.label} Model.xlsx`)
                                    }
                                >
                                    <FileText size={18} /> Sample
                                </button>
                            </div>
                        ))}

                    </>
                )}
            </div>
        </div>
    )
}

export default FileUpload;