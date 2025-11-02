import React from 'react';
import SearchableDropdown from '../../components/common/SearchableDropdown';

const EditStaffCourseModal = ({
    isOpen, closeModal, staffId: staffIdList, editStaff, handleEditStaffIdChange, handleEditInputChange, 
    deptId: deptIdList, semester: semesterList, section: sectionList, courseCode: courseCodeList,
    handleEditCourseCodeChange, handleEditDeptIdChange, handleEditCategoryChange, handleEditSemChange, 
    handleSaveEditStaff, staffData
}) => {
    
    if (!isOpen) return null;

    const staffIdOptions = staffIdList.map(id => {
        const staff = staffData.find(s => s.staff_id === id);
        return { value: id, label: `${id} - ${staff?.staff_name || "Unknown Staff"}` };
    });

    const categoryOptions = ["SFM", "SFW", "AIDED"].map(c => ({ value: c, label: c }));
    const deptIdOptions = deptIdList.map(id => ({ value: id, label: id }));
    const courseCodeOptions = courseCodeList.map(code => ({ value: code, label: code }));
    const sectionOptions = sectionList.map(sec => ({ value: sec, label: sec }));

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3>EDIT STAFF COURSE</h3>
                    <button className="modal-close" onClick={closeModal}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="form-grid">
                        <label>
                            <div className="label">Staff ID :</div>
                            <SearchableDropdown
                                options={staffIdOptions}
                                value={editStaff.staff_id || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditStaffIdChange(value);
                                }}
                                placeholder="Select Staff ID"
                            />
                        </label>

                        <label>
                            <div className="label">Staff Name :</div>
                            <input type="text" name="staff_name" value={editStaff.staff_name || ''} readOnly placeholder="Staff Name" />
                        </label>

                        <label>
                            <div className="label">Category :</div>
                            <select
                                name="category"
                                className='input-box-correction'
                                value={editStaff.category || ""}
                                onChange={e => {
                                    const value = e.target.value;
                                    handleEditInputChange(e);
                                    handleEditCategoryChange(value);
                                }}
                            >
                                <option value="" disabled>Select Category</option>
                                {categoryOptions.map((c, i) => (
                                    <option key={i} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <div className="label">Dept ID :</div>
                            <SearchableDropdown
                                options={deptIdOptions}
                                value={editStaff.dept_id || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditDeptIdChange(value);
                                }}
                                placeholder="Select Dept ID"
                            />
                        </label>

                        <label>
                            <div className="label">Dept Name :</div>
                            <input type="text" name="dept_name" value={editStaff.dept_name || ''} readOnly placeholder="Dept Name" />
                        </label>

                        <label>
                            <div className="label">Degree :</div>
                            <input type="text" name="degree" value={editStaff.degree || ''} readOnly placeholder="Degree" />
                        </label>

                        <label>
                            <div className="label">Semester :</div>
                            <select
                                className='input-box-correction'
                                name="semester"
                                value={editStaff.semester || ''}
                                onChange={e => {
                                    const value = e.target.value;
                                    handleEditInputChange(e);
                                    handleEditSemChange(value);
                                }}
                            >
                                <option value="" disabled>Select Semester</option>
                                {semesterList.map((sem, i) => (
                                    <option key={i} value={sem}>{sem}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <div className="label">Section :</div>
                            <select
                                className='input-box-correction'
                                name="section"
                                value={editStaff.section || ''}
                                onChange={handleEditInputChange}
                            >
                                <option value="" disabled>Select Section</option>
                                {sectionOptions.map((sec, i) => (
                                    <option key={i} value={sec.value}>{sec.label}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <div className="label">Course Code :</div>
                            <SearchableDropdown
                                options={courseCodeOptions}
                                value={editStaff.course_code || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditCourseCodeChange(value);
                                }}
                                placeholder="Select Course Code"
                            />
                        </label>

                        <label>
                            <div className="label">Course Title :</div>
                            <input type="text" name="course_title" value={editStaff.course_title || ''} readOnly placeholder="Course Title" />
                        </label>

                        <label>
                            <div className="label">Batch :</div>
                            <input type="text" name="batch" value={editStaff.batch || ''} readOnly placeholder="Batch" />
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button className="btn btn-primary" onClick={handleSaveEditStaff}>Save Changes</button>
                        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditStaffCourseModal;