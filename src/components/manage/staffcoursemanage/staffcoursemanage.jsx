import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './staffcoursemanage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddModal from './addmodal';
import EditModal from './editmodal';
import DeleteModal from './deletemodal';

const Staffcoursemanage = () => {

	const apiUrl = import.meta.env.VITE_API_URL;
	const [staffData, setStaffData] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editStaff, setEditStaff] = useState({});
	const [deleteStaff, setDeleteStaff] = useState(null);
	const [staffId, setStaffId] = useState([]);
	const [selectedStaffId, setSelectedStaffId] = useState('');
	const [staffName, setStaffName] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [deptId, setDeptId] = useState([]);
	const [selectedDeptId, setSelectedDeptId] = useState('');
	const [deptName, setDeptName] = useState('');
	const [degree, setDegree] = useState('');
	const [semester, setSemester] = useState([]);
	const [selectedSemester, setSelectedSemester] = useState('');
	const [section, setSection] = useState([]);
	const [selectedSection, setSelectedSection] = useState('');
	const [courseCode, setCourseCode] = useState([]);
	const [selectedCourseCode, setSelectedCourseCode] = useState('');
	const [courseTitle, setCourseTitle] = useState('');
	const [batch, setBatch] = useState('');

	const fixField = val => Array.isArray(val) ? val[0] || '' : val;

	// STAFF COURSE LIST FOR DISPLAY

	useEffect(() => {
		const fetchStaffDetails = async () => {
			try {
				const response = await axios.get(`${apiUrl}/api/staffcoursemanage`);
				setStaffData(response.data);
			} catch (error) {
				console.error('Error fetching staff data : ', error);
			}
		};
		fetchStaffDetails();
	}, [apiUrl])

	// STAFF ID TO DISPLAY IN DROPDOWNS

	useEffect(() => {
		const fetchStaffIds = async () => {
			try {
				const response = await axios.get(`${apiUrl}/api/staffId`);
				setStaffId(response.data);
			} catch (error) { console.error('Error fetching staff details : ', error) }
		};
		fetchStaffIds();
	}, [])

	// FETCH COURSE DETAILS

	useEffect(() => {
		const fetchSectionCourse = async () => {
			try {
				if (selectedCategory && selectedDeptId && selectedSemester) {
					const response = await axios.post(`${apiUrl}/api/scmsection`, {
						semester: selectedSemester,
						dept_id: selectedDeptId,
						category: selectedCategory
					});
					setSection(response.data.section);
					setCourseCode(response.data.courseCode);
				}
			} catch (error) { console.error('Error in fetching course details : ', error) }
		}
		fetchSectionCourse();
	}, [selectedCategory, selectedDeptId, selectedSemester])

	// FETCH STAFF NAME

	const handleStaffIdChange = async value => {
		setSelectedStaffId(value);
		try {
			const response = await axios.post(`${apiUrl}/api/staffname`, { staff_id: value });
			setStaffName(fixField(response.data));
		} catch (error) {
			console.error('Error in fetching staff name : ', error);
		}
	}

	// FETCH DEPT ID

	const handleCategoryChange = async value => {
		setSelectedCategory(value);
		try {
			const response = await axios.post(`${apiUrl}/api/depId`, { category: value });
			setDeptId(response.data);
		} catch (error) { console.error('Error in fetching dept id : ', error) }
	}

	// FETCH DEPT NAME

	const handleIdChange = async value => {
		setSelectedDeptId(value);
		try {
			const response = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: value });
			setDeptName(fixField(response.data.uniqueDeptNames));
			setDegree(fixField(response.data.uniqueDegrees));
			setSemester(response.data.uniqueSemester);
		} catch (error) { console.error('Error in fetching dept name : ', error) }
	}

	// FETCH SECTION

	const handleSemChange = async value => {
		setSelectedSemester(value);
		try {
			const response = await axios.post(`${apiUrl}/api/scmsection`, {
				semester: value,
				dept_id: selectedDeptId,
				category: selectedCategory
			});
			setSection(response.data.section);
			setCourseCode(response.data.courseCode);
		} catch (error) { console.error('Error in fetching section : ', error) }
	}

	const handleSectionChange = value => setSelectedSection(value);

	// FETCH COURSE TITLE

	const handleCourseCodeChange = async value => {
		setSelectedCourseCode(value);
		try {
			const response = await axios.post(`${apiUrl}/api/scmcoursetitle`, { courseCode: value });
			setCourseTitle(fixField(response.data.courseTitle));
			setBatch(fixField(response.data.batch));
		} catch (error) { console.error('Error in fetching course title : ', error) }
	}

	// OPEN EDIT MODAL

	const handleOpenEditModal = async staff => {
		setEditStaff(staff);
		setSelectedCategory(staff.category);
		setSelectedDeptId(staff.dept_id);
		setSelectedSemester(staff.semester);
		setIsEditModalOpen(true);

		try {
			const deptDetails = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: staff.dept_id });
			setDeptName(fixField(deptDetails.data.uniqueDeptNames));
			setDegree(fixField(deptDetails.data.uniqueDegrees));
			setSemester(deptDetails.data.uniqueSemester);
		} catch (error) { console.error(error) }

		try {
			const resp = await axios.post(`${apiUrl}/api/scmsection`, {
				semester: staff.semester,
				dept_id: staff.dept_id,
				category: staff.category
			});
			setSection(resp.data.section);
			setCourseCode(resp.data.courseCode)
		} catch (error) { console.error(error) }
	}

	// STAFF COURSE MANAGE ADD

	const handleSaveStaff = async () => {
		const payload = {
			staff_id: selectedStaffId?.toString().trim() || '',
			staff_name: staffName,
			category: selectedCategory,
			dept_id: selectedDeptId,
			dept_name: deptName,
			degree, batch,
			semester: selectedSemester,
			section: selectedSection,
			course_code: selectedCourseCode,
			course_title: courseTitle,

		}
		try {
			const response = await axios.post(`${apiUrl}/api/scmNewStaff`, payload);
			if (response.status === 201) {
				alert('Staff saved successfully!');
				setStaffData(prev => [...prev, response.data.data]);
				setIsAddModalOpen(false);
			}
		} catch (error) {
			console.error(error);
			alert('Failed to save staff.');
		}
	}

	// STAFF COURSE MANAGE EDIT

	const handleSaveEditStaff = async () => {
		try {
			const cleanEditStaff = { ...editStaff };
			cleanEditStaff.staff_name = fixField(cleanEditStaff.staff_name);
			cleanEditStaff.degree = fixField(cleanEditStaff.degree);
			cleanEditStaff.dept_name = fixField(cleanEditStaff.dept_name);
			cleanEditStaff.course_title = fixField(cleanEditStaff.course_title);
			cleanEditStaff.batch = fixField(cleanEditStaff.batch);

			const response = await axios.post(`${apiUrl}/api/staffCourseEdit`, cleanEditStaff);
			if (response.data.ok) {
				alert('Staff course edited successfully!');
				setIsEditModalOpen(false);
			}
		} catch (error) {
			console.error(error);
			alert('Failed to edit staff course.');
		}
	}

	// STAFF COURSE MANAGE DELETE

	const handleDeleteStaff = async (s_no, staff_id, course_code, category, section, dept_id) => {
		try {
			const response = await axios.delete(`${apiUrl}/api/deletestaff`, {
				params: { staff_id, course_code, category, section, dept_id }
			});
			if (response.status === 200) {
			setStaffData(prev => prev.filter(staff => staff.s_no !== s_no));
			alert('Staff course deleted successfully!');
			setDeleteStaff(null);
		}
		} catch (error) {
			console.error('Error in deleting staff course manage : ', error);
			alert('Failed to delete staff course.');
		}
	}

	// STAFF COURSE MANAGE FILTER

	const filteredStaffData = staffData.filter(
		staff =>
			(staff.section?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
			(staff.dept_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
			(staff.course_title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
			(staff.course_code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
			(staff.staff_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
			(staff.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
			(staff.staff_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
	)

	return (
		<div className="scm-manage">
			<span className="scm-top-heading">STAFF COURSE MANAGE</span>
			<div className="scm-input-btn">
				<input
					className="scm-search"
					type="text"
					placeholder="Search..."
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
				<button className="smsm-save-btn" onClick={() => setIsAddModalOpen(true)}>
					<FontAwesomeIcon icon={faPlus} className="smsm-icon" /> Add
				</button>
			</div>

			<table className="scm-table">
				<thead>
					<tr>
						<th>S No</th>
						<th>Staff ID</th>
						<th>Staff Name</th>
						<th>Category</th>
						<th>Section</th>
						<th>Dept ID</th>
						<th>Course Code</th>
						<th>Course Title</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{filteredStaffData.length > 0 ? filteredStaffData.map((staff, idx) => (
						<tr key={idx} className={idx % 2 === 0 ? 'scm-light' : 'scm-dark'}>
							<td>{idx + 1}</td>
							<td>{staff.staff_id}</td>
							<td>{staff.staff_name}</td>
							<td>{staff.category}</td>
							<td>{staff.section}</td>
							<td>{staff.dept_id}</td>
							<td>{staff.course_code}</td>
							<td>{staff.course_title}</td>
							<td>
								<button className="scm-edit-btn" onClick={() => handleOpenEditModal(staff)}>
									<FontAwesomeIcon icon={faEdit} /> Edit
								</button>
							</td>
							<td>
								<button className="scm-del-btn" onClick={() => setDeleteStaff(staff)}>
									<FontAwesomeIcon icon={faTrash} /> Delete
								</button>
							</td>
						</tr>
					)) : (
						<tr>
							<td colSpan="10" className="scm-data">No Data Available</td>
						</tr>
					)}
				</tbody>
			</table>

			<AddModal
				isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)}
				staffId={staffId} selectedStaffId={selectedStaffId} handleStaffIdChange={handleStaffIdChange} staffName={staffName}
				selectedCategory={selectedCategory} handleCategoryChange={handleCategoryChange} deptId={deptId} selectedDeptId={selectedDeptId}
				handleIdChange={handleIdChange} setStaffName={setStaffName} setDeptName={setDeptName} staffData={staffData} deptName={deptName} degree={degree}
				semester={semester} selectedSemester={selectedSemester} handleSemChange={handleSemChange} section={section} selectedSection={selectedSection}
				handleSectionChange={handleSectionChange} courseCode={courseCode} selectedCourseCode={selectedCourseCode} handleCourseCodeChange={handleCourseCodeChange}
				courseTitle={courseTitle} batch={batch} handleAddInputChange={e => setBatch(e.target.value)} handleSaveStaff={handleSaveStaff}
			/>

			<EditModal
				staffData={staffData}
				isOpen={isEditModalOpen}
				closeModal={() => setIsEditModalOpen(false)}
				staffId={staffId}
				editStaff={editStaff}
				handleEditStaffIdChange={async value => {
					setEditStaff(prev => ({ ...prev, staff_id: value }));
					try {
						const response = await axios.post(`${apiUrl}/api/staffname`, { staff_id: value });
						setEditStaff(prev => ({ ...prev, staff_name: fixField(response.data) }));
					} catch (error) { console.error(error); }
				}}
				handleEditInputChange={e => setEditStaff(prev => ({ ...prev, [e.target.name]: e.target.value }))}
				deptId={deptId}
				handleEditDeptIdChange={async value => {
					setEditStaff(prev => ({ ...prev, dept_id: value }));
					try {
						const response = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: value });
						setEditStaff(prev => ({
							...prev,
							dept_name: fixField(response.data.uniqueDeptNames),
							degree: fixField(response.data.uniqueDegrees),
							semester: response.data.uniqueSemester
						}));
						setSelectedSemester(response.data.uniqueSemester[0] || '');
					} catch (error) { console.error(error); }
				}}
				semester={semester}
				section={section}
				courseCode={courseCode}
				handleEditCourseCodeChange={async value => {
					setEditStaff(prev => ({ ...prev, course_code: value }));
					try {
						const response = await axios.post(`${apiUrl}/api/scmcoursetitle`, { courseCode: value });
						setEditStaff(prev => ({
							...prev,
							course_title: fixField(response.data.courseTitle),
							batch: fixField(response.data.batch)
						}));
					} catch (error) { console.error(error); }
				}}
				handleSaveEditStaff={handleSaveEditStaff}
			/>

			<DeleteModal
				isOpen={!!deleteStaff}
				staff={deleteStaff}
				onClose={() => setDeleteStaff(null)}
				onDelete={handleDeleteStaff}
			/>
		</div>
	)
}

export default Staffcoursemanage;