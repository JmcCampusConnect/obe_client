import React, { useState, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/Settings.css';
import { useParams } from 'react-router-dom';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import passbg from '../assets/passbg.jpg';

function Settings() {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const confirmPasswordRef = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const { staffId } = useParams();

    const handlePasswordChange = async () => {
        if (newPassword !== '' && confirmPassword !== '') {
            if (newPassword === confirmPassword) {
                try {
                    const response = await axios.post(`${apiUrl}/api/passwordchange`, {
                        staff_id: staffId,
                        staff_pass: newPassword,
                    });
                    if (response.data.success) {
                        alert(response.data.message);
                        window.location.reload();
                    }
                } catch (error) {
                    alert('An error occurred. Please try Again Later.');
                    console.error('Password Change Error:', error);
                }
            } else {
                alert("New password & confirm password are not same");
            }
        } else {
            alert("Fill both the fields");
            return;
        }
    };

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            if (field === 'newPassword') {
                confirmPasswordRef.current.focus();
            } else if (field === 'confirmPassword') {
                handlePasswordChange();
            }
        }
    };

    return (
        <div className="settings-parent">
            <div className="settings-main">
                <div className="settings-left-wrapper">
                    <img src={passbg} alt="LOGO" className="settings-passbg" />
                </div>
                <div className="settings-right-wrapper">
                    <span className="settings-rgt-header">Change Your Password</span>

                    <input
                        className="settings-desc-input"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'newPassword')}
                    />

                    <input
                        className="settings-desc-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'confirmPassword')}
                        ref={confirmPasswordRef}
                    />

                    <button className="settings-desc-btn" onClick={handlePasswordChange}>
                        <FontAwesomeIcon icon={faKey} className='settings-fa-fa-icons' />
                        <div className='settings-login-desc'>Reset Password</div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;