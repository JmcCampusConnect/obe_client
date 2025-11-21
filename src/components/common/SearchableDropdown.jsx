import React, { useState, useEffect, useRef } from "react";
import "../../css/StaffMaster.css";

function SearchableDropdown({ label, options, value, onSelect, getOptionLabel, placeholder, error }) {

    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (value) {
            const selectedOption = options.find(opt =>
                (typeof opt === "string" ? opt : opt.value) === value
            )
            if (selectedOption) {
                setInputValue(getOptionLabel(selectedOption));
            } else {
                setInputValue(value);
            }
        } else {
            setInputValue("");
        }
    }, [value, getOptionLabel, options]);

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

    const handleSelect = (opt) => {
        onSelect(opt);
        setInputValue(getOptionLabel(opt));
        setShowDropdown(false);
        setTimeout(() => {
            dropdownRef.current
                ?.querySelector("input")
                ?.blur();
        }, 50);
    }

    return (
        <div className="smsh-form" ref={dropdownRef}>
            {label && <label className="smsh-edit-search-label">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    className={`smsm-inputs dropdown-input ${error ? 'input-error' : ''}`}
                    value={inputValue}
                    placeholder={placeholder || ""}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowDropdown(true);
                        if (e.target.value !== value) { onSelect("") }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredOptions.length > 0) {
                                handleSelect(filteredOptions[0]);
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
                                onMouseDown={() => handleSelect(opt)}
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