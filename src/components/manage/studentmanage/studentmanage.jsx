// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './studentmanage.css';
// import Loading from '../../../assets/load.svg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// function StudentManage() {

//     const apiUrl = import.meta.env.VITE_API_URL;
//     const [studata, setStudata] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [newStudent, setNewStudent] = useState({ stu_name: '', reg_no: '', batch: '', mentor: '', emis: '' });
//     const [editStudent, setEditStudent] = useState(null);
//     const [studentToDelete, setStudentToDelete] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [deptId, setdeptId] = useState([])
//     const [selecteddeptId, setSelectedDeptId] = useState("");
//     const [semester, setSemester] = useState([])
//     const [selectedSemester, setSelectedSemester] = useState("");
//     const [section, setSection] = useState([]);
//     const [selectedSection, setSelectedSection] = useState("")
//     const [courseCodes, setCourseCodes] = useState([]);
//     const [selectedCourseCodes, setSelectedCourseCodes] = useState([]);

//     // Fetch Dept Id based on the Detailse

//     const handleFetchCourse = async () => {
//         try {
//             const submit = {
//                 category: selectedCategory,
//                 deptId: selecteddeptId,
//                 semester: selectedSemester,
//                 section: selectedSection,
//             };
//             const response = await axios.post(`${apiUrl}/api/coursecode`, submit);
//             setCourseCodes(response.data);
//         }
//         catch (error) {
//             console.error("Error fetching course code:", error);
//         }
//     }

//     // To fetch Category

//     // useEffect(() => {
//     //     const fetchCategory = async () => {
//     //         try {
//     //             const response = await axios.get(`${apiUrl}/api/category`);
//     //             setCategories(response.data);
//     //         }
//     //         catch (error) {
//     //             console.error('Error fetching Categories:', error);
//     //         }
//     //     }
//     //     fetchCategory();
//     // }, [apiUrl]);

//     // To fetch Dept Id

//     const handleCategoryChange = async (value) => {
//         setSelectedCategory(value);
//         try {
//             const response = await axios.post(`${apiUrl}/api/deptId`, {
//                 category: value,
//             })
//             setdeptId(response.data);
//         }
//         catch (error) {
//             console.error("Error posting Category:", error);
//         }
//     };

//     // To fetch Semester 

//     const handledeptIdChange = async (value) => {
//         setSelectedDeptId(value);
//         try {
//             const response = await axios.post(`${apiUrl}/api/semester`, {
//                 category: selectedCategory,
//                 deptId: value,
//             })
//             setSemester(response.data);
//         }
//         catch (error) {
//             console.error("Error fetching Semesters:", error);
//         }
//     }

//     // To fetch Section

//     const handleSemesterChange = async (value) => {
//         setSelectedSemester(value);
//         try {
//             const response = await axios.post(`${apiUrl}/api/section`, {
//                 category: selectedCategory,
//                 deptId: selecteddeptId,
//                 semester: value,
//             });
//             setSection(response.data);
//         }
//         catch (error) {
//             console.error("Error fetching Sections:", error);
//         }
//     }

//     const handleSectionChange = (value) => { setSelectedSection(value) }

//     // To fetch all Student Details

//     // useEffect(() => {
//     //     const fetchStudentDetails = async () => {
//     //         try {
//     //             const response = await axios.get(`${apiUrl}/api/studetails`);
//     //             setStudata(response.data);
//     //         }
//     //         catch (error) {
//     //             console.error('Error fetching student details:', error);
//     //         }
//     //         finally {
//     //             setLoading(false);
//     //         }
//     //     }
//     //     fetchStudentDetails();
//     // }, [apiUrl]);

//     const filteredStudata = studata.filter((student) =>
//         (student.stu_name?.toLowerCase() || '').includes(searchTerm.toLowerCase() || '') ||
//         (student.category?.toLowerCase() || '').includes(searchTerm.toLowerCase() || '') ||
//         (student.batch?.toLowerCase() || '').includes(searchTerm.toLowerCase() || '') ||
//         (student.section?.toLowerCase() || '').includes(searchTerm.toLowerCase() || '') ||
//         (student.dept_id?.toLowerCase() || '').includes(searchTerm.toLowerCase() || '') ||
//         (student.reg_no?.toLowerCase() || '').includes(searchTerm.toLowerCase() || '')
//     )

//     const openAddModal = () => setIsAddModalOpen(true);

//     const closeAddModal = () => {
//         setIsAddModalOpen(false)
//         setNewStudent({
//             stu_name: '', reg_no: '', dept_id: '', category: 'default',
//             semester: 'default', section: 'default', batch: 'default'
//         })
//         setSelectedCategory('default');
//         setSelectedDeptId('default');
//         setSelectedSemester('default');
//         setSelectedSection('default');
//     }

//     const handleAddInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewStudent((prev) => ({ ...prev, [name]: value }));
//     }

//     // Save the New Student

//     const handleSaveStudent = async () => {
//         try {
//             const response = await axios.post(`${apiUrl}/api/addstudent`, {
//                 stu_name: newStudent.stu_name, reg_no: newStudent.reg_no,
//                 batch: newStudent.batch, emis: newStudent.emis,
//                 section: selectedSection, semester: selectedSemester,
//                 mentor: newStudent.mentor, category: selectedCategory,
//                 dept_id: selecteddeptId, course_codes: selectedCourseCodes
//             })

//             if (response.status === 201) {
//                 const newStudentData = response.data.student;
//                 setStudata(prevStudata => [...prevStudata, newStudentData]);
//                 alert("Student Succesfully Added")
//                 closeAddModal();
//                 setNewStudent({
//                     stu_name: '', reg_no: '',
//                     batch: '', mentor: '', emis: ''
//                 })
//                 setSelectedCategory('');
//                 setSelectedDeptId('');
//                 setSelectedSemester('');
//                 setSelectedSection('');
//                 setSelectedCourseCodes([]);
//             }
//             else {
//                 alert("Failed to Save Student. Please try again.");
//             }
//         }
//         catch (error) {
//             console.error("Error adding Student :", error);
//             alert("An error occurred while adding the Student.");
//         }
//     }

//     const handleCheckboxChange = (event) => {
//         const { value, checked } = event.target;
//         setSelectedCourseCodes((prevSelected) =>
//             checked
//                 ? [...prevSelected, value]
//                 : prevSelected.filter((code) => code !== value)
//         )
//     }

//     const openEditModal = (student) => {
//         setEditStudent({ ...student });
//         setIsEditModalOpen(true);
//     }

//     const closeEditModal = () => {
//         setIsEditModalOpen(false);
//         setEditStudent(null);
//     }

//     const handleEditInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditStudent((prev) => ({ ...prev, [name]: value }));
//     }


//     // Save the Edited Student

//     const handleSaveEditStudent = async () => {
//         try {
//             const response = await axios.put(`${apiUrl}/api/editstudent`, editStudent);
//             if (response.status === 200) {
//                 setStudata((prev) =>
//                     prev.map((student) =>
//                         student.reg_no === editStudent.reg_no ? response.data.student : student
//                     )
//                 );
//                 alert("Student Updated Successfully!");
//                 closeEditModal();
//             }
//             else {
//                 alert("Failed to update student. Please try again.");
//             }
//         }
//         catch (error) {
//             console.error('Error updating Student:', error);
//             alert("An error occurred while updating the student.");
//         }
//     }

//     // Open Delete Modal

//     const openDeleteModal = (student) => {
//         setStudentToDelete(student);
//         setIsDeleteModalOpen(true);
//     }

//     // Close Delete Modal

//     const closeDeleteModal = () => {
//         setIsDeleteModalOpen(false);
//         setStudentToDelete(null);
//     }

//     // Confirm Delete

//     const handleConfirmDelete = async () => {
//         try {
//             await axios.delete(`${apiUrl}/api/deletestudent/${studentToDelete.reg_no}`);
//             setStudata((prev) => prev.filter((student) => student.reg_no !== studentToDelete.reg_no));
//             closeDeleteModal();
//         }
//         catch (error) {
//             console.error('Error deleting student:', error);
//         }
//     }

//     // if (loading) { return <div><center><img src={Loading} alt="" className="img" /></center></div> }

//     return (
//         <div className="sm-main">
//             {/* <span className="scm-top-heading">STUDENT DETAILS</span>
//             <div className="scm-input-btn">
//                 <input
//                     className="scm-search"
//                     type="text"
//                     placeholder="Search ..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <button
//                     className="scm-save-btn"
//                     onClick={openAddModal}
//                 >
//                     <span>ADD</span><FontAwesomeIcon icon={faPlus} className="smst-icon-add" />
//                 </button>
//             </div>
//             <table className="student-table">
//                 <thead>
//                     <tr>
//                         <th className="student-header">S No</th>
//                         <th className="student-header">Reg No</th>
//                         <th className="student-header">Category</th>
//                         <th className="student-header">Name</th>
//                         <th className="student-header">Dept Id</th>
//                         <th className="student-header">Batch</th>
//                         <th className="student-header">Sem</th>
//                         <th className="student-header">Sec</th>
//                         <th className="student-header">Edit</th>
//                         <th className="student-header">Delete</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredStudata.length > 0 ? (
//                         filteredStudata.map((student, student) => (
//                             <tr key={student.reg_no}>
//                                 <td className="student-data">{student + 1}</td>
//                                 <td className="student-data">{student.reg_no}</td>
//                                 <td className="student-data">{student.category}</td>
//                                 <td className="student-data-stu">{student.stu_name}</td>
//                                 <td className="student-data">{student.dept_id}</td>
//                                 <td className="student-data">{student.batch}</td>
//                                 <td className="student-data">{student.semester}</td>
//                                 <td className="student-data">{student.section}</td>
//                                 <td className="student-data">
//                                     <button className="scm-edit-btn" onClick={openEditModal}>
//                                         <span className="sm-edit-btn">
//                                             Edit &nbsp;
//                                             <FontAwesomeIcon icon={faEdit} className="scm-icon" />
//                                         </span>
//                                     </button>
//                                 </td>
//                                 <td className="student-data">
//                                     <button className="scm-del-btn" onClick={() => openDeleteModal(student)}>
//                                         <span className="sc-del-btn">
//                                             Delete &nbsp;
//                                             <FontAwesomeIcon icon={faTrash} className="scm-icon" />
//                                         </span>
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="10" className="hod-repo-td">
//                                 No Data Available.
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table> */}
//             {/* {isAddModalOpen && (
//                 <div className="stu-add-modal">
//                     <div className="stu-add-content">
//                         <span className='stu-span'>ADD STUDENT</span>
//                         <div className='stu-add-input-container'>
//                             <input
//                                 type="text"
//                                 name="stu_name"
//                                 placeholder="Student Name"
//                                 value={newStudent.stu_name}
//                                 onChange={handleAddInputChange}
//                                 className='stu-add-indi-input'
//                             />
//                             <input
//                                 type="text"
//                                 name="reg_no"
//                                 placeholder="Registration Number"
//                                 value={newStudent.reg_no}
//                                 onChange={handleAddInputChange}
//                                 className='stu-add-indi-input'
//                             />
//                         </div>
//                         <div className='student-add-input-container'>
//                             <input
//                                 type="number"
//                                 name="batch"
//                                 placeholder="Batch"
//                                 value={newStudent.batch}
//                                 onChange={handleAddInputChange}
//                                 className='stu-add-indi-input'
//                             />
//                             <input
//                                 type="text"
//                                 name="mentor"
//                                 placeholder="Mentor"
//                                 value={newStudent.mentor}
//                                 onChange={handleAddInputChange}
//                                 className='stu-add-indi-input'
//                             />
//                             <input
//                                 type="number"
//                                 name="emis"
//                                 placeholder="Emis"
//                                 value={newStudent.emis}
//                                 onChange={handleAddInputChange}
//                                 className='stu-add-indi-input'
//                             />
//                         </div>
//                         <div className="student-add-dropdowns">
//                             <select className="stu-select" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
//                                 <option className="stu-option" value="default">Category</option>
//                                 {categories.map((category, student) => (
//                                     <option className="stu-option" key={student} value={category}>
//                                         {category}
//                                     </option>
//                                 ))}
//                             </select>
//                             <select className="stu-select" value={selecteddeptId} onChange={(e) => handledeptIdChange(e.target.value)}>
//                                 <option className="stu-option" value="default">Dept Id</option>
//                                 {deptId.map((course, student) => (
//                                     <option className="stu-option" key={student} value={course}>
//                                         {course}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="student-add-dropdowns">
//                             <select className="stu-select" value={selectedSemester} onChange={(e) => handleSemesterChange(e.target.value)}>
//                                 <option className="stu-option" value="default">Semester</option>
//                                 {semester.map((sem, student) => (
//                                     <option className="stu-option" key={student} value={sem}>
//                                         {sem}
//                                     </option>
//                                 ))}
//                             </select>
//                             <select className="stu-select" value={selectedSection} onChange={(e) => handleSectionChange(e.target.value)}>
//                                 <option className="stu-option" value="default">Section</option>
//                                 {section.map((sec, student) => (
//                                     <option className="stu-option" key={student} value={sec}>
//                                         {sec}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className='stu-btn-container'>
//                             <button onClick={handleFetchCourse} className='stu-btn-1'>GET COURSE CODE</button>
//                             <button onClick={closeAddModal} className='stu-btn-2'>CANCEL</button>
//                         </div>
//                         {courseCodes.length > 0 && (
//                             <div className="checkbox-container">
//                                 <div className="checkbox-student">
//                                     {courseCodes.map((courseCode, student) => (
//                                         <div key={student} className="checkbox-item">
//                                             <input
//                                                 type="checkbox"
//                                                 id={`course-${courseCode}`}
//                                                 value={courseCode}
//                                                 onChange={handleCheckboxChange}
//                                                 className="custom-checkbox"
//                                             />
//                                             <label htmlFor={`course-${courseCode}`} className="checkbox-label">
//                                                 {courseCode}
//                                             </label>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className='stu-btn-container2'>
//                                     <button onClick={handleSaveStudent} className='stu-btn-3'>SAVE</button>
//                                     <button onClick={closeAddModal} className='stu-btn-2'>CANCEL</button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//             {isDeleteModalOpen && studentToDelete && (
//                 <div className="stu-del-modal">
//                     <div className="stu-del-content">
//                         <h2>Confirm Delete</h2>
//                         <p>
//                             Are you sure you want to delete the student with Registration Number{' '}
//                             <strong>{studentToDelete.reg_no}</strong>?
//                         </p>
//                         <div className="stu-del-actions">
//                             <button onClick={handleConfirmDelete} className="stu-btn-3">CONFIRM</button>
//                             <button onClick={closeDeleteModal} className="stu-btn-2">CANCEL</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {isEditModalOpen && editStudent && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <h3>Edit Student</h3>
//                         <input
//                             type="text"
//                             name="stu_name"
//                             placeholder="Student Name"
//                             value={editStudent.stu_name || ''}
//                             onChange={handleEditInputChange}
//                         />
//                         <input
//                             type="text"
//                             name="reg_no"
//                             placeholder="Registration Number"
//                             value={editStudent.reg_no || ''}
//                             disabled
//                         />
//                         <input
//                             type="number"
//                             name="batch"
//                             placeholder="Batch"
//                             value={editStudent.batch || ''}
//                             onChange={handleEditInputChange}
//                         />
//                         <input
//                             type="text"
//                             name="mentor"
//                             placeholder="Mentor Name"
//                             value={editStudent.mentor || ''}
//                             onChange={handleEditInputChange}
//                         />
//                         <input
//                             type="number"
//                             name="emis"
//                             placeholder="Emis No"
//                             value={editStudent.emis || ''}
//                             onChange={handleEditInputChange}
//                         />
//                         <input
//                             type="text"
//                             name="section"
//                             placeholder="Section"
//                             value={editStudent.section || ''}
//                             onChange={handleEditInputChange}
//                         />
//                         <input
//                             type="text"
//                             name="semester"
//                             placeholder="Semester"
//                             value={editStudent.semester || ''}
//                             onChange={handleEditInputChange}
//                         />
//                         <input
//                             type="text"
//                             name="category"
//                             placeholder="Category"
//                             value={editStudent.category || ''}
//                             onChange={handleEditInputChange}
//                         />
//                         <button onClick={handleSaveEditStudent}>Save</button>
//                         <button onClick={closeEditModal}>Cancel</button>
//                     </div>
//                 </div>
//             )} */}
//             <div className="sm-dropdown-container">
//                 <div className="sm-search-cnt">
//                     <span className="sm-label">Academic Year : </span>
//                     <input
//                         type="text"
//                         className="sm-select"
//                         readOnly
//                         disabled
//                     />
//                 </div>

//                 <div className="sm-search-cnt">
//                     <span className="sm-label">Category : </span>
//                     <select className="sm-select">
//                         <option className="sm-option" value="">Select</option>
//                     </select>
//                 </div>

//                 <div className="sm-search-cnt">
//                     <span className="sm-label">Department : </span>
//                     <select className="sm-select">
//                         <option className="sm-option" value="">Select</option>
//                     </select>
//                 </div>

//                 <div className="sm-search-cnt">
//                     <span className="sm-label">Class : </span>
//                     <select className="sm-select">
//                         <option className="sm-option" value="">Select</option>
//                     </select>
//                 </div>

//                 <div className="sm-search-cnt">
//                     <span className="sm-label">Semester : </span>
//                     <select className="sm-select">
//                         <option className="sm-option" value="">Select</option>
//                     </select>
//                 </div>

//                 <div className="sm-search-cnt">
//                     <span className="sm-label">Section : </span>
//                     <select className="sm-select">
//                         <option className="sm-option" value="">Select</option>
//                     </select>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default StudentManage;



import React, { useEffect, useState } from "react";
import "./studentmanage.css";
import axios from "axios";
import SearchableDropdown from "../../../common/SearchableDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../../assets/load.svg'
import AddModal from './addmodal'
import DeleteModal from "./deletemodal";

function StudentManage() {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [category, setCategory] = useState("");
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    // FETCH DROPDOWN VALUES
    useEffect(() => {
        const fetchDropdownValues = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/student/manage/dropdownValues`);
                setDepartments(response.data.uniqueDeptId || []);
                setSemesters(response.data.uniqueSemester || []);
            } catch (err) {
                console.error("Error fetching dropdown values:", err);
                setError("Failed to fetch dropdown values");
            }
        };
        fetchDropdownValues();
    }, [apiUrl]);

    // FETCH STUDENT LIST
    const handleFetchStudents = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${apiUrl}/api/student/manage/studentsList`, {
                semester, department, category,
            });
            setStudentData(response.data.studentsList || []);
        } catch (err) {
            console.error("Error fetching students for student manage : ", err);
            setError("Failed to fetch students");
        } finally { setLoading(false) }
    }

    const formatOptions = (arr, key) =>
        (arr || []).map((item) => ({
            value: String(item[key] || item),
            label: String(item[key] || item),
        }))

    const closeAddModal = () => { setAddModal(false) }
    const closeDeleteModal = () => { setDeleteModal(false) }

    return (
        <div className="sm-main">
            <div className="sm-dropdown-container">

                {/* Category Dropdown */}
                <SearchableDropdown
                    label="Category : "
                    options={[
                        { value: "AIDED", label: "AIDED" },
                        { value: "SFM", label: "SFM" },
                        { value: "SFW", label: "SFW" },
                    ]}
                    value={category}
                    getOptionLabel={(c) => (typeof c === "string" ? c : c.label)}
                    onSelect={(c) => setCategory(typeof c === "string" ? c : c?.value || "")}
                    placeholder="CATEGORY"
                />

                {/* Department Dropdown */}
                <SearchableDropdown
                    label="Department Id : "
                    options={formatOptions(departments, "dept_id")}
                    value={department}
                    getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                    onSelect={(d) => setDepartment(typeof d === "string" ? d : d?.value || "")}
                    placeholder="DEPARTMENT"
                />

                {/* Semester Dropdown */}
                <SearchableDropdown
                    label="Semester : "
                    options={formatOptions(semesters, "semester")}
                    value={semester}
                    getOptionLabel={(s) => (typeof s === "string" ? s : s.label)}
                    onSelect={(s) => setSemester(typeof s === "string" ? s : s?.value || "")}
                    placeholder="SEMESTER"
                />
            </div>

            <div className="sm-btn-content">
                <button className="sm-btn" onClick={handleFetchStudents} disabled={loading}>
                    {loading ? "Loading..." : "Get Students"}
                </button>
            </div>

            <div className="smsm-input-btn">
                <input className="smsm-search" type="text" placeholder="Search ..." />
                <button className="smsm-save-btn" onClick={() => setAddModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="smsm-icon" /><span>Add</span>
                </button>
            </div>

            {/* Students List */}
            <table className="smst-table">
                <thead>
                    <tr>
                        <th>S. No.</th>
                        <th>Reg. No.</th>
                        <th>Student Name</th>
                        <th>Category</th>
                        <th>Dept Id</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="9" style={{ textAlign: "center" }}>
                                <img src={Loading} alt="Loading..." className="img" />
                            </td>
                        </tr>
                    ) : studentData.length > 0 ? (
                        studentData.map((student, index) => (
                            <tr
                                key={student.reg_no}
                                className={index % 2 === 0 ? "smst-repo-light" : "smst-repo-dark"}
                            >
                                <td>{index + 1}</td>
                                <td>{student.reg_no}</td>
                                <td>{student.stu_name}</td>
                                <td>{student.category}</td>
                                <td>{student.dept_id}</td>
                                <td>{student.semester}</td>
                                <td>{student.section}</td>
                                <td className="staff-repo-action">
                                    <button className="smsm-edit-btn">
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </button>
                                </td>
                                <td className="staff-repo-action">
                                    <button
                                        className="smsm-del-btn"
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setDeleteModal(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" style={{ textAlign: "center", height: '55px' }}>
                                No Data Available.
                            </td>
                        </tr>
                    )}
                </tbody>
                <AddModal addModal={addModal} closeAddModal={closeAddModal} />
                <DeleteModal
                    deleteModal={deleteModal}
                    closeDeleteModal={closeDeleteModal}
                    student={selectedStudent}
                />
            </table>
        </div>
    )
}

export default StudentManage;