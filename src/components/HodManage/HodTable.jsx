import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const HodTable = ({
	filteredData, page, pageSize, totalPages, setPage, openEditHodModal, openDeleteHodModal,
}) => {
	
	const visibleRows = filteredData.slice((page - 1) * pageSize, page * pageSize);

	return (
		<main className="crm-content">
			<section className="card">
				<div className="card-header">
					<div className="card-title">HOD Directory</div>
					<div className="card-sub">
						Showing <strong>{filteredData.length}</strong> records
					</div>
				</div>

				<div className="table-frame">
					<div className="table-scroll">
						<table className="crm-table" role="table" aria-label="HOD table">
							<thead>
								<tr>
									<th style={{ width: 60 }}>S.No</th>
									<th style={{ minWidth: 120 }}>Category</th>
									<th style={{ minWidth: 100 }}>Dept ID</th>
									<th style={{ minWidth: 100 }}>Staff ID</th>
									<th style={{ minWidth: 250 }}>HOD / MID Name</th>
									<th style={{ minWidth: 200 }}>Department Name</th>
									<th style={{ width: 50 }}>Edit</th>
									<th style={{ width: 50 }}>Delete</th>
								</tr>
							</thead>

							<tbody>
								{visibleRows.length ? (
									visibleRows.map((row, idx) => (
										<tr key={idx}>
											<td>{(page - 1) * pageSize + idx + 1}</td>
											<td>{row?.category || "-"}</td>
											<td>{row?.dept_id || "-"}</td>
											<td>{row?.staff_id || "-"}</td>
											<td className="name-cell">{row?.hod_name || "-"}</td>
											<td>{row?.dept_name || "-"}</td>
											<td>
												<button
													className="icon-btn edit"
													title="Edit"
													onClick={() => openEditHodModal(row)}
												>
													<FontAwesomeIcon icon={faEdit} />
												</button>
											</td>
											<td>
												<button
													className="icon-btn del"
													title="Delete"
													onClick={() => openDeleteHodModal(row)}
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

				{/* Pagination */}
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
							Page <strong>{page}</strong> of <strong>{totalPages}</strong>
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
						Showing {visibleRows.length} of {filteredData.length} entries
					</div>
				</div>
			</section>
		</main>
	)
}

export default HodTable;