import React, { useState, useEffect } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function AddHodModal({
	popup, staff, newStaffId, setNewStaffId, newHodName, setNewHodName, newGraduate, setNewGraduate,
	newCategory, setNewCategory, depts, newDeptId, setNewDeptId, newDeptName, setNewDeptName,
	handleSaveNewHod, closeAddHodModal
}) {

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (!popup) { setErrors({}) }
	}, [popup]);

	if (!popup) return null;

	const validateForm = () => {

		const newErrors = {};

		if (!newStaffId) newErrors.newStaffId = "Please select a Staff ID";
		if (!newGraduate) newErrors.newGraduate = "Please select Graduate type";
		if (!newCategory) newErrors.newCategory = "Please select a Category";
		if (!newDeptId) newErrors.newDeptId = "Please select a Department";

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		handleSaveNewHod();
	};

	const graduateOptions = [
		{ value: "UG", label: "UG" },
		{ value: "PG", label: "PG" }
	];

	const categoryOptions = [
		{ value: "AIDED", label: "AIDED" },
		{ value: "SFM", label: "SFM" },
		{ value: "SFW", label: "SFW" }
	];

	return (
		<div className="modal-overlay">
			<div className="modal modal-lg">
				<div className="modal-header">
					<h3>ADD HOD</h3>
					<button className="modal-close" onClick={closeAddHodModal}>✕</button>
				</div>

				<form className="modal-body" onSubmit={handleSubmit}>
					<div className="form-grid">

						{/* STAFF ID */}
						<label>
							<div className="label">Staff ID :</div>
							<SearchableDropdown
								useMode="add"
								options={staff}
								value={newStaffId}
								getOptionLabel={(s) =>
									typeof s === "string"
										? s
										: `${s.staff_id} - ${s.staff_name}`
								}
								onSelect={(s) => {
									if (typeof s === "string") {
										setNewStaffId(s);
										setNewHodName("");
									} else if (s) {
										setNewStaffId(s.staff_id);
										setNewHodName(s.staff_name);
									} else {
										setNewStaffId("");
										setNewHodName("");
									}
								}}
							/>
							{errors.newStaffId && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>{errors.newStaffId}</span>
							)}
						</label>

						{/* HOD NAME */}
						<label>
							<div className="label">HOD Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={newHodName}
								disabled
							/>
						</label>

						{/* GRADUATE */}
						<label>
							<div className="label">Graduate :</div>
							<SearchableDropdown
								useMode="add"
								options={graduateOptions}
								value={newGraduate}
								getOptionLabel={(g) =>
									typeof g === "string" ? g : g.label
								}
								onSelect={(g) =>
									setNewGraduate(typeof g === "string" ? g : g?.value || "")
								}
							/>
							{errors.newGraduate && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>{errors.newGraduate}</span>
							)}
						</label>

						{/* CATEGORY */}
						<label>
							<div className="label">Category :</div>
							<SearchableDropdown
								useMode="add"
								options={categoryOptions}
								value={newCategory}
								getOptionLabel={(c) =>
									typeof c === "string" ? c : c.label
								}
								onSelect={(c) =>
									setNewCategory(typeof c === "string" ? c : c?.value || "")
								}
							/>
							{errors.newCategory && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>{errors.newCategory}</span>
							)}
						</label>

						{/* DEPT ID */}
						<label>
							<div className="label">Dept ID :</div>
							<SearchableDropdown
								useMode="add"
								options={depts}
								value={newDeptId}
								getOptionLabel={(d) =>
									typeof d === "string"
										? d
										: `${d.dept_id} - ${d.dept_name}`
								}
								onSelect={(d) => {
									if (typeof d === "string") {
										setNewDeptId(d);
										setNewDeptName("");
									} else if (d) {
										setNewDeptId(d.dept_id);
										setNewDeptName(d.dept_name);
									} else {
										setNewDeptId("");
										setNewDeptName("");
									}
								}}
							/>
							{errors.newDeptId && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>{errors.newDeptId}</span>
							)}
						</label>

						{/* DEPT NAME */}
						<label>
							<div className="label">Dept Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={newDeptName}
								disabled
							/>
						</label>
					</div>

					<div className="modal-actions">
						<button type="submit" className="btn btn-primary">Save</button>
						<button type="button" className="btn btn-outline" onClick={closeAddHodModal}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddHodModal;