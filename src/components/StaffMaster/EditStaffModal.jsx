import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

const ErrorMessage = ({ message }) => {
    return message ? (
        <div className="error-message" style={{ color: "red", marginTop: "5px" }}>
            {message}
        </div>
    ) : null;
};

function EditStaffModal({
    edit, staffEditClose, newstaffid, newstaffname, setNewstaffname,
    newStaffCategory, setNewStaffCategory, newDeptCategory, setNewDeptCategory,
    newdept, setNewdept, oldpassword, newpassword, setNewpassword, updatestaff,
    staff_Dept, editErrors, setEditErrors
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

                        {/* Staff ID */}
                        <label>
                            <div className="label">Staff ID :</div>
                            <input className="input-box-correction" value={newstaffid} disabled />
                        </label>

                        {/* Staff Name */}
                        <label>
                            <div className="label">Staff Name :</div>
                            <input
                                className={`input-box-correction ${editErrors.newstaffname ? "input-error" : ""}`}
                                value={newstaffname}
                                onChange={(e) => {
                                    setNewstaffname(e.target.value.toUpperCase());
                                    if (editErrors.newstaffname)
                                        setEditErrors(prev => ({ ...prev, newstaffname: "" }));
                                }}
                            />
                            <ErrorMessage message={editErrors.newstaffname} />
                        </label>

                        {/* Staff Category */}
                        <label>
                            <div className="label">Staff Category :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={categoryOptions}
                                value={newStaffCategory}
                                onSelect={(opt) => setNewStaffCategory(opt ? opt.value : "")}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                error={editErrors.newStaffCategory}
                            />
                            <ErrorMessage message={editErrors.newStaffCategory} />
                        </label>

                        {/* Dept Category */}
                        <label>
                            <div className="label">Dept Category :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={categoryOptions}
                                value={newDeptCategory}
                                onSelect={(opt) => setNewDeptCategory(opt ? opt.value : "")}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                error={editErrors.newDeptCategory}
                            />
                            <ErrorMessage message={editErrors.newDeptCategory} />
                        </label>

                        {/* Department */}
                        <label>
                            <div className="label">Department :</div>
                            <SearchableDropdown
                                useMode="edit"
                                options={departmentOptions}
                                value={newdept}
                                onSelect={(opt) => setNewdept(opt ? opt.value : "")}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                error={editErrors.newdept}
                            />
                            <ErrorMessage message={editErrors.newdept} />
                        </label>

                        {/* Password — NEW PASSWORD validation only */}
                        <label>
                            <div className="label">Current Password :</div>
                            <input value={oldpassword} disabled type="text" />
                        </label>

                        <label>
                            <div className="label">New Password :</div>
                            <input
                                type="password"
                                value={newpassword}
                                className={`${editErrors.newpassword ? "input-error" : ""}`}
                                onChange={(e) => {
                                    setNewpassword(e.target.value);
                                    if (editErrors.newpassword)
                                        setEditErrors(prev => ({ ...prev, newpassword: "" }));
                                }}
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
    )
}

export default EditStaffModal;