import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    Trash2, AlertTriangle, Key, Loader, CheckCircle,
    ShieldAlert, Database, Users, FileText, History
} from "lucide-react";
import '../css/DataDeletion.css';

function DataDeletion() {

    const apiUrl = import.meta.env.VITE_API_URL || '';
    const [options, setOptions] = useState({ batches: [], mentorAcademicYears: [], markEntryAcademicYears: [], reportAcademicSems: [], hodAllCount: 0, staffAllCount: 0 });
    const [selected, setSelected] = useState({ studentBatches: [], mentorYears: [], markEntryYears: [], reportSems: [], hodAll: false, staffAll: false });
    const [preview, setPreview] = useState({ studentCounts: {}, mentorCounts: {}, markEntryCounts: {}, reportCounts: {}, hodAllCount: 0, staffAllCount: 0 });
    const [adminPass, setAdminPass] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteResult, setDeleteResult] = useState(null);

    const fetchOptions = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/data-delete/options`);
            setOptions(res.data || {});
        } catch (err) { console.error('Failed to fetch options', err); }
    };

    useEffect(() => { fetchOptions(); }, [apiUrl]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.post(`${apiUrl}/api/data-delete/preview`, selected);
                const d = res.data || {};
                const mapCounts = (arr) => (arr || []).reduce((acc, i) => ({ ...acc, [i.value]: i.count }), {});
                setPreview({
                    studentCounts: mapCounts(d.studentCounts),
                    mentorCounts: mapCounts(d.mentorCounts),
                    markEntryCounts: mapCounts(d.markEntryCounts),
                    reportCounts: mapCounts(d.reportCounts),
                    hodAllCount: d.hodAllCount ?? 0,
                    staffAllCount: d.staffAllCount ?? 0
                });
            } catch (err) { console.error('Preview failed', err); }
        })();
    }, [selected, apiUrl]);

    const itemsToPurge = useMemo(() => {
        let sum = (selected.staffAll ? (preview.staffAllCount || options.staffAllCount || 0) : 0) +
            (selected.hodAll ? (preview.hodAllCount || options.hodAllCount || 0) : 0);
        selected.studentBatches.forEach(b => sum += (preview.studentCounts[b] || 0));
        selected.mentorYears.forEach(y => sum += (preview.mentorCounts[y] || 0));
        selected.markEntryYears.forEach(y => sum += (preview.markEntryCounts[y] || 0));
        selected.reportSems.forEach(s => sum += (preview.reportCounts[s] || 0));
        return sum;
    }, [selected, preview, options]);

    const toggleSelection = (key, value) => {
        setSelected(prev => ({
            ...prev,
            [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value]
        }));
    };

    const handleConfirmDeletion = async () => {
        if (itemsToPurge === 0 || !isConfirmed) return;
        setDeleteLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/api/data-delete/execute`, { password: adminPass, ...selected });
            if (res.data?.success) {
                setDeleteResult({ success: true, deleted: res.data.deleted });
                setSelected({ studentBatches: [], mentorYears: [], markEntryYears: [], reportSems: [], hodAll: false, staffAll: false });
                setAdminPass(''); setIsConfirmed(false); fetchOptions();
            } else setDeleteResult({ success: false, message: res.data.message || 'Deletion failed' });
        } catch (err) {
            setDeleteResult({ success: false, message: err.response?.status === 401 ? 'Invalid password' : 'Server error' });
        } finally { setDeleteLoading(false); }
    };

    const academicModules = [
        { id: 'studentBatches', title: 'Student Master', icon: <Users size={16} />, badge: 'By Batch', data: options.batches, counts: preview.studentCounts },
        { id: 'mentorYears', title: 'Mentor Records', icon: <ShieldAlert size={16} />, badge: 'By Academic Year', data: options.mentorAcademicYears, counts: preview.mentorCounts },
        { id: 'markEntryYears', title: 'Mark Entry Records', icon: <FileText size={16} />, badge: 'By Academic Year', data: options.markEntryAcademicYears, counts: preview.markEntryCounts },
        { id: 'reportSems', title: 'Course Mapping', icon: <History size={16} />, badge: 'By Semester', data: options.reportAcademicSems, counts: preview.reportCounts }
    ];

    return (
        <div className="admin-purge-root">
            <div className="purge-container">
                <header className="purge-header">
                    <div className="header-identity">
                        <div className="brand-icon"><ShieldAlert size={28} /></div>
                        <div><h1>System Data Management</h1><p>Prune historical data and manage system storage</p></div>
                    </div>
                </header>

                <div className="purge-grid">
                    <main className="purge-main">
                        <section className="config-section">
                            <h2 className="section-label">Master Records</h2>
                            <div className="card-grid">
                                {[
                                    { key: 'staffAll', label: 'Staff Records', icon: <Users size={20} />, desc: 'Remove all non-admin staff profiles.' },
                                    { key: 'hodAll', label: 'HOD Master', icon: <Database size={20} />, desc: 'Wipe all department head assignments.' }
                                ].map(card => (
                                    <div key={card.key} className={`config-card ${selected[card.key] ? 'active' : ''}`}>
                                        <div className="card-top">{card.icon}<span>{card.label}</span></div>
                                        <p>{card.desc}</p>
                                        <button className="select-trigger" onClick={() => setSelected(p => ({ ...p, [card.key]: !p[card.key] }))}>
                                            {selected[card.key] ? 'Selected' : `Select All ${card.label.split(' ')[0]}`}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="config-section">
                            <h2 className="section-label">Academic Modules</h2>
                            {academicModules.map(mod => (
                                <div className="module-group" key={mod.id}>
                                    <div className="group-header">
                                        <div className="header-meta">{mod.icon}<h3>{mod.title}</h3></div>
                                        <span className="badge">{mod.badge}</span>
                                    </div>
                                    <div className="pills-container">
                                        {mod.data.length === 0 ? <p className="empty-msg">No records found</p> :
                                            mod.data.map(val => (
                                                <button key={val} className={`purge-pill ${selected[mod.id].includes(val) ? 'active' : ''}`} onClick={() => toggleSelection(mod.id, val)}>
                                                    {val} <small>({mod.counts[val] ?? 0})</small>
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}
                        </section>
                    </main>

                    <aside className="purge-sidebar">
                        <div className="sticky-box">
                            <div className="alert-banner">
                                <AlertTriangle size={20} />
                                <div><h4>Destructive Action</h4><p>This will permanently remove records.</p></div>
                            </div>
                            <div className="summary-panel">
                                <div className="summary-stat"><label>Estimated Deletions</label><span className="count-value">{itemsToPurge.toLocaleString()}</span></div>
                                <div className="auth-field">
                                    <label>Admin Verification</label>
                                    <div className="input-with-icon"><Key size={16} /><input type="password" placeholder="Enter password" value={adminPass} onChange={e => setAdminPass(e.target.value)} /></div>
                                </div>
                                <div className="confirm-toggle">
                                    <input type="checkbox" id="confirm" checked={isConfirmed} onChange={e => setIsConfirmed(e.target.checked)} />
                                    <label htmlFor="confirm">I have backed up the database</label>
                                </div>
                                <button className="execute-btn" disabled={!isConfirmed || !adminPass || itemsToPurge === 0 || deleteLoading} onClick={handleConfirmDeletion}>
                                    {deleteLoading ? <Loader className="spin" /> : <Trash2 size={18} />}<span>Execute Purge</span>
                                </button>
                            </div>
                            {deleteResult && (
                                <div className={`status-msg ${deleteResult.success ? 'success' : 'error'}`}>
                                    {deleteResult.success ? <><CheckCircle size={16} /> Data purged successfully</> : <><AlertTriangle size={16} /> {deleteResult.message}</>}
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default DataDeletion;