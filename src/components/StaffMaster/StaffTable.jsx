import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function StaffTable({
    visibleRows, filteredData, page, totalPages, pageSize, setPage, handleEdit, handleDelete
}) {

    return (
        <main className="crm-content">
            <section className="card">
                <div className="card-header">
                    <div className="card-title">Staff Directory</div>
                    <div className="card-sub">Showing <strong>{filteredData.length}</strong> records</div>
                </div>

                <div className="table-frame">
                    <div className="table-scroll">
                        <table className="crm-table" role="table" aria-label="Staff table">
                            <thead>
                                <tr>
                                    <th style={{ width: 60 }}>S.No</th>
                                    <th style={{ minWidth: 110 }}>Staff ID</th>
                                    <th style={{ minWidth: 280 }}>Staff Name</th>
                                    <th style={{ minWidth: 120 }}>Staff Category</th>
                                    <th style={{ minWidth: 120 }}>Dept Category</th>
                                    <th style={{ minWidth: 200 }}>Department</th>
                                    <th style={{ width: 50 }}>Edit</th>
                                    <th style={{ width: 50 }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRows.length ? visibleRows.map((staff, idx) => (
                                    <tr key={staff.staff_id || idx}>
                                        <td>{(page - 1) * pageSize + idx + 1}</td>
                                        <td>{staff.staff_id}</td>
                                        <td className="name-cell">{staff.staff_name}</td>
                                        <td>{staff.staff_category}</td>
                                        <td>{staff.dept_category}</td>
                                        <td>{staff.staff_dept}</td>
                                        <td>
                                            <button className="icon-btn edit" title="Edit"
                                                onClick={() => handleEdit(staff.staff_id, staff.staff_name, staff.staff_pass, staff.staff_dept, staff.staff_category, staff.dept_category)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                        <td>
                                            <button className="icon-btn del" title="Delete" onClick={() => handleDelete(staff.staff_id, staff.staff_name)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="no-data">No records to display</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="card-footer">
                    <div className="pagination">
                        <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <div className="pg-info">Page <strong>{page}</strong> of <strong>{totalPages}</strong></div>
                        <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                    <div className="dense-info">Showing {visibleRows.length} of {filteredData.length} entries</div>
                </div>
            </section>
        </main>
    );
}

export default StaffTable;