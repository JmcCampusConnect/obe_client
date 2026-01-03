import '../css/DataDeletion.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Trash2,
    AlertTriangle,
    Info,
    Key,
    Loader,
    CheckCircle
} from "lucide-react";

function DataDeletion() {
    const apiUrl = import.meta.env.VITE_API_URL || '';

    const [options, setOptions] = useState({
        batches: [],
        mentorAcademicYears: [],
        markEntryAcademicYears: [],
        reportAcademicSems: [],
        mentorAcademicSems: [],
        markEntryAcademicSems: []
    });

    const [selected, setSelected] = useState({
        studentBatches: [],
        mentorYears: [],
        markEntryYears: [],
        reportSems: [],
        hodSems: [],
        hodAll: false,
        staffAll: false
    });

    const [preview, setPreview] = useState({
        studentCounts: {},
        mentorCounts: {},
        markEntryCounts: {},
        reportCounts: {},
        hodCounts: {},
        hodAllCount: null,
        staffAllCount: null
    });

    const fetchPreview = async (nextSelected) => {
        try {
            const res = await axios.post(`${apiUrl}/api/data-delete/preview`, {
                studentBatches: nextSelected.studentBatches || [],
                mentorYears: nextSelected.mentorYears || [],
                markEntryYears: nextSelected.markEntryYears || [],
                reportSems: nextSelected.reportSems || [],
                hodSems: nextSelected.hodSems || [],
                hodAll: !!nextSelected.hodAll,
                staffAll: !!nextSelected.staffAll
            });
            const d = res.data || {};

            const studentCounts = {};
            (d.studentCounts || []).forEach(i => {studentCounts[i.value] = i.count});
            const mentorCounts = {};
            (d.mentorCounts || []).forEach(i => {mentorCounts[i.value] = i.count});
            const markEntryCounts = {};
            (d.markEntryCounts || []).forEach(i => {markEntryCounts[i.value] = i.count});
            const reportCounts = {};
            (d.reportCounts || []).forEach(i => {reportCounts[i.value] = i.count});
            const hodCounts = {};
            (d.hodCounts || []).forEach(i => {hodCounts[i.value] = i.count});

            setPreview({
                studentCounts,
                mentorCounts,
                markEntryCounts,
                reportCounts,
                hodCounts,
                hodAllCount: (typeof d.hodAllCount !== 'undefined') ? d.hodAllCount : null,
                staffAllCount: (typeof d.staffAllCount !== 'undefined') ? d.staffAllCount : null
            });
        } catch (err) {
            console.error('Preview fetch failed', err);
        }
    };

    useEffect(() => {
        fetchPreview(selected);
    }, [selected]);

    const [adminPass, setAdminPass] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteResult, setDeleteResult] = useState(null);

    const handleConfirmDeletion = async () => {
        if (itemsToPurge === 0) return;
        setDeleteLoading(true);
        setDeleteResult(null);
        try {
            const payload = {
                password: adminPass,
                studentBatches: selected.studentBatches,
                mentorYears: selected.mentorYears,
                markEntryYears: selected.markEntryYears,
                reportSems: selected.reportSems,
                hodSems: selected.hodSems,
                hodAll: !!selected.hodAll,
                staffAll: !!selected.staffAll
            };

            const res = await axios.post(`${apiUrl}/api/data-delete/execute`, payload);
            const data = res.data || {};

            if (data && data.success) {
                setDeleteResult({success: true, deleted: data.deleted});

                // reset selections (include hodAll)
                setSelected({studentBatches: [], mentorYears: [], markEntryYears: [], reportSems: [], hodSems: [], hodAll: false, staffAll: false});
                setAdminPass('');

                // refetch options and preview
                const opts = await axios.get(`${apiUrl}/api/data-delete/options`);
                setOptions(opts.data || {});
                // clear preview
                setPreview({studentCounts: {}, mentorCounts: {}, markEntryCounts: {}, reportCounts: {}, hodCounts: {}, hodAllCount: null, staffAllCount: null});
            } else {
                setDeleteResult({success: false, message: data.message || 'Deletion failed'});
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setDeleteResult({success: false, message: err.response.data.message || 'Password not matching'});
            } else {
                setDeleteResult({success: false, message: 'Server error during deletion'});
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/data-delete/options`);
                const data = res.data || {};
                setOptions({
                    batches: data.batches || [],
                    mentorAcademicYears: data.mentorAcademicYears || [],
                    markEntryAcademicYears: data.markEntryAcademicYears || [],
                    reportAcademicSems: data.reportAcademicSems || [],
                    mentorAcademicSems: data.mentorAcademicSems || [],
                    markEntryAcademicSems: data.markEntryAcademicSems || [],
                    hodAllCount: data.hodAllCount || 0,
                    staffAllCount: data.staffAllCount || 0
                });

                // console.log("SUGD", options)
            } catch (err) {
                console.error('Failed to fetch delete options', err);
            }
        };
        fetchOptions();
    }, []);

    const toggleSelection = (key, value) => {
        setSelected(prev => {
            const list = new Set(prev[key] || []);
            if (list.has(value)) list.delete(value);
            else list.add(value);
            return {...prev, [key]: Array.from(list)};
        });
    };

    const toggleStaffAll = () => {
        setSelected(prev => ({...prev, staffAll: !prev.staffAll}));
    };
    const toggleHodAll = () => {
        setSelected(prev => ({...prev, hodAll: !prev.hodAll, hodSems: !prev.hodAll ? [] : prev.hodSems}));
    };
    const itemsToPurge = (() => {
        let sum = 0;
        if (selected.staffAll) sum += (preview.staffAllCount ?? options.staffAllCount ?? 0);
        (selected.studentBatches || []).forEach(b => {sum += (preview.studentCounts[b] ?? 0)});
        (selected.mentorYears || []).forEach(y => {sum += (preview.mentorCounts[y] ?? 0)});
        (selected.markEntryYears || []).forEach(y => {sum += (preview.markEntryCounts[y] ?? 0)});
        (selected.reportSems || []).forEach(s => {sum += (preview.reportCounts[s] ?? 0)});
        if (selected.hodAll) sum += (preview.hodAllCount ?? options.hodAllCount ?? 0);
        else (selected.hodSems || []).forEach(s => {sum += (preview.hodCounts[s] ?? 0)});
        return sum;
    })();

    return (
        <div className="data-delete-page">
            <div className="container">

                {/* Header */}
                <header className="page-header">
                    <div className="title-wrap">
                        <div className="icon-box">
                            <Trash2 size={26} />
                        </div>
                        <h1>System Data Deletion</h1>
                    </div>
                    <p className="subtitle">
                        Select specific academic modules and timeframes to purge from the system.
                        This action is permanent.
                    </p>
                </header>

                <div className="layout">

                    {/* LEFT */}
                    <section className="modules">

                        <div className="module-card">
                            <div className="module-header">
                                <h3>Staff Master</h3>
                                <span>EXCLUDES ADMIN</span>
                            </div>
                            <div className="module-body">
                                <button
                                    className={`pill ${selected.staffAll ? 'selected' : ''}`}
                                    onClick={toggleStaffAll}
                                >
                                    All Staff {selected.staffAll ? `(${preview.staffAllCount ?? options.staffAllCount ?? 0})` : ''}
                                </button>
                            </div>
                        </div>

                        <div className="module-card">
                            <div className="module-header">
                                <h3>Student Master</h3>
                                <span>BY BATCH</span>
                            </div>
                            <div className="module-body">
                                {options.batches.length === 0 ? (
                                    <button className="pill disabled">No batches</button>
                                ) : (
                                    options.batches.map(b => (
                                        <button
                                            key={b}
                                            className={`pill ${selected.studentBatches.includes(b) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection('studentBatches', b)}
                                        >
                                            {b} {(preview.studentCounts && Object.prototype.hasOwnProperty.call(preview.studentCounts, b)) ? `(${preview.studentCounts[b]})` : ''}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="module-card">
                            <div className="module-header">
                                <h3>Report Data</h3>
                                <span>BY ACADEMIC SEM</span>
                            </div>
                            <div className="module-body">
                                {options.reportAcademicSems.length === 0 ? (
                                    <button className="pill disabled">No sems</button>
                                ) : (
                                    options.reportAcademicSems.map(s => (
                                        <button
                                            key={s}
                                            className={`pill ${selected.reportSems.includes(s) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection('reportSems', s)}
                                        >
                                            {s} {(preview.reportCounts && Object.prototype.hasOwnProperty.call(preview.reportCounts, s)) ? `(${preview.reportCounts[s]})` : ''}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="module-card">
                            <div className="module-header">
                                <h3>HOD Data</h3>
                                <span>ALL</span>
                            </div>
                            <div className="module-body">
                                <button
                                    className={`pill ${selected.hodAll ? 'selected' : ''}`}
                                    onClick={toggleHodAll}
                                >
                                    All HOD {selected.hodAll ? `(${preview.hodAllCount ?? options.hodAllCount ?? 0})` : ''}
                                </button>



                            </div>
                        </div>


                        <div className="module-card">
                            <div className="module-header">
                                <h3>Mentor</h3>
                                <span>BY ACADEMIC YEAR</span>
                            </div>
                            <div className="module-body">
                                {options.mentorAcademicYears.length === 0 ? (
                                    <button className="pill disabled">No years</button>
                                ) : (
                                    options.mentorAcademicYears.map(y => (
                                        <button
                                            key={y}
                                            className={`pill ${selected.mentorYears.includes(y) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection('mentorYears', y)}
                                        >
                                            {y} {(preview.mentorCounts && Object.prototype.hasOwnProperty.call(preview.mentorCounts, y)) ? `(${preview.mentorCounts[y]})` : ''}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="module-card">
                            <div className="module-header">
                                <h3>Mark Entry</h3>
                                <span>BY ACADEMIC YEAR</span>
                            </div>
                            <div className="module-body">
                                {options.markEntryAcademicYears.length === 0 ? (
                                    <button className="pill disabled">No years</button>
                                ) : (
                                    options.markEntryAcademicYears.map(y => (
                                        <button
                                            key={y + '-mark'}
                                            className={`pill ${selected.markEntryYears.includes(y) ? 'selected' : ''}`}
                                            onClick={() => toggleSelection('markEntryYears', y)}
                                        >
                                            {y} {(preview.markEntryCounts && Object.prototype.hasOwnProperty.call(preview.markEntryCounts, y)) ? `(${preview.markEntryCounts[y]})` : ''}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                    </section>

















                    {/* RIGHT */}
                    <aside className="sidebar">

                        <div className="warning-box">
                            <AlertTriangle size={18} />
                            <p>
                                <strong>Critical Action:</strong> Ensure database backup exists.
                                Deleted data cannot be recovered.
                            </p>
                        </div>

                        <div className="summary-card">
                            <h3>
                                <Info size={18} /> Execution Summary
                            </h3>

                            <div className="summary-row">
                                <span>Items to Purge</span>
                                <strong>{itemsToPurge}</strong>
                            </div>

                            <label className="auth-label">Authorization</label>
                            <div className="password-box">
                                <Key size={16} />
                                <input
                                    type="password"
                                    placeholder="Admin Password"
                                    value={adminPass}
                                    onChange={(e) => setAdminPass(e.target.value)}
                                />
                            </div>

                            <button
                                className="delete-btn"
                                onClick={handleConfirmDeletion}
                                disabled={deleteLoading || itemsToPurge === 0 || adminPass.trim() === ''}
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader size={16} className="spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} /> Confirm Deletion
                                    </>
                                )}
                            </button>

                            {deleteResult && (
                                <div className={`delete-result ${deleteResult.success ? 'success' : 'error'}`}>
                                    {deleteResult.success ? (
                                        <div>
                                            <strong>Deleted:</strong>
                                            <ul>
                                                {Object.entries(deleteResult.deleted || {}).map(([k, v]) => (
                                                    <li key={k}>{k}: {v}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div>
                                            <strong>Error:</strong> {deleteResult.message}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>




                </div>
            </div>
        </div>
    );
}


export default DataDeletion