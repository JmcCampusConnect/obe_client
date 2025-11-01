import React from 'react';
import SearchableDropdown from '../../common/SearchableDropdown';

function StaffFilters({
    showFilters, staffCategory, setStaffCategory, staffDept, setStaffDept,
    staff_Dept,  filterDeptCategory, setFilterDeptCategory, applyFiltersFunction
}) {

    const categoryOptions = [
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
        { value: "AIDED", label: "AIDED" }
    ];

    const deptCategoryOptions = [
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
        { value: "AIDED", label: "AIDED" }
    ];

    const departmentOptions = staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }));

    const handleClearFilters = () => {
        setStaffCategory("");
        setStaffDept("");
        setFilterDeptCategory("");
        applyFiltersFunction();
    }

    if (!showFilters) return null;

    return (
        <div className="crm-filters">
            <div className="filter-grid">
                <SearchableDropdown
                    options={categoryOptions}
                    value={staffCategory}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setStaffCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                    placeholder="Staff Category"
                />
                <SearchableDropdown
                    options={deptCategoryOptions}
                    value={filterDeptCategory}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setFilterDeptCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                    placeholder="Dept Category"
                />
                <SearchableDropdown
                    options={departmentOptions}
                    value={staffDept}
                    getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
                    onSelect={(opt) => setStaffDept(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
                    placeholder="Department Name"
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

export default StaffFilters;