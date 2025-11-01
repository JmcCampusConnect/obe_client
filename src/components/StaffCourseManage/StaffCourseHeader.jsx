import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

// PROPS: searchText, handleSearch (setSearchTerm), showPopup (open Add Modal), setShowFilters (toggle state)
function StaffCourseHeader({ searchText, handleSearch, showPopup, setShowFilters }) {

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-toolbar">
                    <div className="toolbar-left">
                        <div className="search-group">
                            <input
                                value={searchText}
                                // Fix: handleSearch is the setSearchTerm function from parent
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by ID, Name, Department..."
                                className="search-input"
                            />
                            {/* Fix: Call setShowFilters to toggle filter visibility */}
                            <button className="filter-button" onClick={() => setShowFilters(v => !v)} title="Toggle Filters">
                                <FontAwesomeIcon icon={faFilter} />
                            </button>
                        </div>
                    </div>

                    <div className="toolbar-right">
                        {/* Fix: Clear search by setting searchTerm to empty string */}
                        <button className="btn btn-secondary" onClick={() => handleSearch("")}>
                            Clear Search
                        </button>
                        {/* Fix: Call showPopup to open the Add Modal */}
                        <button className="btn btn-primary" onClick={showPopup}>
                            <FontAwesomeIcon icon={faPlus} /> Add New Course
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default StaffCourseHeader;