import React from 'react';
import SearchableDropdown from '../../common/SearchableDropdown';

function HodFilters({
	showFilters, filterCategory, setFilterCategory, filterDeptId, setFilterDeptId, depts, clearAllFilters
}) {

	const categoryOptions = [
		{ value: "AIDED", label: "AIDED" },
		{ value: "SFM", label: "SFM" },
		{ value: "SFW", label: "SFW" }
	];

	const departmentIdOptions = depts.map(d => ({
		value: d.dept_id,
		label: `${d.dept_id} - ${d.dept_name}`
	}));

	const handleClearFilters = () => { clearAllFilters() }

	if (!showFilters) return null;

	return (
		<div className="crm-filters">
			<div className="filter-grid-hod">

				<SearchableDropdown
					options={categoryOptions}
					value={filterCategory}
					getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
					onSelect={(opt) => setFilterCategory(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
					placeholder="Category"
				/>

				<SearchableDropdown
					options={departmentIdOptions}
					value={filterDeptId}
					getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
					onSelect={(opt) => setFilterDeptId(typeof opt === "string" ? opt : (opt ? opt.value : ""))}
					placeholder="Department ID"
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

export default HodFilters;
