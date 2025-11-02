import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

function RsMartixReportHeader({ searchText, handleSearch, handleDownload, setShowFilters }) {

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-toolbar">
                    <div className="toolbar-left">
                        <div className="search-group">
                            <input
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search by Course Code, Status..."
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
                        <button className="btn btn-primary" onClick={handleDownload}>
                            Download Excel
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default RsMartixReportHeader;