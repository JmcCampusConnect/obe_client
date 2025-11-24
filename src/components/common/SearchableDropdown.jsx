import React, { useState, useEffect, useRef } from "react";

function SearchableDropdown({ label, options, value, onSelect, getOptionLabel, placeholder, error, useMode }) {

    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const itemRefs = useRef([]);

    useEffect(() => {
        const updateInputValue = () => {
            if (value) {
                const selectedOption = options.find(
                    opt => (typeof opt === "string" ? opt : opt.value) === value
                );
                if (selectedOption) {
                    setInputValue(getOptionLabel(selectedOption));
                } else if (useMode === "edit") {
                    setInputValue(String(value));
                }
            } else {
                setInputValue("");
            }
        };
        updateInputValue();
    }, [useMode, value, getOptionLabel, options]);

    const filteredOptions = options.filter(opt =>
        getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
    )

    const handleSelect = (opt) => {
        onSelect(opt);
        setInputValue(getOptionLabel(opt));
        setShowDropdown(false);
        setHighlightIndex(-1);

        setTimeout(() => {
            dropdownRef.current?.querySelector("input")?.blur();
        }, 50);
    };

    useEffect(() => {
        if (highlightIndex >= 0 && itemRefs.current[highlightIndex]) {
            itemRefs.current[highlightIndex].scrollIntoView({
                block: "nearest",
                behavior: "smooth"
            });
        }
    }, [highlightIndex]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setHighlightIndex(-1);

                const selectedOption = options.find(
                    opt => (typeof opt === "string" ? opt : opt.value) === value
                );
                if (selectedOption) {
                    setInputValue(getOptionLabel(selectedOption));
                } else if (value) {
                    setInputValue(String(value));
                } else {
                    setInputValue("");
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [options, value, getOptionLabel]);

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputValue(text);
        setShowDropdown(true);
        setHighlightIndex(-1);
        if (text.trim() === "") { onSelect(null) }
    }

    const handleKeyDown = (e) => {
        if (!showDropdown || filteredOptions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex(prev =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex(prev =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightIndex > -1) {
                handleSelect(filteredOptions[highlightIndex]);
            } else if (filteredOptions.length > 0) {
                handleSelect(filteredOptions[0]);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setShowDropdown(false);
            setHighlightIndex(-1);
        }
    };

    return (
        <div className="smsh-form" ref={dropdownRef}>
            {label && <label className="smsh-edit-search-label">{label}</label>}

            <div className="relative">
                <input
                    type="text"
                    className={`smsm-inputs dropdown-input ${error ? "input-error" : ""}`}
                    value={inputValue}
                    placeholder={placeholder || ""}
                    onFocus={() => {
                        setShowDropdown(true);
                        setHighlightIndex(-1);
                    }}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />

                {showDropdown && filteredOptions.length > 0 && (
                    <ul className="dropdown-list">
                        {filteredOptions.map((opt, idx) => (
                            <li
                                key={idx}
                                ref={el => (itemRefs.current[idx] = el)}
                                className={`dropdown-item ${highlightIndex === idx ? "highlighted-option" : ""}`}
                                onMouseDown={() => handleSelect(opt)}
                            >
                                {getOptionLabel(opt)}
                            </li>
                        ))}
                    </ul>
                )}

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    )
}

export default SearchableDropdown;