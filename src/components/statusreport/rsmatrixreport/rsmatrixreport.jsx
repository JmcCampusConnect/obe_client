import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './rsmatrixreport.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function MatrixReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [academicYear, setAcademicYear] = useState('');
    const [allMatrixReport, setAllMatrixReport] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseCount, setCourseCount] = useState('');
    const [comCount, setComCount] = useState('');
    const [filter, setFilter] = useState({
        all: true, incomplete: true, completed: true
    })

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
    }, [])

    useEffect(() => {
        const fetchMatrixReport = async () => {
            if (academicYear) {
                try {
                    const response = await axios.post(`${apiUrl}/api/allmatrixreport`, {
                        academic_sem: academicYear,
                    });
                    setAllMatrixReport(response.data);
                }
                catch (err) {
                    alert('Error Fetching Status Report');
                    console.log('Error Fetching Data:', err);
                }
            }
        }
        fetchMatrixReport();

        const matrixCompletedCount = async () => {
            if (academicYear) {
                try {
                    const response = await axios.post(`${apiUrl}/api/matrixcount`, {
                        academic_sem: academicYear,
                    })
                    if (response.data) {
                        setCourseCount(response.data.uniqueCourseCount);
                        setComCount(response.data.completeCount);
                    }
                }
                catch (err) {
                    alert('Error Fetching Status Report.');
                    console.log('Error Fetching Data:', err);
                }
            }
        }
        matrixCompletedCount();
    }, [academicYear])

    const handleFilterChange = (event) => {
        const { name, checked } = event.target;
        if (name === 'all') {
            setFilter({
                all: checked,
                incomplete: checked,
                completed: checked
            })
        }
        else {
            setFilter((prevFilter) => ({
                ...prevFilter,
                [name]: checked,
                all: checked && prevFilter.incomplete && prevFilter.completed
            }))
        }
    }

    const getStatusPriority = (status) => {
        if (status === 'Incomplete') return 1;
        if (status === 'Processing') return 2;
        if (status === 'Completed') return 3;
    }

    const sortedReports = [...allMatrixReport]
        .sort((a, b) => {
            const statusPriorityA = getStatusPriority(a.status);
            const statusPriorityB = getStatusPriority(b.status);
            if (statusPriorityA !== statusPriorityB) {
                return statusPriorityA - statusPriorityB;
            }
            return a.staff_id.localeCompare(b.staff_id);
        })

    const filteredReports = sortedReports.filter(matrix => {
        const matchesSearch =
            matrix.staff_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matrix.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matrix.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matrix.course_code.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filter.all) return true;
        if (matrix.status === 'Incomplete' && filter.incomplete) return true;
        if (matrix.status === 'Completed' && filter.completed) return true;
        return false;
    })

    const handleDownload = () => {

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
        const fileName = `Rs Matrix ${formattedDate}`;

        const headers = [
            'Staff Id',
            'Staff Name',
            'Dept Id',
            'Course Code',
            'Category',
            'Section',
            'Status'
        ];

        const data = allMatrixReport.map(dept => ({
            'Staff Id': dept.staff_id,
            'Staff Name': dept.staff_name,
            'Dept Id': dept.dept_id,
            'Course Code': dept.course_code,
            'Category': dept.category,
            'Section': dept.section,
            'Status': dept.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            worksheet[cellAddress].v = headers[C];
        }

        const workbook = { Sheets: { 'Rs Matrix': worksheet }, SheetNames: ['Rs Matrix'] };
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: fileType });
        saveAs(dataBlob, fileName + fileExtension);
    }

    return (
        <div className='rsm-repo-main'>
            <p className='dept-heading'>Relationship Matrix REPORT</p>
            <div className='rsm-repo-search'>
                <input
                    type="text"
                    placeholder="Search...."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rsm-search-input"
                />
                <div className='rsm-repo-com-status'>
                    <b>No of Course Codes Completed : </b>{comCount} / {courseCount}
                </div>
            </div>
            <div className='rsm-repo-btn-content'>
                <div className="rsm-repo-filter">
                    <label className='rsm-repo-label'>
                        <input
                            type="checkbox"
                            name="all"
                            checked={filter.all}
                            onChange={handleFilterChange}
                        />
                        <b>All</b> ({filteredReports.length})
                    </label>
                    <label className='rsm-repo-label'>
                        <input
                            type="checkbox"
                            name="incomplete"
                            checked={filter.incomplete}
                            onChange={handleFilterChange}
                        />
                        <b>Incomplete</b>
                        (
                        {filteredReports.filter(matrix => matrix.status === 'Incomplete').length}
                        )
                    </label>
                    <label className='rsm-repo-label'>
                        <input
                            type="checkbox"
                            name="completed"
                            checked={filter.completed}
                            onChange={handleFilterChange}
                        />
                        <b>Completed</b> (
                        {filteredReports.filter(matrix => matrix.status === 'Completed').length}
                        )
                    </label>
                </div>
                <button className='dept-repo-btn' onClick={handleDownload}>Download Excel</button>
            </div>
            <div className='rsm-table-wrapper'>
                <table className="rsm-repo-header">
                    <thead>
                        <tr>
                            <th className="rsm-repo-heading">S. No.</th>
                            <th className="rsm-repo-heading">Staff Id</th>
                            <th className="rsm-repo-heading">Staff Name</th>
                            <th className="rsm-repo-heading">Dept Id</th>
                            <th className="rsm-repo-heading">Course Code</th>
                            <th className="rsm-repo-heading">Category</th>
                            <th className="rsm-repo-heading">Section</th>
                            <th className="rsm-repo-heading">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.length > 0 ? (
                            filteredReports.map((matrix, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'rsm-repo-light' : 'rsm-repo-dark'}>
                                    <td className="rsm-repo-content">{index + 1}</td>
                                    <td className="rsm-repo-content">{matrix.staff_id}</td>
                                    <td className="rsm-repo-content-sn">{matrix.staff_name}</td>
                                    <td className="rsm-repo-content">{matrix.dept_id}</td>
                                    <td className="rsm-repo-content">{matrix.course_code}</td>
                                    <td className="rsm-repo-content">{matrix.category}</td>
                                    <td className="rsm-repo-content">{matrix.section}</td>
                                    <td className="rsm-repo-content" style={{ color: matrix.status === 'Completed' ? 'green' : 'red' }}>
                                        {matrix.status}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="hod-repo-td">
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

export default MatrixReport;
