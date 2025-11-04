import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../../css/StaffMaster.css";
import StaffHeader from "../../components/StaffMaster/StaffHeader";
import StaffFilters from "../../components/StaffMaster/StaffFilters";
import StaffTable from "../../components/StaffMaster/StaffTable";
import AddStaffModal from "../../components/StaffMaster/AddStaffModal";
import EditStaffModal from "../../components/StaffMaster/EditStaffModal";
import DeleteStaffModal from "../../components/StaffMaster/DeleteStaffModal";

function StaffMaster() {

    const [staffData, setStaffData] = useState([]);
    const [filterDeptCategory, setFilterDeptCategory] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    // Modals Popup
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

    const [appliedStaffCategory, setAppliedStaffCategory] = useState("");
    const [appliedStaffDept, setAppliedStaffDept] = useState("");
    const [appliedFilterDeptCategory, setAppliedFilterDeptCategory] = useState("");

    // toolbar / search / filter
    const [searchText, setSearchText] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Pagination (client-side)
    const [page, setPage] = useState(1);
    const pageSize = 12;

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

    // --- Data Fetching ---
    useEffect(() => {

        fetchStaff();
        loadDepartments();
    }, [apiUrl]);

    // --- Filtering Logic ---
    useEffect(() => {
        const filtered = performFiltering(
            staffData, searchText,
            staffCategory, staffDept,
            filterDeptCategory
        );
        setFilteredData(filtered);
    }, [staffData, searchText, staffCategory, staffDept, filterDeptCategory]);

    const loadDepartments = async () => {
        try {
            const resp = await axios.get(`${apiUrl}/api/staffdepartments`);
            if (resp.data) setStaff_Dept(resp.data);
        } catch (err) {
            console.error("Error loading departments:", err);
        }
    };

    const showPopup = async () => {
        setPopup(true);
        await loadDepartments();
    }

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

    const savenewstaff = async (e) => {

        e.preventDefault();
        if (!staffId || !staffName || !staffDept || !staffCategory || !staffpassword) {
            window.alert("All fields are required");
            return;
        }

        const newStaffData = {
            staff_id: staffId, staff_name: staffName,
            staff_dept: staffDept, staff_category: staffCategory,
            dept_category: deptCategory, password: staffpassword,
            permissions: checkboxValues
        }

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
            console.error("Error adding staff : ", err);
            window.alert("Error adding staff");
        }
    }

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
            console.error("Error updating staff : ", err);
            window.alert("Error updating staff");
        }
    };

    const handleDelete = (dstaffid, dstaffname) => {
        setDeletestaffid(dstaffid);
        setDeletestaffname(dstaffname);
        setDeletestaff(true);
    };

    const confirmDelete = async () => {
        try {
            const resp = await axios.post(`${apiUrl}/api/staffdelete`, { deletestaffid });
            if (resp.data) {
                setStaffData(prev => prev.filter(s => s.staff_id !== deletestaffid));
                setFilteredData(prev => prev.filter(s => s.staff_id !== deletestaffid));
                window.alert("Staff deleted successfully");
                staffDeleteClose();
            }
        } catch (err) {
            console.error("Error deleting staff : ", err);
            window.alert("Error deleting staff");
        }
    };

    // --- Search, Filter, Pagination Logic ---
    const handleSearch = (text) => {
        setSearchText(text);
        const lower = (text || "").toLowerCase();
        const filtered = staffData.filter(s => {
            return (
                (appliedStaffCategory ? s.staff_category === appliedStaffCategory : true) &&
                (appliedStaffDept ? s.staff_dept === appliedStaffDept : true) &&
                (appliedFilterDeptCategory ? s.dept_category === appliedFilterDeptCategory : true) &&
                ((lower === "") ||
                    (s.staff_name || "").toLowerCase().includes(lower) ||
                    (s.staff_id || "").toLowerCase().includes(lower))
            )
        })
        setFilteredData(filtered);
        setPage(1);
    }

    const performFiltering = (data, search, category, dept, deptCategory) => {
        const lower = (search || "").toLowerCase();
        return data.filter(s => {
            return (
                (category ? s.staff_category === category : true) &&
                (dept ? s.staff_dept === dept : true) &&
                (deptCategory ? s.dept_category === deptCategory : true) &&
                ((lower === "") ||
                    (s.staff_name || "").toLowerCase().includes(lower) ||
                    (s.staff_id || "").toLowerCase().includes(lower))
            )
        })
    }

    const applyAllFilters = (currentSearchText, currentStaffData) => {
        const lower = (currentSearchText || "").toLowerCase();
        const filtered = currentStaffData.filter(s => {
            return (
                (staffCategory ? s.staff_category === staffCategory : true) &&
                (staffDept ? s.staff_dept === staffDept : true) &&
                (filterDeptCategory ? s.dept_category === filterDeptCategory : true) &&
                ((lower === "") ||
                    (s.staff_name || "").toLowerCase().includes(lower) ||
                    (s.staff_id || "").toLowerCase().includes(lower))
            )
        })
        setFilteredData(filtered);
        setPage(1);
    }

    const applyFinalFilters = () => {
        const lower = (searchText || "").toLowerCase();
        const filtered = staffData.filter(s => {
            return (
                (appliedStaffCategory ? s.staff_category === appliedStaffCategory : true) &&
                (appliedStaffDept ? s.staff_dept === appliedStaffDept : true) &&
                (appliedFilterDeptCategory ? s.dept_category === appliedFilterDeptCategory : true) &&
                ((lower === "") ||
                    (s.staff_name || "").toLowerCase().includes(lower) ||
                    (s.staff_id || "").toLowerCase().includes(lower))
            )
        })
        setFilteredData(filtered);
        setPage(1);
    }

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const visibleRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page]);

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
                filterDeptCategory={filterDeptCategory}
                setFilterDeptCategory={setFilterDeptCategory}
                staff_Dept={staff_Dept}
                searchText={searchText}
                staffData={staffData}
                setFilteredData={setFilteredData}
                setPage={setPage}
                setAppliedStaffCategory={setAppliedStaffCategory}
                setAppliedStaffDept={setAppliedStaffDept}
                setAppliedFilterDeptCategory={setAppliedFilterDeptCategory}
                handleApplyFilters={applyFinalFilters}
                applyFiltersFunction={() => applyAllFilters(searchText, staffData)}
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

            {edit && (
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

            {deletestaff && (
                <DeleteStaffModal
                    deletestaff={deletestaff}
                    staffDeleteClose={staffDeleteClose}
                    deletestaffname={deletestaffname}
                    deletestaffid={deletestaffid}
                    confirmDelete={confirmDelete}
                />
            )}
        </div>
    )
}

export default StaffMaster;