import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const TutorReportTable = ({
	filteredStaffData = [], page, pageSize, totalPages, setPage, getStatusClass,
}) => {

	const dataToDisplay = Array.isArray(filteredStaffData) ? filteredStaffData : [];
	const visibleRows = dataToDisplay.slice((page - 1) * pageSize, page * pageSize);

	return (
		<main className="crm-content">
			<section className="card">

				<div className="card-header">
					<div className="card-title">Tutor Report</div>
					<div className="card-sub">
						Showing {dataToDisplay.length} record{dataToDisplay.length !== 1 && "s"}
					</div>
				</div>

				<div className="table-frame">
					<div className="table-scroll">
						<table className="crm-table" role="table" aria-label="Tutor Report Table">
							<thead>
								<tr>
									<th style={{ minWidth: 100 }}>S No</th>
                                    <th style={{ minWidth: 300 }}>Staff Name</th>
                                    <th style={{ minWidth: 250 }}>Course Title</th>
                                    <th style={{ width: 100 }}>CIA 1</th>
                                    <th style={{ width: 100 }}>CIA 2</th>
                                    <th style={{ width: 100 }}>ASS 1</th>
                                    <th style={{ width: 100 }}>ASS 2</th>
								</tr>
							</thead>

							<tbody>
								{visibleRows.length > 0 ? (
									visibleRows.map((dept, idx) => (
										<tr key={idx}>
											<td>{(page - 1) * pageSize + idx + 1}</td>
											<td className="name-cell" style={{ textTransform: "uppercase" }}>
												{dept?.staff_name || "-"}
											</td>
											<td>{dept?.course_title || "-"}</td>
											<td className={`tutor-repo-td-status ${getStatusClass(dept.cia_1)}`}>
												{dept?.cia_1 || "-"}
											</td>
											<td className={`tutor-repo-td-status ${getStatusClass(dept.cia_2)}`}>
												{dept?.cia_2 || "-"}
											</td>
											<td className={`tutor-repo-td-status ${getStatusClass(dept.ass_1)}`}>
												{dept?.ass_1 || "-"}
											</td>
											<td className={`tutor-repo-td-status ${getStatusClass(dept.ass_2)}`}>
												{dept?.ass_2 || "-"}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="7" className="no-data">No records to display</td>
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

export default TutorReportTable;