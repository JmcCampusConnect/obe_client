import React from 'react';
import SearchableDropdown from '../../components/common/SearchableDropdown';

const EditStaffCourseModal = ({
    isOpen, closeModal,
    staffId: staffIdList, editStaff, handleEditStaffIdChange, handleEditInputChange,
    deptId: deptIdList, semester: semesterList, section: sectionList, courseCode: courseCodeList,
    handleEditCourseCodeChange, handleEditDeptIdChange, handleEditCategoryChange,
    handleEditSemChange, handleSaveEditStaff, staffData, errors = {}
}) => {

    if (!isOpen) return null;

    const safeMap = (list = []) => (Array.isArray(list) ? list.map(item => {
        if (item == null) return { value: "", label: "" };
        if (typeof item === 'object') {
            if ('value' in item || 'label' in item) {
                return { value: String(item.value ?? ""), label: String(item.label ?? item.value ?? "") };
            }
            const val = item.value ?? item.semester ?? item.dept_id ?? item.course_code ?? item.staff_id ?? Object.values(item)[0];
            const lab = item.label ?? item.semester ?? item.dept_name ?? item.course_title ?? item.staff_name ?? val;
            return { value: String(val ?? ""), label: String(lab ?? "") };
        }
        return { value: String(item), label: String(item) };
    }) : []);

    const staffIdOptions = (Array.isArray(staffIdList) ? staffIdList : []).map(item => {
        let id = item;
        let labelFromItem = null;
        if (item && typeof item === 'object') {
            id = item.value ?? item.staff_id ?? Object.values(item)[0];
            labelFromItem = item.label ?? null;
        }
        const staff = staffData?.find(s => String(s.staff_id) === String(id));
        const label = labelFromItem || `${id} - ${staff?.staff_name || "Unknown Staff"}`;
        return { value: String(id ?? ""), label: String(label) };
    });

    const categoryOptions = ["SFM", "SFW", "AIDED"].map(c => ({
        value: String(c),
        label: String(c)
    }));

    const deptIdOptions = (Array.isArray(deptIdList) ? deptIdList : []).map(id => {
        let raw = id;
        if (id && typeof id === 'object') raw = id.value ?? id.dept_id ?? Object.values(id)[0];
        const dept = (staffData || []).find(d => String(d.dept_id) === String(raw));
        return { value: String(raw ?? ""), label: `${raw} - ${dept?.dept_name || ""}` };
    });

    const courseCodeOptions = (Array.isArray(courseCodeList) ? courseCodeList : []).map(code => {
        let raw = code;
        if (code && typeof code === 'object') raw = code.value ?? code.course_code ?? Object.values(code)[0];
        const course = (staffData || []).find(c => String(c.course_code) === String(raw));
        return { value: String(raw ?? ""), label: `${raw} - ${course?.course_title || ""}` };
    });

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
               
                    {typeof errors === 'object' && (
                        <style>{`.edit-modal-error{color:red;margin-bottom:8px}`}</style>
                    )}
                    <div className="form-grid">

                        {/* STAFF ID */}
                        <label>
                            <div className="label">Staff ID :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={staffIdOptions}
                                value={editStaff.staff_id || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditStaffIdChange(value);
                                }}
                            />
                            {errors.staff_id && <div className="edit-modal-error">{errors.staff_id}</div>}
                        </label>

                        {/* STAFF NAME */}
                        <label>
                            <div className="label">Staff Name :</div>
                            <input
                                type="text"
                                name="staff_name"
                                value={editStaff.staff_name || ''}
                                readOnly
                                
                            />
                        </label>

                        {/* CATEGORY */}
                        <label>
                            <div className="label">Category :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={categoryOptions}
                                value={editStaff.category || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditCategoryChange(value);
                                    handleEditInputChange({ target: { name: "category", value } });
                                }}
                            />
                            {errors.category && <div className="edit-modal-error">{errors.category}</div>}
                        </label>

                        {/* DEPT ID */}
                        <label>
                            <div className="label">Dept ID :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={deptIdOptions}
                                value={editStaff.dept_id || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditDeptIdChange(value);
                                }}
                            />
                            {errors.dept_id && <div className="edit-modal-error">{errors.dept_id}</div>}
                        </label>

                        {/* DEPT NAME */}
                        <label>
                            <div className="label">Dept Name :</div>
                            <input
                                type="text"
                                name="dept_name"
                                value={editStaff.dept_name || ''}
                                readOnly
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
                            />
                        </label>

                        {/* SEMESTER */}
                        <label>
                            <div className="label">Semester :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={semesterOptions}
                                value={editStaff.semester || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditSemChange(value);
                                    handleEditInputChange({ target: { name: "semester", value } });
                                }}
                            />
                            {errors.semester && <div className="edit-modal-error">{errors.semester}</div>}
                        </label>

                        {/* SECTION */}
                        <label>
                            <div className="label">Section :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={sectionOptions}
                                value={editStaff.section || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditInputChange({ target: { name: "section", value } });
                                }}
                            />
                            {errors.section && <div className="edit-modal-error">{errors.section}</div>}
                        </label>

                        {/* COURSE CODE */}
                        <label>
                            <div className="label">Course Code :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={courseCodeOptions}
                                value={editStaff.course_code || ""}
                                getOptionLabel={opt => opt.label}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleEditCourseCodeChange(value);
                                }}
                            />
                            {errors.course_code && <div className="edit-modal-error">{errors.course_code}</div>}
                        </label>

                        {/* COURSE TITLE */}
                        <label>
                            <div className="label">Course Title :</div>
                            <input
                                type="text"
                                name="course_title"
                                value={editStaff.course_title || ''}
                                readOnly
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