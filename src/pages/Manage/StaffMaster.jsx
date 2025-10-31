// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faPlus, faChevronLeft, faChevronRight, faFilter } from "@fortawesome/free-solid-svg-icons";
// import "../../css/StaffMaster.css";
// import SearchableDropdown from "../../common/SearchableDropdown";

// function StaffMaster() {

//     const [staffData, setStaffData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const apiUrl = import.meta.env.VITE_API_URL;

//     const [popup, setPopup] = useState(false);
//     const [edit, setEdit] = useState(false);
//     const [deletestaff, setDeletestaff] = useState(false);

//     // Add modal fields
//     const [staffId, setStaffId] = useState("");
//     const [staffName, setStaffName] = useState("");
//     const [staffDept, setStaffDept] = useState("");
//     const [staffCategory, setStaffCategory] = useState("");
//     const [deptCategory, setDeptCategory] = useState("");
//     const [staffpassword, setStaffpassword] = useState("");

//     // Edit modal fields
//     const [newstaffid, setNewstaffid] = useState("");
//     const [newstaffname, setNewstaffname] = useState("");
//     const [newdept, setNewdept] = useState("");
//     const [newStaffCategory, setNewStaffCategory] = useState("");
//     const [newDeptCategory, setNewDeptCategory] = useState("");
//     const [oldpassword, setOldpassword] = useState("");
//     const [newpassword, setNewpassword] = useState("");

//     // Delete
//     const [deletestaffid, setDeletestaffid] = useState("");
//     const [deletestaffname, setDeletestaffname] = useState("");

//     // Departments & permissions
//     const [staff_Dept, setStaff_Dept] = useState([]);
//     const [checkboxValues, setCheckboxValues] = useState({
//         dashboard: true, course: true, co: false, so: false,
//         po: false, pso: false, wpr: false, obereport: false,
//         input: false, manage: false, rsm: true, setting: true
//     });

//     // toolbar / search / filter
//     const [searchText, setSearchText] = useState("");
//     const [showFilters, setShowFilters] = useState(false);

//     // Pagination (client-side)
//     const [page, setPage] = useState(1);
//     const pageSize = 12;

//     useEffect(() => {
//         const fetchStaff = async () => {
//             try {
//                 const resp = await axios.get(`${apiUrl}/api/staffdetails`);
//                 if (resp.data) {
//                     setStaffData(resp.data);
//                     setFilteredData(resp.data);
//                 }
//             } catch (err) {
//                 console.error("Error fetching staff:", err);
//             }
//         };
//         fetchStaff();
//     }, [apiUrl]);

//     // fetch depts on demand when opening add/edit
//     const loadDepartments = async () => {
//         try {
//             const resp = await axios.get(`${apiUrl}/api/staffdepartments`);
//             if (resp.data) setStaff_Dept(resp.data);
//         } catch (err) {
//             console.error("Error loading departments:", err);
//         }
//     };

//     const showPopup = async () => {
//         setPopup(true);
//         await loadDepartments();
//     };

//     const hidepopup = () => {
//         setPopup(false);
//         resetForm();
//     };

//     const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
//         setCheckboxValues(prev => ({ ...prev, [name]: checked }));
//     };

//     const resetForm = () => {
//         setStaffId(""); setStaffName(""); setStaffDept(""); setStaffCategory("");
//         setDeptCategory(""); setStaffpassword("");
//         setCheckboxValues({
//             dashboard: true, course: true, co: false, so: false,
//             po: false, pso: false, wpr: false, obereport: false,
//             input: false, manage: false, rsm: true, setting: true
//         });
//     };

//     const savenewstaff = async (e) => {
//         e.preventDefault();
//         if (!staffId || !staffName || !staffDept || !staffCategory || !staffpassword) {
//             window.alert("All fields are required");
//             return;
//         }
//         const newStaffData = {
//             staff_id: staffId,
//             staff_name: staffName,
//             staff_dept: staffDept,
//             staff_category: staffCategory,
//             dept_category: deptCategory,
//             password: staffpassword,
//             permissions: checkboxValues
//         };
//         try {
//             const resp = await axios.post(`${apiUrl}/api/newstaff`, newStaffData);
//             if (resp.data) {
//                 const added = resp.data.newStaff || resp.data;
//                 setStaffData(prev => [...prev, added]);
//                 setFilteredData(prev => [...prev, added]);
//                 window.alert("Staff added successfully");
//                 hidepopup();
//             }
//         } catch (err) {
//             console.error("Error adding staff:", err);
//             window.alert("Error adding staff");
//         }
//     };

//     const handleSearch = (text) => {
//         setSearchText(text);
//         const lower = text.trim().toLowerCase();
//         if (!lower) {
//             setFilteredData(staffData);
//             setPage(1);
//             return;
//         }
//         const filtered = staffData.filter((staff) =>
//             (staff.staff_id || "").toLowerCase().includes(lower) ||
//             (staff.staff_name || "").toLowerCase().includes(lower) ||
//             (staff.staff_dept || "").toLowerCase().includes(lower) ||
//             (staff.staff_category || "").toLowerCase().includes(lower) ||
//             (staff.dept_category || "").toLowerCase().includes(lower)
//         );
//         setFilteredData(filtered);
//         setPage(1);
//     };

//     const handleEdit = async (id, name, pass, dept, staff_category, dept_category) => {
//         setNewstaffid(id);
//         setNewstaffname(name);
//         setOldpassword(pass || "");
//         setNewdept(dept || "");
//         setNewStaffCategory(staff_category || "");
//         setNewDeptCategory(dept_category || "");
//         setNewpassword("");
//         setEdit(true);
//         await loadDepartments();
//     };

//     const staffEditClose = () => setEdit(false);

//     const updatestaff = async () => {
//         try {
//             const resp = await axios.put(`${apiUrl}/api/staffupdate`, {
//                 newstaffid, newstaffname, newpassword, newdept, newStaffCategory, newDeptCategory, oldpassword
//             });
//             if (resp.data) {
//                 const updatedStaff = resp.data.updatedStaff || resp.data;
//                 const updatedList = staffData.map(s => s.staff_id === updatedStaff.staff_id ? updatedStaff : s);
//                 setStaffData(updatedList);
//                 setFilteredData(updatedList);
//                 window.alert("Staff updated successfully");
//             }
//             staffEditClose();
//         } catch (err) {
//             console.error("Error updating staff:", err);
//             window.alert("Error updating staff");
//         }
//     };

//     const handleDelete = (dstaffid, dstaffname) => {
//         setDeletestaffid(dstaffid);
//         setDeletestaffname(dstaffname);
//         setDeletestaff(true);
//     };

//     const staffDeleteClose = () => setDeletestaff(false);

//     const Confirmdelete = async () => {
//         try {
//             const resp = await axios.post(`${apiUrl}/api/staffdelete`, { deletestaffid });
//             if (resp.data) {
//                 setStaffData(prev => prev.filter(s => s.staff_id !== deletestaffid));
//                 setFilteredData(prev => prev.filter(s => s.staff_id !== deletestaffid));
//                 window.alert("Staff deleted successfully");
//                 staffDeleteClose();
//             }
//         } catch (err) {
//             console.error("Error deleting staff:", err);
//             window.alert("Error deleting staff");
//         }
//     };

//     // client-side pagination slice
//     const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
//     useEffect(() => {
//         if (page > totalPages) setPage(totalPages);
//     }, [totalPages, page]);

//     const visibleRows = useMemo(() => {
//         const start = (page - 1) * pageSize;
//         return filteredData.slice(start, start + pageSize);
//     }, [filteredData, page]);

//     return (
//         <div className="staff-management-shell">
//             {/* Application Header */}
//             <header className="app-header">
//                 <div className="header-container">

//                     <div className="header-toolbar">
//                         <div className="toolbar-left">
//                             <div className="search-group">
//                                 <input
//                                     value={searchText}
//                                     onChange={(e) => handleSearch(e.target.value)}
//                                     placeholder="Search by ID, name, department..."
//                                     className="search-input"
//                                 />
//                                 <button className="filter-button" onClick={() => setShowFilters(v => !v)} title="Filters">
//                                     <FontAwesomeIcon icon={faFilter} />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="toolbar-right">
//                             <button className="btn btn-secondary" onClick={() => { setSearchText(""); handleSearch(""); }}>
//                                 Clear Search
//                             </button>
//                             <button className="btn btn-primary" onClick={showPopup}>
//                                 <FontAwesomeIcon icon={faPlus} /> Add New Staff
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Rest of the CRM/Staff Management content will go here... */}


//             {/* Optional filters area */}
//             {showFilters && (
//                 <div className="crm-filters">
//                     <div className="filter-grid">
//                         <SearchableDropdown
//                             options={[{ value: "SFM", label: "SFM" }, { value: "SFW", label: "SFW" }, { value: "AIDED", label: "AIDED" }]}
//                             value={staffCategory}
//                             getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                             onSelect={(opt) => setStaffCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                             placeholder="Filter: Staff Category"
//                         />
//                         <SearchableDropdown
//                             options={staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }))}
//                             value={staffDept}
//                             getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                             onSelect={(opt) => setStaffDept(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                             placeholder="Filter: Department"
//                         />
//                         <div className="filter-actions">
//                             <button className="btn btn-outline" onClick={() => { setStaffCategory(""); setStaffDept(""); }}>
//                                 Clear Filters
//                             </button>
//                             <button className="btn btn-primary" onClick={() => {
//                                 const lower = (searchText || "").toLowerCase();
//                                 const filtered = staffData.filter(s => {
//                                     return (
//                                         (staffCategory ? s.staff_category === staffCategory : true) &&
//                                         (staffDept ? s.staff_dept === staffDept : true) &&
//                                         ((lower === "") ||
//                                             (s.staff_name || "").toLowerCase().includes(lower) ||
//                                             (s.staff_id || "").toLowerCase().includes(lower))
//                                     );
//                                 });
//                                 setFilteredData(filtered);
//                                 setPage(1);
//                             }}>
//                                 Apply
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Content card */}
//             <main className="crm-content">
//                 <section className="card">
//                     <div className="card-header">
//                         <div className="card-title">Staff Directory</div>
//                         <div className="card-sub">Showing <strong>{filteredData.length}</strong> records</div>
//                     </div>

//                     {/* Table wrapper - fixed size, scrollable body */}
//                     <div className="table-frame">
//                         <div className="table-scroll">
//                             <table className="crm-table" role="table" aria-label="Staff table">
//                                 <thead>
//                                     <tr>
//                                         <th style={{ width: 60 }}>S.No</th>
//                                         <th style={{ minWidth: 120 }}>Staff ID</th>
//                                         <th style={{ minWidth: 220 }}>Staff Name</th>
//                                         <th style={{ minWidth: 160 }}>Staff Category</th>
//                                         <th style={{ minWidth: 160 }}>Dept Category</th>
//                                         <th style={{ minWidth: 200 }}>Department</th>
//                                         <th style={{ width: 80 }}>Edit</th>
//                                         <th style={{ width: 90 }}>Delete</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {visibleRows.length ? visibleRows.map((staff, idx) => (
//                                         <tr key={staff.staff_id || idx}>
//                                             <td>{(page - 1) * pageSize + idx + 1}</td>
//                                             <td>{staff.staff_id}</td>
//                                             <td className="name-cell">{staff.staff_name}</td>
//                                             <td>{staff.staff_category}</td>
//                                             <td>{staff.dept_category}</td>
//                                             <td>{staff.staff_dept}</td>
//                                             <td>
//                                                 <button className="icon-btn edit" title="Edit"
//                                                     onClick={() => handleEdit(staff.staff_id, staff.staff_name, staff.staff_pass, staff.staff_dept, staff.staff_category, staff.dept_category)}>
//                                                     <FontAwesomeIcon icon={faEdit} />
//                                                 </button>
//                                             </td>
//                                             <td>
//                                                 <button className="icon-btn del" title="Delete" onClick={() => handleDelete(staff.staff_id, staff.staff_name)}>
//                                                     <FontAwesomeIcon icon={faTrash} />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     )) : (
//                                         <tr>
//                                             <td colSpan="8" className="no-data">No records to display</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Pagination */}
//                     <div className="card-footer">
//                         <div className="pagination">
//                             <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
//                                 <FontAwesomeIcon icon={faChevronLeft} />
//                             </button>
//                             <div className="pg-info">Page <strong>{page}</strong> of <strong>{totalPages}</strong></div>
//                             <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
//                                 <FontAwesomeIcon icon={faChevronRight} />
//                             </button>
//                         </div>
//                         <div className="dense-info">Showing {visibleRows.length} of {filteredData.length} entries</div>
//                     </div>
//                 </section>
//             </main>

//             {/* Add Staff Modal */}
//             {popup && (
//                 <div className="modal-overlay">
//                     <div className="modal modal-lg">
//                         <div className="modal-header">
//                             <h3>New Staff</h3>
//                             <button className="modal-close" onClick={hidepopup}>✕</button>
//                         </div>

//                         <form className="modal-body" onSubmit={savenewstaff}>
//                             <div className="form-grid">
//                                 <label>
//                                     <div className="label">Staff ID</div>
//                                     <input value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
//                                 </label>
//                                 <label>
//                                     <div className="label">Staff Name</div>
//                                     <input value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
//                                 </label>

//                                 <label>
//                                     <div className="label">Staff Category</div>
//                                     <SearchableDropdown
//                                         options={[{ value: "SFM", label: "SFM" }, { value: "SFW", label: "SFW" }, { value: "AIDED", label: "AIDED" }]}
//                                         value={staffCategory}
//                                         getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                                         onSelect={(opt) => setStaffCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                                         placeholder="Select category"
//                                     />
//                                 </label>

//                                 <label>
//                                     <div className="label">Dept Category</div>
//                                     <SearchableDropdown
//                                         options={[{ value: "SFM", label: "SFM" }, { value: "SFW", label: "SFW" }, { value: "AIDED", label: "AIDED" }]}
//                                         value={deptCategory}
//                                         getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                                         onSelect={(opt) => setDeptCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                                         placeholder="Select dept category"
//                                     />
//                                 </label>

//                                 <label>
//                                     <div className="label">Department</div>
//                                     <SearchableDropdown
//                                         options={staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }))}
//                                         value={staffDept}
//                                         getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                                         onSelect={(opt) => setStaffDept(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                                         placeholder="Select department"
//                                     />
//                                 </label>

//                                 <label>
//                                     <div className="label">Password</div>
//                                     <input type="password" value={staffpassword} onChange={(e) => setStaffpassword(e.target.value)} required />
//                                 </label>
//                             </div>

//                             <div className="permissions">
//                                 <div className="perm-title">Permissions</div>
//                                 <div className="perm-grid">
//                                     {Object.keys(checkboxValues).map((key) => (
//                                         <label className="perm-item" key={key}>
//                                             <input type="checkbox" name={key} checked={checkboxValues[key]} onChange={handleCheckboxChange} />
//                                             <span>{key}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="modal-actions">
//                                 <button type="submit" className="btn btn-primary">Save</button>
//                                 <button type="button" className="btn btn-outline" onClick={hidepopup}>Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Staff Modal */}
//             {edit && (
//                 <div className="modal-overlay">
//                     <div className="modal modal-lg">
//                         <div className="modal-header">
//                             <h3>Edit Staff</h3>
//                             <button className="modal-close" onClick={staffEditClose}>✕</button>
//                         </div>

//                         <div className="modal-body">
//                             <div className="form-grid">
//                                 <label>
//                                     <div className="label">Staff ID</div>
//                                     <input value={newstaffid} disabled />
//                                 </label>
//                                 <label>
//                                     <div className="label">Staff Name</div>
//                                     <input value={newstaffname} onChange={(e) => setNewstaffname(e.target.value)} />
//                                 </label>

//                                 <label>
//                                     <div className="label">Staff Category</div>
//                                     <SearchableDropdown
//                                         options={[{ value: "SFM", label: "SFM" }, { value: "SFW", label: "SFW" }, { value: "AIDED", label: "AIDED" }]}
//                                         value={newStaffCategory}
//                                         getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                                         onSelect={(opt) => setNewStaffCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                                         placeholder="Category"
//                                     />
//                                 </label>

//                                 <label>
//                                     <div className="label">Dept Category</div>
//                                     <SearchableDropdown
//                                         options={[{ value: "SFM", label: "SFM" }, { value: "SFW", label: "SFW" }, { value: "AIDED", label: "AIDED" }]}
//                                         value={newDeptCategory}
//                                         getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                                         onSelect={(opt) => setNewDeptCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                                         placeholder="Dept category"
//                                     />
//                                 </label>

//                                 <label>
//                                     <div className="label">Department</div>
//                                     <SearchableDropdown
//                                         options={staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }))}
//                                         value={newdept}
//                                         getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
//                                         onSelect={(opt) => setNewdept(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
//                                         placeholder="Department"
//                                     />
//                                 </label>

//                                 <label>
//                                     <div className="label">Old Password</div>
//                                     <input value={oldpassword} disabled />
//                                 </label>
//                                 <label>
//                                     <div className="label">New Password</div>
//                                     <input value={newpassword} onChange={(e) => setNewpassword(e.target.value)} placeholder="Leave blank to keep old" />
//                                 </label>
//                             </div>

//                             <div className="modal-actions">
//                                 <button className="btn btn-primary" onClick={updatestaff}>Save</button>
//                                 <button className="btn btn-outline" onClick={staffEditClose}>Cancel</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Confirmation Modal */}
//             {deletestaff && (
//                 <div className="modal-overlay">
//                     <div className="modal modal-sm">
//                         <div className="modal-header">
//                             <h3>Confirm Delete</h3>
//                             <button className="modal-close" onClick={staffDeleteClose}>✕</button>
//                         </div>
//                         <div className="modal-body">
//                             <p>Are you sure you want to delete the following staff?</p>
//                             <p className="del-info"><strong>{deletestaffname}</strong> ({deletestaffid})</p>
//                             <div className="modal-actions">
//                                 <button className="btn btn-danger" onClick={Confirmdelete}>Delete</button>
//                                 <button className="btn btn-outline" onClick={staffDeleteClose}>Cancel</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }

// export default StaffMaster;

// StaffMaster.jsx (The main component)
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../../css/StaffMaster.css";

// Import the new components
import StaffHeader from "../../components/StaffMaster/StaffHeader";
import StaffFilters from "../../components/StaffMaster/StaffFilters";
import StaffTable from "../../components/StaffMaster/StaffTable";
import AddStaffModal from "../../components/StaffMaster/AddStaffModal";
import EditStaffModal from "../../components/StaffMaster/EditStaffModal"; // You would create this
import DeleteStaffModal from "../../components/StaffMaster/DeleteStaffModal"; // You would create this
// import SearchableDropdown from "../../common/SearchableDropdown"; // Only needed in sub-components

function StaffMaster() {
    // ... All state and helper functions (useEffect, loadDepartments, savenewstaff, handleSearch, updatestaff, Confirmdelete, etc.) remain here ...

    // --- State and Helpers (The logic center) ---
    const [staffData, setStaffData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    // Modals
    const [popup, setPopup] = useState(false);
    const [edit, setEdit] = useState(false);
    const [deletestaff, setDeletestaff] = useState(false);

    // Add modal fields
    const [staffId, setStaffId] = useState("");
    const [staffName, setStaffName] = useState("");
    const [staffDept, setStaffDept] = useState("");
    const [staffCategory, setStaffCategory] = useState("");
    const [deptCategory, setDeptCategory] = useState("");
    const [staffpassword, setStaffpassword] = useState("");

    // Edit modal fields
    const [newstaffid, setNewstaffid] = useState("");
    const [newstaffname, setNewstaffname] = useState("");
    const [newdept, setNewdept] = useState("");
    const [newStaffCategory, setNewStaffCategory] = useState("");
    const [newDeptCategory, setNewDeptCategory] = useState("");
    const [oldpassword, setOldpassword] = useState("");
    const [newpassword, setNewpassword] = useState("");

    // Delete
    const [deletestaffid, setDeletestaffid] = useState("");
    const [deletestaffname, setDeletestaffname] = useState("");

    // Departments & permissions
    const [staff_Dept, setStaff_Dept] = useState([]);
    const [checkboxValues, setCheckboxValues] = useState({
        dashboard: true, course: true, co: false, so: false,
        po: false, pso: false, wpr: false, obereport: false,
        input: false, manage: false, rsm: true, setting: true
    });

    // toolbar / search / filter
    const [searchText, setSearchText] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Pagination (client-side)
    const [page, setPage] = useState(1);
    const pageSize = 12;

    // --- Data Fetching ---
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const resp = await axios.get(`${apiUrl}/api/staffdetails`);
                if (resp.data) {
                    setStaffData(resp.data);
                    setFilteredData(resp.data);
                }
            } catch (err) {
                console.error("Error fetching staff:", err);
            }
        };
        fetchStaff();
    }, [apiUrl]);

    const loadDepartments = async () => {
        try {
            const resp = await axios.get(`${apiUrl}/api/staffdepartments`);
            if (resp.data) setStaff_Dept(resp.data);
        } catch (err) {
            console.error("Error loading departments:", err);
        }
    };

    // --- Modals Handlers ---
    const showPopup = async () => {
        setPopup(true);
        await loadDepartments();
    };
    const hidepopup = () => {
        setPopup(false);
        resetForm();
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxValues(prev => ({ ...prev, [name]: checked }));
    };
    const resetForm = () => {
        setStaffId(""); setStaffName(""); setStaffDept(""); setStaffCategory("");
        setDeptCategory(""); setStaffpassword("");
        setCheckboxValues({
            dashboard: true, course: true, co: false, so: false,
            po: false, pso: false, wpr: false, obereport: false,
            input: false, manage: false, rsm: true, setting: true
        });
    };
    const staffEditClose = () => setEdit(false);
    const staffDeleteClose = () => setDeletestaff(false);

    // --- CRUD Operations ---
    const savenewstaff = async (e) => {
        e.preventDefault();
        if (!staffId || !staffName || !staffDept || !staffCategory || !staffpassword) {
            window.alert("All fields are required");
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
            const resp = await axios.post(`${apiUrl}/api/newstaff`, newStaffData);
            if (resp.data) {
                const added = resp.data.newStaff || resp.data;
                setStaffData(prev => [...prev, added]);
                setFilteredData(prev => [...prev, added]);
                window.alert("Staff added successfully");
                hidepopup();
            }
        } catch (err) {
            console.error("Error adding staff:", err);
            window.alert("Error adding staff");
        }
    };

    const handleEdit = async (id, name, pass, dept, staff_category, dept_category) => {
        setNewstaffid(id);
        setNewstaffname(name);
        setOldpassword(pass || "");
        setNewdept(dept || "");
        setNewStaffCategory(staff_category || "");
        setNewDeptCategory(dept_category || "");
        setNewpassword("");
        setEdit(true);
        await loadDepartments();
    };

    const updatestaff = async () => {
        try {
            const resp = await axios.put(`${apiUrl}/api/staffupdate`, {
                newstaffid, newstaffname, newpassword, newdept, newStaffCategory, newDeptCategory, oldpassword
            });
            if (resp.data) {
                const updatedStaff = resp.data.updatedStaff || resp.data;
                const updatedList = staffData.map(s => s.staff_id === updatedStaff.staff_id ? updatedStaff : s);
                setStaffData(updatedList);
                setFilteredData(updatedList);
                window.alert("Staff updated successfully");
            }
            staffEditClose();
        } catch (err) {
            console.error("Error updating staff:", err);
            window.alert("Error updating staff");
        }
    };

    const handleDelete = (dstaffid, dstaffname) => {
        setDeletestaffid(dstaffid);
        setDeletestaffname(dstaffname);
        setDeletestaff(true);
    };

    const Confirmdelete = async () => {
        try {
            const resp = await axios.post(`${apiUrl}/api/staffdelete`, { deletestaffid });
            if (resp.data) {
                setStaffData(prev => prev.filter(s => s.staff_id !== deletestaffid));
                setFilteredData(prev => prev.filter(s => s.staff_id !== deletestaffid));
                window.alert("Staff deleted successfully");
                staffDeleteClose();
            }
        } catch (err) {
            console.error("Error deleting staff:", err);
            window.alert("Error deleting staff");
        }
    };

    // --- Search, Filter, Pagination Logic ---
    const handleSearch = (text) => {
        setSearchText(text);
        const lower = text.trim().toLowerCase();
        const filtered = staffData.filter((staff) =>
            (staff.staff_id || "").toLowerCase().includes(lower) ||
            (staff.staff_name || "").toLowerCase().includes(lower) ||
            (staff.staff_dept || "").toLowerCase().includes(lower) ||
            (staff.staff_category || "").toLowerCase().includes(lower) ||
            (staff.dept_category || "").toLowerCase().includes(lower)
        );
        setFilteredData(filtered);
        setPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const visibleRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page]);


    // --- Render Components ---
    return (
        <div className="staff-management-shell">
            <StaffHeader
                searchText={searchText}
                handleSearch={handleSearch}
                showPopup={showPopup}
                setShowFilters={setShowFilters}
            />

            <StaffFilters
                showFilters={showFilters}
                staffCategory={staffCategory}
                setStaffCategory={setStaffCategory}
                staffDept={staffDept}
                setStaffDept={setStaffDept}
                staff_Dept={staff_Dept}
                searchText={searchText}
                staffData={staffData}
                setFilteredData={setFilteredData}
                setPage={setPage}
            />

            <StaffTable
                visibleRows={visibleRows}
                filteredData={filteredData}
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                setPage={setPage}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            <AddStaffModal
                popup={popup}
                hidepopup={hidepopup}
                staffId={staffId} setStaffId={setStaffId}
                staffName={staffName} setStaffName={setStaffName}
                staffDept={staffDept} setStaffDept={setStaffDept}
                staffCategory={staffCategory} setStaffCategory={setStaffCategory}
                deptCategory={deptCategory} setDeptCategory={setDeptCategory}
                staffpassword={staffpassword} setStaffpassword={setStaffpassword}
                savenewstaff={savenewstaff}
                staff_Dept={staff_Dept}
                checkboxValues={checkboxValues}
                handleCheckboxChange={handleCheckboxChange}
            />

            {/* Note: You would also include EditStaffModal and DeleteStaffModal here, passing their respective props */}

            {edit && ( /* Placeholder for EditStaffModal, replace with actual component */
                <EditStaffModal
                    edit={edit}
                    staffEditClose={staffEditClose}
                    newstaffid={newstaffid}
                    newstaffname={newstaffname} setNewstaffname={setNewstaffname}
                    newStaffCategory={newStaffCategory} setNewStaffCategory={setNewStaffCategory}
                    newDeptCategory={newDeptCategory} setNewDeptCategory={setNewDeptCategory}
                    newdept={newdept} setNewdept={setNewdept}
                    oldpassword={oldpassword}
                    newpassword={newpassword} setNewpassword={setNewpassword}
                    updatestaff={updatestaff}
                    staff_Dept={staff_Dept}
                />
            )}

            {deletestaff && ( /* Placeholder for DeleteStaffModal, replace with actual component */
                <DeleteStaffModal
                    deletestaff={deletestaff}
                    staffDeleteClose={staffDeleteClose}
                    deletestaffname={deletestaffname}
                    deletestaffid={deletestaffid}
                    Confirmdelete={Confirmdelete}
                />
            )}
        </div>
    );
}

export default StaffMaster;