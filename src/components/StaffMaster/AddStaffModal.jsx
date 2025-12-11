import React, { useState, useEffect } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

const ErrorMessage = ({ message }) => {
    return message ? <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>{message}</div> : null;
};

function AddStaffModal({
    popup, hidepopup, staffId, setStaffId, staffName, setStaffName, staffDept, setStaffDept,
    staffCategory, setStaffCategory, deptCategory, setDeptCategory, staffpassword, setStaffpassword,
    savenewstaff, staff_Dept, checkboxValues, handleCheckboxChange, errors, setErrors
}) {

    if (!popup) return null;

    const departmentOptions = staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }));
    const categoryOptions = [
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
        { value: "AIDED", label: "AIDED" }
    ];

    useEffect(() => {
        if (!popup) {
            setErrors({});
        }
    }, [popup, setErrors]);

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3>New Staff</h3>
                    <button className="modal-close" onClick={hidepopup}>✕</button>
                </div>

                <form className="modal-body" onSubmit={savenewstaff}>
                    <div className="form-grid">
                        <label>
                            <div className="label">Staff ID :</div>
                            <input
                                className={`input-box-correction ${errors.staffId ? 'input-error' : ''}`}
                                value={staffId}
                                onChange={(e) => {
                                    setStaffId(e.target.value.toUpperCase());
                                    if (errors.staffId) setErrors(prev => ({ ...prev, staffId: '' }));
                                }}
                            />
                            <ErrorMessage message={errors.staffId} />
                        </label>
                        <label>
                            <div className="label">Staff Name :</div>
                            <input
                                className={`input-box-correction ${errors.staffName ? 'input-error' : ''}`}
                                value={staffName}
                                onChange={(e) => {
                                    setStaffName(e.target.value.toUpperCase());
                                    if (errors.staffName) setErrors(prev => ({ ...prev, staffName: '' }));
                                }}
                            />
                            <ErrorMessage message={errors.staffName} />
                        </label>
                        <label>
                            <div className="label">Staff Category :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={categoryOptions}
                                value={staffCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    setStaffCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""));
                                    if (errors.staffCategory) setErrors(prev => ({ ...prev, staffCategory: '' }));
                                }}
                                error={errors.staffCategory}
                            />
                            <ErrorMessage message={errors.staffCategory} />
                        </label>
                        <label>
                            <div className="label">Dept Category :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={categoryOptions}
                                value={deptCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    setDeptCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""));
                                    if (errors.deptCategory) setErrors(prev => ({ ...prev, deptCategory: '' }));
                                }}
                                error={errors.deptCategory}
                            />
                            <ErrorMessage message={errors.deptCategory} />
                        </label>
                        <label>
                            <div className="label">Department :</div>
                            <SearchableDropdown
                                useMode="add"
                                options={departmentOptions}
                                value={staffDept}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    setStaffDept(typeof opt === "string" ? opt : (opt ? opt.value : ""));
                                    if (errors.staffDept) setErrors(prev => ({ ...prev, staffDept: '' }));
                                }}
                                error={errors.staffDept}
                            />
                            <ErrorMessage message={errors.staffDept} />
                        </label>
                        <label>
                            <div className="label">Password :</div>
                            <input
                                type="text"
                                className={errors.staffpassword ? 'input-error' : ''}
                                value={staffpassword}
                                onChange={(e) => {
                                    setStaffpassword(e.target.value);
                                    if (errors.staffpassword) setErrors(prev => ({ ...prev, staffpassword: '' }));
                                }}
                            />
                            <ErrorMessage message={errors.staffpassword} />
                        </label>
                    </div>

                    <div className="permissions">
                        <div className="perm-title">Permissions :</div>
                        <div className="perm-grid">
                            {Object.keys(checkboxValues).map((key) => (
                                <label className="perm-item" key={key}>
                                    <input type="checkbox" name={key} checked={checkboxValues[key]} onChange={handleCheckboxChange} />
                                    <span>{key}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-outline" onClick={hidepopup}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddStaffModal;