import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/StaffCourseManage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddModal from './addmodal';
import EditModal from '../../components/StaffCourseManage/EditStaffCourseModal';
import DeleteModal from '../../components/StaffCourseManage/DeleteStaffCourse';
import StaffCourseTable from '../../components/StaffCourseManage/StaffCourseTable';
import StaffCourseHeader from '../../components/StaffCourseManage/StaffCourseHeader';

const StaffCourseManage = () => {

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
    const [page, setPage] = useState(1);
    const pageSize = 10;

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

    // FETCH COURSE DETAILS (For ADD MODAL)

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

    // FETCH STAFF NAME (For ADD MODAL)

    const handleStaffIdChange = async value => {
        setSelectedStaffId(value);
        try {
            const response = await axios.post(`${apiUrl}/api/staffname`, { staff_id: value });
            setStaffName(fixField(response.data));
        } catch (error) {
            console.error('Error in fetching staff name : ', error);
        }
    }

    // FETCH DEPT ID (For ADD MODAL)

    const handleCategoryChange = async value => {
        setSelectedCategory(value);
        try {
            const response = await axios.post(`${apiUrl}/api/depId`, { category: value });
            setDeptId(response.data);
            // Reset dependent fields
            setSelectedDeptId('');
            setDeptName('');
            setDegree('');
            setSemester([]);
            setSection([]);
            setCourseCode([]);
        } catch (error) { console.error('Error in fetching dept id : ', error) }
    }

    // FETCH DEPT NAME (For ADD MODAL)

    const handleIdChange = async value => {
        setSelectedDeptId(value);
        try {
            const response = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: value });
            setDeptName(fixField(response.data.uniqueDeptNames));
            setDegree(fixField(response.data.uniqueDegrees));
            setSemester(response.data.uniqueSemester);
            // Reset dependent fields
            setSelectedSemester('');
            setSection([]);
            setCourseCode([]);
        } catch (error) { console.error('Error in fetching dept name : ', error) }
    }

    // FETCH SECTION (For ADD MODAL)

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
            // Reset dependent fields
            setSelectedSection('');
            setSelectedCourseCode('');
            setCourseTitle('');
            setBatch('');
        } catch (error) { console.error('Error in fetching section : ', error) }
    }

    const handleSectionChange = value => setSelectedSection(value);

    // FETCH COURSE TITLE (For ADD MODAL)

    const handleCourseCodeChange = async value => {
        setSelectedCourseCode(value);
        try {
            const response = await axios.post(`${apiUrl}/api/scmcoursetitle`, { courseCode: value });
            setCourseTitle(fixField(response.data.courseTitle));
            setBatch(fixField(response.data.batch));
        } catch (error) { console.error('Error in fetching course title : ', error) }
    }

    // --- EDIT MODAL HANDLERS ---

    const handleOpenEditModal = async staff => {
        setEditStaff(staff);
        setSelectedCategory(staff.category);
        setSelectedDeptId(staff.dept_id);
        setSelectedSemester(staff.semester);
        setIsEditModalOpen(true);

        try {
            // Pre-load department and semester lists
            const deptResponse = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: staff.dept_id });
            setDeptName(fixField(deptResponse.data.uniqueDeptNames));
            setDegree(fixField(deptResponse.data.uniqueDegrees));
            setSemester(deptResponse.data.uniqueSemester);

            // Pre-load section and course code lists
            const courseResponse = await axios.post(`${apiUrl}/api/scmsection`, {
                semester: staff.semester,
                dept_id: staff.dept_id,
                category: staff.category
            });
            setSection(courseResponse.data.section);
            setCourseCode(courseResponse.data.courseCode)
        } catch (error) { console.error('Error pre-loading edit modal data:', error) }
    }

    // EDIT HANDLER 1: Changing Category (fetches new Dept IDs)
    const handleEditCategoryChange = async (value) => {
        setEditStaff(prev => ({ ...prev, category: value, dept_id: '', dept_name: '', degree: '', semester: '', section: '', course_code: '', course_title: '', batch: '' }));
        setSelectedCategory(value);
        try {
            const response = await axios.post(`${apiUrl}/api/depId`, { category: value });
            setDeptId(response.data); // Update the Dept ID list
        } catch (error) { console.error('Error in fetching dept id for edit: ', error) }
    };

    // EDIT HANDLER 2: Changing Dept ID (fetches new Dept Name, Degree, Semesters, Sections, Course Codes)
    const handleEditDeptIdChange = async (value) => {
        // This handler is now defined in the <EditModal> component
        setEditStaff(prev => ({ ...prev, dept_id: value, semester: '', section: '', course_code: '', course_title: '', batch: '' }));
        setSelectedDeptId(value);
        
        if (value) {
            try {
                // Fetch Dept Details
                const deptDetails = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: value });
                const newDeptName = fixField(deptDetails.data.uniqueDeptNames);
                const newDegree = fixField(deptDetails.data.uniqueDegrees);
                const newSemesterList = deptDetails.data.uniqueSemester;
                setSemester(newSemesterList);

                // Update editStaff with dept details
                setEditStaff(prev => ({ 
                    ...prev, 
                    dept_name: newDeptName, 
                    degree: newDegree,
                    // If semesters list is available, set the first one or clear it
                    semester: newSemesterList[0] || '' 
                }));

                // If semesters are available, also fetch sections/courses for the first semester
                if (newSemesterList.length > 0 && newSemesterList[0] && editStaff.category) {
                     handleEditSemChange(newSemesterList[0], value, editStaff.category);
                } else {
                    setSection([]);
                    setCourseCode([]);
                }

            } catch (error) { console.error('Error fetching dept details on edit: ', error); }
        } else {
            setEditStaff(prev => ({ ...prev, dept_name: '', degree: '', semester: '', section: '', course_code: '', course_title: '', batch: '' }));
            setSemester([]);
            setSection([]);
            setCourseCode([]);
        }
    };
    
    // EDIT HANDLER 3: Changing Semester (fetches new Sections and Course Codes)
    const handleEditSemChange = async (value, deptIdOverride = editStaff.dept_id, categoryOverride = editStaff.category) => {
        const currentDeptId = deptIdOverride;
        const currentCategory = categoryOverride;
        
        setEditStaff(prev => ({ ...prev, semester: value, section: '', course_code: '', course_title: '', batch: '' }));
        
        if (value && currentDeptId && currentCategory) {
            try {
                const response = await axios.post(`${apiUrl}/api/scmsection`, {
                    semester: value,
                    dept_id: currentDeptId,
                    category: currentCategory
                });
                setSection(response.data.section);
                setCourseCode(response.data.courseCode);
                
                // Set the first section and course code if available
                setEditStaff(prev => ({
                    ...prev,
                    section: response.data.section[0] || '',
                    course_code: response.data.courseCode[0] || ''
                }));
                
                // If a course code is set, fetch its title and batch
                if (response.data.courseCode[0]) {
                    handleEditCourseCodeChange(response.data.courseCode[0]);
                } else {
                    setEditStaff(prev => ({ ...prev, course_title: '', batch: '' }));
                }
                
            } catch (error) { console.error('Error fetching section/course on edit: ', error) }
        } else {
            setSection([]);
            setCourseCode([]);
        }
    };

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
            // Use the editStaff state directly, clean up array fields if necessary
            const cleanEditStaff = { ...editStaff };
            
            // NOTE: The fixField function is mostly for initial load from DB arrays, 
            // but we'll apply it just to ensure the final payload is clean
            cleanEditStaff.staff_name = fixField(cleanEditStaff.staff_name);
            cleanEditStaff.degree = fixField(cleanEditStaff.degree);
            cleanEditStaff.dept_name = fixField(cleanEditStaff.dept_name);
            cleanEditStaff.course_title = fixField(cleanEditStaff.course_title);
            cleanEditStaff.batch = fixField(cleanEditStaff.batch);

            const response = await axios.post(`${apiUrl}/api/staffCourseEdit`, cleanEditStaff);
            if (response.data.ok) {
                alert('Staff course edited successfully!');
                // Update the local staff data state for the re-render
                setStaffData(prev => prev.map(staff => 
                    (staff.s_no === cleanEditStaff.s_no) ? cleanEditStaff : staff
                ));
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

    const totalPages = Math.ceil(filteredStaffData.length / pageSize);

    useEffect(() => { setPage(1) }, [searchTerm]);

    return (
        <div className="staff-management-shell">
            
            <StaffCourseHeader />

            <StaffCourseTable
                staffCourseData={filteredStaffData}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                handleOpenEditModal={handleOpenEditModal} 
                setDeleteStaff={setDeleteStaff} 
            />

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
                
                // *** FIX: Changed staff ID handler to handle selection and typing separately ***
                handleEditStaffIdChange={async value => {
                    setEditStaff(prev => ({ ...prev, staff_id: value }));
                    try {
                        const response = await axios.post(`${apiUrl}/api/staffname`, { staff_id: value });
                        setEditStaff(prev => ({ ...prev, staff_name: fixField(response.data) }));
                    } catch (error) { console.error(error); }
                }}
                
                handleEditInputChange={e => {
                    const { name, value } = e.target;
                    setEditStaff(prev => ({ ...prev, [name]: value }));
                    
                    // Logic to re-fetch sections/courses when semester changes in edit modal
                    if (name === 'semester') {
                        handleEditSemChange(value);
                    }
                }}
                
                deptId={deptId}
                // *** New handlers for dynamic data fetching in Edit Modal ***
                handleEditCategoryChange={handleEditCategoryChange}
                handleEditDeptIdChange={handleEditDeptIdChange} // Uses the combined handler defined above
                handleEditSemChange={handleEditSemChange} // Uses the combined handler defined above
                
                semester={semester} // List of semesters for the dropdown
                section={section} // List of sections for the dropdown
                courseCode={courseCode} // List of course codes for the dropdown
                
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

export default StaffCourseManage;