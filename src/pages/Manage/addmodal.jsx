import React from 'react';
import SearchableDropdown from '../../components/common/SearchableDropdown';

const AddModal = ({
    isOpen, closeModal, staffId, selectedStaffId, handleStaffIdChange, staffName, selectedCategory,
    handleCategoryChange, deptId, selectedDeptId, handleIdChange, setStaffName, staffData, deptName,
    degree, semester, selectedSemester, handleSemChange, section, selectedSection, handleSectionChange,
    courseCode, selectedCourseCode, handleCourseCodeChange, courseTitle, batch, handleAddInputChange,
    handleSaveStaff,
}) => {

    if (!isOpen) return null;

    return (

        <div className="smst-overlay">
            <div className="scm-modal">
                <div className='smsm-close-div'>
                    <button className="smst-close" onClick={closeModal}>✖</button>
                </div>
                <h3>ADD NEW STAFF COURSE</h3>

                {/* STAFF ID Dropdown with Staff Name */}
                <SearchableDropdown
                    options={staffId.map(id => ({
                        value: id,
                        label: `${id} - ${staffData.find(s => s.staff_id === id)?.staff_name || ""}`
                    }))}
                    value={
                        selectedStaffId
                            ? { value: selectedStaffId, label: `${selectedStaffId} - ${staffName}` }
                            : null
                    }
                    getOptionLabel={opt => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={opt => {
                        if (typeof opt === "string") {
                            handleStaffIdChange(opt);
                        } else if (opt) {
                            handleStaffIdChange(opt.value);
                            setStaffName(staffData.find(s => s.staff_id === opt.value)?.staff_name || "");
                        }
                    }}
                    placeholder="STAFF ID"
                />

                <div className="smst-form-grid">

                    <input
                        type="text"
                        name="staff_name"
                        placeholder="STAFF NAME"
                        value={staffName}
                        disabled
                    />

                    <SearchableDropdown
                        options={["SFM", "SFW", "AIDED"].map(c => ({ value: c, label: c }))}
                        value={selectedCategory ? { value: selectedCategory, label: selectedCategory } : null}
                        getOptionLabel={opt => (typeof opt === "string" ? opt : opt.label)}
                        onSelect={opt => {
                            if (typeof opt === "string") handleCategoryChange(opt);
                            else if (opt) handleCategoryChange(opt.value);
                            else handleCategoryChange("");
                        }}
                        placeholder="CATEGORY"
                    />

                    <SearchableDropdown
                        options={deptId}
                        value={selectedDeptId}
                        onSelect={(val) => handleIdChange(val)}
                        getOptionLabel={(id) => id}
                        placeholder="DEPT ID"
                    />

                    <input type="text" name="dept_name" placeholder="DEPT NAME" value={deptName} disabled />
                    <input type="text" name="degree" placeholder="DEGREE" value={degree} onChange={handleAddInputChange} disabled />

                    <select name="semester" value={selectedSemester} onChange={(e) => handleSemChange(e.target.value)}>
                        <option value="">SEMESTER</option>
                        {semester.map((sem, index) => (
                            <option key={index} value={sem}> {sem}  </option>
                        ))}
                    </select>

                    <select name="section" value={selectedSection} onChange={(e) => handleSectionChange(e.target.value)}>
                        <option value="">SECTION</option>
                        {section.map((sec, index) => (
                            <option key={index} value={sec}> {sec} </option>
                        ))}
                    </select>

                    <SearchableDropdown
                        options={courseCode}
                        value={selectedCourseCode}
                        onSelect={(val) => handleCourseCodeChange(val)}
                        getOptionLabel={(code) => code}
                        placeholder="COURSE CODE"
                    />

                    <input type="text" name="course_title" placeholder="COURSE TITLE" value={courseTitle} disabled />
                    <input type="text" name="batch" placeholder="BATCH" value={batch} disabled />

                </div>

                <div className="smst-delete-btn-container">
                    <button onClick={handleSaveStaff} className="smsm-add-save-btn">SAVE</button>
                    <button onClick={closeModal} className="smsm-save-edit-btn">CANCEL</button>
                </div>

            </div>
        </div>
    )

}

export default AddModal;