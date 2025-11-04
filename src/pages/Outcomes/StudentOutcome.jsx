import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../../css/StudentOutcome.css';
const apiUrl = import.meta.env.VITE_API_URL;
import Loading from '../../assets/load.svg'

function StudentOutcome() {

    const { staffId } = useParams();
    const navigate = useNavigate();
    const [courseHandle, setCourseHandle] = useState(false);
    const [tutorHandle, setTutorHandle] = useState(false);
    const [hodHandle, setHodHandle] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [staffName, setStaffName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaffData = async () => {
            setLoading(true);
            try {
                const staffNameResponse = await axios.post(`${apiUrl}/staffName`, { staffId });
                setStaffName(staffNameResponse.data);
                if (staffId === 'ADMIN' || staffId.toLowerCase() === 'admin') { setAdmin(true) }
                else {
                    const roleResponse = await axios.post(`${apiUrl}/api/checkstaffId`, { staff_id: staffId });
                    if (roleResponse.data) {
                        setCourseHandle(!!roleResponse.data.courseHandleStaffId);
                        setTutorHandle(!!roleResponse.data.tutorHandleStaffId);
                        setHodHandle(!!roleResponse.data.hodHandleStaffId);
                    }
                }
            } catch (err) { console.log('Error fetching staff data : ', err) } finally { setLoading(false) }
        };
        fetchStaffData();
    }, [apiUrl, staffId]);

    const handleCourse = () => { navigate(`/staff/${staffId}/staffstudentoutcome`) }
    const handleTutor = () => { navigate(`/staff/${staffId}/tutorstudentoutcome`) }
    const handleHod = () => { navigate(`/staff/${staffId}/hodstudentoutcome`) }
    const handleAdmin = () => { navigate(`/staff/${staffId}/adminstudentoutcome`) }

    if (loading) {
        return (
            <div>
                <center> <img src={Loading} alt="Loading..." className="img" /> </center>
            </div>
        )
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