import React from 'react';
import SearchableDropdown from '../../components/common/SearchableDropdown';

const EditStaffCourseModal = ({
    isOpen, closeModal,
    staffId: staffIdList, editStaff, handleEditStaffIdChange, handleEditInputChange,
    deptId: deptIdList, semester: semesterList, section: sectionList, courseCode: courseCodeList,
    handleEditCourseCodeChange, handleEditDeptIdChange, handleEditCategoryChange,
    handleEditSemChange, handleSaveEditStaff, staffData
}) => {

    if (!isOpen) return null;

    const safeMap = (list = []) =>
        list.map(item => ({
            value: String(item ?? ""),
            label: String(item ?? "")
        }));

    const staffIdOptions = (staffIdList || []).map(id => {
        const staff = staffData?.find(s => s.staff_id === id);
        return {
            value: String(id ?? ""),
            label: `${id} - ${staff?.staff_name || "Unknown Staff"}`
        };
    });

    const categoryOptions = ["SFM", "SFW", "AIDED"].map(c => ({
        value: String(c),
        label: String(c)
    }));

    const deptIdOptions = safeMap(deptIdList);
    const courseCodeOptions = safeMap(courseCodeList);
    const sectionOptions = safeMap(sectionList);
    const semesterOptions = safeMap(semesterList);

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3>EDIT STAFF COURSE</h3>
                    <button className="modal-close" onClick={closeModal}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="form-grid">

                        {/* STAFF ID */}
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

                        {/* STAFF NAME */}
                        <label>
                            <div className="label">Staff Name :</div>
                            <input
                                type="text"
                                name="staff_name"
                                value={editStaff.staff_name || ''}
                                readOnly
                                placeholder="Select Staff Name"
                            />
                        </label>

                        {/* CATEGORY */}
                        <label>
                            <div className="label">Category :</div>
                            <SearchableDropdown
                                options={categoryOptions}
                                value={editStaff.category || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditCategoryChange(value);
                                    handleEditInputChange({ target: { name: "category", value } });
                                }}
                                placeholder="Select Category"
                            />
                        </label>

                        {/* DEPT ID */}
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

                        {/* DEPT NAME */}
                        <label>
                            <div className="label">Dept Name :</div>
                            <input
                                type="text"
                                name="dept_name"
                                value={editStaff.dept_name || ''}
                                readOnly
                                placeholder="Select Dept Name"
                            />
                        </label>

                        {/* DEGREE */}
                        <label>
                            <div className="label">Degree :</div>
                            <input
                                type="text"
                                name="degree"
                                value={editStaff.degree || ''}
                                readOnly
                                placeholder="Select Degree"
                            />
                        </label>

                        {/* SEMESTER */}
                        <label>
                            <div className="label">Semester :</div>
                            <SearchableDropdown
                                options={semesterOptions}
                                value={semesterOptions.find(opt => opt.value === String(editStaff.semester)) || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditSemChange(value);
                                    handleEditInputChange({ target: { name: "semester", value } });
                                }}
                                placeholder="Select Semester"
                            />
                        </label>

                        {/* SECTION */}
                        <label>
                            <div className="label">Section :</div>
                            <SearchableDropdown
                                options={sectionOptions}
                                value={editStaff.section || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditInputChange({ target: { name: "section", value } });
                                }}
                                placeholder="Select Section"
                            />
                        </label>

                        {/* COURSE CODE */}
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

                        {/* COURSE TITLE */}
                        <label>
                            <div className="label">Course Title :</div>
                            <input
                                type="text"
                                name="course_title"
                                value={editStaff.course_title || ''}
                                readOnly
                                placeholder="Select Course Title"
                            />
                        </label>

                        {/* BATCH */}
                        <label>
                            <div className="label">Batch :</div>
                            <input
                                type="text"
                                name="batch"
                                value={editStaff.batch || ''}
                                readOnly
                                placeholder="Select Batch"
                            />
                        </label>
                    </div>

                    {/* ACTION BUTTONS */}
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