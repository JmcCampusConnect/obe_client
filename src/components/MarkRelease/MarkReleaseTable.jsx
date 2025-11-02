import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const MarkReleaseTable = ({
    filteredData, page, pageSize, totalPages, setPage, handleCheckbox, handleUpdate,
}) => {
    
    const dataToDisplay = Array.isArray(filteredData) ? filteredData : [];
    const visibleRows = dataToDisplay.slice((page - 1) * pageSize, page * pageSize);

    return (
        <main className="crm-content">
            <section className="card">
                <div className="card-header">
                    <div className="card-title">Course Mark Release Status</div>
                    <div className="card-sub">Showing {dataToDisplay.length} records</div>
                </div>

                <div className="table-frame">
                    <div className="table-scroll">
                        <table className="crm-table" role="table" aria-label="Course Mark Release table">
                            <thead>
                                <tr>
                                    <th style={{ width: 60 }}>S.No</th>
                                    <th style={{ minWidth: 120 }}>Staff ID</th>
                                    <th style={{ minWidth: 300 }}>Staff Name</th>
                                    <th style={{ minWidth: 120 }}>Dept ID</th>
                                    <th style={{ minWidth: 150 }}>Course Code</th>
                                    <th style={{ minWidth: 350 }}>Course Title</th>
                                    <th style={{ minWidth: 100 }}>Section</th>
                                    <th style={{ width: 80 }}>CIA 1</th>
                                    <th style={{ width: 80 }}>CIA 2</th>
                                    <th style={{ width: 80 }}>Ass 1</th>
                                    <th style={{ width: 80 }}>Ass 2</th>
                                    <th style={{ width: 80 }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleRows.length > 0 ? (
                                    visibleRows.map((reportItem, idx) => {
                                        const dataIndex = (page - 1) * pageSize + idx;
                                        return (
                                            <tr key={dataIndex}>
                                                <td>{dataIndex + 1}</td>
                                                <td>{reportItem.staff_id || "-"}</td>
                                                <td className="name-cell">{reportItem.staff_name || "-"}</td>
                                                <td>{reportItem.dept_id || "-"}</td>
                                                <td>{reportItem.course_code || "-"}</td>
                                                <td>{reportItem.course_title || "-"}</td>
                                                <td>{reportItem.section || "-"}</td>

                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="staffcourse-toggle"
                                                        checked={reportItem.cia_1 === 2}
                                                        onChange={(e) => handleCheckbox(dataIndex, 'cia_1', e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="staffcourse-toggle"
                                                        checked={reportItem.cia_2 === 2}
                                                        onChange={(e) => handleCheckbox(dataIndex, 'cia_2', e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="staffcourse-toggle"
                                                        checked={reportItem.ass_1 === 2}
                                                        onChange={(e) => handleCheckbox(dataIndex, 'ass_1', e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="staffcourse-toggle"
                                                        checked={reportItem.ass_2 === 2}
                                                        onChange={(e) => handleCheckbox(dataIndex, 'ass_2', e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className="staffcourse-save-btn"
                                                        title="Save"
                                                        onClick={() => handleUpdate(dataIndex)}
                                                    >
                                                        <FontAwesomeIcon icon={faSave} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="12" className="no-data">
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

export default MarkReleaseTable;