import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useNavigate } from 'react-router-dom';
import {
    faKey, faEye, faEyeSlash, faCheck,
    faTimes, faInfoCircle, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import '../css/Settings.css';
import passbg from '../assets/passbg.jpg';

function Settings() {

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false
    });

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [touched, setTouched] = useState({
        newPassword: false,
        confirmPassword: false
    });

    const confirmPasswordRef = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const { staffId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const password = formData.newPassword;
        setPasswordStrength({
            score: calculatePasswordStrength(password),
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    }, [formData.newPassword]);

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        return score;
    };

    const getPasswordStrengthText = () => {
        const score = passwordStrength.score;
        if (score <= 2) return { text: 'Weak', color: '#dc3545' };
        if (score <= 3) return { text: 'Medium', color: '#ffc107' };
        if (score <= 4) return { text: 'Good', color: '#17a2b8' };
        return { text: 'Strong', color: '#28a745' };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleBlur = (field) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Both fields are required');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirm password do not match');
            return false;
        }
        if (passwordStrength.score < 3) {
            setError('Please choose a stronger password');
            return false;
        }
        return true;
    };

    const handlePasswordChange = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${apiUrl}/api/passwordchange`, {
                staff_id: staffId,
                staff_pass: formData.newPassword,
            });
            if (response.data.success) {
                setSuccess('Password changed successfully! Redirecting...');
                // Clear form
                setFormData({
                    newPassword: '',
                    confirmPassword: ''
                });
                // Redirect after success
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                'An error occurred. Please try again later.';
            setError(errorMessage);
            console.error('Password Change Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (field === 'newPassword') {
                confirmPasswordRef.current?.focus();
            } else if (field === 'confirmPassword') {
                handlePasswordChange();
            }
        }
    };

    const isFormValid = () => {
        return formData.newPassword &&
            formData.confirmPassword &&
            formData.newPassword === formData.confirmPassword &&
            passwordStrength.score >= 3;
    };

    const strengthInfo = getPasswordStrengthText();

    return (
        <div className="settings-container">
            <div className="settings-card">

                {/* Right Side - Form */}
                <div className="settings-form-section">
                    <div className="settings-form-header">
                        <h1>Change Password</h1>
                        <p>Please enter your new password below</p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="settings-message error">
                            <FontAwesomeIcon icon={faTimes} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="settings-message success">
                            <FontAwesomeIcon icon={faCheck} />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* New Password Field */}
                    <div className="settings-input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="settings-input-wrapper">
                            <input
                                id="newPassword"
                                name="newPassword"
                                className={`settings-input ${touched.newPassword && !formData.newPassword ? 'error' : ''}`}
                                type={showPasswords.new ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('newPassword')}
                                onKeyPress={(e) => handleKeyPress(e, 'newPassword')}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="settings-password-toggle"
                                onClick={() => togglePasswordVisibility('new')}
                                aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
                            >
                                <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        {/* Password Strength Meter */}
                        {formData.newPassword && (
                            <div className="settings-password-strength">
                                <div className="settings-strength-bar">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`settings-strength-level ${level <= passwordStrength.score ? 'active' : ''}`}
                                            style={{ backgroundColor: level <= passwordStrength.score ? strengthInfo.color : '#e0e0e0' }}
                                        />
                                    ))}
                                </div>
                                <span style={{ color: strengthInfo.color }}>
                                    Password Strength: {strengthInfo.text}
                                </span>
                            </div>
                        )}

                        {/* Password Requirements */}
                        <div className="settings-password-requirements">
                            <p>
                                <FontAwesomeIcon
                                    icon={passwordStrength.hasMinLength ? faCheck : faTimes}
                                    className={passwordStrength.hasMinLength ? 'valid' : 'invalid'}
                                />
                                At least 8 characters
                            </p>
                            <p>
                                <FontAwesomeIcon
                                    icon={passwordStrength.hasUpperCase ? faCheck : faTimes}
                                    className={passwordStrength.hasUpperCase ? 'valid' : 'invalid'}
                                />
                                One uppercase letter
                            </p>
                            <p>
                                <FontAwesomeIcon
                                    icon={passwordStrength.hasLowerCase ? faCheck : faTimes}
                                    className={passwordStrength.hasLowerCase ? 'valid' : 'invalid'}
                                />
                                One lowercase letter
                            </p>
                            <p>
                                <FontAwesomeIcon
                                    icon={passwordStrength.hasNumber ? faCheck : faTimes}
                                    className={passwordStrength.hasNumber ? 'valid' : 'invalid'}
                                />
                                One number
                            </p>
                            <p>
                                <FontAwesomeIcon
                                    icon={passwordStrength.hasSpecialChar ? faCheck : faTimes}
                                    className={passwordStrength.hasSpecialChar ? 'valid' : 'invalid'}
                                />
                                One special character
                            </p>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="settings-input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="settings-input-wrapper">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                ref={confirmPasswordRef}
                                className={`settings-input ${touched.confirmPassword &&
                                    formData.confirmPassword &&
                                    formData.newPassword !== formData.confirmPassword ? 'error' : ''
                                    }`}
                                type={showPasswords.confirm ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('confirmPassword')}
                                onKeyPress={(e) => handleKeyPress(e, 'confirmPassword')}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="settings-password-toggle"
                                onClick={() => togglePasswordVisibility('confirm')}
                                aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
                            >
                                <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        {/* Match Indicator */}
                        {touched.confirmPassword && formData.confirmPassword && (
                            <div className={`settings-match-indicator ${formData.newPassword === formData.confirmPassword ? 'match' : 'no-match'
                                }`}>
                                <FontAwesomeIcon
                                    icon={formData.newPassword === formData.confirmPassword ? faCheck : faTimes}
                                />
                                <span>
                                    {formData.newPassword === formData.confirmPassword
                                        ? 'Passwords match'
                                        : 'Passwords do not match'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        className={`settings-submit-btn ${loading ? 'loading' : ''}`}
                        onClick={handlePasswordChange}
                        disabled={loading || !isFormValid()}
                    >
                        {loading ? (
                            <>
                                <span className="settings-spinner" />
                                Changing Password...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faKey} />
                                Reset Password
                            </>
                        )}
                    </button>

                    {/* Security Notice */}
                    <div className="settings-security-note">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <p>
                            For your security, choose a password you haven't used before and
                            avoid sharing it with anyone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;