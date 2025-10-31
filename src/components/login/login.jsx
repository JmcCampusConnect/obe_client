import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import jmclogo from '../../assets/jmclogo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authenticate/authenticate';
import './login.css';

function Login() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');
    const passwordInputRef = useRef(null);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { logout } = useAuth();

    const handleLogin = async () => {

        if (staffId === '' || password === '') {
            alert('Fill both the fields');
            return
        }

        try {
            const response = await axios.post(`${apiUrl}/login`, {
                staff_id: staffId,
                staff_pass: password,
            });

            if (response.data.success) {
                login(staffId);
                navigate(`staff/${staffId}/dashboard`, { replace: true });
            }
            else {
                alert(response.data.message);
                setPassword('')
            }
        }
        catch (error) {
            alert('An error occurred. Please try again later.');
            console.error('Login Error: ', error);
        }
    }

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            if (field === 'staffId') {
                passwordInputRef.current.focus();
            }
            else if (field === 'password') { handleLogin() }
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    }

    return (
        <div className='log-parent'>
            <div className='log-left-container'>
                <div className='log-left-top'>
                    <img src={jmclogo} alt="LOGO" className="log-jmclogo" />
                </div>
                <div className='log-left-bottom'>
                    <div className='log-clg-desc'>
                        <span className='log-clg-span'>JAMAL MOHAMED COLLEGE</span>
                        <span className='log-clg-span'>( AUTONOMOUS )</span>
                        <span className='log-clg-span'>TIRUCHIRAPPALLI - 620 020 .</span>
                    </div>
                </div>
            </div>
            <div className='log-right-container'>
                <span className="log-desc-para">LOGIN TO YOUR ACCOUNT</span>
                <input
                    className="log-desc-input"
                    type="text"
                    placeholder="Enter Staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'staffId')}
                    required
                />
                <input
                    className="log-desc-input"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'password')}
                    ref={passwordInputRef}
                    required
                />
                {/* <a href="www.obe.com" className="log-desc-anchor">Forgot Password</a> */}
                <span className='log-desc-anchor'>Forgot Password</span>
                <button className="log-desc-btn" onClick={handleLogin}>
                    <FontAwesomeIcon icon={faLock} className='log-fa-fa-icons' />
                    <div className='log-login-desc' onClick={handleLogout}>LOGIN</div>
                </button>
            </div>
        </div>
    )
}

export default Login;