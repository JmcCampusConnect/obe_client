import React from 'react';
import SearchableDropdown from '../../common/SearchableDropdown';

function AddHodModal({
	popup, staff, newStaffId, setNewStaffId, newHodName, setNewHodName, newGraduate, setNewGraduate, 
	newCategory, setNewCategory, depts, newDeptId, setNewDeptId, newDeptName, setNewDeptName, 
	handleSaveNewHod, closeAddHodModal
}) {

	if (!popup) return null;

	const graduateOptions = [
		{ value: "UG", label: "UG" },
		{ value: "PG", label: "PG" }
	];

	const categoryOptions = [
		{ value: "AIDED", label: "AIDED" },
		{ value: "SFM", label: "SFM" },
		{ value: "SFW", label: "SFW" }
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		handleSaveNewHod();
	};

	return (
		<div className="modal-overlay">
			<div className="modal modal-lg">
				<div className="modal-header">
					<h3>ADD HOD</h3>
					<button className="modal-close" onClick={closeAddHodModal}>✕</button>
				</div>

				<form className="modal-body" onSubmit={handleSubmit}>
					<div className="form-grid">
						<label>
							<div className="label">Staff ID :</div>
							<SearchableDropdown
								options={staff}
								value={newStaffId}
								getOptionLabel={(s) => typeof s === "string" ? s : `${s.staff_id} - ${s.staff_name}`}
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
								placeholder="Select Staff ID"
							/>
						</label>

						<label>
							<div className="label">HOD Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={newHodName}
								placeholder="Select Staff Name"
								readOnly
							/>
						</label>

						<label>
							<div className="label">Graduate :</div>
							<SearchableDropdown
								options={graduateOptions}
								value={newGraduate}
								getOptionLabel={(g) => typeof g === "string" ? g : g.label}
								onSelect={(g) => setNewGraduate(typeof g === "string" ? g : g?.value || "")}
								placeholder="Select Graduate"
							/>
						</label>

						<label>
							<div className="label">Category :</div>
							<SearchableDropdown
								options={categoryOptions}
								value={newCategory}
								getOptionLabel={(c) => typeof c === "string" ? c : c.label}
								onSelect={(c) => setNewCategory(typeof c === "string" ? c : c?.value || "")}
								placeholder="Select Category"
							/>
						</label>

						<label>
							<div className="label">Dept ID :</div>
							<SearchableDropdown
								options={depts}
								value={newDeptId}
								getOptionLabel={(d) => typeof d === "string" ? d : `${d.dept_id} - ${d.dept_name}`}
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
								placeholder="Select Dept ID"
							/>
						</label>

						<label>
							<div className="label">Dept Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={newDeptName}
								placeholder="Select Dept Name"
								readOnly
							/>
						</label>
					</div>

					<div className="modal-actions">
						<button type="submit" className="btn btn-primary">Save</button>
						<button type="button" className="btn btn-outline" onClick={closeAddHodModal}>Cancel</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddHodModal;