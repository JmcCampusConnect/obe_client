import React, { useState } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function EditHodModal({
	editingHod, closeEditHodModal, handleSaveEditedHod,
	editForm, setEditForm, staff, depts, typedStaffId, setTypedStaffId
}) {

	const [errors, setErrors] = useState({});

	if (!editingHod) return null;

	const graduateOptions = [
		{ value: "UG", label: "UG" },
		{ value: "PG", label: "PG" }
	];

	const categoryOptions = [
		{ value: "AIDED", label: "AIDED" },
		{ value: "SFM", label: "SFM" },
		{ value: "SFW", label: "SFW" }
	];

	const handleStaffChange = (selected) => {
		if (typeof selected === "string") {
			setTypedStaffId(selected);
			setEditForm(prev => ({
				...prev,
				staff_id: selected,
				hod_name: ""
			}));
			return;
		}

		if (!selected) {
			setTypedStaffId("");
			setEditForm(prev => ({
				...prev,
				staff_id: "",
				hod_name: ""
			}));
			return;
		}

		setTypedStaffId(selected.staff_id);
		setEditForm(prev => ({
			...prev,
			staff_id: selected.staff_id,
			hod_name: selected.staff_name
		}));
	};

	const getDropdownValue = (opt) =>
		typeof opt === "string" ? opt : (opt ? opt.value : "");

	const validateForm = () => {

		const newErrors = {};

		if (!editForm.staff_id) newErrors.staff_id = "Please select Staff ID";
		if (!editForm.graduate) newErrors.graduate = "Please select Graduate type";
		if (!editForm.category) newErrors.category = "Please select Category";
		if (!editForm.dept_id) newErrors.dept_id = "Please select Department";

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (!validateForm()) return;
		handleSaveEditedHod();
	};

	return (
		<div className="modal-overlay">
			<div className="modal modal-lg">
				<div className="modal-header">
					<h3>EDIT HOD</h3>
					<button className="modal-close" onClick={closeEditHodModal}>✕</button>
				</div>

				<div className="modal-body">
					<div className="form-grid">

						{/* STAFF ID */}
						<label>
							<div className="label">Staff ID :</div>
							<SearchableDropdown
								useMode="edit"
								options={staff}
								value={typedStaffId}
								getOptionLabel={(s) =>
									typeof s === "string"
										? s
										: `${s.staff_id} - ${s.staff_name}`
								}
								onSelect={handleStaffChange}
							/>
							{errors.staff_id && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>
									{errors.staff_id}
								</span>
							)}
						</label>

						{/* HOD NAME */}
						<label>
							<div className="label">HOD Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={editForm.hod_name || ""}
								disabled
							/>
						</label>

						{/* GRADUATE */}
						<label>
							<div className="label">Graduate :</div>

							<SearchableDropdown
								useMode="edit"
								options={graduateOptions}
								value={editForm.graduate || ""}
								getOptionLabel={(g) =>
									typeof g === "string" ? g : g.label
								}
								onSelect={(g) =>
									setEditForm(prev => ({
										...prev,
										graduate: getDropdownValue(g)
									}))
								}
							/>

							{errors.graduate && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>
									{errors.graduate}
								</span>
							)}
						</label>

						{/* CATEGORY */}
						<label>
							<div className="label">Category :</div>
							<SearchableDropdown
								useMode="edit"
								options={categoryOptions}
								value={editForm.category || ""}
								getOptionLabel={(c) =>
									typeof c === "string" ? c : c.label
								}
								onSelect={(c) =>
									setEditForm(prev => ({
										...prev,
										category: getDropdownValue(c)
									}))
								}
							/>

							{errors.category && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>
									{errors.category}
								</span>
							)}
						</label>

						{/* DEPT ID */}
						<label>
							<div className="label">Dept ID :</div>
							<SearchableDropdown
								useMode="edit"
								options={depts}
								value={editForm.dept_id || ""}
								getOptionLabel={(d) =>
									typeof d === "string"
										? d
										: `${d.dept_id} - ${d.dept_name}`
								}
								onSelect={(d) => {
									if (!d) {
										setEditForm(prev => ({
											...prev,
											dept_id: "",
											dept_name: ""
										}));
										return;
									}

									if (typeof d === "string") {
										setEditForm(prev => ({
											...prev,
											dept_id: d,
											dept_name: ""
										}));
										return;
									}

									setEditForm(prev => ({
										...prev,
										dept_id: d.dept_id,
										dept_name: d.dept_name
									}));
								}}
							/>

							{errors.dept_id && (
								<span className="error-message" style={{ color: 'red', marginTop: '5px', display: 'block' }}>
									{errors.dept_id}
								</span>
							)}
						</label>

						{/* DEPT NAME */}
						<label>
							<div className="label">Dept Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={editForm.dept_name || ""}
								disabled
							/>
						</label>
					</div>

					<div className="modal-actions">
						<button className="btn btn-primary" onClick={handleSubmit}>
							Save Changes
						</button>
						<button className="btn btn-outline" onClick={closeEditHodModal}>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditHodModal;