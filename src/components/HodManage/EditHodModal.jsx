import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function EditHodModal({
	editingHod, closeEditHodModal, handleSaveEditedHod,
	editForm, setEditForm, staff, depts,
}) {
		
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

	const getDropdownValue = (opt) => (typeof opt === "string" ? opt : (opt ? opt.value : ""));

	return (
		<div className="modal-overlay">
			<div className="modal modal-lg">
				<div className="modal-header">
					<h3>EDIT HOD</h3>
					<button className="modal-close" onClick={closeEditHodModal}>✕</button>
				</div>

				<div className="modal-body">
					<div className="form-grid">
						<label>
							<div className="label">Staff ID :</div>
							<SearchableDropdown
								options={staff}
								value={editForm.staff_id || ""}
								getOptionLabel={(s) => typeof s === "string" ? s : `${s.staff_id} - ${s.staff_name}`}
								onSelect={(s) => {
									if (typeof s === "string") {
										setEditForm(prev => ({ ...prev, staff_id: s, hod_name: "" }));
									} else if (s) {
										setEditForm(prev => ({ ...prev, staff_id: s.staff_id, hod_name: s.staff_name }));
									} else {
										setEditForm(prev => ({ ...prev, staff_id: "", hod_name: "" }));
									}
								}}
							/>
						</label>

						<label>
							<div className="label">HOD Name :</div>
							<input
								className="input-box-correction"
								type="text"
								value={editForm.hod_name || ""}
								disabled
							/>
						</label>

						<label>
							<div className="label">Graduate :</div>
							<SearchableDropdown
								options={graduateOptions}
								value={editForm.graduate || ""}
								getOptionLabel={(g) => typeof g === "string" ? g : g.label}
								onSelect={(g) => setEditForm(prev => ({ ...prev, graduate: getDropdownValue(g) }))}
							/>
						</label>

						<label>
							<div className="label">Category :</div>
							<SearchableDropdown
								options={categoryOptions}
								value={editForm.category || ""}
								getOptionLabel={(c) => typeof c === "string" ? c : c.label}
								onSelect={(c) => setEditForm(prev => ({ ...prev, category: getDropdownValue(c) }))}
							/>
						</label>

						<label>
							<div className="label">Dept ID :</div>
							<SearchableDropdown
								options={depts}
								value={editForm.dept_id || ""}
								getOptionLabel={(d) => typeof d === "string" ? d : `${d.dept_id} - ${d.dept_name}`}
								onSelect={(d) => {
									if (typeof d === "string") {
										setEditForm(prev => ({ ...prev, dept_id: d, dept_name: "" }));
									} else if (d) {
										setEditForm(prev => ({ ...prev, dept_id: d.dept_id, dept_name: d.dept_name }));
									} else {
										setEditForm(prev => ({ ...prev, dept_id: "", dept_name: "" }));
									}
								}}
							/>
						</label>

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
						<button className="btn btn-primary" onClick={handleSaveEditedHod}>Save Changes</button>
						<button className="btn btn-outline" onClick={closeEditHodModal}>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditHodModal;