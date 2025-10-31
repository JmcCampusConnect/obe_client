import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './staffhod.css';
import Loading from '../../../../assets/load.svg';
import SearchableDropdown from "../../../../common/SearchableDropdown";

function StaffHodManage() {

	const API_URL = "http://localhost:5000/api/hod";
	const apiUrl = import.meta.env.VITE_API_URL;

	// States
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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

	// Handle search
	const handleSearch = (e) => {
		const searchText = e.target.value.toLowerCase();
		const filtered = data.filter(
			row =>
				row.staff_id?.toLowerCase().includes(searchText) ||
				row.hod_name?.toLowerCase().includes(searchText) ||
				row.category?.toLowerCase().includes(searchText) ||
				row.dept_id?.toLowerCase().includes(searchText) ||
				row.dept_name?.toLowerCase().includes(searchText)
		);
		setFilteredData(filtered);
	}

	// Open Add HOD modal
	const openAddHodModal = () => {
		setAddHodModal(true);
		resetAddHodForm();
	}

	// Close Add HOD modal
	const closeAddHodModal = () => {
		setAddHodModal(false);
		resetAddHodForm();
	}

	// Reset Add HOD form
	const resetAddHodForm = () => {
		setNewStaffId("");
		setNewHodName("");
		setNewGraduate("");
		setNewCategory("");
		setNewDeptName("");
		setNewDeptId("");
	}

	// Open Edit HOD modal
	const openEditHodModal = (row) => {
		setEditingHod(row);
		setEditForm({ ...row });
		setOriginalStaffId(row.staff_id);
	}

	// Close Edit HOD modal
	const closeEditHodModal = () => {
		setEditingHod(null);
		setEditForm({});
		setOriginalStaffId(null);
	}

	// Open Delete HOD modal
	const openDeleteHodModal = (row) => {
		setDeleteHod(row);
	}

	// Cancel Delete
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

			if (newHodAdded.data) {
				alert('Hod has been added successfully');
				setData(prev => [...prev, newHodAdded.data.newHod]);
				setFilteredData(prev => [...prev, newHodAdded.data.newHod]);
				closeAddHodModal();
			}

		} catch {
			alert("Error: Something went wrong while adding the new HOD");
			closeAddHodModal();
		}
	}

	// Edit HOD
	const handleSaveEditedHod = async () => {

		try {

			await axios.put(`${API_URL}/${editForm.staff_id}`, editForm);
			const updatedData = data.map(row =>
				row.staff_id === originalStaffId ? editForm : row
			);

			setData(updatedData);
			setFilteredData(updatedData);
			alert("HOD has been modified successfully.");
			closeEditHodModal();

		} catch { alert("Failed to update the record. Please try again.") }
	}

	// Delete HOD
	const handleConfirmDelete = async (hod) => {

		try {

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
			setFilteredData(updatedData);
			alert("Hod has been deleted successfully.");
			cancelDelete();

		} catch { alert("Failed to delete the record. Please try again.") }
	}

	if (loading) return (<div> <center> <img src={Loading} alt="Loading" className="img" /> </center> </div>)
	if (error) return <div>Error : {error}</div>;

	return (
		<div className="smsh-main">
			<span className="smsh-top-heading">HOD DETAILS</span>

			<div className="smsh-input-btn">
				<input
					className="smsh-search"
					type="text"
					placeholder="Search ..."
					onChange={handleSearch}
				/>
				<button className="smsm-save-btn" onClick={openAddHodModal}>
					<FontAwesomeIcon icon={faPlus} className="smsm-icon" />
					<span>Add</span>
				</button>
			</div>

			{/* HOD Table */}
			<table className="smsh-table">
				<thead>
					<tr>
						<th>S No</th>
						<th>Category</th>
						<th>Dept Id</th>
						<th>Staff ID</th>
						<th>HOD / MID Name</th>
						<th>Department Name</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{filteredData.length > 0 ? (
						filteredData.map((row, index) => (
							<tr key={index} className={index % 2 === 0 ? 'smsh-repo-light' : 'smsh-repo-dark'}>
								<td>{index + 1}</td>
								<td>{row?.category || "-"}</td>
								<td>{row?.dept_id || "-"}</td>
								<td>{row?.staff_id || "-"}</td>
								<td>{row?.hod_name || "-"}</td>
								<td>{row?.dept_name || "-"}</td>
								<td className='staff-repo-action'>
									<button className="smsh-edit-btn" onClick={() => openEditHodModal(row)}>
										<FontAwesomeIcon icon={faEdit} />
										<span>Edit</span>
									</button>
								</td>
								<td className='staff-repo-action'>
									<button className="smsh-delete-btn" onClick={() => openDeleteHodModal(row)}>
										<FontAwesomeIcon icon={faTrash} />
										<span>Delete</span>
									</button>
								</td>
							</tr>
						))
					) : (
						<tr><td colSpan="8">No Data Available.</td></tr>
					)}
				</tbody>
			</table>

			{/* Add HOD Modal */}
			{addHodModal && (
				<div className="smsh-overlay">
					<div className="smsh-edit">
						<div className="smsh-close-class">
							<span onClick={closeAddHodModal} className="smsh-close">✖</span>
						</div>
						<h3>ADD HOD</h3>

						{/* STAFF ID */}
						<SearchableDropdown
							options={staff}
							value={newStaffId}
							getOptionLabel={(s) => typeof s === "string" ? s : `${s.staff_id} - ${s.staff_name}`}
							onSelect={(s) => {
								if (typeof s === "string") {
									setNewStaffId(s); setNewHodName("");
								} else if (s) {
									setNewStaffId(s.staff_id); setNewHodName(s.staff_name);
								} else {
									setNewStaffId(""); setNewHodName("");
								}
							}}
							placeholder="STAFF ID"
						/>

						{/* HOD Name */}
						<div className="smsh-form">
							<input type="text" className="smsh-edit-inputbox" value={newHodName} placeholder="STAFF NAME" readOnly />
						</div>

						{/* Graduate & Dept ID */}
						<div className="smsh-edit-psw">
							<SearchableDropdown
								options={[{ value: "UG", label: "UG" }, { value: "PG", label: "PG" }]}
								value={newGraduate}
								getOptionLabel={(g) => typeof g === "string" ? g : g.label}
								onSelect={(g) => setNewGraduate(typeof g === "string" ? g : g?.value || "")}
								placeholder="GRADUATE"
							/>
							<div className="smsh-edit-psw">
								<SearchableDropdown
									options={[{ value: "AIDED", label: "AIDED" }, { value: "SFM", label: "SFM" }, { value: "SFW", label: "SFW" }]}
									value={newCategory}
									getOptionLabel={(c) => typeof c === "string" ? c : c.label}
									onSelect={(c) => setNewCategory(typeof c === "string" ? c : c?.value || "")}
									placeholder="CATEGORY"
								/>
							</div>
						</div>

						{/* DeptId & Dept Name */}
						<SearchableDropdown
							options={depts}
							value={newDeptId}
							getOptionLabel={(d) => typeof d === "string" ? d : `${d.dept_id} - ${d.dept_name}`}
							onSelect={(d) => {
								if (typeof d === "string") { setNewDeptId(d); setNewDeptName(""); }
								else if (d) { setNewDeptId(d.dept_id); setNewDeptName(d.dept_name); }
								else { setNewDeptId(""); setNewDeptName(""); }
							}}
							placeholder="DEPT ID"
						/>
						<input type="text" className="smsm-inputs" value={newDeptName} placeholder="DEPT NAME" readOnly />

						{/* Buttons */}
						<div className="smst-delete-btn-container">
							<button onClick={handleSaveNewHod} className="smsm-add-save-btn">SAVE</button>
							<button onClick={closeAddHodModal} className="smsm-save-edit-btn">CANCEL</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit HOD Modal */}
			{editingHod && (
				<div className="smsh-overlay">
					<div className="smsh-edit">
						<div className="smsh-close-class">
							<span onClick={closeEditHodModal} className="smsh-close">✖</span>
						</div>
						<h3>EDIT HOD</h3>

						{/* STAFF ID */}
						<SearchableDropdown
							options={staff}
							value={editForm.staff_id || ""}
							getOptionLabel={(s) => typeof s === "string" ? s : `${s.staff_id} - ${s.staff_name}`}
							onSelect={(s) => {
								if (typeof s === "string") { setEditForm(prev => ({ ...prev, staff_id: s, hod_name: "" })); }
								else if (s) { setEditForm(prev => ({ ...prev, staff_id: s.staff_id, hod_name: s.staff_name })); }
								else { setEditForm(prev => ({ ...prev, staff_id: "", hod_name: "" })); }
							}}
							placeholder="STAFF ID"
						/>

						{/* HOD Name */}
						<div className="smsh-form">
							<input type="text" className="smsh-edit-inputbox" value={editForm.hod_name || ""} placeholder="HOD NAME" readOnly />
						</div>

						{/* Graduate & Dept ID */}
						<div className="smsh-edit-psw">
							<SearchableDropdown
								options={[{ value: "UG", label: "UG" }, { value: "PG", label: "PG" }]}
								value={editForm.graduate || ""}
								getOptionLabel={(g) => typeof g === "string" ? g : g.label}
								onSelect={(g) => setEditForm(prev => ({ ...prev, graduate: typeof g === "string" ? g : g?.value || "" }))}
								placeholder="GRADUATE"
							/>
							<SearchableDropdown
								options={[{ value: "AIDED", label: "AIDED" }, { value: "SFM", label: "SFM" }, { value: "SFW", label: "SFW" }]}
								value={editForm.category || ""}
								getOptionLabel={(c) => typeof c === "string" ? c : c.label}
								onSelect={(c) => setEditForm(prev => ({ ...prev, category: typeof c === "string" ? c : c?.value || "" }))}
								placeholder="CATEGORY"
							/>
						</div>

						{/* Category & Dept Name */}
						<SearchableDropdown
							options={depts}
							value={editForm.dept_id || ""}
							getOptionLabel={(d) => typeof d === "string" ? d : `${d.dept_id} - ${d.dept_name}`}
							onSelect={(d) => {
								if (typeof d === "string") { setEditForm(prev => ({ ...prev, dept_id: d, dept_name: "" })); }
								else if (d) { setEditForm(prev => ({ ...prev, dept_id: d.dept_id, dept_name: d.dept_name })); }
								else { setEditForm(prev => ({ ...prev, dept_id: "", dept_name: "" })); }
							}}
							placeholder="DEPT ID"
						/>
						<input type="text" className="smsh-edit-inputbox-psw" value={editForm.dept_name || ""} placeholder="DEPT NAME" readOnly />

						{/* Buttons */}
						<div className="smst-delete-btn-container">
							<button onClick={handleSaveEditedHod} className="smsm-add-save-btn">SAVE</button>
							<button onClick={closeEditHodModal} className="smsm-save-edit-btn">CANCEL</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete HOD Modal */}
			{deleteHod && (
				<div className="smsh-overlay">
					<div className="smsh-delete">
						<div className="smsh-close-class">
							<span onClick={cancelDelete} className="smsh-close">✖</span>
						</div>
						<h3>CONFIRM DELETE</h3>
						<div className="smsh-del-div">
							<h4>STAFF ID : {deleteHod.staff_id}</h4>
							<h4>HOD NAME : {deleteHod.hod_name}</h4>
							<h4>DEPARTMENT NAME : {deleteHod.dept_name}</h4>
							<h4>CATEGORY : {deleteHod.category}</h4>
						</div>
						<div className="smshh-delete-btn-container">
							<button onClick={() => handleConfirmDelete(deleteHod)} className="smsm-add-save-btn">DELETE</button>
							<button onClick={cancelDelete} className="smsm-save-edit-btn">CANCEL</button>
						</div>
					</div>
				</div>
			)}

		</div>
	)
}

export default StaffHodManage;