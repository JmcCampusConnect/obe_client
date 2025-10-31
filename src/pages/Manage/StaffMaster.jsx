import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../css/StaffMaster.css';
import SearchableDropdown from "../../common/SearchableDropdown";

function StaffMaster() {

    const [staffData, setStaffData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    const [popup, setPopup] = useState(false);
    const [edit, setEdit] = useState(false);
    const [deletestaff, setDeletestaff] = useState(false);

    const [staffId, setStaffId] = useState("");
    const [staffName, setStaffName] = useState("");
    const [staffDept, setStaffDept] = useState("");
    const [staffCategory, setStaffCategory] = useState("");
    const [deptCategory, setDeptCategory] = useState("");
    const [staffpassword, setStaffpassword] = useState("");

    const [newstaffid, setNewstaffid] = useState("");
    const [newstaffname, setNewstaffname] = useState("");
    const [newdept, setNewdept] = useState("");
    const [newStaffCategory, setNewStaffCategory] = useState("");
    const [newDeptCategory, setNewDeptCategory] = useState("");
    const [oldpassword, setOldpassword] = useState("");
    const [newpassword, setNewpassword] = useState("");

    const [deletestaffid, setDeletestaffid] = useState("");
    const [deletestaffname, setDeletestaffname] = useState("");

    const [staff_Dept, setStaff_Dept] = useState([]);
    const [checkboxValues, setCheckboxValues] = useState({
        dashboard: true, course: true, co: false, so: false,
        po: false, pso: false, wpr: false, obereport: false,
        input: false, manage: false, rsm: true, setting: true
    });

    useEffect(() => {
        const staffDetails = async () => {
            try {
                const StaffResponse = await axios.get(`${apiUrl}/api/staffdetails`);
                if (StaffResponse.data) {
                    setStaffData(StaffResponse.data);
                    setFilteredData(StaffResponse.data);
                }
            } catch (err) {
                console.log('Error Fetching Data:', err);
            }
        };
        staffDetails();
    }, [apiUrl]);

    const showPopup = async () => {
        setPopup(true);
        try {
            const response = await axios.get(`${apiUrl}/api/staffdepartments`);
            if (response.data) setStaff_Dept(response.data);
        } catch (err) {
            console.log("ERROR FETCHING STAFF DEPARTMENT CATEGORY", err);
        }
    }

    const hidepopup = () => {
        setPopup(false);
        resetForm();
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxValues(prev => ({ ...prev, [name]: checked }));
    }

    const resetForm = () => {
        setStaffId(""); setStaffName(""); setStaffDept(""); setStaffCategory("");
        setDeptCategory(""); setStaffpassword("");
    }

    const savenewstaff = async (e) => {

        e.preventDefault();
        if (!staffId || !staffName || !staffDept || !staffCategory || !staffpassword) {
            window.alert("All Fields are Required");
            return;
        }

        const newStaffData = {
            staff_id: staffId,
            staff_name: staffName,
            staff_dept: staffDept,
            staff_category: staffCategory,
            dept_category: deptCategory,
            password: staffpassword,
            permissions: checkboxValues
        };

        try {
            const newStaffResponse = await axios.post(`${apiUrl}/api/newstaff`, newStaffData);
            if (newStaffResponse.data) {
                setStaffData([...staffData, newStaffResponse.data.newStaff]);
                setFilteredData([...staffData, newStaffResponse.data.newStaff]);
                window.alert("Staff has been added successfully");
            }
            hidepopup();
        } catch (err) {
            console.log("Error in adding staff : ", err);
            alert('Error in adding staff')
        }
    }

    const handleSearch = (e) => {
        const searchText = e.target.value.toLowerCase();
        const filterList = staffData.filter((staff) =>
            staff.staff_id.toLowerCase().includes(searchText) ||
            staff.staff_category.toLowerCase().includes(searchText) ||
            staff.dept_category.toLowerCase().includes(searchText) ||
            staff.staff_dept.toLowerCase().includes(searchText) ||
            staff.staff_name.toLowerCase().includes(searchText)
        );
        setFilteredData(filterList);
    }

    const handleEdit = async (id, name, pass, dept, staff_category, dept_category) => {
        setNewstaffid(id);
        setNewstaffname(name);
        setOldpassword(pass);
        setNewdept(dept);
        setNewStaffCategory(staff_category);
        setNewDeptCategory(dept_category);
        setNewpassword("");
        setEdit(true);
        try {
            const response = await axios.get(`${apiUrl}/api/staffdepartments`);
            if (response.data) setStaff_Dept(response.data);
        } catch (err) {
            console.log("Error fetching Staff Category : ", err);
        }
    }

    const staffEditClose = () => {
        setEdit(false);
    }

    const updatestaff = async () => {
        try {
            const updateresponse = await axios.put(`${apiUrl}/api/staffupdate`, {
                newstaffid, newstaffname, newpassword, newdept, newStaffCategory, newDeptCategory, oldpassword
            })
            if (updateresponse.data) {
                const updatedStaff = updateresponse.data.updatedStaff;
                const updatedStaffList = staffData.map(staff =>
                    staff.staff_id === updatedStaff.staff_id ? updatedStaff : staff
                )
                setStaffData(updatedStaffList);
                setFilteredData(updatedStaffList);
                window.alert("Staff has been modified successfully");
            }
            staffEditClose();
        } catch (err) { console.log("Error in Updating Staff : ", err) }
    }

    const handleDelete = (dstaffid, dstaffname) => {
        setDeletestaffid(dstaffid);
        setDeletestaffname(dstaffname);
        setDeletestaff(true);
    }

    const staffDeleteClose = () => {
        setDeletestaff(false);
    }

    const Confirmdelete = async () => {
        try {
            const DeleteResponse = await axios.post(`${apiUrl}/api/staffdelete`, { deletestaffid });
            if (DeleteResponse.data) {
                window.alert("Staff has been deleted successfully");
                setStaffData(staffData.filter(s => s.staff_id !== deletestaffid));
                setFilteredData(filteredData.filter(s => s.staff_id !== deletestaffid));
                staffDeleteClose();
            }
        } catch (err) { console.log("Error in deleting Staff : ", err) }
    }

    return (
        <div className="smsm-manage">
            <p className="smsm-top-heading">STAFF Master Data</p>
            <div className="smsm-input-btn">
                <input className="smsm-search" type="text" placeholder="Search ..." onChange={handleSearch} />
                <button className="smsm-save-btn" onClick={showPopup}>
                    <FontAwesomeIcon icon={faPlus} className="smsm-icon" />
                    <span>Add</span>
                </button>
            </div>

            {/* Staff Table */}
            <table className="smsm-header">
                <thead>
                    <tr>
                        <th>S. No.</th>
                        <th>Staff Id</th>
                        <th>Staff Name</th>
                        <th>Staff Category</th>
                        <th>Dept Category</th>
                        <th>Dept Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? filteredData.map((staff, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'staff-repo-light' : 'staff-repo-dark'}>
                            <td>{index + 1}</td>
                            <td>{staff.staff_id}</td>
                            <td>{staff.staff_name}</td>
                            <td>{staff.staff_category}</td>
                            <td>{staff.dept_category}</td>
                            <td>{staff.staff_dept}</td>
                            <td className='staff-repo-action'>
                                <button className="smsm-edit-btn" onClick={() => handleEdit(staff.staff_id, staff.staff_name, staff.staff_pass, staff.staff_dept, staff.staff_category, staff.dept_category)}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                            </td>
                            <td className='staff-repo-action'>
                                <button className="smsm-del-btn" onClick={() => handleDelete(staff.staff_id, staff.staff_name)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="8">No Data Available.</td></tr>}
                </tbody>
            </table>

            {/* Add Staff Modal */}
            {popup && (
                <div className="smsm-overlay">
                    <div className="smsm-addstaff">
                        <div className='smsm-close-div'>
                            <button onClick={hidepopup} className="smsm-close">✖</button>
                        </div>
                        <h3>ADD NEW STAFF</h3>
                        <div className="smsm-form-grid">
                            <input
                                type="text"
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                                className="smsm-inputs"
                                placeholder="Staff ID"
                            />
                            <input
                                type="text"
                                value={staffName}
                                onChange={(e) => setStaffName(e.target.value)}
                                className="smsm-inputs"
                                placeholder="Staff Name"
                            />

                            {/* Staff Category */}
                            <SearchableDropdown
                                options={[
                                    { value: "SFM", label: "SFM" },
                                    { value: "SFW", label: "SFW" },
                                    { value: "AIDED", label: "AIDED" }
                                ]}
                                value={staffCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setStaffCategory(opt);
                                    else if (opt) setStaffCategory(opt.value);
                                    else setStaffCategory("");
                                }}
                                placeholder="Staff Category"
                            />

                            {/* Dept Category */}
                            <SearchableDropdown
                                options={[
                                    { value: "SFM", label: "SFM" },
                                    { value: "SFW", label: "SFW" },
                                    { value: "AIDED", label: "AIDED" }
                                ]}
                                value={deptCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setDeptCategory(opt);
                                    else if (opt) setDeptCategory(opt.value);
                                    else setDeptCategory("");
                                }}
                                placeholder="Dept Category"
                            />

                            {/* Staff Department */}
                            <SearchableDropdown
                                options={staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }))}
                                value={staffDept}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setStaffDept(opt);
                                    else if (opt) setStaffDept(opt.value);
                                    else setStaffDept("");
                                }}
                                placeholder="Staff Department"
                            />

                            <input
                                type="text"
                                value={staffpassword}
                                onChange={(e) => setStaffpassword(e.target.value)}
                                className="smsm-inputs"
                                placeholder="Password"
                            />
                        </div>

                        <div className="smsm-check-boxes smsms-fullwidth">
                            {Object.keys(checkboxValues).map((key, idx) => (
                                <label key={idx} className="smsm-individual-check">
                                    <input type="checkbox" name={key} checked={checkboxValues[key]} onChange={handleCheckboxChange} />
                                    {key.toUpperCase()}
                                </label>
                            ))}
                        </div>

                        <div className="smsh-delete-btn-container">
                            <button onClick={savenewstaff} className="smsm-add-save-btn">SAVE</button>
                            <button onClick={hidepopup} className="smsm-save-edit-btn">CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Staff Modal */}
            {edit && (
                <div className="smsm-overlay">
                    <div className="smsm-edit">
                        <div className='smsm-close-div'>
                            <button onClick={staffEditClose} className="smsm-close">✖</button>
                        </div>
                        <h3>EDIT STAFF</h3>

                        <div className="smsm-form-grid">

                            <input type="text" value={newstaffid} disabled className="smsm-edit-inputbox" />
                            <input type="text" value={newstaffname} onChange={(e) => setNewstaffname(e.target.value)} className="smsm-edit-inputbox" />

                            {/* Staff Category */}
                            <SearchableDropdown
                                options={[
                                    { value: "SFM", label: "SFM" },
                                    { value: "SFW", label: "SFW" },
                                    { value: "AIDED", label: "AIDED" }
                                ]}
                                value={newStaffCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setNewStaffCategory(opt);
                                    else if (opt) setNewStaffCategory(opt.value);
                                    else setNewStaffCategory("");
                                }}
                                placeholder="Staff Category"
                            />

                            {/* Dept Category */}
                            <SearchableDropdown
                                options={[
                                    { value: "SFM", label: "SFM" },
                                    { value: "SFW", label: "SFW" },
                                    { value: "AIDED", label: "AIDED" }
                                ]}
                                value={newDeptCategory}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setNewDeptCategory(opt);
                                    else if (opt) setNewDeptCategory(opt.value);
                                    else setNewDeptCategory("");
                                }}
                                placeholder="Dept Category"
                            />
                        </div>

                        <div className="smsm-form-grid-2">
                            <SearchableDropdown
                                options={staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }))}
                                value={newdept}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setNewdept(opt);
                                    else if (opt) setNewdept(opt.value);
                                    else setNewdept("");
                                }}
                                placeholder="Staff Department"
                            />
                        </div>

                        <div className="smsm-edit-psw smsms-fullwidth">
                            <label className="smsm-edit-password">
                                <span className="smsm-edit-span">Old Password :</span>
                                <input type="text" value={oldpassword} disabled className="smsm-edit-inputbox-psw" />
                            </label>
                            <label className="smsm-edit-password">
                                <span className="smsm-edit-span">New Password :</span>
                                <input type="text" value={newpassword} onChange={(e) => setNewpassword(e.target.value)} className="smsm-edit-inputbox-psw" placeholder="New Password" />
                            </label>
                        </div>

                        <div className="smsh-delete-btn-container">
                            <button onClick={updatestaff} className="smsm-add-save-btn">SAVE</button>
                            <button onClick={staffEditClose} className="smsm-save-edit-btn">CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Staff Modal */}
            {deletestaff && (
                <div className="smsm-overlay">
                    <div className="smsm-delete">
                        <div className='smsm-close-div'><button onClick={staffDeleteClose} className="smsm-close">✖</button></div>
                        <h3>CONFRIM DELETE</h3>
                        <p>Staff ID : {deletestaffid}</p>
                        <p>Staff Name : {deletestaffname}</p>
                        <div className="smsh-delete-btn-containers">
                            <button onClick={Confirmdelete} className="smsm-confirm-btn">CONFIRM</button>
                            <button onClick={staffDeleteClose} className="smsm-cancel-btn">CANCEL</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StaffMaster;