import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import jmclogo from '../assets/jmclogo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/common/Authenticate';
import '../css/LoginPage.css';

function LoginPage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');
    const passwordInputRef = useRef(null);
    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {

        if (staffId.trim() === '' || password.trim() === '') {
            alert('Fill both the fields');
            return
        }

        try {
            const response = await axios.post(`${apiUrl}/login`, {
                staff_id: staffId.trim(),
                staff_pass: password.trim(),
            });

            if (response.data.success) {
                login(staffId.trim());
                navigate(`staff/${staffId.trim()}/dashboard`, { replace: true });
            }
            else { alert(response.data.message)}
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
                <div className="w-full relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="log-desc-input"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'password')}
                        ref={passwordInputRef}
                        required
                    />
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 pr-1 text-gray-500 cursor-pointer"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        <FontAwesomeIcon className='text-sm' icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                <span className='log-desc-anchor' onClick={() => { alert('Contact admin if you forgot your password') }}>Forgot Password</span>
                <button className="log-desc-btn" onClick={handleLogin}>
                    <FontAwesomeIcon icon={faLock} className='log-fa-fa-icons' />
                    <div className='log-login-desc' onClick={handleLogout}>LOGIN</div>
                </button>
            </div>
        </div>
    )
}

export default LoginPage;