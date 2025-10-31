import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './settings.css';
import { useParams } from 'react-router-dom';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import passbg from '../../assets/passbg.jpg';

function Settings() {
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const { staffId } = useParams();

    const handlePasswordChange = async () => {
        if (newPassword !== '' && confirmPassword !== '') {
            if (newPassword === confirmPassword) {
                try {
                    const response = await axios.post(`${apiUrl}/api/passwordchange`, {
                        staff_id: staffId,
                        staff_pass: newPassword,
                    })
                    if (response.data.success) {
                        alert(response.data.message);
                        window.location.reload();
                    }
                }
                catch (error) {
                    alert('An error occurred. Please try Again Later.');
                    console.error('Login Error: ', error);
                }
            }
            else {
                alert("New Password & Confirm Password are not Same")
            }
        }
        else {
            alert("Fill Both the Fields");
            return;
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handlePasswordChange();
        }
    }

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
                        onKeyPress={handleKeyPress}
                    />
                    <input
                        className="settings-desc-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="settings-desc-btn" onClick={handlePasswordChange}>
                        <FontAwesomeIcon icon={faKey} className='settings-fa-fa-icons' />
                        <div className='settings-login-desc'>Reset Password</div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings;
