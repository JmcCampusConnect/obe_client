import React, { useState, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import jmclogo from '../assets/jmclogo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/common/Authenticate';
import '../css/LoginPage.css';

const getPasswordConstraints = (password) => {
    return {
        minLength: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasDigit: /\d/.test(password),
        hasSpecial: /[!@#$%^&*()_+={}[\]:;"'<,>.?/\\|~-]/.test(password),
    }
}

function LoginPage() {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [staffId, setStaffId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [staffIdToChange, setStaffIdToChange] = useState('');

    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const passwordInputRef = useRef(null);

    const handleLogin = async () => {

        if (staffId === '' || password === '') {
            alert('Fill both fields');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/login`, {
                staff_id: staffId.trim(),
                staff_pass: password.trim()
            });

            if (response.data.success) {
                if (response.data.needsPasswordChange) {
                    setStaffIdToChange(staffId.trim());
                    setShowModal(true);
                } else {
                    login(staffId.trim());
                    navigate(`staff/${staffId.trim()}/dashboard`, { replace: true });
                }
            } else {
                alert(response.data.message);
            }

        } catch (err) {
            console.error("Login Error:", err);
            alert("Something went wrong.");
        }
    };

    const handleSuccessRedirect = () => {
        setShowModal(false);
        navigate(`staff/${staffIdToChange}/dashboard`, { replace: true });
    };

    const handleKeyPress = (e, field) => {
        if (e.key === "Enter") {
            if (field === 'staffId') passwordInputRef.current.focus();
            if (field === 'password') handleLogin();
        }
    };

    return (
        <div className="log-parent">
            {showModal && (
                <PasswordChangeModal
                    staffId={staffIdToChange}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccessRedirect}
                    apiUrl={apiUrl}
                    login={login}
                />
            )}

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

            <div className="log-right-container">
                <span className="log-desc-para">LOGIN TO YOUR ACCOUNT</span>

                <input
                    className="log-desc-input"
                    type="text"
                    placeholder="Enter Staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'staffId')}
                />

                <div className="w-full relative">
                    <input
                        className="log-desc-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'password')}
                        ref={passwordInputRef}
                    />

                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>

                <span
                    className='log-desc-anchor'
                    onClick={() => alert("Contact admin if you forgot your password")}
                >
                    Forgot Password?
                </span>

                <button className="log-desc-btn" onClick={handleLogin}>
                    <FontAwesomeIcon icon={faLock} className="log-fa-fa-icons" />
                    <div className="log-login-desc">LOGIN</div>
                </button>
            </div>
        </div>
    );
}

const PasswordChangeModal = ({ staffId, onClose, onSuccess, apiUrl, login }) => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const constraints = useMemo(() => getPasswordConstraints(newPassword), [newPassword]);
    const isNewPasswordValid = Object.values(constraints).every(Boolean);

    const handlePasswordUpdate = async () => {

        setError('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (!isNewPasswordValid) {
            setError("New password must meet all strength requirements.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        if (oldPassword === newPassword) {
            setError("New password must be different from old password.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/update-password`, {
                staff_id: staffId,
                old_password: oldPassword,
                new_password: newPassword
            });

            if (response.data.success) {
                alert("Password updated successfully ! Redirecting...");
                login(staffId);
                onSuccess();
            } else {
                setError(response.data.message || "Password update failed.");
            }

        } catch (err) {
            console.error("Password update error:", err);
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderRequirement = (isOk, label) => (
        <div className={`pwd-req ${isOk ? 'ok' : 'not-ok'}`}>
            <FontAwesomeIcon icon={isOk ? faCheckCircle : faTimesCircle} className="pwd-req-icon" />
            {label}
        </div>
    );

    return (
        <div className="pwd-modal-overlay">
            <div className="pwd-modal">
                <h2 className="pwd-title">🔐 Password Change Required</h2>
                <p className="pwd-subtitle">
                    Your current password is weak/default. Set a strong password to continue.
                </p>
                {error && <div className="pwd-error-box">{error}</div>}
                <input
                    className="pwd-input"
                    type="password"
                    placeholder="Enter Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                    className="pwd-input"
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    className="pwd-input"
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="pwd-req-box">
                    <p className="pwd-req-title">New Password Requirements : </p>

                    <div className="pwd-req-grid">
                        {renderRequirement(constraints.minLength, "Min 8 Characters")}
                        {renderRequirement(constraints.hasUpper, "Uppercase Letter")}
                        {renderRequirement(constraints.hasLower, "Lowercase Letter")}
                        {renderRequirement(constraints.hasDigit, "Digit (0-9)")}
                        {renderRequirement(constraints.hasSpecial, "Special Character")}
                    </div>
                </div>
                <button
                    className="pwd-btn"
                    onClick={handlePasswordUpdate}
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Set New Password & Login"}
                </button>
            </div>
        </div>
    )
}


export default LoginPage;