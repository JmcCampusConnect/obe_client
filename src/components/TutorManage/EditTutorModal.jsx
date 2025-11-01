import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function EditTutorModal({
	editingStaff, closeEditTutorModal, handleEditSave, editForm, setEditForm,
	getUniqueStaffsForDropdown, getUniqueValues, data
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
	const deptIdOptions = getUniqueValues("dept_id").map(d => ({ value: d, label: d }));
	const deptNameOptions = getUniqueValues("dept_name").map(d => ({ value: d, label: d }));
	const batchOptions = getUniqueValues("batch").map(b => ({ value: b, label: b }));

	return (
		<div className="modal-overlay">
			<div className="modal modal-lg">
				<div className="modal-header">
					<h3>EDIT TUTOR</h3>
					<button className="modal-close" onClick={closeEditTutorModal}>✕</button>
				</div>

				<div className="modal-body">
					<div className="form-grid">
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
										const selectedStaff = data.find(s => s.staff_id === opt.value);
										setEditForm(prev => ({
											...prev,
											staff_id: opt.value,
											staff_name: selectedStaff?.staff_name || ""
										}));
									} else {
										setEditForm(prev => ({ ...prev, staff_id: "", staff_name: "" }));
									}
								}}
								placeholder="Select Staff Id"
								isDisabled={true}
							/>
						</label>

						<label>
							<div className="label">Tutor Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={editForm.staff_name || ""}
								readOnly
								placeholder="Select Tutor Name"
							/>
						</label>

						<label>
							<div className="label">Category :</div>
							<SearchableDropdown
								options={categoryOptions}
								value={editForm.category || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("category", opt)}
								placeholder="Select Category"
							/>
						</label>

						<label>
							<div className="label">Degree :</div>
							<SearchableDropdown
								options={degreeOptions}
								value={editForm.degree || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("degree", opt)}
								placeholder="Select Degree"
							/>
						</label>

						<label>
							<div className="label">Graduate :</div>
							<SearchableDropdown
								options={graduateOptions}
								value={editForm.graduate || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("graduate", opt)}
								placeholder="Select Graduate"
							/>
						</label>

						<label>
							<div className="label">Section :</div>
							<SearchableDropdown
								options={sectionOptions}
								value={editForm.section || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("section", opt)}
								placeholder="Select Section"
							/>
						</label>

						<label>
							<div className="label">Dept ID :</div>
							<SearchableDropdown
								options={deptIdOptions}
								value={editForm.dept_id || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("dept_id", opt)}
								placeholder="Select Dept ID"
							/>
						</label>

						<label>
							<div className="label">Dept Name :</div>
							<SearchableDropdown
								options={deptNameOptions}
								value={editForm.dept_name || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("dept_name", opt)}
								placeholder="Select Dept Name"
							/>
						</label>

						<label>
							<div className="label">Batch :</div>
							<SearchableDropdown
								options={batchOptions}
								value={editForm.batch || ""}
								getOptionLabel={getDropdownLabel}
								onSelect={(opt) => handleDropdownSelect("batch", opt)}
								placeholder="Select Batch"
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
	);
}

export default EditTutorModal;