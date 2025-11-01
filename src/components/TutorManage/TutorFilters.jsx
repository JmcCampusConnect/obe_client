// components/TutorManage/TutorFilters.jsx

import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function TutorFilters({
    showFilters, filterCategory, setFilterCategory, filterDeptId, setFilterDeptId,
    filterSection, setFilterSection, departmentOptions, getUniqueValues, clearAllFilters
}) {

    const categoryOptions = [
        { value: "AIDED", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" }
    ];

    const sectionOptions = getUniqueValues("section").map(s => ({ value: s, label: s }));

    const handleClearFilters = () => { clearAllFilters() }

    if (!showFilters) return null;

    return (
        <div className="crm-filters">
            <div className="filter-grid">

                <SearchableDropdown
                    options={categoryOptions}
                    value={filterCategory}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                    placeholder="Category"
                />

                <SearchableDropdown
                    options={departmentOptions}
                    value={filterDeptId}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterDeptId(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                    placeholder="Department"
                />
                
                <SearchableDropdown
                    options={sectionOptions} 
                    value={filterSection} 
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterSection(typeof opt === "string" ? opt : (opt ? opt.value : ""))} // **FIXED** to use correct setter
                    placeholder="Section"
                />

                <div className="filter-actions">
                    <button className="btn btn-outline" onClick={handleClearFilters}>
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TutorFilters;