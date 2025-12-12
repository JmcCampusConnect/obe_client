import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const TutorTable = ({
    filteredData, page, pageSize, totalPages, setPage, handleEditClick, handleDelete,
}) => {

    const dataToDisplay = Array.isArray(filteredData) ? filteredData : [];
    const visibleRows = dataToDisplay.slice((page - 1) * pageSize, page * pageSize);

    const getYearLabel = (batchYear) => {
        if (!batchYear) return "-";
        const now = new Date();
        const currentYear = now.getFullYear();
        const month = now.getMonth() + 1;
        let academicYear;
        if (month >= 6) {
            academicYear = currentYear;
        } else {
            academicYear = currentYear - 1;
        }
        const diff = academicYear - Number(batchYear);
        if (diff === 0) return "I";
        if (diff === 1) return "II";
        if (diff === 2) return "III";
        return "-";
    };

    return (
        <main className="crm-content">
            <section className="card">
                <div className="card-header">
                    <div className="card-title">Mentor Directory</div>
                    <div className="card-sub">Showing {dataToDisplay.length} records</div>
                </div>

                <div className="table-frame">
                    <div className="table-scroll">
                        <table className="crm-table" role="table" aria-label="Mentor table">
                            <thead>
                                <tr>
                                    <th style={{ width: 60 }}>S.No</th>
                                    <th style={{ minWidth: 120 }}>Staff ID</th>
                                    <th style={{ minWidth: 250 }}>Mentor Name</th>
                                    <th style={{ minWidth: 100 }}>Category</th>
                                    <th style={{ minWidth: 180 }}>Class</th>
                                    <th style={{ minWidth: 200 }}>Department Name</th>
                                    <th style={{ width: 50 }}>Edit</th>
                                    <th style={{ width: 50 }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRows.length > 0 ? (
                                    visibleRows.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{(page - 1) * pageSize + idx + 1}</td>
                                            <td>{row?.staff_id || "-"}</td>
                                            <td>{row?.staff_name || "-"}</td>
                                            <td>{row?.category || "-"}</td>
                                            <td>
                                                {`${getYearLabel(row?.batch)} ${row?.dept_id || "-"} ${row?.section || "-"}`}
                                            </td>
                                            <td>{row?.dept_name || "-"}</td>
                                            <td>
                                                <button
                                                    className="icon-btn edit"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(row)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="icon-btn del"
                                                    title="Delete"
                                                    onClick={() => handleDelete(row)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="no-data">
                                            No records to display
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

export default TutorTable;