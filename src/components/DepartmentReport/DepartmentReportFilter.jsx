import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function DepartmentReportFilter({
    showFilters, clearAllFilters, filterCategory, setFilterCategory, filterDeptId, setFilterDeptId, depts,
    filterStaffId, setFilterStaffId, staffOptions, filterCourseCode, setFilterCourseCode, courseCodeOptions,
    filterSection, setFilterSection, sectionOptions, filterStatus, setFilterStatus
}) {

    const categoryOptions = [ 
        { value: "AIDED", label: "AIDED" },
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" }
    ]

    const getOptionValue = (opt) => (typeof opt === "string" ? opt : opt?.value || "");
    const getOptionLabel = (opt) => (typeof opt === "string" ? opt : opt?.label || "");

    if (!showFilters) return null;

    return (
        <div className="crm-filters">
            <div className="filter-grid-dept-report">

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
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterDeptId(getOptionValue(opt))}
                    placeholder="Department"
                />

                <SearchableDropdown
                    options={categoryOptions}
                    value={filterCategory}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterCategory(getOptionValue(opt))}
                    placeholder="Category"
                />

                <SearchableDropdown
                    options={courseCodeOptions}
                    value={filterCourseCode}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterCourseCode(getOptionValue(opt))}
                    placeholder="Course Code"
                />

                <SearchableDropdown
                    options={sectionOptions}
                    value={filterSection}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterSection(getOptionValue(opt))}
                    placeholder="Section"
                />

                <SearchableDropdown
                    options={[
                        { value: "Completed", label: "Completed" },
                        { value: "Processing", label: "Processing" },
                        { value: "Incomplete", label: "Incomplete" },
                    ]}
                    value={filterStatus}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterStatus(getOptionValue(opt))}
                    placeholder="Status"
                />
            </div>
            <div className="filter-actions">
                <button
                    className="btn btn-outline"
                    onClick={clearAllFilters}
                >
                    Clear Filters
                </button>
            </div>
        </div>
    )
}

export default DepartmentReportFilter;
