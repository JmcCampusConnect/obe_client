import React from 'react';

const DeleteStaffCourse = ({ isOpen, staff, onClose, onDelete }) => {

    if (!isOpen || !staff) return null;

    const { s_no, staff_id, staff_name, dept_name, category,
    semester, dept_id, section, course_code } = staff;

    const handleDeleteClick = () => {
        onDelete(s_no, staff_id, course_code, category, section, dept_id);
    }

    return (
        <div className="modal-overlay">
            <div className="modal modal-md">
                <div className="modal-header">
                    <h3>Confirm Delete</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to permanently delete the following <strong>Staff Course Assignment</strong> ?</p>
                    <div className="del-info">
                        <p><strong>Staff : </strong> {staff_name} ({staff_id})</p>
                        <p><strong>Department : </strong> {dept_name} ({dept_id})</p>
                        <p><strong>Category : </strong> {category}</p>
                        <p><strong>Class / Course : </strong> {semester} {section} - {course_code}</p>
                    </div>
                    <div className="modal-actions">
                        <button className="btn btn-danger" onClick={handleDeleteClick}>Delete</button>
                        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteStaffCourse;