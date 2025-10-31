import React from 'react';

const DeleteModal = ({ isOpen, staff, onClose, onDelete }) => {

	if (!isOpen || !staff) return null;

	return (

		<div className="smsh-overlay">
			<div className="smsh-delete">
				<div className="smsh-close-class">
					<span onClick={onClose} className="smsh-close">✖</span>
				</div>
				<h3>CONFIRM DELETE</h3>
				<div className="smsh-del-div">
					<h4>STAFF ID : {staff.staff_id}</h4>
					<h4>STAFF NAME : {staff.staff_name}</h4>
					<h4>DEPARTMENT : {staff.dept_name}</h4>
					<h4>CATEGORY : {staff.category}</h4>
					<h4>CLASS : {staff.semester} {staff.dept_id} {staff.section}</h4>
					<h4>COURSE CODE : {staff.course_code}</h4>
				</div>
				<div className="smshh-delete-btn-container">
					<button
						onClick={() => onDelete(staff.s_no, staff.staff_id, staff.course_code, staff.category, staff.section, staff.dept_id)}
						className="smsm-add-save-btn"
					>
						DELETE
					</button>
					<button onClick={onClose} className="smsm-save-edit-btn">CANCEL</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteModal;