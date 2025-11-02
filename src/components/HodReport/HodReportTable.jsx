import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const HodReportTable = ({
    staffData = [], // Renamed prop to better reflect data content (from filteredStaffData)
    page,
    pageSize,
    totalPages,
    setPage,
    getStatusClass, // Must be passed as a prop now
}) => {

    // Use staffData as the source data
    const dataToDisplay = Array.isArray(staffData) ? staffData : [];

    const visibleRows = useMemo(() => {
        // Apply pagination logic
        return dataToDisplay.slice((page - 1) * pageSize, page * pageSize);
    }, [dataToDisplay, page, pageSize]);

    // Handle no records case, styled similarly to the example
    if (dataToDisplay.length === 0) {
        return (
            <main className="crm-content">
                <section className="card">
                    <div className="card-header">
                        <div className="card-title">Staff Assessment Report</div>
                        <div className="card-sub">No records to display</div>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="crm-content">
            <section className="card">

                {/* Header */}
                <div className="card-header">
                    <div className="card-title">Staff Assessment Report</div>
                    <div className="card-sub">
                        Showing {dataToDisplay.length} record
                        {dataToDisplay.length !== 1 && "s"}
                    </div>
                </div>

                {/* Table */}
                <div className="table-frame">
                    <div className="table-scroll">
                        <table
                            className="crm-table" // Changed from 'hod-repo-table' to 'crm-table' for consistency with the desired style
                            role="table"
                            aria-label="Staff Assessment Report Table"
                        >
                            <thead>
                                <tr>
                                    <th style={{ width: 60 }}>S No</th>
                                    <th style={{ minWidth: 200 }}>Staff Name</th>
                                    <th style={{ minWidth: 150 }}>Class</th>
                                    <th style={{ minWidth: 250 }}>Course Title</th>
                                    <th style={{ width: 100 }}>CIA 1</th>
                                    <th style={{ width: 100 }}>CIA 2</th>
                                    <th style={{ width: 100 }}>ASS 1</th>
                                    <th style={{ width: 100 }}>ASS 2</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleRows.length > 0 ? (
                                    visibleRows.map((dept, idx) => {
                                        // Calculate the global index for S. No.
                                        const globalIndex = (page - 1) * pageSize + idx + 1;

                                        // Original Class format: {dept.semester} {dept.dept_id} {dept.section}
                                        const classText = `${dept.semester || ''} ${dept.dept_id || ''} ${dept.section || ''}`.trim() || '-';

                                        // Helper function for status classes (must be passed via props)
                                        const getStatusClassLocal = getStatusClass || (() => '');

                                        return (
                                            <tr key={globalIndex}>
                                                <td>{globalIndex}</td>
                                                <td className="name-cell" style={{ textTransform: "uppercase" }}>
                                                    {dept.staff_name || "-"}
                                                </td>
                                                <td>{classText}</td>
                                                <td>{dept.course_title || "-"}</td>

                                                {/* Use getStatusClass to apply conditional styling */}
                                                <td className={`hod-repo-td-status ${getStatusClassLocal(dept.cia_1)}`}>
                                                    {dept.cia_1 || "-"}
                                                </td>
                                                <td className={`hod-repo-td-status ${getStatusClassLocal(dept.cia_2)}`}>
                                                    {dept.cia_2 || "-"}
                                                </td>
                                                <td className={`hod-repo-td-status ${getStatusClassLocal(dept.ass_1)}`}>
                                                    {dept.ass_1 || "-"}
                                                </td>
                                                <td className={`hod-repo-td-status ${getStatusClassLocal(dept.ass_2)}`}>
                                                    {dept.ass_2 || "-"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        {/* 8 columns total */}
                                        <td colSpan="8" className="no-data">
                                            No records to display
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer with Pagination */}
                <div className="card-footer">
                    <div className="pagination">
                        <button
                            className="pg-btn"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || totalPages <= 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>

                        <div className="pg-info">
                            Page {page} of {totalPages}
                        </div>

                        <button
                            className="pg-btn"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages <= 1}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>

                    <div className="dense-info">
                        Showing {visibleRows.length} of {dataToDisplay.length} entries
                    </div>
                </div>
            </section>
        </main>
    )
}

export default HodReportTable;