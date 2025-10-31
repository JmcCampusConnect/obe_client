import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../../css/EseReport.css'

function EseReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [courseCode, setCourseCode] = useState([])

    useEffect(() => {
        const eseCourseCodes = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/esereport`)
                const sortedCourses = response.data.courses.sort((a, b) => {
                    if (a.course_code < b.course_code) return -1;
                    if (a.course_code > b.course_code) return 1;
                    return 0;
                })
                setCourseCode(sortedCourses)
            }
            catch (err) {
                console.error("Error fetching ESE Report Data:", err);
            }
        }
        eseCourseCodes();

    }, [apiUrl])

    const downloadExcel = () => {
        const worksheetData = courseCode.map(course => ({
            'Course Code': course.course_code,
            'Course Title': course.course_title
        }))

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ESE Report');
        XLSX.writeFile(workbook, 'Ese Report.xlsx');
    }

    return (
        <div className='ese-repo-main'>
            <span className='ese-repo-heading'>ESE REPORT</span>
            <div className='ese-repo-ex-btn'>
                <span className='ese-repo-count'><b>Total Records : {courseCode.length}</b></span>
                <button onClick={downloadExcel} className='ese-repo-btn'>
                    Download Excel
                </button>
            </div>
            <table className="ese-repo-table">
                <thead>
                    <tr>
                        <th className="ese-repo-th">S. No.</th>
                        <th className="ese-repo-th">Course Code</th>
                        <th className="ese-repo-th">Course Title</th>
                    </tr>
                </thead>
                <tbody>
                    {courseCode.map((code, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'ese-repo-light' : 'ese-repo-dark'}>
                            <td className='ese-repo-td'>{index + 1}</td>
                            <td className='ese-repo-td'>{code.course_code}</td>
                            <td className='ese-repo-td'>{code.course_title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EseReport;