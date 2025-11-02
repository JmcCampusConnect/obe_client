import React from "react";
import SearchableDropdown from "../common/SearchableDropdown";

function RsMartixReportFilters({
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
        <div className="crm-filters bg-white p-6 rounded-xl shadow-lg border border-sky-100 mb-6">
            <div className="filter-grid-dept-report grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

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

export default RsMartixReportFilters;