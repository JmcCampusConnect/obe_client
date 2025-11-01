import React from 'react';

function DeleteHodModal({ deleteHod, cancelDelete, handleConfirmDelete}) {

	if (!deleteHod) return null;

	return (
		<div className="modal-overlay">
			<div className="modal modal-sm">
				<div className="modal-header">
					<h3>Confirm Delete</h3>
					<button className="modal-close" onClick={cancelDelete}>✕</button>
				</div>

				<div className="modal-body">
					<p className="text-lg mb-4 text-center">
						Are you sure you want to permanently delete the following HOD record ?
					</p>

					<div className="del-info space-y-2 p-3 bg-red-50 border border-red-200 rounded-lg">
						<p><strong>Staff ID : </strong> {deleteHod.staff_id}</p>
						<p><strong>HOD Name : </strong> {deleteHod.hod_name}</p>
						<p><strong>Department : </strong> {deleteHod.dept_name}</p>
						<p><strong>Category : </strong> {deleteHod.category}</p>
					</div>

					<div className="modal-actions mt-6">
						<button
							className="btn btn-danger"
							onClick={() => handleConfirmDelete(deleteHod)}
						>
							Delete
						</button>
						<button
							className="btn btn-outline"
							onClick={cancelDelete}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DeleteHodModal;
