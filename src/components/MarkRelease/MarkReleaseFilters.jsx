import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function MarkReleaseFilters({
    showFilters, clearAllFilters,
    filterDeptId, setFilterDeptId,
    filterStaffId, setFilterStaffId,
    filterCourseCode, setFilterCourseCode,
    filterSection, setFilterSection,
    depts, staffOptions, courseCodeOptions, sectionOptions
}) {
    
    if (!showFilters) return null;

    const getOptionValue = (opt) => (typeof opt === "string" ? opt : (opt ? opt.value : ""));
    const getOptionLabel = (opt) => (typeof opt === "string" ? opt : opt.label);

    return (
        <div className="crm-filters">
            <div className="filter-grid-mark-release">

                {/* Staff Filter: ID + Name */}
                <SearchableDropdown
                    options={staffOptions}
                    value={filterStaffId}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterStaffId(getOptionValue(opt))}
                    placeholder="Staff ID / Name"
                />

                {/* Department Filter */}
                <SearchableDropdown
                    options={depts}
                    value={filterDeptId}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterDeptId(getOptionValue(opt))}
                    placeholder="Department"
                />

                {/* Course Code Filter: Code + Title */}
                <SearchableDropdown
                    options={courseCodeOptions}
                    value={filterCourseCode}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterCourseCode(getOptionValue(opt))}
                    placeholder="Course Code / Title"
                />

                {/* Section Filter */}
                <SearchableDropdown
                    options={sectionOptions}
                    value={filterSection}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterSection(getOptionValue(opt))}
                    placeholder="Section"
                />
            </div>
            <div className="filter-actions">
                <button className="btn btn-outline" onClick={clearAllFilters}>
                    Clear Filters
                </button>
            </div>
        </div>
    )
}

export default MarkReleaseFilters;