import React from 'react';

const DeleteStaffCourse = ({ isOpen, staff, onClose, onDelete }) => {

    if (!isOpen || !staff) return null;

    const { s_no, staff_id, staff_name, dept_name, category,
        semester, dept_id, section, course_code, course_title } = staff;

    const handleDeleteClick = () => {
        onDelete(s_no, staff_id, course_code, category, section, dept_id, course_title);
    }

    const getYearFromSemester = (sem) => {
        if (!sem) return '';
        const num = parseInt(sem, 10);
        if ([1, 2].includes(num)) return 'I';
        if ([3, 4].includes(num)) return 'II';
        if ([5, 6].includes(num)) return 'III';
    }

    const semesterDisplay = getYearFromSemester(semester);

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
                        <p><strong>Department : </strong> {dept_name}</p>
                        <p><strong>Category : </strong> {category}</p>
                        <p><strong>Class : </strong> {semesterDisplay} {dept_id} {section}</p>
                        <p><strong>Course : </strong> {course_code}</p>
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