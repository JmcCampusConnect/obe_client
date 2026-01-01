import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import '../../css/DepartmentReport.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Loading from '../../assets/load.svg';
import DepartmentReportTable from '../../components/DepartmentReport/DepartmentReportTable';
import DepartmentReportHeader from '../../components/DepartmentReport/DepartmentReportHeader';
import DepartmentReportFilter from '../../components/DepartmentReport/DepartmentReportFilter';

function DepartmentReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);
    const { dept } = useParams();

    const [activeSection, setActiveSection] = useState(
        dept === "alldepartments" ? "all" : "1"
    );

    const activeSectionIsAll = activeSection === "all";
    const isAllMode = activeSection === "all";
    const [academicYear, setAcademicYear] = useState('');
    const [deptStatusReport, setDeptStatusReport] = useState([]);
    const [filter, setFilter] = useState({
        all: true,
        incomplete: true,
        processing: true,
        completed: true
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [filterCategory, setFilterCategory] = useState('');
    const [filterDeptId, setFilterDeptId] = useState('');
    const [filterStaffId, setFilterStaffId] = useState('');
    const [filterCourseCode, setFilterCourseCode] = useState('');
    const [filterSection, setFilterSection] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const [depts, setDepts] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [courseCodeOptions, setCourseCodeOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);

    const pageSize = 100;
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchAcademicYear = async () => {
            try {
                const response = await axios.post(`${apiUrl}/activesem`, {});
                setAcademicYear(response.data.academic_sem);
            } catch (err) {
                console.log('Error fetching Academic Year : ', err);
                alert('Error fetching Academic Year.');
            }
        };
        fetchAcademicYear();
    }, [apiUrl]);

    useEffect(() => {
        if (dept === "alldepartments") {
            setActiveSection("all");
        } else {
            setActiveSection("1");
        }
    }, [dept]);

    useEffect(() => {
        const fetchDeptStatusReport = async () => {
            if (!academicYear) return;
            try {
                const response = await axios.post(`${apiUrl}/api/deptstatusreport`, {
                    academic_sem: academicYear,
                    dept_name: dept === "alldepartments" ? "ALL" : dept
                });

                setDeptStatusReport(response.data);
                setDepts([...new Set(response.data.map(d => d.dept_name))].map(v => ({ value: v, label: v })));
                const uniqueStaff = Array.from(
                    new Map(
                        response.data.map(d => [d.staff_id, { value: d.staff_id, label: `${d.staff_id} - ${d.staff_name}` }])
                    ).values()
                );
                setStaffOptions(uniqueStaff);
                const uniqueCourses = Array.from(
                    new Map(
                        response.data.map(d => [d.course_code, {
                            value: d.course_code,
                            label: d.course_title ? `${d.course_code} - ${d.course_title}` : d.course_code
                        }])
                    ).values()
                );
                setCourseCodeOptions(uniqueCourses);

                const uniqueSections = [...new Set(response.data.map(d => d.section))]
                    .filter(Boolean)
                    .map(v => ({ value: v, label: v }));
                setSectionOptions(uniqueSections);

            } catch (err) {
                alert('Error fetching status report.');
                console.log('Error fetching status report : ', err);
            } finally { setLoading(false) }
        };
        fetchDeptStatusReport();
    }, [academicYear, dept]);

    const handleSearch = (term) => setSearchTerm(term);

    const getStatus = (v) =>
        v === 0 ? "Incomplete" :
            v === 1 ? "Processing" :
                v === 2 ? "Completed" : "";

    const getStatusColor = (v) =>
        v === 0 ? { color: "red" } :
            v === 1 ? { color: "blue" } :
                v === 2 ? { color: "green" } : {};

    const clearAllFilters = () => {
        setFilterCategory('');
        setFilterDeptId('');
        setFilterStaffId('');
        setFilterCourseCode('');
        setFilterSection('');
        setFilterStatus('');
    };

    const expandedAllRows = deptStatusReport.flatMap((d) => {
        return [
            { ...d, part: "CIA - 1", value: d.cia_1 },
            { ...d, part: "CIA - 2", value: d.cia_2 },
            { ...d, part: "ASS - 1", value: d.ass_1 },
            { ...d, part: "ASS - 2", value: d.ass_2 }
        ];
    });

    const baseReport = dept === "alldepartments" && activeSection === "all"
        ? expandedAllRows
        : deptStatusReport;

    const filteredReport = baseReport.filter((d) => {
        const status = (dept === "alldepartments" && activeSection === "all")
            ? d.value
            : (activeSection === "1" ? d.cia_1 :
                activeSection === "2" ? d.cia_2 :
                    activeSection === "3" ? d.ass_1 :
                        d.ass_2);

        const term = searchTerm.toLowerCase();

        const matchesSearch =
            !term ||
            d.staff_id?.toLowerCase().includes(term) ||
            d.staff_name?.toLowerCase().includes(term) ||
            d.dept_name?.toLowerCase().includes(term) ||
            d.course_code?.toLowerCase().includes(term) ||
            d.section?.toLowerCase().includes(term) ||
            d.course_title?.toLowerCase().includes(term);

        const matchesDropdown =
            (!filterDeptId || d.dept_name === filterDeptId) &&
            (!filterStaffId || d.staff_id === filterStaffId) &&
            (!filterCategory || d.category === filterCategory) &&
            (!filterCourseCode || d.course_code === filterCourseCode) &&
            (!filterSection || d.section === filterSection) &&
            (!filterStatus || getStatus(status) === filterStatus);

        if (!matchesSearch || !matchesDropdown) return false;

        if (filter.all) return true;
        if (status === 0 && filter.incomplete) return true;
        if (status === 1 && filter.processing) return true;
        if (status === 2 && filter.completed) return true;

        return false;
    });

    const sortedReport = [...filteredReport].sort((a, b) => {

        const isAllMode = activeSection === "all";

        const getActiveStatus = (d) => (
            activeSection === "1" ? d.cia_1 :
                activeSection === "2" ? d.cia_2 :
                    activeSection === "3" ? d.ass_1 :
                        d.ass_2
        );

        const v1 = isAllMode ? a.value : getActiveStatus(a);
        const v2 = isAllMode ? b.value : getActiveStatus(b);

        return v1 - v2;
    });

    const totalPages = Math.ceil(sortedReport.length / pageSize);

    useEffect(() => setPage(1), [filter, searchTerm, activeSection]);

    if (!academicYear || deptStatusReport.length === 0) {
        return <div><center><img src={Loading} className="img" /></center></div>;
    }

    const handleDownload = () => {

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
        const fileName = `Mark Entry Report ${formattedDate}`;

        const headers = [
            'Staff Id', 'Staff Name', 'Dept Name', 'Course Code', 'Category',
            'Section', 'Cia - 1', 'Cia - 2', 'Ass - 1', 'Ass - 2', 'Status'
        ];

        const pendingData = deptStatusReport.filter(dept => {
            const status = ['cia_1', 'cia_2', 'ass_1', 'ass_2'].every(
                key => getStatus(dept[key]) === 'Completed') ? 'Finished' : 'Pending';
            return status === 'Pending';
        });

        let data = pendingData.map(dept => {
            const status = ['cia_1', 'cia_2', 'ass_1', 'ass_2'].every(
                key => getStatus(dept[key]) === 'Completed') ? 'Finished' : 'Pending';
            return {
                'Staff Id': dept.staff_id,
                'Staff Name': dept.staff_name,
                'Dept Name': dept.dept_name,
                'Course Code': dept.course_code,
                'Category': dept.category,
                'Section': dept.section,
                'Cia - 1': getStatus(dept.cia_1),
                'Cia - 2': getStatus(dept.cia_2),
                'Ass - 1': getStatus(dept.ass_1),
                'Ass - 2': getStatus(dept.ass_2),
                'Status': status,
            }
        });

        data.sort((a, b) => {
            if (a.Category < b.Category) return -1;
            if (a.Category > b.Category) return 1;
            if (a['Dept Name'] < b['Dept Name']) return -1;
            if (a['Dept Name'] > b['Dept Name']) return 1;
            if (a['Staff Id'] < b['Staff Id']) return -1;
            if (a['Staff Id'] > b['Staff Id']) return 1;
            return 0;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            worksheet[cellAddress].v = headers[C];
        }

        const workbook = { Sheets: { 'Mark Entry Report': worksheet }, SheetNames: ['Mark Entry Report'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: fileType });
        saveAs(dataBlob, fileName + fileExtension);
    }

    if (loading) return (
        <div>
            <center>
                <img src={Loading} alt="Loading spinner" className="img" />
            </center>
        </div>
    )

    return (

        <div className="staff-management-shell">

            <DepartmentReportHeader
                searchText={searchTerm}
                handleSearch={handleSearch}
                handleDownload={handleDownload}
                setShowFilters={setShowFilters}
                clearAllFilters={clearAllFilters}
            />

            <DepartmentReportFilter
                showFilters={showFilters}
                clearAllFilters={clearAllFilters}
                filterCategory={filterCategory} setFilterCategory={setFilterCategory}
                filterDeptId={filterDeptId} setFilterDeptId={setFilterDeptId}
                depts={depts}
                filterStaffId={filterStaffId} setFilterStaffId={setFilterStaffId}
                staffOptions={staffOptions}
                filterCourseCode={filterCourseCode} setFilterCourseCode={setFilterCourseCode}
                courseCodeOptions={courseCodeOptions}
                filterSection={filterSection} setFilterSection={setFilterSection}
                sectionOptions={sectionOptions}
                filterStatus={filterStatus} setFilterStatus={setFilterStatus}
            />

            <div className="dept-main-div">
                <div className="section-toggle-group">
                    {dept === "alldepartments" && (
                        <button
                            className={`section-toggle-btn ${activeSection === "all" ? "active" : ""}`}
                            onClick={() => setActiveSection("all")}
                        >
                            ALL
                        </button>
                    )}
                    <button
                        className={`section-toggle-btn ${activeSection === "1" ? "active" : ""}`}
                        onClick={() => setActiveSection("1")}
                    >
                        CIA - 1
                    </button>
                    <button
                        className={`section-toggle-btn ${activeSection === "2" ? "active" : ""}`}
                        onClick={() => setActiveSection("2")}
                    >
                        CIA - 2
                    </button>
                    <button
                        className={`section-toggle-btn ${activeSection === "3" ? "active" : ""}`}
                        onClick={() => setActiveSection("3")}
                    >
                        ASS - 1
                    </button>
                    <button
                        className={`section-toggle-btn ${activeSection === "4" ? "active" : ""}`}
                        onClick={() => setActiveSection("4")}
                    >
                        ASS - 2
                    </button>
                </div>
            </div>

            <DepartmentReportTable
                sortedReport={sortedReport}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                getStatus={getStatus}
                getStatusColor={getStatusColor}
                isAllMode={activeSection === "all"}
                activeSection={activeSection}
            />

        </div>
    )
}

export default DepartmentReport;