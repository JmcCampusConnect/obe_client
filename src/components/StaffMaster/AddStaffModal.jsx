import React from 'react';
import SearchableDropdown from '../../common/SearchableDropdown';

function AddStaffModal({
    popup, hidepopup, staffId, setStaffId, staffName, setStaffName, staffDept, setStaffDept,
    staffCategory, setStaffCategory, deptCategory, setDeptCategory, staffpassword, setStaffpassword,
    savenewstaff, staff_Dept, checkboxValues, handleCheckboxChange
}) {

    if (!popup) return null;

    const departmentOptions = staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }));
    const categoryOptions = [
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
        { value: "AIDED", label: "AIDED" }
    ]

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
                            <input className='input-box-correction' value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
                        </label>
                        <label>
                            <div className="label">Staff Name :</div>
                            <input className='input-box-correction' value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
                        </label>
                        <label>
                            <div className="label">Staff Category :</div>
                            <SearchableDropdown
                                options={categoryOptions}
                                value={staffCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => setStaffCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                                placeholder="Select Category"
                            />
                        </label>
                        <label>
                            <div className="label">Dept Category :</div>
                            <SearchableDropdown
                                options={categoryOptions}
                                value={deptCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => setDeptCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                                placeholder="Select Dept Category"
                            />
                        </label>
                        <label>
                            <div className="label">Department :</div>
                            <SearchableDropdown
                                options={departmentOptions}
                                value={staffDept}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => setStaffDept(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                                placeholder="Select Department"
                            />
                        </label>
                        <label>
                            <div className="label">Password :</div>
                            <input type="password" value={staffpassword} onChange={(e) => setStaffpassword(e.target.value)} required />
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