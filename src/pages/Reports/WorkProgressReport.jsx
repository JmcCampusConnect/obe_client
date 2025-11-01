import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import '../../css/WorkProgressReport.css'

function WorkProgressReport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { staffId } = useParams();
    const navigate = useNavigate();
    const [academicSem, setAcademicSem] = useState('');
    const [reportDeptName, setReportDeptName] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [mentor, setMentor] = useState(false);
    const [hod, setHod] = useState(false);
    const [staffName, setStaffName] = useState('');

    useEffect(() => {
        const checkStaffId = async () => {
            if (staffId === 'ADMIN' || staffId === 'Admin' || staffId === 'admin') { setAdmin(true) }
            else {
                try {
                    const response = await axios.post(`${apiUrl}/api/chkstaffId`, { staff_id: staffId })
                    if (response.data) {
                        if (response.data.tutorHandleStaffId) { setMentor(true) }
                        if (response.data.hodHandleStaffId) { setHod(true) }
                    }
                }
                catch (err) { console.log('Error fetching data:', err) }
            }
        }
        checkStaffId();
    }, [staffId])

    useEffect(() => {
        const academicSemSet = async () => {
            try {
                const response = await axios.post(`${apiUrl}/activesem`, {});
                setAcademicSem(response.data.academic_sem);
            }
            catch (err) { alert('Error fetching Academic Year.') }
        }
        academicSemSet();

    }, [])

    useEffect(() => {
        const fetchStaffName = async () => {
            try {
                const response = await axios.post(`${apiUrl}/staffName`, { staffId });
                setStaffName(response.data)
            }
            catch (err) { console.log('Error Fetching Staff Name : ', err) }
        }
        fetchStaffName();
    }, [apiUrl, staffId]);


    useEffect(() => {
        const fetchStatusReport = async () => {
            if (academicSem) {
                try {
                    const response = await axios.post(`${apiUrl}/api/statusDeptName`, {
                        academicSem,
                    })
                    const sortedDepartments = response.data.sort((a, b) => a.localeCompare(b))
                    setReportDeptName(sortedDepartments);
                }
                catch (err) {
                    alert('Error fetching status report.');
                    console.log('Error fetching data:', err);
                }
            }
        }
        fetchStatusReport();
    }, [academicSem]);

    const handleDeptReport = (dept) => {
        if (dept === "ALL") { navigate(`/staff/${staffId}/alldepartments/departmentreport`) }
        else { navigate(`/staff/${staffId}/${dept}/departmentreport`) }
    }

    const handleMatrixReport = () => navigate(`/staff/${staffId}/matrixreport`);
    const handleEseReport = () => navigate(`/staff/${staffId}/esereport`);
    const handleHod = () => navigate(`/staff/${staffId}/hodreport`);
    const handleMentor = () => navigate(`/staff/${staffId}/tutorreport`);

    return (
        <div className='report-main'>
            <div className="course-layout-top-div">
                <p className="course-layout-staff-id">
                    <span className="course-staff">Welcome </span> {staffName.staff_name}
                </p>
                <p className="course-layout-staff-id">
                    <span className="course-staff">Staff Id :</span> {staffId}
                </p>
            </div>
            {(admin || hod || mentor) ? (
                <div className='course-content-box'>
                    <div className='course-entire-box'>
                        {admin && (
                            <>
                                <button className='report-subject-box' onClick={() => handleDeptReport("ALL")}>ALL</button>
                                <button className='report-subject-box' onClick={handleMatrixReport}>RELATIONSHIP MATRIX</button>
                                <button className='report-subject-box' onClick={handleEseReport}>ESE</button>
                                {reportDeptName.map((dept, index) => (
                                    <button key={index} className='report-subject-box' onClick={() => handleDeptReport(dept)}>{dept}</button>
                                ))}
                            </>
                        )}
                        {hod && <button className='report-subject-box' onClick={handleHod}>DEPT REPORT</button>}
                        {mentor && <button className='report-subject-box' onClick={handleMentor}>CLASS REPORT</button>}
                    </div>
                </div>
            ) : (
                <div className='course-content-box'>
                    <div className="rsmatrix-no-code">
                        <p>No Report Found for this ID</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WorkProgressReport;