import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function HodReportFilter({
    showFilters, clearAllFilters,
    filterDeptId, setFilterDeptId, deptOptions,
    filterStaffId, setFilterStaffId, staffOptions,
    filterCourseCode, setFilterCourseCode, courseCodeOptions,
    filterSection, setFilterSection, sectionOptions
}) {

    const getOptionValue = (opt) => (typeof opt === "string" ? opt : opt?.value || "");
    const getOptionLabel = (opt) => (typeof opt === "string" ? opt : opt?.label || "");

    if (!showFilters) return null;

    return (
        <div className="crm-filters">
            <div className="filter-grid-hod-report-grid">

                {/* Staff ID Filter */}
                <SearchableDropdown
                    options={staffOptions}
                    value={filterStaffId}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterStaffId(getOptionValue(opt))}
                    placeholder="Staff ID"
                />

                {/* Department Filter */}
                <SearchableDropdown
                    options={deptOptions}
                    value={filterDeptId}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterDeptId(getOptionValue(opt))}
                    placeholder="Department"
                />

                {/* Course Code Filter */}
                <SearchableDropdown
                    options={courseCodeOptions}
                    value={filterCourseCode}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterCourseCode(getOptionValue(opt))}
                    placeholder="Course Code"
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

export default HodReportFilter;
