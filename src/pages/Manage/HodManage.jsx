import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../css/HodManage.css';
import Loading from '../../assets/load.svg';
import HodTable from "../../components/HodManage/HodTable";
import HodHeader from "../../components/HodManage/HodHeader";
import HodFilters from "../../components/HodManage/HodFilters";
import AddHodModal from "../../components/HodManage/AddHodModal";
import EditHodModal from "../../components/HodManage/EditHodModal";
import DeleteHodModal from "../../components/HodManage/DeleteHodModal";

function StaffHodManage() {

	const API_URL = "http://localhost:5000/api/hod";
	const apiUrl = import.meta.env.VITE_API_URL;

	// States
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [filterCategory, setFilterCategory] = useState("");
	const [filterGraduate, setFilterGraduate] = useState("");
	const [filterDeptId, setFilterDeptId] = useState("");

	// Pagination States
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const totalPages = useMemo(() => Math.ceil(filteredData.length / pageSize), [filteredData.length, pageSize]);

	const [editingHod, setEditingHod] = useState(null);
	const [editForm, setEditForm] = useState({});
	const [originalStaffId, setOriginalStaffId] = useState(null);

	const [deleteHod, setDeleteHod] = useState(null);

	const [addHodModal, setAddHodModal] = useState(false);
	const [newStaffId, setNewStaffId] = useState("");
	const [newHodName, setNewHodName] = useState("");
	const [newGraduate, setNewGraduate] = useState("");
	const [newCategory, setNewCategory] = useState("");
	const [newDeptName, setNewDeptName] = useState("");
	const [newDeptId, setNewDeptId] = useState("");

	const [staff, setStaff] = useState([]);
	const [depts, setDepts] = useState([]);

	// Reset page to 1 whenever filteredData changes (e.g., after search/add/edit/delete)
	useEffect(() => {
		applyAllFilters(searchText, filterCategory, filterGraduate, filterDeptId);
		setPage(1);
	}, [data, searchText, filterCategory, filterGraduate, filterDeptId]);

	// Fetch HODs
	useEffect(() => {
		const fetchHods = async () => {
			try {
				const response = await axios.get(API_URL);
				const hods = Array.isArray(response.data) ? response.data : response.data?.hods || [];
				const order = ["AIDED", "SFM", "SFW"];
				const sortedData = hods
					.filter(item => item && item.category)
					.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
				setData(sortedData);
				setFilteredData(sortedData);
			} catch (err) {
				console.error("Error fetching HODs : ", err);
				setError(err.message);
			} finally { setLoading(false) }
		}
		fetchHods();
	}, [API_URL]);

	// Fetch dropdown values for staff and departments
	useEffect(() => {
		const fetchHodDropDownValues = async () => {
			try {
				const response = await axios.get(`${apiUrl}/api/hodDropDownValues`);
				setStaff(response.data.uniqueStaffs);
				setDepts(response.data.uniqueDepts);
			} catch (err) { console.error("Error fetching dropdown values : ", err) }
		}
		fetchHodDropDownValues();
	}, [apiUrl]);

	// Centralized Filter/Search Logic
	const applyAllFilters = (
		search = searchText,
		category = filterCategory,
		graduate = filterGraduate,
		deptId = filterDeptId
	) => {
		const lowerSearch = search.toLowerCase();

		let workingData = data;

		// 1. Apply Text Search
		if (lowerSearch) {
			workingData = workingData.filter(
				row =>
					row.staff_id?.toLowerCase().includes(lowerSearch) ||
					row.hod_name?.toLowerCase().includes(lowerSearch) ||
					row.category?.toLowerCase().includes(lowerSearch) ||
					row.dept_id?.toLowerCase().includes(lowerSearch) ||
					row.dept_name?.toLowerCase().includes(lowerSearch)
			);
		}

		// 2. Apply Category Filter (AIDED/SFM/SFW)
		if (category) {
			workingData = workingData.filter(row => row.category === category);
		}

		// 3. Apply Graduate Filter (UG/PG)
		if (graduate) {
			workingData = workingData.filter(row => row.graduate === graduate);
		}

		// 4. Apply Department ID Filter
		if (deptId) {
			workingData = workingData.filter(row => row.dept_id === deptId);
		}

		setFilteredData(workingData);
	};

	// Handle search
	const handleSearch = (text) => {
		const searchText = text.toLowerCase();
		setSearchText(text);
		applyAllFilters(searchText, filterCategory, filterGraduate, filterDeptId);
	}

	// Unified Filter Change Handler
	const handleFilterChange = ({ category, graduate, deptId }) => {
		const newCategory = category !== undefined ? category : filterCategory;
		const newGraduate = graduate !== undefined ? graduate : filterGraduate;
		const newDeptId = deptId !== undefined ? deptId : filterDeptId;

		setFilterCategory(newCategory);
		setFilterGraduate(newGraduate);
		setFilterDeptId(newDeptId);

		applyAllFilters(searchText, newCategory, newGraduate, newDeptId);
	};

	const clearAllFilters = () => {
		handleFilterChange({
			category: "",
			graduate: "",
			deptId: ""
		});
	};

	// Modal Handlers
	const resetAddHodForm = () => { setNewStaffId(""); setNewHodName(""); setNewGraduate(""); setNewCategory(""); setNewDeptName(""); setNewDeptId(""); }
	const openAddHodModal = () => { setAddHodModal(true); resetAddHodForm(); }
	const closeAddHodModal = () => { setAddHodModal(false); resetAddHodForm(); }
	const openEditHodModal = (row) => { setEditingHod(row); setEditForm({ ...row }); setOriginalStaffId(row.staff_id); }
	const closeEditHodModal = () => { setEditingHod(null); setEditForm({}); setOriginalStaffId(null); }
	const openDeleteHodModal = (row) => { setDeleteHod(row); }
	const cancelDelete = () => { setDeleteHod(null) }

	// Add Hod
	const handleSaveNewHod = async () => {
		try {
			const newHodAdded = await axios.post(`${apiUrl}/api/newhodadded`, {
				staff_id: newStaffId,
				hod_name: newHodName,
				graduate: newGraduate,
				category: newCategory,
				dept_name: newDeptName,
				dept_id: newDeptId,
			});

			if (newHodAdded.data && newHodAdded.data.newHod) {
				alert('Hod has been added successfully');
				const newHod = newHodAdded.data.newHod;
				// Re-sort data after adding the new HOD
				const order = ["AIDED", "SFM", "SFW"];
				const updatedData = [...data, newHod]
					.filter(item => item && item.category)
					.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));

				setData(updatedData);
				closeAddHodModal();
				// setFilteredData will be updated by the useEffect hook watching `data`
			} else {
				alert("Error: New HOD data missing from response.");
				closeAddHodModal();
			}

		} catch (err) {
			console.error("Error adding HOD:", err);
			alert("Error: Something went wrong while adding the new HOD");
			closeAddHodModal();
		}
	}

	// Edit HOD
	const handleSaveEditedHod = async () => {
		try {
			await axios.put(`${API_URL}/${originalStaffId}`, editForm); // Use originalStaffId for PUT endpoint

			const updatedData = data.map(row =>
				// Compare by the *original* staff ID and update with the *new* form data
				row.staff_id === originalStaffId ? { ...row, ...editForm } : row
			);

			setData(updatedData);
			alert("HOD has been modified successfully.");
			closeEditHodModal();
			// setFilteredData will be updated by the useEffect hook watching `data`

		} catch (err) {
			console.error("Error editing HOD:", err);
			alert("Failed to update the record. Please try again.")
		}
	}

	// Delete HOD
	const handleConfirmDelete = async (hod) => {
		try {
			// The delete endpoint uses staff_id from the hod object.
			await axios.delete(`${API_URL}/${hod.staff_id}`, {
				data: {
					staff_id: hod.staff_id,
					dept_id: hod.dept_id,
					graduate: hod.graduate,
					category: hod.category,
				}
			});

			const updatedData = data.filter(row => !(
				row.staff_id === hod.staff_id &&
				row.dept_id === hod.dept_id &&
				row.category === hod.category &&
				row.graduate === hod.graduate
			));

			setData(updatedData);
			alert("Hod has been deleted successfully.");
			cancelDelete();
			// setFilteredData will be updated by the useEffect hook watching `data`

		} catch (err) {
			console.error("Error deleting HOD:", err);
			alert("Failed to delete the record. Please try again.")
		}
	}

	if (loading) return (<div> <center> <img src={Loading} alt="Loading spinner" className="img" /> </center> </div>)
	if (error) return <div>Error : {error}</div>;

	return (
		<div className="staff-management-shell">
			<HodHeader
				searchText={searchText}
				handleSearch={handleSearch}
				showPopup={openAddHodModal}
				setShowFilters={setShowFilters}
			/>

			<HodFilters
				showFilters={showFilters}
				filterCategory={filterCategory}
				setFilterCategory={(val) => handleFilterChange({ category: val })}
				filterDeptId={filterDeptId}
				setFilterDeptId={(val) => handleFilterChange({ deptId: val })}
				filterGraduate={filterGraduate}
				setFilterGraduate={(val) => handleFilterChange({ graduate: val })}
				depts={depts}
				clearAllFilters={clearAllFilters}
			/>

			<HodTable
				filteredData={filteredData}
				page={page}
				pageSize={pageSize}
				totalPages={totalPages}
				setPage={setPage}
				openEditHodModal={openEditHodModal}
				openDeleteHodModal={openDeleteHodModal}
			/>
			<AddHodModal
				popup={addHodModal}
				closeAddHodModal={closeAddHodModal}
				staff={staff}
				depts={depts}
				newStaffId={newStaffId}
				setNewStaffId={setNewStaffId}
				newHodName={newHodName}
				setNewHodName={setNewHodName}
				newGraduate={newGraduate}
				setNewGraduate={setNewGraduate}
				newCategory={newCategory}
				setNewCategory={setNewCategory}
				newDeptId={newDeptId}
				setNewDeptId={setNewDeptId}
				newDeptName={newDeptName}
				setNewDeptName={setNewDeptName}
				handleSaveNewHod={handleSaveNewHod}
			/>

			<EditHodModal
				editingHod={editingHod}
				closeEditHodModal={closeEditHodModal}
				handleSaveEditedHod={handleSaveEditedHod}
				editForm={editForm}
				setEditForm={setEditForm}
				staff={staff}
				depts={depts}
			/>

			<DeleteHodModal
				deleteHod={deleteHod}
				cancelDelete={cancelDelete}
				handleConfirmDelete={handleConfirmDelete}
			/>

		</div>
	)
}

export default StaffHodManage;