import React, { useState } from 'react';
import {
    ClipboardCheck,
    DatabaseZap,
    FileStack,
    Settings,
    CloudUpload,
    AlertCircle
} from 'lucide-react';
import '../css/GuideLines.css';

function GuideLines() {

    const [semester, setSemester] = useState('odd');

    const oddSteps = [
        {
            id: 1,
            title: "Verification Phase",
            desc: "Verify that all staff have submitted marks through the Dashboard and confirm that all ESE marks are uploaded.",
            icon: <ClipboardCheck size={18} />,
            status: "required"
        },
        {
            id: 2,
            title: "Resource Preparation",
            desc: "Prepare Course Master, Student Master, Staff Course Mapping, and Student Course Mapping data using the provided sample templates in the Input Files menu.",
            icon: <FileStack size={18} />,
            status: "required"
        },
        {
            id: 3,
            title: "Data Sanitization",
            desc: "Remove unnecessary data from the Data Deletion menu and delete course mapping records from the previous semester (recommended).",
            icon: <DatabaseZap size={18} />,
            status: "danger",
            warning: "Irreversible action"
        },
        {
            id: 4,
            title: "System Configuration",
            desc: "Update the Academic Year in Manage → Academic Manage.",
            icon: <Settings size={18} />,
            status: "config"
        },
        {
            id: 5,
            title: "Final Synchronization",
            desc: "Go to Manage → Mark Manage, click the Modify button (make changes if required), then click Save. Even if no changes are needed, press Save once to set maximum marks correctly and then upload the files in the Input Files menu.",
            icon: <CloudUpload size={18} />,
            status: "success"
        }
    ];

    return (
        <div className="admin-page-container">
            <div className="guide-card">
                <div className="guide-header">
                    <div>
                        <span className="system-label">System Administration</span>
                        <h1>Operational Guidelines</h1>
                    </div>
                    <div className="semester-toggle">
                        <button
                            className={semester === 'odd' ? 'active' : ''}
                            onClick={() => setSemester('odd')}
                        >
                            Odd Semester
                        </button>
                        <button
                            className={semester === 'even' ? 'active' : ''}
                            onClick={() => setSemester('even')}
                        >
                            Even Semester
                        </button>
                    </div>
                </div>

                <div className="guide-body">
                    {semester === 'odd' ? (
                        <div className="timeline">
                            {oddSteps.map((step) => (
                                <div key={step.id} className={`timeline-item ${step.status}`}>
                                    <div className="timeline-badge">
                                        {step.icon}
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-title-row">
                                            <h3>{step.title}</h3>
                                            {step.warning && <span className="warning-pill">{step.warning}</span>}
                                        </div>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-illustration">📅</div>
                            <p>Guidelines for the Even Semester are currently being updated by the administrator.</p>
                        </div>
                    )}
                </div>

                <div className="guide-footer">
                    <p><AlertCircle size={14} /> Ensure all database backups are completed before executing.</p>
                </div>
            </div>
        </div>
    );
}

export default GuideLines;