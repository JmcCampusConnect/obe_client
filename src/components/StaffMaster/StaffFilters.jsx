import React from 'react';
import SearchableDropdown from '../../common/SearchableDropdown';

function StaffFilters({
    showFilters, staffCategory, setStaffCategory, staffDept, setStaffDept,
    staff_Dept, searchText, staffData, setFilteredData, setPage
}) {

    const categoryOptions = [
        { value: "SFM", label: "SFM" },
        { value: "SFW", label: "SFW" },
        { value: "AIDED", label: "AIDED" }
    ];

    const departmentOptions = staff_Dept.map(d => ({ value: d.staff_dept, label: d.staff_dept }));

    const handleApplyFilters = () => {
        const lower = (searchText || "").toLowerCase();
        const filtered = staffData.filter(s => {
            return (
                (staffCategory ? s.staff_category === staffCategory : true) &&
                (staffDept ? s.staff_dept === staffDept : true) &&
                ((lower === "") ||
                    (s.staff_name || "").toLowerCase().includes(lower) ||
                    (s.staff_id || "").toLowerCase().includes(lower))
            );
        });
        setFilteredData(filtered);
        setPage(1);
    };

    const handleClearFilters = () => {
        setStaffCategory("");
        setStaffDept("");
        const lower = (searchText || "").toLowerCase();
        if (lower) {
            handleApplyFilters(); 
        } else {
            setFilteredData(staffData); 
        }
        setPage(1);
    };

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
                    <button className="btn btn-primary" onClick={handleApplyFilters}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StaffFilters;