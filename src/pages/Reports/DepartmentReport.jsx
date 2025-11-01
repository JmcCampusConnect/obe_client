import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import '../../css/DepartmentReport.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Loading from '../../assets/load.svg';

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

    useEffect(() => {
        const academicYearSet = async () => {
            try {
                const response = await axios.post(`${apiUrl}/activesem`, {});
                setAcademicYear(response.data.academic_sem);
            }
            catch (err) {
                alert('Error fetching Academic Year.');
            }
        }
        academicYearSet();
    }, []);

    console.log(academicYear)

    useEffect(() => {
        const fetchDeptStatusReport = async () => {
            if (academicYear) {
                try {
                    const response = await axios.post(`${apiUrl}/api/deptstatusreport`, {
                        academic_sem: academicYear,
                        dept_name: dept === "alldepartments" ? "ALL" : dept
                    })
                    setDeptStatusReport(response.data);
                }
                catch (err) {
                    alert('Error fetching status report.');
                    console.log('Error fetching data:', err);
                }
            }
        }
        fetchDeptStatusReport();
    }, [academicYear, dept]);

    const handleSectionChange = (event) => {
        setActiveSection(event.target.value);
    }

    const getActiveField = (dept) => {
        switch (activeSection) {
            case '1':
                return dept.cia_1;
            case '2':
                return dept.cia_2;
            case '3':
                return dept.ass_1;
            case '4':
                return dept.ass_2;
            default:
                return '';
        }
    }

    const getStatus = (value) => {
        if (value === 0) return 'Incomplete';
        if (value === 1) return 'Processing';
        if (value === 2) return 'Completed';
        return '';
    }

    const getStatusColor = (value) => {
        if (value === 0) return { color: 'red' };
        if (value === 1) return { color: 'blue' };
        if (value === 2) return { color: 'green' };
        return {};
    }

    const handleFilterChange = (event) => {
        const { name, checked } = event.target;

        if (name === 'all') {
            setFilter({
                all: checked,
                incomplete: checked,
                processing: checked,
                completed: checked
            });
        }
        else {
            setFilter((prevFilter) => ({
                ...prevFilter,
                [name]: checked,
                all: checked && prevFilter.incomplete && prevFilter.processing && prevFilter.completed
            }));
        }
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const filteredReport = deptStatusReport.filter((dept) => {
        const status = getActiveField(dept);
        const matchesSearch =
            dept.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.category.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;
        if (filter.all) return true;
        if (status === 0 && filter.incomplete) return true;
        if (status === 1 && filter.processing) return true;
        if (status === 2 && filter.completed) return true;
        return false;
    })

    const sortedReport = [...filteredReport].sort((a, b) => {
        const statusOrder = getActiveField(a) - getActiveField(b);
        if (statusOrder !== 0) return statusOrder;
        const categoryOrder = ['aided', 'sfm', 'sfw'];
        const categoryA = categoryOrder.indexOf(a.category.toLowerCase());
        const categoryB = categoryOrder.indexOf(b.category.toLowerCase());
        if (categoryA !== categoryB) return categoryA - categoryB;
        const deptNameOrder = a.dept_name.localeCompare(b.dept_name);
        if (deptNameOrder !== 0) return deptNameOrder;
        return a.staff_id.localeCompare(b.staff_id);
    })

    const handleDownload = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
        const fileName = `Mark Entry Report ${formattedDate}`;

        const headers = [
            'Staff Id',
            'Staff Name',
            'Dept Name',
            'Course Code',
            'Category',
            'Section',
            'Cia - 1',
            'Cia - 2',
            'Ass - 1',
            'Ass - 2',
            'Status'
        ];

        const data = deptStatusReport.map(dept => {
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
        })

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

    if (!deptStatusReport) return <div><center><img src={Loading} alt="" className="img" /></center></div>;

    return (
        <div className='dept-repo-main'>
            <p className='dept-heading'>OBE MARK Entry REPORT</p>
            <div className='dept-main-div'>
                <select
                    value={activeSection || ''}
                    onChange={handleSectionChange}
                    className="dept-dropdown"
                >
                    <option value="1">CIA - 1</option>
                    <option value="2">CIA - 2</option>
                    <option value="3">ASS - 1</option>
                    <option value="4">ASS - 2</option>
                </select>
            </div>
            <div className='dept-repo-search'>
                <input
                    type="text"
                    placeholder="Search...."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="dept-search-input"
                />
            </div>
            <div className='dept-repo-btn-content'>
                <div className="dept-repo-filter">
                    <label className='dept-repo-label'>
                        <input
                            type="checkbox"
                            name="all"
                            checked={filter.all}
                            onChange={handleFilterChange}
                        />
                        <b>All</b> ( {sortedReport.length} )
                    </label>
                    <label className='dept-repo-label'>
                        <input
                            type="checkbox"
                            name="incomplete"
                            checked={filter.incomplete}
                            onChange={handleFilterChange}
                        />
                        <b>Incomplete</b>
                        (
                        {sortedReport.filter(dept => getActiveField(dept) === 0).length}
                        )
                    </label>
                    <label className='dept-repo-label'>
                        <input
                            type="checkbox"
                            name="processing"
                            checked={filter.processing}
                            onChange={handleFilterChange}
                        />
                        <b>Processing</b>
                        (
                        {sortedReport.filter(dept => getActiveField(dept) === 1).length}
                        )
                    </label>
                    <label className='dept-repo-label'>
                        <input
                            type="checkbox"
                            name="completed"
                            checked={filter.completed}
                            onChange={handleFilterChange}
                        />
                        <b>Completed</b>
                        (
                        {sortedReport.filter(dept => getActiveField(dept) === 2).length}
                        )
                    </label>
                </div>
                <button className='dept-repo-btn' onClick={handleDownload}>Download Excel</button>
            </div>
            <div className='dept-table-wrapper'>
                <table className="dept-repo-header">
                    <thead>
                        <tr>
                            <th className="dept-repo-heading">S. No.</th>
                            <th className="dept-repo-heading">Staff Id</th>
                            <th className="dept-repo-heading">Staff Name</th>
                            <th className="dept-repo-heading">Dept Name</th>
                            <th className="dept-repo-heading">Course Code</th>
                            <th className="dept-repo-heading">Category</th>
                            <th className="dept-repo-heading">Section</th>
                            <th className="dept-repo-heading">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReport.length > 0 ? (
                            sortedReport.map((dept, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? 'dept-repo-light' : 'dept-repo-dark'}
                                >
                                    <td className="dept-repo-content">{index + 1}</td>
                                    <td className="dept-repo-content">{dept.staff_id}</td>
                                    <td className="dept-repo-content-sn">{dept.staff_name}</td>
                                    <td className="dept-repo-content-dn">{dept.dept_name}</td>
                                    <td className="dept-repo-content">{dept.course_code}</td>
                                    <td className="dept-repo-content">{dept.category}</td>
                                    <td className="dept-repo-content">{dept.section}</td>
                                    <td
                                        className="dept-repo-content-sr"
                                        style={getStatusColor(getActiveField(dept))}
                                    >
                                        {getStatus(getActiveField(dept))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="dept-repo-td">
                                    No Data Available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DepartmentReport;