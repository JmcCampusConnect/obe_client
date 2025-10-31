import React, { useEffect, useState } from 'react';
import './dash.css';
import Barchart from './Barchart/barchart';
import Piechart1 from './Piechart/Piechart1';
import Piechart2 from './Piechart/Piechart2';
import Linechart1 from './Linechart/Linechart1'
import { PiStudentFill } from "react-icons/pi";
import { IoPersonSharp } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";
import axios from 'axios';

function Dash() {
    
    const [studentCount, setStudentCount] = useState(0);
    const [staffCount, setStaffCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [programCount, setProgramCount] = useState(0);

    const fetchCounts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/counts`);
            const { studentCount, staffCount, courseCount, programCount } = response.data;
            animateCount(setStudentCount, studentCount);
            animateCount(setStaffCount, staffCount);
            animateCount(setCourseCount, courseCount);
            animateCount(setProgramCount, programCount);
        }
        catch (error) {
            console.error('Error fetching counts:', error);
        }
    }

    const animateCount = (setCount, targetCount, initialCount = 0, duration = 1000) => {
        let currentCount = initialCount;
        const increment = Math.ceil(targetCount / 100);
        const intervalTime = duration / 100;

        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount > targetCount) {
                currentCount = targetCount;
            }
            setCount(currentCount);
            if (currentCount === targetCount) {
                clearInterval(timer);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    return (
        <div className='dash-main'>
            <div className='dash-header'>
                <div className='dash-header-content'>
                    <PiStudentFill className='dash-student-icon' />
                    <span className='dash-count-content'>Total Students</span>
                    <span className='dash-count-number'>{studentCount}</span>
                </div>
                <div className='dash-header-content'>
                    <IoPersonSharp className='dash-staff-icon' />
                    <span className='dash-count-content'>Total Staff</span>
                    <span className='dash-count-number'>{staffCount}</span>
                </div>
                <div className='dash-header-content'>
                    <FaBook className='dash-course-icon' />
                    <span className='dash-count-content'>Total Courses</span>
                    <span className='dash-count-number'>{courseCount}</span>
                </div>
                <div className='dash-header-content'>
                    <SiBookstack className='dash-programme-icon' />
                    <span className='dash-count-content'>Total Programs</span>
                    <span className='dash-count-number'>{programCount}</span>
                </div>
            </div>
            <div className='dash-linechart'>
                <Barchart />
            </div>
            <div className='dash-piechart-main'>
                <div className="chart-card"><Linechart1 /></div>
                <div className="chart-card"><Piechart1 /></div>
                <div className="chart-card"><Piechart2 /></div>
            </div>
        </div>
    )
}

export default Dash;