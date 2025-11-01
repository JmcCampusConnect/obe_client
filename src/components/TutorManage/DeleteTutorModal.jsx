import React from 'react';

function DeleteTutorModal({ deleteStaff, cancelDelete, handleConfirmDelete }) {
	
	if (!deleteStaff) return null;

	return (
		<div className="modal-overlay">
			<div className="modal modal-sm">
				<div className="modal-header">
					<h3>Confirm Delete</h3>
					<button className="modal-close" onClick={cancelDelete}>✕</button>
				</div>

				<div className="modal-body">
					<p className="text-lg mb-4 text-center">
						Are you sure you want to permanently delete the following Tutor record?
					</p>

					<div className="del-info space-y-2 p-3 bg-red-50 border border-red-200 rounded-lg">
						<p><strong>Staff ID : </strong> {deleteStaff.staff_id}</p>
						<p><strong>Tutor Name : </strong> {deleteStaff.staff_name}</p>
						<p><strong>Category : </strong> {deleteStaff.category}</p>
						<p><strong>Assigned Class : </strong> {deleteStaff.degree} {deleteStaff.dept_name} - {deleteStaff.section}</p>
					</div>

					<div className="modal-actions mt-6">
						<button
							className="btn btn-danger"
							onClick={() => handleConfirmDelete(deleteStaff)}
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
	);
}

export default DeleteTutorModal;