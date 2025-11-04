import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function EditTutorModal({
	editingStaff, closeEditTutorModal, handleEditSave, editForm, setEditForm,
	getUniqueStaffsForDropdown, getUniqueValues, data, staffData
}) {

	if (!editingStaff) return null;

	const getDropdownValue = (opt) => (typeof opt === "string" ? opt : opt?.value || "");
	const getDropdownLabel = (opt) => (typeof opt === "string" ? opt : opt?.label || "");
	const handleDropdownSelect = (key, opt) => {
		setEditForm(prev => ({ ...prev, [key]: getDropdownValue(opt) }));
	};

	const staffIdOptions = getUniqueStaffsForDropdown();
	const categoryOptions = getUniqueValues("category").map(c => ({ value: c, label: c }));
	const degreeOptions = getUniqueValues("degree").map(d => ({ value: d, label: d }));
	const graduateOptions = getUniqueValues("graduate").map(g => ({ value: g, label: g }));
	const sectionOptions = getUniqueValues("section").map(s => ({ value: s, label: s }));
	const batchOptions = getUniqueValues("batch").map(b => ({ value: b, label: b }));

	const deptOptions = Array.from(
		new Map(
			data
				.filter(d => d.dept_id && d.dept_name)
				.map(d => [d.dept_id, {
					value: d.dept_id,
					label: `${d.dept_id} - ${d.dept_name}`,
					name: d.dept_name
				}])
		).values()
	);

	const handleDeptSelect = (opt) => {
		if (opt) {
			const value = typeof opt === "string" ? opt : opt.value;
			const selectedDept = deptOptions.find(d => d.value === value);
			setEditForm(prev => ({
				...prev,
				dept_id: value,
				dept_name: selectedDept ? selectedDept.name : ""
			}));
		} else {
			setEditForm(prev => ({ ...prev, dept_id: "", dept_name: "" }));
		}
	}

	return (
		<div className="modal-overlay">
			<div className="modal modal-lg">
				<div className="modal-header">
					<h3>EDIT TUTOR</h3>
					<button className="modal-close" onClick={closeEditTutorModal}>✕</button>
				</div>

				<div className="modal-body">
					<div className="form-grid">

						{/* Staff ID */}
						<label>
							<div className="label">Staff ID :</div>
							<SearchableDropdown
								options={staffIdOptions}
								value={editForm.staff_id || ""}
								getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
								onSelect={(opt) => {
									if (typeof opt === "string") {
										setEditForm(prev => ({ ...prev, staff_id: opt, staff_name: "" }));
									} else if (opt) {
										const selectedStaff = staffData.find(s => s.staff_id === opt.value);
										setEditForm(prev => ({
											...prev,
											staff_id: opt.value,
											staff_name: selectedStaff?.staff_name || ""
										}));
									} else {
										setEditForm(prev => ({ ...prev, staff_id: "", staff_name: "" }));
									}
								}}
								isDisabled={true}
							/>
						</label>

						{/* Tutor Name */}
						<label>
							<div className="label">Tutor Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={editForm.staff_name || ""}
								disabled
							/>
						</label>

						{/* Category */}
						<label>
							<div className="label">Category :</div>
							<SearchableDropdown
								options={categoryOptions}
								value={editForm.category || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("category", opt)}
							/>
						</label>

						{/* Degree */}
						<label>
							<div className="label">Degree :</div>
							<SearchableDropdown
								options={degreeOptions}
								value={editForm.degree || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("degree", opt)}
							/>
						</label>

						{/* Graduate */}
						<label>
							<div className="label">Graduate :</div>
							<SearchableDropdown
								options={graduateOptions}
								value={editForm.graduate || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("graduate", opt)}
							/>
						</label>

						{/* Section */}
						<label>
							<div className="label">Section :</div>
							<SearchableDropdown
								options={sectionOptions}
								value={editForm.section || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("section", opt)}
							/>
						</label>

						{/* 🟩 Dept ID (ID + Name together) */}
						<label>
							<div className="label">Dept ID :</div>
							<SearchableDropdown
								options={deptOptions}
								value={editForm.dept_id || ""}
								getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
								onSelect={handleDeptSelect}
							/>
						</label>

						{/* 🟩 Dept Name (auto-filled, disabled) */}
						<label>
							<div className="label">Dept Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={editForm.dept_name || ""}
								disabled
							/>
						</label>

						{/* Batch */}
						<label>
							<div className="label">Batch :</div>
							<SearchableDropdown
								options={batchOptions}
								value={editForm.batch || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("batch", opt)}
							/>
						</label>
					</div>

					<div className="modal-actions">
						<button className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
						<button className="btn btn-outline" onClick={closeEditTutorModal}>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditTutorModal;