import React, { useState, useEffect } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function AddTutorModal({
    addTutur, tututaddClose, getUniqueStaffsForDropdown, newTuturId, setNewTuturId,
    newtuturName, setNewtuturName, staffData, data, getUniqueValues,
    tuturCategory, setTuturCategory, tuturDegree, setTuturDegree, tuturgraduate,
    setTuturGraduate, tuturSection, setTuturSection, tuturDeptId, setTuturDeptId,
    tuturdeptName, setTuturdeptName, tuturBatch, setTuturBatch, handleNewMentor
}) {

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!addTutur) {
            setErrors({});
        }
    }, [addTutur]);

    if (!addTutur) return null;

    const validateForm = () => {
        const newErrors = {};

        if (!newTuturId) newErrors.newTuturId = "Please select a Staff ID";
        if (!tuturCategory) newErrors.tuturCategory = "Please select Category";
        if (!tuturDegree) newErrors.tuturDegree = "Please select Degree";
        if (!tuturgraduate) newErrors.tuturgraduate = "Please select Graduate type";
        if (!tuturSection) newErrors.tuturSection = "Please select Section";
        if (!tuturDeptId) newErrors.tuturDeptId = "Please select Department";
        if (!tuturBatch) newErrors.tuturBatch = "Please select Batch";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        handleNewMentor();
    };

    const handleStaffSelect = (opt) => {
        if (typeof opt === "string") {
            setNewTuturId(opt);
        } else if (opt) {
            setNewTuturId(opt.value);
            setNewtuturName(staffData.find(s => s.staff_id === opt.value)?.staff_name || "");
        } else {
            setNewTuturId("");
            setNewtuturName("");
        }
    };

    const handleDropdownSelect = (setter) => (opt) =>
        setter(opt ? (typeof opt === "string" ? opt : opt.value) : "");

    const mapUniqueOptions = (key) =>
        getUniqueValues(key).map(v => ({ value: v, label: v }));

    const deptOptions = Array.from(
        new Map(data
            .filter(d => d.dept_id && d.dept_name)
            .map(d => [d.dept_id, { value: d.dept_id, label: `${d.dept_id} - ${d.dept_name}`, name: d.dept_name }])
        ).values()
    );

    const handleDeptSelect = (opt) => {
        if (opt) {
            const value = typeof opt === "string" ? opt : opt.value;
            const selectedDept = deptOptions.find(d => d.value === value);
            setTuturDeptId(value);
            setTuturdeptName(selectedDept ? selectedDept.name : "");
        } else {
            setTuturDeptId("");
            setTuturdeptName("");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3>ADD NEW TUTOR</h3>
                    <button className="modal-close" onClick={tututaddClose}>✕</button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-grid">

                        {/* STAFF ID */}
                        <label>
                            <div className="label">Staff ID :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={getUniqueStaffsForDropdown()}
                                value={newTuturId}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : opt.label}
                                onSelect={handleStaffSelect}
                            />
                            {errors.newTuturId && (
                                <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>
                                    {errors.newTuturId}
                                </span>
                            )}
                        </label>

                        {/* TUTOR NAME */}
                        <label>
                            <div className="label">Tutor Name :</div>
                            <input className="input-box-correction" type="text" value={newtuturName} disabled />
                        </label>

                        {/* CATEGORY */}
                        <label>
                            <div className="label">Category :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={mapUniqueOptions("category")}
                                value={tuturCategory}
                                getOptionLabel={(c) => typeof c === "string" ? c : c.label}
                                onSelect={handleDropdownSelect(setTuturCategory)}
                            />
                            {errors.tuturCategory && (
                                <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>
                                    {errors.tuturCategory}
                                </span>
                            )}
                        </label>

                        {/* DEGREE */}
                        <label>
                            <div className="label">Degree :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={mapUniqueOptions("degree")}
                                value={tuturDegree}
                                getOptionLabel={(d) => typeof d === "string" ? d : d.label}
                                onSelect={handleDropdownSelect(setTuturDegree)}
                            />
                            {errors.tuturDegree && (
                                <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>
                                    {errors.tuturDegree}
                                </span>
                            )}
                        </label>

                        {/* GRADUATE */}
                        <label>
                            <div className="label">Graduate :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={mapUniqueOptions("graduate")}
                                value={tuturgraduate}
                                getOptionLabel={(g) => typeof g === "string" ? g : g.label}
                                onSelect={handleDropdownSelect(setTuturGraduate)}
                            />
                            {errors.tuturgraduate && (
                                <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>
                                    {errors.tuturgraduate}
                                </span>
                            )}
                        </label>

                        {/* SECTION */}
                        <label>
                            <div className="label">Section :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={mapUniqueOptions("section")}
                                value={tuturSection}
                                getOptionLabel={(s) => typeof s === "string" ? s : s.label}
                                onSelect={handleDropdownSelect(setTuturSection)}
                            />
                            {errors.tuturSection && (
                                <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>
                                    {errors.tuturSection}
                                </span>
                            )}
                        </label>

                        {/* DEPT ID */}
                        <label>
                            <div className="label">Dept ID :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={deptOptions}
                                value={tuturDeptId}
                                getOptionLabel={(d) => typeof d === "string" ? d : d.label}
                                onSelect={handleDeptSelect}
                            />
                            {errors.tuturDeptId && (
                                <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>
                                    {errors.tuturDeptId}
                                </span>
                            )}
                        </label>

                        {/* DEPT NAME */}
                        <label>
                            <div className="label">Dept Name :</div>
                            <input className="input-box-correction" type="text" value={tuturdeptName} disabled />
                        </label>

                        {/* BATCH */}
                        <label>
                            <div className="label">Batch :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={mapUniqueOptions("batch")}
                                value={tuturBatch}
                                getOptionLabel={(b) => typeof b === "string" ? b : b.label}
                                onSelect={handleDropdownSelect(setTuturBatch)}
                            />
                            {errors.tuturBatch && (
                                <span className="error-message" style={{ color: 'red', marginTop: 5, display: 'block' }}>
                                    {errors.tuturBatch}
                                </span>
                            )}
                        </label>

                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">SAVE</button>
                        <button type="button" className="btn btn-outline" onClick={tututaddClose}>
                            CANCEL
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddTutorModal;