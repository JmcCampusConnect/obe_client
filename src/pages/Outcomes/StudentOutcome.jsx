import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../../css/StudentOutcome.css';
const apiUrl = import.meta.env.VITE_API_URL;

function StudentOutcome() {

    const { staffId } = useParams();
    const navigate = useNavigate();
    const [courseHandle, setCourseHandle] = useState(false);
    const [tutorHandle, setTutorHandle] = useState(false);
    const [hodHandle, setHodHandle] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [staffName, setStaffName] = useState('');

    useEffect(() => {
        const fetchStaffName = async () => {
            try {
                const response = await axios.post(`${apiUrl}/staffName`, { staffId });
                setStaffName(response.data)
            }
            catch (err) { }
        }
        fetchStaffName();
    }, [apiUrl, staffId]);

    useEffect(() => {
        const checkStaffId = async () => {
            if (staffId === 'ADMIN' || staffId === 'admin' || staffId === 'Admin') {
                setAdmin(true);
                return;
            }
            else {
                try {
                    const response = await axios.post(`${apiUrl}/api/checkstaffId`, {
                        staff_id: staffId
                    })
                    if (response.data) {
                        if (response.data.courseHandleStaffId) { setCourseHandle(true) }
                        if (response.data.tutorHandleStaffId) { setTutorHandle(true) }
                        if (response.data.hodHandleStaffId) { setHodHandle(true) }
                    }
                }
                catch (err) {
                    console.log('Error Fetching Data:', err);
                }
            }
        }
        checkStaffId();
    }, [staffId]);

    const handleCourse = () => {
        navigate(`/staff/${staffId}/staffstudentoutcome`);
    }

    const handleTutor = () => {
        navigate(`/staff/${staffId}/tutorstudentoutcome`);
    }

    const handleHod = () => {
        navigate(`/staff/${staffId}/hodstudentoutcome`);
    }

    const handleAdmin = () => {
        navigate(`/staff/${staffId}/adminstudentoutcome`);
    }

    return (
        <div className='co-main'>
            <div className="co-layout-top-div">
                <p className="co-layout-staff-id"><span className="course-staff">Welcome </span> {staffName.staff_name}</p>
                <p className="co-layout-staff-id"><span className="co-staff">Staff Id :</span> {staffId}</p>
            </div>
            <div className="co-content-box">
                <div className='co-entire-box'>
                    {courseHandle && (
                        <button className="co-box" onClick={handleCourse}>
                            Course Handle Report
                        </button>
                    )}
                    {tutorHandle && (
                        <button className="co-box" onClick={handleTutor}>
                            Mentor Report
                        </button>
                    )}
                    {hodHandle && (
                        <button className="co-box" onClick={handleHod}>
                            Hod Report
                        </button>
                    )}
                    {admin && (
                        <button className="co-box" onClick={handleAdmin}>
                            Admin Report
                        </button>
                    )}
                </div>
            </div>
            <div className='content-info'>
                <p><span>Student Cognitive Level Attainment (SCLA) : </span>
                    The attainment level for each student in a course is calculated by analyzing their performance across three cognitive levels :
                    Lower-Order Thinking (LOT), Medium-Order Thinking (MOT), and Higher-Order Thinking (HOT). Each cognitive level is assessed
                    for Continuous Internal Assessment (CIA) and End-Semester Examination (ESE).
                </p><br />
                <span>Note : </span><lable>The calculation process are given in OBE Terminologies Menu</lable>
            </div>
        </div>
    )
}

export default StudentOutcome;