import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/TutorManage.css';
import Loading from '../../assets/load.svg'
import TutorTable from "../../components/TutorManage/TutorTable";
import EditTutorModal from "../../components/TutorManage/EditTutorModal";
import DeleteTutorModal from "../../components/TutorManage/DeleteTutorModal";
import TutorFilters from "../../components/TutorManage/TutorFilters";
import TutorHeader from "../../components/TutorManage/TutorHeader";
import AddTutorModal from "../../components/TutorManage/AddTutorModal";

function StaffTutorManage() {

    // --- API CONFIG ---
    const API_URL = "http://localhost:5000/api/mentor";
    const apiUrl = import.meta.env.VITE_API_URL;

    // --- MAIN DATA STATE ---
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [deptDetails, setDeptDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [staffData, setStaffData] = useState([]);

    // --- UI/MODAL STATE ---
    const [editingStaff, setEditingStaff] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteStaff, setDeleteStaff] = useState(null);
    const [addtutur, setAddtutur] = useState(false);

    // --- ADD TUTOR FORM STATE ---
    const [newTuturId, setNewTuturId] = useState("");
    const [newtuturName, setNewtuturName] = useState("");
    const [tuturgraduate, setTuturGraduate] = useState("");
    const [tuturCategory, setTuturCategory] = useState("");
    const [tuturdeptName, setTuturdeptName] = useState("");
    const [tuturDeptId, setTuturDeptId] = useState("");
    const [tuturBatch, setTuturBatch] = useState("");
    const [tuturDegree, setTuturDegree] = useState("");
    const [tuturSection, setTuturSection] = useState("");

    // --- FILTER & SEARCH STATE ---
    const [searchText, setSearchText] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterDeptId, setFilterDeptId] = useState("");
    const [filterSection, setFilterSection] = useState("");

    // --- PAGINATION STATE ---
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(filteredData.length / pageSize);

    const fetchData = async () => {

        try {
            const response = await axios.get(API_URL);
            const rawDeptDetails = response.data.deptDetails;
            const uniqueDeptMap = new Map();
            rawDeptDetails.forEach(dept => {
                if (dept.dept_id) { uniqueDeptMap.set(dept.dept_id, dept) }
            });
            const uniqueDeptDetails = Array.from(uniqueDeptMap.values());
            setData(response.data.mentorData);
            setStaffData(response.data.staff_data);
            setFilteredData(response.data.mentorData);
            setDeptDetails(uniqueDeptDetails);
        } catch (err) {
            console.error("Data Fetching Error:", err);
            setError(err.message || "Failed to fetch data from the server.");
        }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, []);

    // 2. SEARCH & FILTER EFFECT
    useEffect(() => {
        let currentData = data;
        if (searchText) {
            const lowerSearchText = searchText.toLowerCase();
            currentData = currentData.filter((row) =>
                (row.staff_id?.toLowerCase() || "").includes(lowerSearchText) ||
                (row.staff_name?.toLowerCase() || "").includes(lowerSearchText) ||
                (row.category?.toLowerCase() || "").includes(lowerSearchText) ||
                (row.dept_name?.toLowerCase() || "").includes(lowerSearchText)
            )
        }
        if (filterCategory) { currentData = currentData.filter(row => row.category === filterCategory) }
        if (filterDeptId) { currentData = currentData.filter(row => row.dept_id === filterDeptId) }
        if (filterSection) { currentData = currentData.filter(row => row.section === filterSection) }
        setFilteredData(currentData);
    }, [data, searchText, filterCategory, filterDeptId, filterSection]);

    // 3. PAGINATION EFFECT
    useEffect(() => { setPage(1) }, [filteredData.length]);

    // UTILITY FUNCTIONS
    const getUniqueValues = (key) => { return [...new Set(data.map((item) => item[key]).filter(Boolean))] }

    const getUniqueStaffsForDropdown = () => {
        const currentMentorIds = new Set(staffData.map(m => m.staff_id));
        return staffData
            .map(staff => ({
                value: staff.staff_id,
                label: `${staff.staff_id} - ${staff.staff_name}`
            }));
    }

    const departmentOptions = deptDetails.map(d => ({
        value: d.dept_id,
        label: `${d.dept_id} - ${d.dept_name}`
    }));

    // HANDLERS
    const handleHeaderSearch = (text) => {
        setSearchText(text);
    };

    const clearAllFilters = () => {
        setFilterCategory("");
        setFilterDeptId("");
        setFilterSection("");
    }

    const handleDelete = (row) => { setDeleteStaff(row); };
    const cancelDelete = () => setDeleteStaff(null);
    const handleEditClick = (row) => {
        setEditingStaff(row);
        setEditForm({ ...row });
    };
    const closeEditTutorModal = () => setEditingStaff(null);
    const handleaddtutur = () => { setAddtutur(true); };
    const tututaddClose = () => { setAddtutur(false); };

    // CRUD - Add New Mentor
    const handleNewMentor = async () => {

        if (!newTuturId || !newtuturName || !tuturCategory || !tuturDeptId) {
            alert("Please select a Staff ID and ensure all main fields are filled.");
            return;
        }

        const newMentor = {
            staff_id: newTuturId,
            staff_name: newtuturName,
            graduate: tuturgraduate,
            category: tuturCategory,
            dept_name: tuturdeptName,
            dept_id: tuturDeptId,
            batch: tuturBatch,
            degree: tuturDegree,
            section: tuturSection,
        }

        try {
            const response = await axios.post(`${apiUrl}/api/newtutoradded`, newMentor);
            if (response.status === 201) {
                const newData = [...data, response.data.mentor];
                setData(newData);
                setFilteredData(newData);
                setAddtutur(false);
                alert("Mentor has been added successfully.");
                setNewTuturId(""); setNewtuturName(""); setTuturGraduate(""); setTuturCategory("");
                setTuturdeptName(""); setTuturDeptId(""); setTuturBatch(""); setTuturDegree(""); setTuturSection("");
            }
        } catch (error) {
            console.error("Failed to add new mentor : ", error);
            const errorMessage = error.response?.data?.message || "Please check server response.";
            alert(`Failed to add new mentor: ${errorMessage}`);
        }
    }

    // CRUD - Edit Mentor
    const handleEditSave = async () => {
        try {
            await axios.put(`${API_URL}/${editForm.staff_id}`, editForm);
            await fetchData();
            setEditingStaff(null);
            alert("Mentor has been modified successfully");
        } catch (error) {
            console.error("Failed to update mentor : ", error);
            alert("Failed to update the record.");
        }
    }

    // CRUD - Delete Mentor
    const confirmDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/mentor/${id}`);
            const updatedData = data.filter((row) => row.staff_id !== id);
            setData(updatedData);
            setFilteredData(updatedData);
            setDeleteStaff(null);
            alert("Mentor has been deleted successfully.");
        } catch (err) {
            console.error("Failed to delete mentor : ", err);
            alert("Failed to delete the record. Please check console for details.");
        }
    }

    if (loading) return <div><center><img src={Loading} alt="Loading spinner" className="img" /></center></div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="staff-management-shell">

            {/* Tutor Header Component */}
            <TutorHeader
                searchText={searchText}
                handleSearch={handleHeaderSearch}
                showPopup={handleaddtutur}
                setShowFilters={setShowFilters}
            />

            {/* Tutor Filters Component */}
            <TutorFilters
                showFilters={showFilters}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterDeptId={filterDeptId}
                setFilterDeptId={setFilterDeptId}
                filterSection={filterSection}
                setFilterSection={setFilterSection}
                departmentOptions={departmentOptions}
                getUniqueValues={getUniqueValues}
                clearAllFilters={clearAllFilters}
            />

            {/* Tutor Table Component */}
            <TutorTable
                filteredData={filteredData}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
            />

            {/* Add Tutor Modal */}
            <AddTutorModal
                addTutur={addtutur}
                tututaddClose={tututaddClose}
                getUniqueStaffsForDropdown={getUniqueStaffsForDropdown}
                newTuturId={newTuturId}
                setNewTuturId={setNewTuturId}
                newtuturName={newtuturName}
                setNewtuturName={setNewtuturName}
                data={data}
                staffData={staffData}
                getUniqueValues={getUniqueValues}
                tuturCategory={tuturCategory}
                setTuturCategory={setTuturCategory}
                tuturDegree={tuturDegree}
                setTuturDegree={setTuturDegree}
                tuturgraduate={tuturgraduate}
                setTuturGraduate={setTuturGraduate}
                tuturSection={tuturSection}
                setTuturSection={setTuturSection}
                tuturDeptId={tuturDeptId}
                setTuturDeptId={setTuturDeptId}
                tuturdeptName={tuturdeptName}
                setTuturdeptName={setTuturdeptName}
                tuturBatch={tuturBatch}
                setTuturBatch={setTuturBatch}
                handleNewMentor={handleNewMentor}
            />

            {/* Edit Tutor Modal */}
            <EditTutorModal
                editingStaff={editingStaff}
                closeEditTutorModal={closeEditTutorModal}
                handleEditSave={handleEditSave}
                editForm={editForm}
                setEditForm={setEditForm}
                getUniqueStaffsForDropdown={getUniqueStaffsForDropdown}
                getUniqueValues={getUniqueValues}
                data={data}
                staffData={staffData}
            />

            {/* Delete Tutor Modal */}
            <DeleteTutorModal
                deleteStaff={deleteStaff}
                cancelDelete={cancelDelete}
                handleConfirmDelete={confirmDelete}
            />
        </div>
    )
}

export default StaffTutorManage;