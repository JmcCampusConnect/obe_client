import { useEffect, React, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faHome, faFileAlt, faTachometerAlt, faKey, faSignOutAlt , faGear, faGraduationCap, faLightbulb, faProjectDiagram, 
faBookOpen, faUserGraduate, faClipboardCheck, faUserFriends, faChalkboardTeacher, faClipboard } 
from '@fortawesome/free-solid-svg-icons';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import Jmclogo from '../../assets/jmclogo.png';
import { useAuth } from '../login/authenticate/authenticate';
import { useNavigate } from 'react-router-dom';
import './layout.css';

function Layout() 
{
    const apiUrl = import.meta.env.VITE_API_URL;
    const { staffId: urlStaffId } = useParams();
    const navigate = useNavigate();
    const { logout, isAuthenticated, staffId: contextStaffId } = useAuth(); 
    const [user, setUsers] = useState([]);

    useEffect(() => 
    {
        if (!isAuthenticated || urlStaffId !== contextStaffId) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, urlStaffId, contextStaffId, navigate]);

    useEffect(() => 
    {
        axios.get(`${apiUrl}/scope/${urlStaffId}`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(err => console.log(err));
    }, [urlStaffId, apiUrl]);

    const handleLogout = () => 
    {
        logout();
        navigate('/', { replace: true });
        window.location.reload();
    };

    const menus = [
        {
            icon: faHome,
            name: 'Dashboard',
            path: `/staff/${urlStaffId}/dashboard`,
            show: user && user.dashboard === 1,
        },
        {
            icon: faBookOpen,
            name: 'Course List',
            path: `/staff/${urlStaffId}/courselist`,
            show: user && user.course_list === 1,
        },
        {
            icon: faProjectDiagram,
            name: 'Relationship Matrix',
            path: `/staff/${urlStaffId}/rsmatrix`,
            show: user && user.relationship_matrix === 1,
        },
        {
            icon: faFileAlt,
            name: 'Course Outcome',
            path: `/staff/${urlStaffId}/courseoutcome`,
            show: user && user.course_outcome === 1,
        },
        {
            icon: faUserGraduate,
            name: 'Student Outcome',
            path: `/staff/${urlStaffId}/studentoutcome`,
            show: user && user.student_outcome === 1,
        },
        {
            icon: faClipboardCheck,
            name: 'Program Specific Outcome',
            path: `/staff/${urlStaffId}/programspecificoutcome`,
            show: user && user.program_specific_outcome === 1,
        },
        {
            icon: faGraduationCap,
            name: 'Program Outcome',
            path: `/staff/${urlStaffId}/programoutcome`,
            show: user && user.program_outcome === 1,
        },
        {
            icon: faClipboard,
            name: 'Work Progress Report',
            path: `/staff/${urlStaffId}/workprogressreport`,
            show: user && user.work_progress_report === 1,
        },
        {
            icon: faKey,
            name: 'Input Files',
            path: `/staff/${urlStaffId}/inputfiles`,
            show: user.input_files === 1,
        },
        {
            icon: faTachometerAlt,
            name: 'Manage',
            path: `/staff/${urlStaffId}/manage`,
            show: user && user.manage === 1,
        },
        // {
        //     icon: faUserFriends,
        //     name: 'OBE Report',
        //     path: `/staff/${urlStaffId}/obereport`,
        //     show: user && user.obe_report === 1,
        // },
        {
            icon: faGear ,
            name: 'Change Password',
            path: `/staff/${urlStaffId}/settings`,
            show: user.settings === 1,
        },
        {
            icon: faLightbulb ,
            name: 'OBE Terminologies',
            path: `/staff/${urlStaffId}/terminologies`,
            // show: ['ADMIN', 'admin', 'Admin'].includes(urlStaffId),
            show: user        
        },
    ]

    return (
        <div className="layout-container">
            <div className="layout-sidebar">
                <div className="layout-header">
                    <img src={Jmclogo} alt="" className="layout-logo" />
                    <div className="layout-college-info">
                        <span className="layout-college-name">JAMAL MOHAMED COLLEGE<br /></span>
                        <span className="layout-college-type">(Autonomous)<br /></span>
                        <span className="layout-college-location">TIRUCHIRAPPALLI - 620 020 .<br /></span>
                    </div>
                </div>
                {menus
                    .filter(item => item.show)
                    .map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `layout-menu-item ${isActive ? 'layout-active' : ''}`}
                        >
                            <FontAwesomeIcon icon={item.icon} className="layout-fa-icons" />
                            <label className="layout-menu-label">{item.name}</label>
                        </NavLink>
                    ))}
                <button onClick={handleLogout} className="layout-menu-item">
                    <FontAwesomeIcon icon={faSignOutAlt} className="layout-fa-icons" />
                    <label className="layout-menu-logout-label"><b>Logout</b></label>
                </button>
            </div>
            <div className="layout-content">
                <div className="layout-content-inner">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
