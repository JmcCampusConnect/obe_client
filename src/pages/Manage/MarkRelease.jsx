import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import '../../css/MarkRelease.css';
import Loading from '../../assets/load.svg';
import MarkReleaseTable from '../../components/MarkRelease/MarkReleaseTable';
import MarkReleaseHeader from '../../components/MarkRelease/MarkReleaseHeader';
import MarkReleaseFilters from '../../components/MarkRelease/MarkReleaseFilters';

function MarkRelease() {

    const [originalData, setOriginalData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);

    // Lock states
    const [l_cia1, setL_cia1] = useState();
    const [l_cia2, setL_cia2] = useState();
    const [l_a1, setL_a1] = useState();
    const [l_a2, setL_a2] = useState();
    const [l_ese, setL_ese] = useState();

    // Header & Filter states
    const [searchText, setSearchText] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Filter values
    const [filterDeptId, setFilterDeptId] = useState("");
    const [filterStaffId, setFilterStaffId] = useState("");
    const [filterCourseCode, setFilterCourseCode] = useState("");
    const [filterSection, setFilterSection] = useState("");

    // Dropdown Options
    const [deptOptions, setDeptOptions] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [courseCodeOptions, setCourseCodeOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    const apiUrl = import.meta.env.VITE_API_URL;
    const totalPages = filteredData ? Math.ceil(filteredData.length / pageSize) : 1;

    // Fetch report data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/reportdata`);
                const data = res.data;

                if (data.length > 0) {
                    setL_cia1(data[0].l_c1);
                    setL_cia2(data[0].l_c2);
                    setL_a1(data[0].l_a1);
                    setL_a2(data[0].l_a2);
                    setL_ese(data[0].l_ese);
                }

                setOriginalData(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchAllData();
    }, [apiUrl]);

    useEffect(() => {
        if (!originalData) return;

        const getUnique = (key) => {
            const values = [...new Set(originalData.map(item => item[key]).filter(Boolean))];
            return values.map(v => ({ value: v, label: v }));
        };

        // Staff Options (staff_id + staff_name)
        const uniqueStaff = {};
        originalData.forEach(item => {
            if (item.staff_id && !uniqueStaff[item.staff_id]) {
                uniqueStaff[item.staff_id] = `${item.staff_id} - ${item.staff_name}`;
            }
        });
        const staffList = Object.keys(uniqueStaff).map(id => ({
            value: id,
            label: uniqueStaff[id]
        }));

        // Course Options (course_code + course_title)
        const uniqueCourse = {};
        originalData.forEach(item => {
            if (item.course_code && !uniqueCourse[item.course_code]) {
                uniqueCourse[item.course_code] = `${item.course_code} - ${item.course_title}`;
            }
        });
        const courseList = Object.keys(uniqueCourse).map(code => ({
            value: code,
            label: uniqueCourse[code]
        }));

        setDeptOptions(getUnique("dept_id"));
        setSectionOptions(getUnique("section"));
        setStaffOptions(staffList);
        setCourseCodeOptions(courseList);
    }, [originalData]);

    // Unified filtering logic
    const applyFilters = useCallback(() => {

        if (!originalData) return;

        let list = originalData;
        const searchLower = searchText.toLowerCase();

        // Text search
        if (searchLower) {
            list = list.filter(item =>
                (item.staff_id || '').toLowerCase().includes(searchLower) ||
                (item.staff_name || '').toLowerCase().includes(searchLower) ||
                (item.dept_id || '').toLowerCase().includes(searchLower) ||
                (item.course_title || '').toLowerCase().includes(searchLower) ||
                (item.course_code || '').toLowerCase().includes(searchLower)
            );
        }

        // Dropdown filters
        if (filterDeptId) list = list.filter(item => item.dept_id === filterDeptId);
        if (filterStaffId) list = list.filter(item => item.staff_id === filterStaffId);
        if (filterCourseCode) list = list.filter(item => item.course_code === filterCourseCode);
        if (filterSection) list = list.filter(item => item.section === filterSection);

        setFilteredData(list);
    }, [originalData, searchText, filterDeptId, filterStaffId, filterCourseCode, filterSection]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    useEffect(() => {
        setPage(1);
    }, [filteredData?.length]);

    const handleSearch = (text) => setSearchText(text);

    const clearAllFilters = () => {
        setFilterDeptId("");
        setFilterStaffId("");
        setFilterCourseCode("");
        setFilterSection("");
    };

    const handleCheckbox = (index, field, value) => {
        setFilteredData(prevData => {
            const checkData = [...prevData];
            const actualIndex = index + (page - 1) * pageSize;
            if (!checkData[actualIndex]) return prevData;

            checkData[actualIndex] = {
                ...checkData[actualIndex],
                [field]: value ? 2 : 1,
            };
            return checkData;
        });
    };

    const handleUpdate = async (index) => {
        const data = filteredData[index];
        try {
            const res = await axios.put(`${apiUrl}/api/reportrelease`, data);
            alert(res.data?.success ? "Release Updated Successfully" : "Update Failed");
        } catch (err) {
            console.error("Update error:", err);
            alert("Error updating release status");
        }
    };

    if (!filteredData)
        return (
            <div>
                <center>
                    <img src={Loading} alt="Loading..." className="img" />
                </center>
            </div>
        );

    return (
        <div className="staff-management-shell">
            <MarkReleaseHeader
                searchText={searchText}
                handleSearch={handleSearch}
                showPopup={() => alert('Add New Feature Coming Soon')}
                setShowFilters={setShowFilters}
            />

            <MarkReleaseFilters
                showFilters={showFilters}
                clearAllFilters={clearAllFilters}
                filterDeptId={filterDeptId} setFilterDeptId={setFilterDeptId}
                filterStaffId={filterStaffId} setFilterStaffId={setFilterStaffId}
                filterCourseCode={filterCourseCode} setFilterCourseCode={setFilterCourseCode}
                filterSection={filterSection} setFilterSection={setFilterSection}
                depts={deptOptions}
                staffOptions={staffOptions}
                courseCodeOptions={courseCodeOptions}
                sectionOptions={sectionOptions}
            />

            <MarkReleaseTable
                filteredData={filteredData}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                handleCheckbox={handleCheckbox}
                handleUpdate={handleUpdate}
            />
        </div>
    )
}

export default MarkRelease;
