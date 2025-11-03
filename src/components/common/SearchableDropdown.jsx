import React, { useState, useEffect, useRef } from "react";
import "../../css/StaffMaster.css";

function SearchableDropdown({ label, options, value, onSelect, getOptionLabel, placeholder }) {

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const inputValue = typeof value === "string" ? value : value?.value || "";

    const filteredOptions = options.filter(opt => {
        const labelStr = getOptionLabel(opt) || "";
        return labelStr.toLowerCase().includes(inputValue.toLowerCase());
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="smsh-form" ref={dropdownRef}>
            {label && <label className="smsh-edit-search-label">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    className="smsm-inputs dropdown-input"
                    value={inputValue}
                    onChange={(e) => {
                        onSelect(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder={placeholder || "" }
                />
                {showDropdown && filteredOptions.length > 0 && (
                    <ul className="dropdown-list">
                        {filteredOptions.map((opt, idx) => (
                            <li
                                key={idx}
                                className="dropdown-item"
                                onClick={() => {
                                    onSelect(opt);
                                    setShowDropdown(false);
                                }}
                            >
                                {getOptionLabel(opt)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}



export default SearchableDropdown;