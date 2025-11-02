import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function AddStaffCourseModal({
    isOpen, closeModal,
    staffId = [], selectedStaffId, handleStaffIdChange, staffName, selectedCategory,
    handleCategoryChange, deptId = [], selectedDeptId, handleIdChange, setStaffName, staffData = [], deptName,
    degree, semester = [], selectedSemester, handleSemChange, section = [], selectedSection, handleSectionChange,
    courseCode = [], selectedCourseCode, handleCourseCodeChange, courseTitle, batch, handleAddInputChange,
    handleSaveStaff,
}) {
    if (!isOpen) return null;

    const safeMap = (list = []) => (Array.isArray(list) ? list.map(item => ({
        value: String(item ?? ""),
        label: String(item ?? "")
    })) : []);

    const staffIdOptions = (Array.isArray(staffId) ? staffId : []).map(id => {
        const staff = staffData.find(s => s.staff_id === id);
        return {
            value: String(id ?? ""),
            label: `${id} - ${staff?.staff_name || ""}`
        };
    });

    const categoryOptions = ["SFM", "SFW", "AIDED"].map(c => ({ value: String(c), label: String(c) }));
    const deptIdOptions = safeMap(deptId);
    const courseCodeOptions = safeMap(courseCode);
    const semesterOptions = safeMap(semester);
    const sectionOptions = safeMap(section);

    const findOption = (options, val) => {
        if (!options || !val) return "";
        const strVal = String(val);
        return options.find(o => String(o.value) === strVal) || "";
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3>New Staff Course</h3>
                    <button className="modal-close" onClick={closeModal}>✕</button>
                </div>

                <form className="modal-body" onSubmit={(e) => { e.preventDefault(); handleSaveStaff(); }}>
                    <div className="form-grid">

                        <label>
                            <div className="label">Staff ID:</div>
                            <SearchableDropdown
                                options={staffIdOptions || []}
                                value={findOption(staffIdOptions, selectedStaffId)}
                                getOptionLabel={opt => opt?.label || ""}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleStaffIdChange(value);
                                    setStaffName(staffData.find(s => s.staff_id === value)?.staff_name || "");
                                }}
                                placeholder="Select Staff ID"
                            />
                        </label>

                        <label>
                            <div className="label">Staff Name:</div>
                            <input
                                className="input-box-correction"
                                style={{ textTransform: 'uppercase' }}
                                type="text"
                                name="staff_name"
                                value={staffName || ''}
                                disabled
                            />
                        </label>

                        <label>
                            <div className="label">Category:</div>
                            <SearchableDropdown
                                options={categoryOptions || []}
                                value={findOption(categoryOptions, selectedCategory)}
                                getOptionLabel={opt => opt?.label || ""}
                                onSelect={opt => handleCategoryChange(opt ? opt.value : "")}
                                placeholder="Select Category"
                            />
                        </label>

                        <label>
                            <div className="label">Dept ID:</div>
                            <SearchableDropdown
                                options={deptIdOptions || []}
                                value={findOption(deptIdOptions, selectedDeptId)}
                                getOptionLabel={opt => opt?.label || ""}
                                onSelect={opt => handleIdChange(opt ? opt.value : "")}
                                placeholder="Select Dept ID"
                            />
                        </label>

                        <label>
                            <div className="label">Dept Name:</div>
                            <input
                                className="input-box-correction"
                                type="text"
                                name="dept_name"
                                value={deptName || ''}
                                disabled
                            />
                        </label>

                        <label>
                            <div className="label">Degree:</div>
                            <input
                                className="input-box-correction"
                                type="text"
                                name="degree"
                                value={degree || ''}
                                disabled
                            />
                        </label>

                        <label>
                            <div className="label">Semester:</div>
                            <SearchableDropdown
                                options={semesterOptions || []}
                                value={findOption(semesterOptions, selectedSemester)}
                                getOptionLabel={opt => opt?.label || ""}
                                onSelect={opt => handleSemChange(opt ? opt.value : "")}
                                placeholder="Select Semester"
                            />
                        </label>

                        <label>
                            <div className="label">Section:</div>
                            <SearchableDropdown
                                options={sectionOptions || []}
                                value={findOption(sectionOptions, selectedSection)}
                                getOptionLabel={opt => opt?.label || ""}
                                onSelect={opt => handleSectionChange(opt ? opt.value : "")}
                                placeholder="Select Section"
                            />
                        </label>

                        <label>
                            <div className="label">Course Code:</div>
                            <SearchableDropdown
                                options={courseCodeOptions || []}
                                value={findOption(courseCodeOptions, selectedCourseCode)}
                                getOptionLabel={opt => opt?.label || ""}
                                onSelect={opt => handleCourseCodeChange(opt ? opt.value : "")}
                                placeholder="Select Course Code"
                            />
                        </label>

                        <label>
                            <div className="label">Course Title:</div>
                            <input
                                className="input-box-correction"
                                type="text"
                                name="course_title"
                                value={courseTitle || ''}
                                disabled
                            />
                        </label>

                        <label>
                            <div className="label">Batch:</div>
                            <input
                                className="input-box-correction"
                                type="text"
                                name="batch"
                                value={batch || ''}
                                onChange={handleAddInputChange}
                                disabled
                            />
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStaffCourseModal;