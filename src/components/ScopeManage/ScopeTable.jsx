import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const ScopeTable = ({
    filteredData, scopeData, handleCheckboxChange, handleAllCheckboxChange,
    page, pageSize, totalPages, setPage
}) => {

    const columns = [
        { key: 'course_list', label: 'Course' },
        { key: 'course_outcome', label: 'CO' },
        { key: 'student_outcome', label: 'SO' },
        { key: 'program_outcome', label: 'PO' },
        { key: 'program_specific_outcome', label: 'PSO' },
        { key: 'work_progress_report', label: 'Report' },
        { key: 'input_files', label: 'Input' },
        { key: 'manage', label: 'Manage' },
        { key: 'relationship_matrix', label: 'RSM' },
        { key: 'settings', label: 'Settings' },
    ];

    const dataToDisplay = Array.isArray(filteredData) ? filteredData : [];
    const visibleRows = dataToDisplay.slice((page - 1) * pageSize, page * pageSize);

    return (
        <main className="crm-content scope-main-content">
            <section className="card scope-table-wrapper">
                <div className="card-header">
                    <div className="card-title">Scope Data Access Management</div>
                    <div className="card-sub">Showing {dataToDisplay.length} records</div>
                </div>

                <div className="table-frame">
                    <div className="table-scroll">
                        <table className="scope-table crm-table" role="table" aria-label="Scope Data Access Management">
                            <thead className="scope-table-head">
                                <tr>
                                    <th className="scope-table-header-checkbox">Options</th>
                                    {columns.map(col => (
                                        <th key={col.key} className="scope-table-header-checkbox">
                                            <input
                                                type="checkbox"
                                                className="scope-header-inputbox"
                                                onChange={() => handleAllCheckboxChange(col.key)}
                                                checked={scopeData.every(item => item[col.key] === 1)}
                                            />
                                        </th>
                                    ))}
                                </tr>
                                <tr className="scope-table-options">
                                    <th className="scope-table-header" style={{ minWidth: 150 }}>STAFF ID</th>
                                    {columns.map(col => (
                                        <th key={col.key + '-label'} className="scope-table-header" style={{ minWidth: 100 }}>{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRows.length > 0 ? (
                                    visibleRows.map((scopeItem, rowIndex) => {
                                        const dataIndex = (page - 1) * pageSize + rowIndex;
                                        return (
                                            <tr key={scopeItem.staff_id} className="scope-staffid">
                                                <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                                    {scopeItem.staff_id}
                                                </td>
                                                {columns.map(col => (
                                                    <td key={col.key} className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                                        <input
                                                            type="checkbox"
                                                            checked={scopeItem[col.key] === 1}
                                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, col.key, e.target.checked)}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="no-data">
                                            No Data Available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {dataToDisplay.length > 0 && (
                    <div className="card-footer">
                        <div className="pagination">
                            <button
                                className="pg-btn"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <div className="pg-info">
                                Page {page} of {totalPages}
                            </div>
                            <button
                                className="pg-btn"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                        <div className="dense-info">
                            Showing {visibleRows.length} of {dataToDisplay.length} entries
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default ScopeTable;
