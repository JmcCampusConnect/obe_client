import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const EseReportTable = ({ courseCode = [], page, pageSize, totalPages, setPage, getStatusColor }) => {

    const dataToDisplay = Array.isArray(courseCode) ? courseCode : [];

    const visibleRows = useMemo(() => {
        return dataToDisplay.slice((page - 1) * pageSize, page * pageSize);
    }, [dataToDisplay, page, pageSize]);

    if (dataToDisplay.length === 0) {
        return (
            <main className="crm-content">
                <section className="card">
                    <div className="card-header">
                        <div className="card-title">Ese Report</div>
                        <div className="card-sub">No records to display</div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="crm-content">
            <section className="card">
                <div className="card-header">
                    <div className="card-title">Ese Report</div>
                    <div className="card-sub">
                        Showing {dataToDisplay.length} record
                        {dataToDisplay.length !== 1 && "s"}
                    </div>
                </div>

                <div className="table-frame">
                    <div className="table-scroll">
                        <table className="crm-table" role="table" aria-label="Course Report Table">
                            <thead>
                                <tr>
                                    <th style={{ width: 100 }}>S. No.</th>
                                    <th style={{ minWidth: 150 }}>Course Code</th>
                                    <th style={{ minWidth: 300 }}>Course Title</th>
                                    <th style={{ minWidth: 120 }}>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleRows.length > 0 ? (
                                    visibleRows.map((code, idx) => {
                                        const globalIndex = (page - 1) * pageSize + idx + 1;
                                        const statusText = code.status || "Incomplete";
                                        const statusStyle = getStatusColor ? getStatusColor(statusText) : {};

                                        return (
                                            <tr key={globalIndex}>
                                                <td>{globalIndex}</td>
                                                <td>{code.course_code || "-"}</td>
                                                <td>{code.course_title || "-"}</td>
                                                <td style={{ fontWeight: "bold", ...statusStyle }}>
                                                    {statusText}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="no-data">
                                            No records to display
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

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

export default EseReportTable;