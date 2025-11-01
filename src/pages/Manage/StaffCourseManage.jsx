import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import '../../css/StaffCourseManage.css';
import AddModal from './addmodal';
import EditModal from '../../components/StaffCourseManage/EditStaffCourseModal';
import DeleteModal from '../../components/StaffCourseManage/DeleteStaffCourse';
import StaffCourseTable from '../../components/StaffCourseManage/StaffCourseTable';
import StaffCourseHeader from '../../components/StaffCourseManage/StaffCourseHeader';
import StaffCourseFilter from '../../components/StaffCourseManage/StaffCourseFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Assuming the necessary icons are imported or accessible
// import { faEdit, faTrash, faPlus } from '@fortawesome/@fortawesome/free-solid-svg-icons'; 

const StaffCourseManage = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [staffData, setStaffData] = useState([]);
    
    // --- State for Search and Filtering ---
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDeptId, setFilterDeptId] = useState('');     
    const [filterStaffId, setFilterStaffId] = useState('');   
    const [filterCourseCode, setFilterCourseCode] = useState('');
    const [filterSection, setFilterSection] = useState('');   

    // --- State for Modals/CRUD operations ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editStaff, setEditStaff] = useState({});
    const [deleteStaff, setDeleteStaff] = useState(null);

    // --- State for Add/Edit Modal Dropdowns (Fetched Data) ---
    const [staffId, setStaffId] = useState([]); // Raw data: [{ staff_id: '...', staff_name: '...' }]
    const [deptId, setDeptId] = useState([]); // Raw data (Category-dependent for Add/Edit): [{ dept_id: '...' }]

    // --- State for Add/Edit Modal Selections ---
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [staffName, setStaffName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
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

    // --- State for Pagination ---
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Helper function
    const fixField = val => Array.isArray(val) ? val[0] || '' : val;

    // --- API Calls (Data Fetching) ---

    // 1. STAFF COURSE LIST FOR DISPLAY
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

    // 2. STAFF ID TO DISPLAY IN DROPDOWNS (For Add/Edit Modals & Filters)
    useEffect(() => {
        const fetchStaffIds = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/staffId`);
                setStaffId(response.data);
            } catch (error) { console.error('Error fetching staff details : ', error) }
        };
        fetchStaffIds();
    }, [apiUrl])
    
    // 3. FETCH COURSE DETAILS (Section & Course Code lists for ADD MODAL)
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
    }, [selectedCategory, selectedDeptId, selectedSemester, apiUrl])

    // --- ADD MODAL Handlers ---

    // FETCH STAFF NAME
    const handleStaffIdChange = async value => {
        setSelectedStaffId(value);
        setStaffName('');
        if (!value) return setStaffName('');
        try {
            const response = await axios.post(`${apiUrl}/api/staffname`, { staff_id: value });
            setStaffName(fixField(response.data));
        } catch (error) {
            console.error('Error in fetching staff name : ', error);
        }
    }

    // FETCH DEPT ID LIST
    const handleCategoryChange = async value => {
        setSelectedCategory(value);
        setDeptId([]);
        setSelectedDeptId('');
        setDeptName('');
        setDegree('');
        setSemester([]);
        setSection([]);
        setCourseCode([]);
        if (!value) return;

        try {
            const response = await axios.post(`${apiUrl}/api/depId`, { category: value });
            setDeptId(response.data);
        } catch (error) { console.error('Error in fetching dept id : ', error) }
    }

    // FETCH DEPT NAME, DEGREE, SEMESTER LIST
    const handleIdChange = async value => {
        setSelectedDeptId(value);
        setDeptName('');
        setDegree('');
        setSemester([]);
        setSelectedSemester('');
        setSection([]);
        setCourseCode([]);
        if (!value) return;

        try {
            const response = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: value });
            setDeptName(fixField(response.data.uniqueDeptNames));
            setDegree(fixField(response.data.uniqueDegrees));
            setSemester(response.data.uniqueSemester);
        } catch (error) { console.error('Error in fetching dept name : ', error) }
    }

    // FETCH SECTION & COURSE CODE LIST
    const handleSemChange = async value => {
        setSelectedSemester(value);
        setSection([]);
        setCourseCode([]);
        setSelectedSection('');
        setSelectedCourseCode('');
        setCourseTitle('');
        setBatch('');
        if (!value || !selectedDeptId || !selectedCategory) return;
        
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

    // FETCH COURSE TITLE & BATCH
    const handleCourseCodeChange = async value => {
        setSelectedCourseCode(value);
        setCourseTitle('');
        setBatch('');
        if (!value) return;
        
        try {
            const response = await axios.post(`${apiUrl}/api/scmcoursetitle`, { courseCode: value });
            setCourseTitle(fixField(response.data.courseTitle));
            setBatch(fixField(response.data.batch));
        } catch (error) { console.error('Error in fetching course title : ', error) }
    }

    // --- EDIT MODAL Handlers (Condensed for brevity) ---

    const handleOpenEditModal = async staff => {
        setEditStaff(staff);
        setSelectedCategory(staff.category);
        setSelectedDeptId(staff.dept_id);     
        setSelectedSemester(staff.semester);   
        setIsEditModalOpen(true);

        try {
            const deptIdResponse = await axios.post(`${apiUrl}/api/depId`, { category: staff.category });
            setDeptId(deptIdResponse.data);

            const deptResponse = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: staff.dept_id });
            setDeptName(fixField(deptResponse.data.uniqueDeptNames));
            setDegree(fixField(deptResponse.data.uniqueDegrees));
            setSemester(deptResponse.data.uniqueSemester);

            const courseResponse = await axios.post(`${apiUrl}/api/scmsection`, {
                semester: staff.semester,
                dept_id: staff.dept_id,
                category: staff.category
            });
            setSection(courseResponse.data.section);
            setCourseCode(courseResponse.data.courseCode)
        } catch (error) { console.error('Error pre-loading edit modal data:', error) }
    }

    const handleEditCategoryChange = async (value) => {
        setEditStaff(prev => ({ ...prev, category: value, dept_id: '', dept_name: '', degree: '', semester: '', section: '', course_code: '', course_title: '', batch: '' }));
        setSelectedCategory(value);
        setSemester([]);
        setSection([]);
        setCourseCode([]);
        if (!value) return setDeptId([]);
        
        try {
            const response = await axios.post(`${apiUrl}/api/depId`, { category: value });
            setDeptId(response.data);
        } catch (error) { console.error('Error in fetching dept id for edit: ', error) }
    };

    const handleEditDeptIdChange = async (value) => {
        setEditStaff(prev => ({ ...prev, dept_id: value, semester: '', section: '', course_code: '', course_title: '', batch: '' }));
        setSelectedDeptId(value);
        setSemester([]);
        setSection([]);
        setCourseCode([]);
        if (!value) return;

        try {
            const deptDetails = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: value });
            const newDeptName = fixField(deptDetails.data.uniqueDeptNames);
            const newDegree = fixField(deptDetails.data.uniqueDegrees);
            const newSemesterList = deptDetails.data.uniqueSemester;
            setSemester(newSemesterList);

            setEditStaff(prev => ({
                ...prev,
                dept_name: newDeptName,
                degree: newDegree,
                semester: newSemesterList[0] || ''
            }));

            if (newSemesterList.length > 0 && newSemesterList[0] && editStaff.category) {
                // Call the semester change handler with new DeptId to fetch sections/courses
                handleEditSemChange(newSemesterList[0], value, editStaff.category);
            }

        } catch (error) { console.error('Error fetching dept details on edit: ', error); }
    };

    const handleEditSemChange = async (value, deptIdOverride = editStaff.dept_id, categoryOverride = editStaff.category) => {
        const currentDeptId = deptIdOverride;
        const currentCategory = categoryOverride;
        
        setEditStaff(prev => ({ ...prev, semester: value, section: '', course_code: '', course_title: '', batch: '' }));
        setSection([]);
        setCourseCode([]);

        if (!value || !currentDeptId || !currentCategory) return;

        try {
            const response = await axios.post(`${apiUrl}/api/scmsection`, {
                semester: value,
                dept_id: currentDeptId,
                category: currentCategory
            });
            setSection(response.data.section);
            setCourseCode(response.data.courseCode);

            const newSection = response.data.section[0] || '';
            const newCourseCode = response.data.courseCode[0] || '';

            setEditStaff(prev => ({
                ...prev,
                section: newSection,
                course_code: newCourseCode
            }));

            if (newCourseCode) {
                handleEditCourseCodeChange(newCourseCode);
            } else {
                setEditStaff(prev => ({ ...prev, course_title: '', batch: '' }));
            }

        } catch (error) { console.error('Error fetching section/course on edit: ', error) }
    };
    
    const handleEditCourseCodeChange = async value => {
        setEditStaff(prev => ({ ...prev, course_code: value }));
        if (!value) return setEditStaff(prev => ({ ...prev, course_title: '', batch: '' }));
        
        try {
            const response = await axios.post(`${apiUrl}/api/scmcoursetitle`, { courseCode: value });
            setEditStaff(prev => ({
                ...prev,
                course_title: fixField(response.data.courseTitle),
                batch: fixField(response.data.batch)
            }));
        } catch (error) { console.error('Error fetching course title on edit: ', error); }
    };

    // --- CRUD Operations ---

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

    // --- Filtering Logic (Combined Search and Dropdowns) ---

    const filteredStaffData = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();

        return staffData.filter(staff => {
            // 1. Text Search Filter (OR logic)
            const textMatch = 
                (staff.section?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (staff.dept_id?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (staff.course_title?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (staff.course_code?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (staff.staff_id?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (staff.category?.toLowerCase() || '').includes(lowerSearchTerm) ||
                (staff.staff_name?.toLowerCase() || '').includes(lowerSearchTerm);

            // 2. Dropdown Filters (AND logic)
            const categoryMatch = !filterCategory || staff.category === filterCategory;
            const deptIdMatch = !filterDeptId || staff.dept_id === filterDeptId;
            const staffIdMatch = !filterStaffId || staff.staff_id === filterStaffId;
            const courseCodeMatch = !filterCourseCode || staff.course_code === filterCourseCode;
            const sectionMatch = !filterSection || staff.section === filterSection;

            return textMatch && categoryMatch && deptIdMatch && staffIdMatch && courseCodeMatch && sectionMatch;
        });
    }, [staffData, searchTerm, filterCategory, filterDeptId, filterStaffId, filterCourseCode, filterSection]);

    // --- Pagination and Clear Filters (omitted for brevity) ---
    // ... 
    const totalPages = Math.ceil(filteredStaffData.length / pageSize);
    useEffect(() => { setPage(1) }, [searchTerm, filterCategory, filterDeptId, filterStaffId, filterCourseCode, filterSection]);
    
    const clearAllFilters = () => {
        setFilterCategory('');
        setFilterDeptId('');
        setFilterStaffId('');
        setFilterCourseCode('');
        setFilterSection('');
    }

    // --- Data Shaping for Filter Dropdowns (CRITICAL FIXES HERE) ---

    // FIX 1: Map staffId for Filter and Modals (Ensures searchable format: {value, label})
  // StaffCourseManage.jsx - Replace the original definition with this:

const staffIdOptions = useMemo(() => staffId.map(id => {
    // Use optional chaining (?) and nullish coalescing (??)
    const staffIdValue = id?.staff_id ?? 'ID Missing'; 
    const staffNameValue = id?.staff_name ?? 'Name Missing';
    
    return {
        // The value property is crucial for state tracking, use the ID or a placeholder.
        value: id?.staff_id, 
        // The label combines the two values, using placeholders if data is bad.
        label: `${staffIdValue} - ${staffNameValue}` 
    };
}), [staffId]);

    // FIX 2: Generate ALL Department ID options from `staffData` for the Filter 
    // This provides the complete, searchable list for the filter component.
    const allDeptIdOptionsForFilter = useMemo(() => {
        const ids = new Set(staffData.map(s => s.dept_id).filter(Boolean));
        return Array.from(ids).map(id => ({ value: id, label: id }));
    }, [staffData]);

    // Data for the Add/Edit Modal (based on category selection)
    const deptIdOptionsForModal = useMemo(() => deptId.map(d => ({ 
        value: d.dept_id, 
        label: `${d.dept_id}` 
    })), [deptId]);
    
    // Extract unique course codes and sections from current staffData for filter options
    const uniqueCourseCodes = useMemo(() => {
        const codes = new Set(staffData.map(s => s.course_code).filter(Boolean));
        return Array.from(codes).map(code => ({ value: code, label: code }));
    }, [staffData]);

    const uniqueSections = useMemo(() => {
        const sections = new Set(staffData.map(s => s.section).filter(Boolean));
        return Array.from(sections).map(sec => ({ value: sec, label: sec }));
    }, [staffData]);


    return (
        <div className="staff-management-shell">
            
            <StaffCourseHeader 
                searchText={searchTerm}
                handleSearch={setSearchTerm}
                showPopup={() => setIsAddModalOpen(true)}
                setShowFilters={setShowFilters}
            />

            <StaffCourseFilter
                showFilters={showFilters}
                
                // Category Filter
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}

                // Dept ID Filter (Uses the comprehensive, searchable list)
                filterDeptId={filterDeptId}
                setFilterDeptId={setFilterDeptId}
                depts={allDeptIdOptionsForFilter} 

                // Staff ID Filter (Uses the corrected, searchable list)
                filterStaffId={filterStaffId}
                setFilterStaffId={setFilterStaffId}
                staffOptions={staffIdOptions} 

                // Course Code Filter
                filterCourseCode={filterCourseCode}
                setFilterCourseCode={setFilterCourseCode}
                courseCodeOptions={uniqueCourseCodes}

                // Section Filter
                filterSection={filterSection}
                setFilterSection={setFilterSection}
                sectionOptions={uniqueSections}
                
                clearAllFilters={clearAllFilters}
            />

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
                staffId={staffIdOptions} selectedStaffId={selectedStaffId} handleStaffIdChange={handleStaffIdChange} staffName={staffName}
                selectedCategory={selectedCategory} handleCategoryChange={handleCategoryChange} deptId={deptIdOptionsForModal} selectedDeptId={selectedDeptId}
                handleIdChange={handleIdChange} setStaffName={setStaffName} setDeptName={setDeptName} staffData={staffData} deptName={deptName} degree={degree}
                semester={semester} selectedSemester={selectedSemester} handleSemChange={handleSemChange} section={section} selectedSection={selectedSection}
                handleSectionChange={handleSectionChange} courseCode={courseCode} selectedCourseCode={selectedCourseCode} handleCourseCodeChange={handleCourseCodeChange}
                courseTitle={courseTitle} batch={batch} handleAddInputChange={e => setBatch(e.target.value)} handleSaveStaff={handleSaveStaff}
            />

            <EditModal
                staffData={staffData}
                isOpen={isEditModalOpen}
                closeModal={() => setIsEditModalOpen(false)}
                staffId={staffIdOptions}
                editStaff={editStaff}
                
                // In StaffCourseManage.jsx
// ... (inside the return statement, in the <EditModal /> component)

handleEditStaffIdChange={async value => {
    // 1. Update the local state for the edit modal
    setEditStaff(prev => ({ ...prev, staff_id: value }));

    // 2. CRITICAL FIX: Prevent API call if value is falsy (undefined, null, empty string)
    if (!value) {
        setEditStaff(prev => ({ ...prev, staff_name: '' })); // Clear staff name if ID is cleared
        return; // Stop execution
    }
    
    // 3. Proceed with API call if value is valid
    try {
        const response = await axios.post(`${apiUrl}/api/staffname`, { staff_id: value });
        setEditStaff(prev => ({ ...prev, staff_name: fixField(response.data) }));
    } catch (error) { 
        console.error('Error in fetching staff name for edit modal: ', error); 
        // Optional: Add user feedback
    }
}}

// ...
                
                handleEditInputChange={e => {
                    const { name, value } = e.target;
                    setEditStaff(prev => ({ ...prev, [name]: value }));
                    
                    if (name === 'semester') {
                        handleEditSemChange(value);
                    }
                }}
                
                deptId={deptIdOptionsForModal} // Use formatted options for modal
                handleEditCategoryChange={handleEditCategoryChange}
                handleEditDeptIdChange={handleEditDeptIdChange}
                handleEditSemChange={handleEditSemChange} 
                
                semester={semester} 
                section={section} 
                courseCode={courseCode} 
                
                handleEditCourseCodeChange={handleEditCourseCodeChange}
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