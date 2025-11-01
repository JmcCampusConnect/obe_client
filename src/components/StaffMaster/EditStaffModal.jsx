import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function EditStaffModal({
    edit, staffEditClose, newstaffid, newstaffname, setNewstaffname,
    newStaffCategory, setNewStaffCategory, newDeptCategory, setNewDeptCategory,
    newdept, setNewdept, oldpassword, newpassword, setNewpassword, updatestaff,
    staff_Dept
}) {

    if (!edit) return null;

    const departmentOptions = staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }));
    const categoryOptions = [
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
        { value: "AIDED", label: "AIDED" }
    ];

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3>Edit Staff</h3>
                    <button className="modal-close" onClick={staffEditClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="form-grid">
                        <label>
                            <div className="label">Staff ID :</div>
                            <input className='input-box-correction' value={newstaffid} disabled /> 
                        </label>
                        <label>
                            <div className="label">Staff Name</div>
                            <input 
                                className='input-box-correction'
                                value={newstaffname} 
                                onChange={(e) => setNewstaffname(e.target.value)} 
                            />
                        </label>

                        <label>
                            <div className="label">Staff Category :</div>
                            <SearchableDropdown
                                options={categoryOptions}
                                value={newStaffCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => setNewStaffCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                                placeholder="Select Category"
                            />
                        </label>

                        <label>
                            <div className="label">Dept Category :</div>
                            <SearchableDropdown
                                options={categoryOptions} 
                                value={newDeptCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => setNewDeptCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                                placeholder="Select Dept Category"
                            />
                        </label>

                        <label>
                            <div className="label">Department :</div>
                            <SearchableDropdown
                                options={departmentOptions}
                                value={newdept}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => setNewdept(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                                placeholder="Select Department"
                            />
                        </label>

                        {/* Password fields */}
                        <label>
                            <div className="label">Current Password :</div>
                            <input value={oldpassword} disabled type="text" /> 
                        </label>
                        <label>
                            <div className="label">New Password :</div>
                            <input 
                                type="password"
                                value={newpassword} 
                                onChange={(e) => setNewpassword(e.target.value)} 
                            />
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button className="btn btn-primary" onClick={updatestaff}>Save Changes</button>
                        <button className="btn btn-outline" onClick={staffEditClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditStaffModal;