import React, { useState } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function AddStaffCourseModal({
    isOpen, closeModal,
    staffId = [], selectedStaffId, handleStaffIdChange, staffName, selectedCategory,
    handleCategoryChange, deptId = [], selectedDeptId, handleIdChange, setStaffName, staffData = [], deptName,
    degree, semester = [], selectedSemester, handleSemChange, section = [], selectedSection, handleSectionChange,
    courseCode = [], selectedCourseCode, handleCourseCodeChange, courseTitle, batch, handleAddInputChange,
    handleSaveStaff, errors
}) {

    const ErrorMessage = ({ message }) =>
        message ? (
            <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>
                {message}
            </div>
        ) : null;

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

    const courseCodeOptions = (Array.isArray(courseCode) ? courseCode : []).map(code => {
        const course = staffData.find(c => c.course_code === code);
        return {
            value: String(code ?? ""),
            label: `${code} - ${course?.course_title || ""}`
        };
    })

    const deptIdOptions = (Array.isArray(deptId) ? deptId : []).map(id => {
        const dept = staffData.find(d => d.dept_id === id);
        return {
            value: String(id ?? ""),
            label: `${id} - ${dept?.dept_name || ""}`
        };
    })

    const categoryOptions = ["SFM", "SFW", "AIDED"].map(c => ({ value: String(c), label: String(c) }));
    const semesterOptions = safeMap(semester);
    const sectionOptions = safeMap(section);

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
                            <div className="label">Staff ID  : </div>
                            <SearchableDropdown
                                useMode="add"
                                options={staffIdOptions || []}
                                getOptionLabel={opt => opt?.label || ""}
                                value={selectedStaffId}
                                onSelect={opt => {
                                    const value = opt ? (typeof opt === 'string' ? opt : opt.value) : "";
                                    handleStaffIdChange(value);
                                }}
                            />
                            <ErrorMessage message={errors.selectedStaffId} />
                        </label>

                        <label>
                            <div className="label">Staff Name  : </div>
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
                            <div className="label">Category  : </div>
                            <SearchableDropdown
                                useMode="add"
                                options={categoryOptions || []}
                                getOptionLabel={opt => opt?.label || ""}
                                value={selectedCategory}
                                onSelect={opt => handleCategoryChange(opt ? opt.value : "")}
                            />
                            <ErrorMessage message={errors.selectedCategory} />
                        </label>

                        <label>
                            <div className="label">Dept ID  : </div>
                            <SearchableDropdown
                                useMode="add"
                                options={deptIdOptions || []}
                                getOptionLabel={opt => opt?.label || ""}
                                value={selectedDeptId}
                                onSelect={opt => handleIdChange(opt ? opt.value : "")}
                            />
                            <ErrorMessage message={errors.selectedDeptId} />
                        </label>

                        <label>
                            <div className="label">Dept Name  : </div>
                            <input
                                className="input-box-correction"
                                type="text"
                                name="dept_name"
                                value={deptName || ''}
                                disabled
                            />
                        </label>

                        <label>
                            <div className="label">Degree : </div>
                            <input
                                className="input-box-correction"
                                type="text"
                                name="degree"
                                value={degree || ''}
                                disabled
                            />
                        </label>

                        <label>
                            <div className="label">Semester : </div>
                            <SearchableDropdown
                                useMode="add"
                                options={semesterOptions || []}
                                getOptionLabel={opt => opt?.label || ""}
                                value={selectedSemester}
                                onSelect={opt => handleSemChange(opt ? opt.value : "")}
                            />
                            <ErrorMessage message={errors.selectedSemester} />
                        </label>

                        <label>
                            <div className="label">Section : </div>
                            <SearchableDropdown
                                useMode="add"
                                options={sectionOptions || []}
                                getOptionLabel={opt => opt?.label || ""}
                                value={selectedSection}
                                onSelect={opt => handleSectionChange(opt ? opt.value : "")}
                            />
                            <ErrorMessage message={errors.selectedSection} />
                        </label>

                        <label>
                            <div className="label">Course Code : </div>
                            <SearchableDropdown
                                useMode="add"
                                options={courseCodeOptions || []}
                                getOptionLabel={opt => opt?.label || ""}
                                value={selectedCourseCode}
                                onSelect={opt => handleCourseCodeChange(opt ? opt.value : "")}
                            />
                            <ErrorMessage message={errors.selectedCourseCode} />
                        </label>

                        <label>
                            <div className="label">Course Title : </div>
                            <input
                                className="input-box-correction"
                                type="text"
                                name="course_title"
                                value={courseTitle || ''}
                                disabled
                            />
                        </label>

                        <label>
                            <div className="label">Batch : </div>
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