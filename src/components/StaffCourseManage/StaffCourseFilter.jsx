import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function StaffCourseFilter({
    showFilters, clearAllFilters, filterCategory, setFilterCategory, filterDeptId, setFilterDeptId,
    depts, filterStaffId, setFilterStaffId, staffOptions, filterCourseCode, setFilterCourseCode,
    courseCodeOptions, filterSection, setFilterSection, sectionOptions
}) {

    const categoryOptions = [
        { value: "AIDED", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" }
    ];

    const getOptionValue = (opt) => (typeof opt === "string" ? opt : (opt ? opt.value : ""));
    const getOptionLabel = (opt) => (typeof opt === "string" ? opt : opt.label);

    if (!showFilters) return null;

    return (
        <div className="crm-filters">
            <div className="filter-grid-staff-course">

                <SearchableDropdown
                    options={staffOptions}
                    value={filterStaffId}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterStaffId(getOptionValue(opt))}
                    placeholder="Staff ID or Name"
                />

                <SearchableDropdown
                    options={depts}
                    value={filterDeptId}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterDeptId(getOptionValue(opt))}
                    placeholder="Department ID"
                />

                <SearchableDropdown
                    options={categoryOptions}
                    value={filterCategory}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterCategory(getOptionValue(opt))}
                    placeholder="Category"
                />

                <SearchableDropdown
                    options={courseCodeOptions}
                    value={filterCourseCode}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterCourseCode(getOptionValue(opt))}
                    placeholder="Course Code or Title"
                />

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