// components/TutorManage/TutorHeader.jsx

import React from 'react';

function TutorReportHeader({ searchText, handleSearch }) {

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
    )
}

export default TutorReportHeader;