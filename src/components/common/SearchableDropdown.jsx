import React, { useState, useEffect, useRef } from "react";
import "../../css/StaffMaster.css";

function SearchableDropdown({ label, options, value, onSelect, getOptionLabel, placeholder }) {

    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (typeof value === "string") {
            setInputValue(value);
        } else if (value) {
            setInputValue(getOptionLabel(value));
        }
    }, [value, getOptionLabel]);

    const filteredOptions = options.filter(opt =>
        getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
    );

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
                    placeholder={placeholder || ""}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowDropdown(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredOptions.length > 0) {
                                const selected = filteredOptions[0];
                                onSelect(selected);
                                setShowDropdown(false);
                                setTimeout(() => {
                                    dropdownRef.current
                                        ?.querySelector("input")
                                        ?.blur();
                                }, 50);
                            }
                        }
                    }}
                />

                {showDropdown && filteredOptions.length > 0 && (
                    <ul className="dropdown-list">
                        {filteredOptions.map((opt, idx) => (
                            <li
                                key={idx}
                                className="dropdown-item"
                                onMouseDown={() => {
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
    )
}

export default SearchableDropdown;