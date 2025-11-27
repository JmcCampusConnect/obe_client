import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const DepartmentReportTable = ({
	sortedReport = [], page, pageSize, totalPages, activeSection,
	setPage, getStatus, getStatusColor, isAllMode
}) => {

	const dataToDisplay = Array.isArray(sortedReport) ? sortedReport : [];
	const visibleRows = dataToDisplay.slice((page - 1) * pageSize, page * pageSize);

	const getYearLabel = (semester) => {
		const sem = Number(semester);
		if (!sem) return "-";
		if (sem === 1 || sem === 2) return "I";
		if (sem === 3 || sem === 4) return "II";
		if (sem === 5 || sem === 6) return "III";
		return "-";
	};

	return (
		<main className="crm-content">
			<section className="card">

				<div className="card-header">
					<div className="card-title">Department Report</div>
					<div className="card-sub">
						Showing {dataToDisplay.length} record{dataToDisplay.length !== 1 && "s"}
					</div>
				</div>

				<div className="table-frame">
					<div className="table-scroll">
						<table className="crm-table">
							<thead>
								<tr>
									<th style={{ width: 60 }}>S.No</th>
									<th style={{ minWidth: 120 }}>Staff ID</th>
									<th style={{ minWidth: 250 }}>Staff Name</th>
									<th style={{ minWidth: 120 }}>Category</th>
									<th style={{ minWidth: 130 }}>Class</th>
									<th style={{ minWidth: 150 }}>Course Code</th>
									<th style={{ minWidth: 350 }}>Course Title</th>
									{isAllMode && <th style={{ minWidth: 100 }}>Component</th>}
									<th style={{ minWidth: 120 }}>Status</th>
								</tr>
							</thead>
							<tbody>
								{visibleRows.length > 0 ? (
									visibleRows.map((d, idx) => {
										const getActiveStatus = (d) => (
											activeSection === "1" ? d.cia_1 :
												activeSection === "2" ? d.cia_2 :
													activeSection === "3" ? d.ass_1 :
														d.ass_2
										);
										const status = isAllMode ? d.value : getActiveStatus(d);
										const statusText = getStatus(status);
										const statusColor = getStatusColor(status);
										return (
											<tr key={idx}>
												<td>{(page - 1) * pageSize + idx + 1}</td>
												<td>{d.staff_id}</td>
												<td style={{ textTransform: "uppercase" }}>{d.staff_name}</td>
												<td>{d.category}</td>
												<td>{getYearLabel(d.semester)} {d.dept_id} {d.section}</td>
												<td>{d.course_code}</td>
												<td>{d.course_title}</td>
												{isAllMode && <td>{d.part}</td>}
												<td style={{ fontWeight: "bold", ...statusColor }}>{statusText}</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={isAllMode ? 10 : 9} className="no-data">No records to display</td>
									</tr>
								)}

							</tbody>
						</table>
					</div>
				</div>

				{dataToDisplay.length > 0 && (
					<div className="card-footer">

						<div className="pagination">
							<button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>

							<div className="pg-info">
								Page {page} of {totalPages}
							</div>

							<button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
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

export default DepartmentReportTable;