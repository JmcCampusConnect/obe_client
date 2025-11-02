import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import '../../css/StaffCourseManage.css';
import AddModal from '../../components/StaffCourseManage/AddStaffCourseModal';
import EditModal from '../../components/StaffCourseManage/EditStaffCourseModal';
import DeleteModal from '../../components/StaffCourseManage/DeleteStaffCourse';
import StaffCourseTable from '../../components/StaffCourseManage/StaffCourseTable';
import StaffCourseHeader from '../../components/StaffCourseManage/StaffCourseHeader';
import StaffCourseFilter from '../../components/StaffCourseManage/StaffCourseFilter';

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
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDeptId, setFilterDeptId] = useState('');
    const [filterStaffId, setFilterStaffId] = useState('');
    const [filterCourseCode, setFilterCourseCode] = useState('');
    const [filterSection, setFilterSection] = useState('');

    const fixField = val => (Array.isArray(val) ? val[0] || '' : val);

    useEffect(() => {
        const fetchStaffDetails = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/staffcoursemanage`);
                setStaffData(response.data);
            } catch (error) {
                console.error('Error fetching staff data:', error);
            }
        };
        fetchStaffDetails();
    }, [apiUrl]);

    useEffect(() => {
        const fetchStaffIds = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/staffId`);
                setStaffId(response.data);
            } catch (error) {
                console.error('Error fetching staff IDs:', error);
            }
        };
        fetchStaffIds();
    }, [apiUrl]);

    const courseCodeOptions = useMemo(() => {
        const uniqueCourses = staffData.reduce((acc, staff) => {
            if (staff.course_code && !acc[staff.course_code]) {
                acc[staff.course_code] = staff.course_title || staff.course_code;
            }
            return acc;
        }, {});
        return Object.entries(uniqueCourses).map(([code, title]) => ({
            value: code,
            label: `${code} - ${title}`,
        }));
    }, [staffData]);

    const deptIdOptions = useMemo(() => {
        const uniqueDepts = staffData.reduce((acc, staff) => {
            if (staff.dept_id && !acc[staff.dept_id]) {
                acc[staff.dept_id] = staff.dept_name || staff.dept_id;
            }
            return acc;
        }, {});
        return Object.entries(uniqueDepts).map(([id, name]) => ({
            value: id,
            label: `${id} - ${name}`,
        }));
    }, [staffData]);

    const sectionOptions = useMemo(
        () =>
            [...new Set(staffData.map(d => d.section).filter(Boolean))].map(sec => ({
                value: sec,
                label: sec,
            })),
        [staffData]
    );

    const staffIdOptions = useMemo(() => {
        const uniqueStaff = staffData.reduce((acc, staff) => {
            if (staff.staff_id && !acc[staff.staff_id]) {
                acc[staff.staff_id] = staff.staff_name || staff.staff_id;
            }
            return acc;
        }, {});
        return Object.entries(uniqueStaff).map(([id, name]) => ({
            value: id,
            label: `${id} - ${name}`,
        }));
    }, [staffData]);

    const clearAllFilters = () => {
        setFilterCategory('');
        setFilterDeptId('');
        setFilterStaffId('');
        setFilterCourseCode('');
        setFilterSection('');
    };

    const filteredStaffData = useMemo(() => {
        const searchedData = staffData.filter(staff => {
            const lower = searchTerm.toLowerCase();
            return (
                staff.section?.toLowerCase().includes(lower) ||
                staff.dept_id?.toLowerCase().includes(lower) ||
                staff.course_title?.toLowerCase().includes(lower) ||
                staff.course_code?.toLowerCase().includes(lower) ||
                staff.staff_id?.toLowerCase().includes(lower) ||
                staff.category?.toLowerCase().includes(lower) ||
                staff.staff_name?.toLowerCase().includes(lower)
            );
        });
        return searchedData.filter(staff => {
            if (filterCategory && staff.category !== filterCategory) return false;
            if (filterDeptId && staff.dept_id !== filterDeptId) return false;
            if (filterStaffId && staff.staff_id !== filterStaffId) return false;
            if (filterCourseCode && staff.course_code !== filterCourseCode) return false;
            if (filterSection && staff.section !== filterSection) return false;
            return true;
        });
    }, [staffData, searchTerm, filterCategory, filterDeptId, filterStaffId, filterCourseCode, filterSection]);

    useEffect(() => setPage(1), [searchTerm, filterCategory, filterDeptId, filterStaffId, filterCourseCode, filterSection]);
    const totalPages = Math.ceil(filteredStaffData.length / pageSize);

    const handleStaffIdChange = async value => {
        setSelectedStaffId(value);
        try {
            const response = await axios.post(`${apiUrl}/api/staffname`, { staff_id: value });
            setStaffName(fixField(response.data));
        } catch (error) {
            console.error('Error fetching staff name:', error);
        }
    };

    const handleCategoryChange = async value => {
        setSelectedCategory(value);
        try {
            const response = await axios.post(`${apiUrl}/api/depId`, { category: value });
            setDeptId(response.data);
        } catch (error) {
            console.error('Error fetching dept ID:', error);
        }
    };

    const handleIdChange = async value => {
        setSelectedDeptId(value);
        try {
            const response = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: value });
            setDeptName(fixField(response.data.uniqueDeptNames));
            setDegree(fixField(response.data.uniqueDegrees));
            setSemester(response.data.uniqueSemester);
        } catch (error) {
            console.error('Error fetching dept name:', error);
        }
    };

    const handleSemChange = async value => {
        setSelectedSemester(value);
        try {
            const response = await axios.post(`${apiUrl}/api/scmsection`, {
                semester: value,
                dept_id: selectedDeptId,
                category: selectedCategory,
            });
            setSection(response.data.section);
            setCourseCode(response.data.courseCode);
        } catch (error) {
            console.error('Error fetching section:', error);
        }
    };

    const handleSectionChange = value => setSelectedSection(value);

    const handleCourseCodeChange = async value => {
        setSelectedCourseCode(value);
        try {
            const response = await axios.post(`${apiUrl}/api/scmcoursetitle`, { courseCode: value });
            setCourseTitle(fixField(response.data.courseTitle));
            setBatch(fixField(response.data.batch));
        } catch (error) {
            console.error('Error fetching course title:', error);
        }
    };

    const handleOpenEditModal = async staff => {
        setEditStaff(staff);
        setSelectedCategory(staff.category);
        setSelectedDeptId(staff.dept_id);
        setSelectedSemester(staff.semester);
        setIsEditModalOpen(true);
        try {
            const deptIdResponse = await axios.post(`${apiUrl}/api/depId`, { category: staff.category });
            setDeptId(deptIdResponse.data);
        } catch (error) {
            console.error('Error fetching ALL Dept IDs for category:', error);
        }
        try {
            const deptDetails = await axios.post(`${apiUrl}/api/departmentname`, { dept_id: staff.dept_id });
            setDeptName(fixField(deptDetails.data.uniqueDeptNames));
            setDegree(fixField(deptDetails.data.uniqueDegrees));
            setSemester(deptDetails.data.uniqueSemester);
        } catch (error) {
            console.error('Error fetching department details:', error);
        }
        try {
            const resp = await axios.post(`${apiUrl}/api/scmsection`, {
                semester: staff.semester,
                dept_id: staff.dept_id,
                category: staff.category,
            });
            setSection(resp.data.section);
            setCourseCode(resp.data.courseCode);
        } catch (error) {
            console.error('Error fetching sections and course codes:', error);
        }
    };

    const handleSaveStaff = async () => {
        const payload = {
            staff_id: selectedStaffId?.toString().trim() || '',
            staff_name: staffName,
            category: selectedCategory,
            dept_id: selectedDeptId,
            dept_name: deptName,
            degree,
            batch,
            semester: selectedSemester,
            section: selectedSection,
            course_code: selectedCourseCode,
            course_title: courseTitle,
        };
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
    };

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
    };

    const handleDeleteStaff = async (s_no, staff_id, course_code, category, section, dept_id) => {
        try {
            const response = await axios.delete(`${apiUrl}/api/deletestaff`, {
                params: { staff_id, course_code, category, section, dept_id },
            });
            if (response.status === 200) {
                setStaffData(prev => prev.filter(staff => staff.s_no !== s_no));
                alert('Staff course deleted successfully!');
                setDeleteStaff(null);
            }
        } catch (error) {
            console.error('Error deleting staff course:', error);
            alert('Failed to delete staff course.');
        }
    };

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
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterDeptId={filterDeptId}
                setFilterDeptId={setFilterDeptId}
                depts={deptIdOptions}
                filterStaffId={filterStaffId}
                setFilterStaffId={setFilterStaffId}
                staffOptions={staffIdOptions}
                filterCourseCode={filterCourseCode}
                setFilterCourseCode={setFilterCourseCode}
                courseCodeOptions={courseCodeOptions}
                filterSection={filterSection}
                setFilterSection={setFilterSection}
                sectionOptions={sectionOptions}
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
                isOpen={isAddModalOpen}
                closeModal={() => setIsAddModalOpen(false)}
                staffId={staffId}
                selectedStaffId={selectedStaffId}
                handleStaffIdChange={handleStaffIdChange}
                staffName={staffName}
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                deptId={deptId}
                selectedDeptId={selectedDeptId}
                handleIdChange={handleIdChange}
                setStaffName={setStaffName}
                setDeptName={setDeptName}
                staffData={staffData}
                deptName={deptName}
                degree={degree}
                semester={semester}
                selectedSemester={selectedSemester}
                handleSemChange={handleSemChange}
                section={section}
                selectedSection={selectedSection}
                handleSectionChange={handleSectionChange}
                courseCode={courseCode}
                selectedCourseCode={selectedCourseCode}
                handleCourseCodeChange={handleCourseCodeChange}
                courseTitle={courseTitle}
                batch={batch}
                handleAddInputChange={e => setBatch(e.target.value)}
                handleSaveStaff={handleSaveStaff}
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
                    } catch (error) {
                        console.error(error);
                    }
                }}
                handleEditInputChange={e => {
                    const { name, value } = e.target;
                    setEditStaff(prev => ({ ...prev, [name]: value }));
                    if (name === 'semester') handleSemChange(value);
                }}
                deptId={deptId}
                handleEditCategoryChange={async value => {
                    setEditStaff(prev => ({
                        ...prev,
                        category: value,
                        dept_id: '',
                        dept_name: '',
                        degree: '',
                        semester: '',
                        section: '',
                        course_code: '',
                        course_title: '',
                        batch: '',
                    }));
                    try {
                        const response = await axios.post(`${apiUrl}/api/depId`, { category: value });
                        setDeptId(response.data);
                        setSemester([]);
                        setSection([]);
                        setCourseCode([]);
                    } catch (error) {
                        console.error('Error fetching Dept IDs:', error);
                    }
                }}
                handleEditDeptIdChange={async value => {
                    setEditStaff(prev => ({ ...prev, dept_id: value, semester: '', section: '', course_code: '', course_title: '', batch: '' }));
                    try {
                        const response = await axios.post(`${apiUrl}/api/deptdetails`, { dept_id: value });
                        setEditStaff(prev => ({
                            ...prev,
                            dept_name: fixField(response.data.deptName),
                            degree: fixField(response.data.degree),
                        }));
                    } catch (error) {
                        console.error('Error fetching Dept details:', error);
                    }
                    try {
                        const response = await axios.post(`${apiUrl}/api/semester`, { dept_id: value, category: editStaff.category });
                        setSemester(response.data);
                        setSection([]);
                        setCourseCode([]);
                    } catch (error) {
                        console.error('Error fetching Semesters:', error);
                    }
                }}
                handleEditSemChange={async value => {
                    setEditStaff(prev => ({ ...prev, semester: value, section: '', course_code: '', course_title: '', batch: '' }));
                    try {
                        const response = await axios.post(`${apiUrl}/api/section`, {
                            dept_id: editStaff.dept_id,
                            category: editStaff.category,
                            semester: value,
                        });
                        setSection(response.data);
                    } catch (error) {
                        console.error('Error fetching Sections:', error);
                    }
                    try {
                        const response = await axios.post(`${apiUrl}/api/coursecode`, {
                            dept_id: editStaff.dept_id,
                            category: editStaff.category,
                            semester: value,
                        });
                        setCourseCode(response.data);
                    } catch (error) {
                        console.error('Error fetching Course Codes:', error);
                    }
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
                            batch: fixField(response.data.batch),
                        }));
                    } catch (error) {
                        console.error(error);
                    }
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