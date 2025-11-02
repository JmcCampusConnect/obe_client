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
    const { dept } = useParams();

    const [activeSection, setActiveSection] = useState('1');
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

    const pageSize = 10;
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchAcademicYear = async () => {
            try {
                const response = await axios.post(`${apiUrl}/activesem`, {});
                setAcademicYear(response.data.academic_sem);
            } catch (err) {
                alert('Error fetching Academic Year.');
            }
        };
        fetchAcademicYear();
    }, []);

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
                setStaffOptions(response.data.map(d => ({ value: d.staff_id, label: `${d.staff_id} - ${d.staff_name}` })));
                setCourseCodeOptions(response.data.map(d => ({
                    value: d.course_code,
                    label: d.course_title
                        ? `${d.course_code} - ${d.course_title}`
                        : d.course_code
                })));

                setSectionOptions([...new Set(response.data.map(d => d.section))].map(v => ({ value: v, label: v })));
            } catch (err) {
                alert('Error fetching status report.');
                console.log(err);
            }
        };
        fetchDeptStatusReport();
    }, [academicYear, dept]);

    const handleSearch = (term) => setSearchTerm(term);

    const getActiveField = (dept) => {
        switch (activeSection) {
            case '1': return dept.cia_1;
            case '2': return dept.cia_2;
            case '3': return dept.ass_1;
            case '4': return dept.ass_2;
            default: return '';
        }
    };

    const getStatus = (v) => v === 0 ? 'Incomplete' : v === 1 ? 'Processing' : v === 2 ? 'Completed' : '';
    const getStatusColor = (v) => v === 0 ? { color: 'red' } : v === 1 ? { color: 'blue' } : v === 2 ? { color: 'green' } : {};

    const clearAllFilters = () => {
        setFilterCategory('');
        setFilterDeptId('');
        setFilterStaffId('');
        setFilterCourseCode('');
        setFilterSection('');
    };

    const filteredReport = deptStatusReport.filter((d) => {
        const status = getActiveField(d);
        const matchesSearch = d.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
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
    })

    const sortedReport = [...filteredReport].sort((a, b) => getActiveField(a) - getActiveField(b));
    const totalPages = Math.ceil(sortedReport.length / pageSize);

    useEffect(() => setPage(1), [filter, searchTerm, activeSection]);

    const handleDownload = () => {
        const headers = [
            'Staff Id', 'Staff Name', 'Dept Name', 'Course Code',
            'Category', 'Section', 'CIA-1', 'CIA-2', 'ASS-1', 'ASS-2', 'Overall Status'
        ];
        const data = deptStatusReport.map(d => ({
            'Staff Id': d.staff_id,
            'Staff Name': d.staff_name,
            'Dept Name': d.dept_name,
            'Course Code': d.course_code,
            'Category': d.category,
            'Section': d.section,
            'CIA-1': getStatus(d.cia_1),
            'CIA-2': getStatus(d.cia_2),
            'ASS-1': getStatus(d.ass_1),
            'ASS-2': getStatus(d.ass_2),
            'Overall Status': [d.cia_1, d.cia_2, d.ass_1, d.ass_2].every(v => v === 2) ? 'Finished' : 'Pending'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = { Sheets: { 'Report': worksheet }, SheetNames: ['Report'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer]), `Dept Report ${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (!academicYear || deptStatusReport.length === 0) {
        return <div><center><img src={Loading} alt="Loading data" className="img" /></center></div>;
    }

    return (
        <div className="staff-management-shell">

            <DepartmentReportHeader
                searchText={searchTerm}
                handleSearch={handleSearch}
                handleDownload={handleDownload}
                setShowFilters={setShowFilters}
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
                    {["1", "2", "3", "4"].map((val, idx) => (
                        <button
                            key={val}
                            className={`section-toggle-btn ${activeSection === val ? "active" : ""}`}
                            onClick={() => setActiveSection(val)}
                        >
                            {idx < 2 ? `CIA - ${idx + 1}` : `ASS - ${idx - 1}`}
                        </button>
                    ))}
                </div>
            </div>

            <DepartmentReportTable
                sortedReport={sortedReport}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                getStatus={getStatus}
                getActiveField={getActiveField}
                getStatusColor={getStatusColor}
            />
        </div>
    )
}

export default DepartmentReport;