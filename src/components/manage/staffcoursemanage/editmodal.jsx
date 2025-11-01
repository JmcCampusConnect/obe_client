import React from 'react';
import SearchableDropdown from '../../common/SearchableDropdown';

const EditModal = (
	{
		isOpen, closeModal, staffId, editStaff, handleEditStaffIdChange, handleEditInputChange,
		deptId, handleEditDeptIdChange, semester, section, courseCode, handleEditCourseCodeChange,
		handleSaveEditStaff, staffData
	}
) => {

	if (!isOpen) return null;

	return (
		<div className="smst-overlay">
			<div className="scm-modal">
				<div className='smsm-close-div'>
					<button className="smst-close" onClick={closeModal}>✖</button>
				</div>
				<h3>EDIT STAFF COURSE</h3>

				{/* STAFF ID Dropdown with Staff Name */}
				<SearchableDropdown
					options={staffId.map(id => ({
						value: id,
						label: `${id} - ${staffData.find(s => s.staff_id === id)?.staff_name || ""}`
					}))}
					value={
						editStaff.staff_id
							? { value: editStaff.staff_id, label: `${editStaff.staff_id} - ${editStaff.staff_name}` }
							: null
					}
					getOptionLabel={opt => (typeof opt === "string" ? opt : opt.label)}
					onSelect={opt => {
						if (typeof opt === "string") {
							handleEditStaffIdChange(opt);
						} else if (opt) {
							handleEditStaffIdChange(opt.value);
						}
					}}
					placeholder="STAFF ID"
				/>

				<div className="smst-form-grid">

					<input
						type="text"
						name="staff_name"
						placeholder="STAFF NAME"
						value={editStaff.staff_name || ''}
						disabled
					/>

					<SearchableDropdown
						options={["SFM", "SFW", "AIDED"].map(c => ({ value: c, label: c }))}
						value={editStaff.category ? { value: editStaff.category, label: editStaff.category } : null}
						getOptionLabel={opt => (typeof opt === "string" ? opt : opt.label)}
						onSelect={opt => {
							if (typeof opt === "string") handleEditInputChange({ target: { name: "category", value: opt } });
							else if (opt) handleEditInputChange({ target: { name: "category", value: opt.value } });
							else handleEditInputChange({ target: { name: "category", value: "" } });
						}}
						placeholder="CATEGORY"
					/>

					<SearchableDropdown
						options={deptId.map(id => ({ value: id, label: id }))}
						value={editStaff.dept_id ? { value: editStaff.dept_id, label: editStaff.dept_id } : null}
						onSelect={opt => handleEditDeptIdChange(opt.value)}
						getOptionLabel={opt => (typeof opt === "string" ? opt : opt.label)}
						placeholder="DEPT ID"
					/>

					<input type="text" name="dept_name" placeholder="DEPT NAME" value={editStaff.dept_name || ''} disabled />
					<input type="text" name="degree" placeholder="DEGREE" value={editStaff.degree || ''} disabled />

					<select
						name="semester"
						value={editStaff.semester || ''}
						onChange={handleEditInputChange}
					>
						<option value="">SEMESTER</option>
						{semester.map((sem, index) => (
							<option key={index} value={sem}>{sem}</option>
						))}
					</select>

					<select
						name="section"
						value={editStaff.section || ''}
						onChange={handleEditInputChange}
					>
						<option value="">SECTION</option>
						{section.map((sec, index) => (
							<option key={index} value={sec}>{sec}</option>
						))}
					</select>

					<SearchableDropdown
						options={courseCode.map(code => ({ value: code, label: code }))}
						value={editStaff.course_code ? { value: editStaff.course_code, label: editStaff.course_code } : null}
						onSelect={opt => handleEditCourseCodeChange(opt.value)}
						getOptionLabel={opt => (typeof opt === "string" ? opt : opt.label)}
						placeholder="COURSE CODE"
					/>

					<input type="text" name="course_title" placeholder="COURSE TITLE" value={editStaff.course_title || ''} disabled />
					<input type="text" name="batch" placeholder="BATCH" value={editStaff.batch || ''} disabled />

				</div>

				<div className="smst-delete-btn-container">
					<button onClick={handleSaveEditStaff} className="smsm-add-save-btn">SAVE</button>
					<button onClick={closeModal} className="smsm-save-edit-btn">CANCEL</button>
				</div>

			</div>
		</div>
	)
}

export default EditModal;