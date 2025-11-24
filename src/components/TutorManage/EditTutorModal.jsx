import React, { useState } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function EditTutorModal({
    editingStaff, closeEditTutorModal, handleEditSave,
    editForm, setEditForm,
    getUniqueStaffsForDropdown, getUniqueValues, data, staffData
}) {

    const [errors, setErrors] = useState({});

    if (!editingStaff) return null;

    const getValue = (opt) => (typeof opt === "string" ? opt : opt?.value || "");
    const getLabel = (opt) => (typeof opt === "string" ? opt : opt?.label || "");

    const handleSelect = (key, opt) =>
        setEditForm(prev => ({ ...prev, [key]: getValue(opt) }));

    const staffIdOptions = getUniqueStaffsForDropdown();
    const categoryOptions = getUniqueValues("category").map(v => ({ value: v, label: v }));
    const degreeOptions = getUniqueValues("degree").map(v => ({ value: v, label: v }));
    const graduateOptions = getUniqueValues("graduate").map(v => ({ value: v, label: v }));
    const sectionOptions = getUniqueValues("section").map(v => ({ value: v, label: v }));
    const batchOptions = getUniqueValues("batch").map(v => ({ value: v, label: v }));

    const deptOptions = Array.from(
        new Map(
            data
                .filter(d => d.dept_id && d.dept_name)
                .map(d => [
                    d.dept_id,
                    {
                        value: d.dept_id,
                        label: `${d.dept_id} - ${d.dept_name}`,
                        name: d.dept_name
                    }
                ])
        ).values()
    );

    const handleDeptSelect = (opt) => {
        if (!opt) {
            setEditForm(prev => ({ ...prev, dept_id: "", dept_name: "" }));
            return;
        }

        const value = typeof opt === "string" ? opt : opt.value;
        const selected = deptOptions.find(d => d.value === value);

        setEditForm(prev => ({
            ...prev,
            dept_id: value,
            dept_name: selected?.name || ""
        }));
    };

    const validateForm = () => {

        const newErrors = {};

        if (!editForm.staff_id) newErrors.staff_id = "Please select Staff ID";
        if (!editForm.category) newErrors.category = "Please select Category";
        if (!editForm.degree) newErrors.degree = "Please select Degree";
        if (!editForm.graduate) newErrors.graduate = "Please select Graduate";
        if (!editForm.section) newErrors.section = "Please select Section";
        if (!editForm.dept_id) newErrors.dept_id = "Please select Department";
        if (!editForm.batch) newErrors.batch = "Please select Batch";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        handleEditSave();
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">

                <div className="modal-header">
                    <h3>EDIT TUTOR</h3>
                    <button className="modal-close" onClick={closeEditTutorModal}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="form-grid">

                        {/* STAFF ID */}
                        <label>
                            <div className="label">Staff ID :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={staffIdOptions}
                                value={editForm.staff_id || ""}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") {
                                        setEditForm(prev => ({ ...prev, staff_id: opt, staff_name: "" }));
                                    } else if (opt) {
                                        const st = staffData.find(s => s.staff_id === opt.value);
                                        setEditForm(prev => ({
                                            ...prev,
                                            staff_id: opt.value,
                                            staff_name: st?.staff_name || ""
                                        }));
                                    } else {
                                        setEditForm(prev => ({ ...prev, staff_id: "", staff_name: "" }));
                                    }
                                }}
                                isDisabled={true}
                            />
                            {errors.staff_id && <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>{errors.staff_id}</span>}
                        </label>

                        {/* STAFF NAME */}
                        <label>
                            <div className="label">Tutor Name :</div>
                            <input className="input-box-correction" value={editForm.staff_name || ""} disabled />
                        </label>

                        {/* CATEGORY */}
                        <label>
                            <div className="label">Category :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={categoryOptions}
                                value={editForm.category || ""}
                                getOptionLabel={getLabel}
                                onSelect={(opt) => handleSelect("category", opt)}
                            />
                            {errors.category && <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>{errors.category}</span>}
                        </label>

                        {/* DEGREE */}
                        <label>
                            <div className="label">Degree :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={degreeOptions}
                                value={editForm.degree || ""}
                                getOptionLabel={getLabel}
                                onSelect={(opt) => handleSelect("degree", opt)}
                            />
                            {errors.degree && <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>{errors.degree}</span>}
                        </label>

                        {/* GRADUATE */}
                        <label>
                            <div className="label">Graduate :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={graduateOptions}
                                value={editForm.graduate || ""}
                                getOptionLabel={getLabel}
                                onSelect={(opt) => handleSelect("graduate", opt)}
                            />
                            {errors.graduate && <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>{errors.graduate}</span>}
                        </label>

                        {/* SECTION */}
                        <label>
                            <div className="label">Section :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={sectionOptions}
                                value={editForm.section || ""}
                                getOptionLabel={getLabel}
                                onSelect={(opt) => handleSelect("section", opt)}
                            />
                            {errors.section && <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>{errors.section}</span>}
                        </label>

                        {/* DEPT ID */}
                        <label>
                            <div className="label">Dept ID :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={deptOptions}
                                value={editForm.dept_id || ""}
                                getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                                onSelect={handleDeptSelect}
                            />
                            {errors.dept_id && <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>{errors.dept_id}</span>}
                        </label>

                        {/* DEPT NAME */}
                        <label>
                            <div className="label">Dept Name :</div>
                            <input className="input-box-correction" value={editForm.dept_name || ""} disabled />
                        </label>

                        {/* BATCH */}
                        <label>
                            <div className="label">Batch :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={batchOptions}
                                value={editForm.batch || ""}
                                getOptionLabel={getLabel}
                                onSelect={(opt) => handleSelect("batch", opt)}
                            />
                            {errors.batch && <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>{errors.batch}</span>}
                        </label>

                    </div>

                    <div className="modal-actions">
                        <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
                        <button className="btn btn-outline" onClick={closeEditTutorModal}>Cancel</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default EditTutorModal;
