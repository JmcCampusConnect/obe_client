import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const StaffCourseTable = ({ staffCourseData, page, pageSize, totalPages, setPage, handleOpenEditModal, setDeleteStaff }) => {

	const dataToDisplay = Array.isArray(staffCourseData) ? staffCourseData : [];
	const visibleRows = dataToDisplay.slice((page - 1) * pageSize, page * pageSize);
	const handleEditClick = handleOpenEditModal;
	const handleDelete = setDeleteStaff;

	return (
		<main className="crm-content">
			<section className="card">
				<div className="card-header">
					<div className="card-title">Staff Course Assignments</div>
					<div className="card-sub">Showing {dataToDisplay.length} records</div>
				</div>

				<div className="table-frame">
					<div className="table-scroll">
						<table className="crm-table" role="table" aria-label="Staff Course Assignment table">
							<thead>
								<tr>
									<th style={{ width: 60 }}>S.No</th>
									<th style={{ minWidth: 120 }}>Staff ID</th>
									<th style={{ minWidth: 250 }}>Staff Name</th>
									<th style={{ minWidth: 100 }}>Category</th>
									<th style={{ minWidth: 120 }}>Dept ID</th>
									<th style={{ minWidth: 150 }}>Course Code</th>
									<th style={{ minWidth: 300 }}>Course Title</th>
									<th style={{ minWidth: 100 }}>Section</th>
									<th style={{ width: 50 }}>Edit</th>
									<th style={{ width: 50 }}>Delete</th>
								</tr>
							</thead>
							<tbody>
								{visibleRows.length > 0 ? (
									visibleRows.map((staff, idx) => (
										<tr key={idx}>
											<td>{(page - 1) * pageSize + idx + 1}</td>
											<td>{staff?.staff_id || "-"}</td>
											<td className="name-cell">{staff?.staff_name || "-"}</td>
											<td>{staff?.category || "-"}</td>
											<td>{staff?.dept_id || "-"}</td>
											<td>{staff?.course_code || "-"}</td>
											<td>{staff?.course_title || "-"}</td>
											<td>{staff?.section || "-"}</td>
											<td>
												<button className="icon-btn edit" title="Edit" onClick={() => handleEditClick(staff)}>
													<FontAwesomeIcon icon={faEdit} />
												</button>
											</td>
											<td>
												<button className="icon-btn del" title="Delete" onClick={() => handleDelete(staff)}>
													<FontAwesomeIcon icon={faTrash} />
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="10" className="no-data">No records to display</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{dataToDisplay.length > 0 && (
					<div className="card-footer">
						<div className="pagination">
							<button className="pg-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>
							<div className="pg-info">Page {page} of {totalPages}</div>
							<button className="pg-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
								<FontAwesomeIcon icon={faChevronRight} />
							</button>
						</div>
						<div className="dense-info">Showing {visibleRows.length} of {dataToDisplay.length}** entries</div>
					</div>
				)}
			</section>
		</main>
	)
}

export default StaffCourseTable;