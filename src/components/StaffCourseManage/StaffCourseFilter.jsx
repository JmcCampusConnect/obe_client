import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function StaffCourseFilter({
    showFilters, 
    filterCategory, setFilterCategory, 
    filterDeptId, setFilterDeptId, depts, // Dept ID filter
    filterStaffId, setFilterStaffId, staffOptions, // Staff ID filter
    filterCourseCode, setFilterCourseCode, courseCodeOptions, // Course Code filter
    filterSection, setFilterSection, sectionOptions, // Section filter
    clearAllFilters
}) {

    const categoryOptions = [
        { value: "AIDED", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" }
    ];

    const getOptionValue = (opt) => (typeof opt === "string" ? opt : (opt ? opt.value : ""));

    if (!showFilters) return null;

    return (
        <div className="crm-filters">
            <div className="filter-grid-hod">

                {/* 1. Category Filter */}
                <SearchableDropdown
                    options={categoryOptions}
                    value={filterCategory}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterCategory(getOptionValue(opt))}
                    placeholder="Category"
                />

                {/* 2. Department ID Filter */}
                <SearchableDropdown
                    options={depts}
                    value={filterDeptId}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterDeptId(getOptionValue(opt))}
                    placeholder="Department ID"
                />
                
                {/* 3. Staff ID Filter */}
                <SearchableDropdown
                    options={staffOptions}
                    value={filterStaffId}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterStaffId(getOptionValue(opt))}
                    placeholder="Staff ID"
                />
                
                {/* 4. Staff Name (Removing this to use the ID dropdown, or you can add a staff name list if needed) */}
                {/* <SearchableDropdown 
                    options={staffOptions} // Reusing staffOptions here, but typically you filter on ID
                    value={filterStaffId}
                    // This is currently redundant with the above Staff ID filter unless you want a name-only search
                    placeholder="Staff Name"
                /> */}
                
                {/* 5. Course Code Filter */}
                <SearchableDropdown
                    options={courseCodeOptions}
                    value={filterCourseCode}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterCourseCode(getOptionValue(opt))}
                    placeholder="Course Code"
                />
                
                {/* 6. Section Filter */}
                <SearchableDropdown
                    options={sectionOptions}
                    value={filterSection}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterSection(getOptionValue(opt))}
                    placeholder="Section"
                />

                <div className="filter-actions">
                    <button className="btn btn-outline" onClick={clearAllFilters}>
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StaffCourseFilter;