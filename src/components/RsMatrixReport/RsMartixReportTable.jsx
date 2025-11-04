import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const RsMartixReportTable = ({
	sortedReport = [], page, pageSize, totalPages,
	setPage, getStatus, getActiveField, getStatusColor,
}) => {

	const dataToDisplay = Array.isArray(sortedReport) ? sortedReport : [];

	const visibleRows = useMemo(() => {
		return dataToDisplay.slice((page - 1) * pageSize, page * pageSize);
	}, [dataToDisplay, page, pageSize]);

	return (
		<main className="crm-content">
			<section className="card">

				{/* Header */}
				<div className="card-header">
					<div className="card-title">Relationship Matrix Report</div>
					<div className="card-sub">
						Showing {dataToDisplay.length} record
						{dataToDisplay.length !== 1 && "s"}
					</div>
				</div>

				{/* Table */}
				<div className="table-frame">
					<div className="table-scroll">
						<table
							className="crm-table"
							role="table"
							aria-label="Department Report Table"
						>
							<thead>
								<tr>
									<th style={{ width: 60 }}>S.No</th>
									<th style={{ minWidth: 120 }}>Staff ID</th>
									<th style={{ minWidth: 250 }}>Staff Name</th>
									<th style={{ minWidth: 200 }}>Dept Name</th>
									<th style={{ minWidth: 150 }}>Course Code</th> 
									<th style={{ minWidth: 250 }}>Course Title</th>
									<th style={{ minWidth: 120 }}>Category</th>
									<th style={{ minWidth: 100 }}>Section</th>
									<th style={{ minWidth: 120 }}>Status</th>
								</tr>
							</thead>

							<tbody>
								{visibleRows.length > 0 ? (
									visibleRows.map((dept, idx) => {
										const activeField = getActiveField(dept);
										const statusText = getStatus(activeField);
										const statusColor = getStatusColor(activeField);

										return (
											<tr key={idx}>
												<td>{(page - 1) * pageSize + idx + 1}</td>
												<td>{dept?.staff_id || "-"}</td>
												<td
													className="name-cell"
													style={{ textTransform: "uppercase" }}
												>
													{dept?.staff_name || "-"}
												</td>
												<td>{dept?.dept_name || "-"}</td>
												<td>{dept?.course_code || "-"}</td>
												<td>{dept?.course_title || "-"}</td>
												<td>{dept?.category || "-"}</td>
												<td>{dept?.section || "-"}</td>
												<td style={{ fontWeight: "bold", ...statusColor }}>
													{statusText}
												</td>
											</tr>
										);
									})
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

export default RsMartixReportTable;