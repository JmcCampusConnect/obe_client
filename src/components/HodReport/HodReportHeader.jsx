import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

function HodReportHeader({ searchText, handleSearch, handleDownload, setShowFilters }) {

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-toolbar">
                    <div className="toolbar-left">
                        <div className="search-group">
                            <input
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by ID, Name, Department..."
                                className="search-input"
                            />
                            <button
                                className="filter-button"
                                onClick={() => setShowFilters(v => !v)}
                                title="Toggle Filters"
                            >
                                <FontAwesomeIcon icon={faFilter} />
                            </button>
                        </div>
                    </div>

                    <div className="toolbar-right">
                        <button className="btn btn-secondary" onClick={() => handleSearch("")}>
                            Clear Search
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HodReportHeader;
