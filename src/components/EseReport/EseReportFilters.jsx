import React from "react";
import SearchableDropdown from "../common/SearchableDropdown";

function EseReportFilters({
    showFilters,
    clearAllFilters,
    filterCourseCode,
    setFilterCourseCode,
    courseCodeOptions,
    filterStatus,
    setFilterStatus,
}) {

    const getOptionValue = (opt) => (typeof opt === "string" ? opt : opt?.value || "");
    const getOptionLabel = (opt) => (typeof opt === "string" ? opt : opt?.label || "");

    if (!showFilters) return null;

    return (
        <div className="crm-filters">
            <div className="filter-grid-ese-report">

                <SearchableDropdown
                    options={courseCodeOptions}
                    value={filterCourseCode}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterCourseCode(getOptionValue(opt))}
                    placeholder="Course Code"
                />

                <SearchableDropdown
                    options={[
                        { value: "Completed", label: "Completed" },
                        { value: "Incomplete", label: "Incomplete" },
                    ]}
                    value={filterStatus}
                    getOptionLabel={getOptionLabel}
                    onSelect={(opt) => setFilterStatus(getOptionValue(opt))}
                    placeholder="Status"
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

export default EseReportFilters;