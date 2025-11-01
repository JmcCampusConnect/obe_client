import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../../css/CourseOutcome.css';
const apiUrl = import.meta.env.VITE_API_URL;

function CourseOutcome() {

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
                    const response = await axios.post(`${apiUrl}/api/chkstaffId`, {
                        staff_id: staffId
                    })
                    if (response.data) {
                        if (response.data.courseHandleStaffId) { setCourseHandle(true) }
                        if (response.data.tutorHandleStaffId) { setTutorHandle(true) }
                        if (response.data.hodHandleStaffId) { setHodHandle(true) }
                    }
                }
                catch (err) { console.log('Error fetching data:', err) }
            }
        }
        checkStaffId();
    }, [staffId])

    const handleCourse = () => {
        navigate(`/staff/${staffId}/staffcourseoutcome`);
    }

    const handleTutor = () => {
        navigate(`/staff/${staffId}/tutorcourseoutcome`);
    }

    const handleHod = () => {
        navigate(`/staff/${staffId}/hodcourseoutcome`);
    }

    const handleAdmin = () => {
        navigate(`/staff/${staffId}/admincourseoutcome`);
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
                <p>
                    <span>Course Outcome (CO) : </span>Course Outcome define what students should know, understand, or be able to do after completing the course.
                    They are generally measurable and focused on skills, knowledge, or competencies.
                    For example, in a Computer Science course, a CO might be “Students will be able to write efficient algorithms to solve complex problems.<br /><br />
                    <p>To measure the attainment of CO the following two methodologies is used.</p>
                </p><br />
                <p><span>Course Cognitive Level Attainment (CCLA) : </span>
                    The CCLA measures how well students achieve cognitive-level outcomes (LOT, MOT, HOT) in the specified course.
                    To calculate CCLA the input is the various assessment scores scored by the students in the specified course.
                </p><br />
                <p ><span>Course Attainment by Programme Specific Outcome (CAPSO) : </span>
                    The CAPSO is a systematic process for evaluating the impact of a course on achieving the program-specific outcome (PSO).
                    To calculate CAPSO the values of the Relationship Matrix and the values of the three cognitive levels calculated in CCLA
                    for a specified course are given as input.
                </p><br />
                <span>Note : </span><lable>The calculation process are given in OBE Terminologies Menu</lable>
            </div>
        </div>
    )
}

export default CourseOutcome;