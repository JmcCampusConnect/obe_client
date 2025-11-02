import React from 'react';

function ScopeHeader({ searchText, handleSearch, handleSave }) {

    const handleClearSearch = () => { handleSearch({ target: { value: "" } }) }

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-toolbar">

                    {/* Toolbar Left: Search Input */}
                    <div className="toolbar-left">
                        <div className="search-group">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by Staff ID..."
                                value={searchText}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Toolbar Right: Actions */}
                    <div className="toolbar-right">
                        <button
                            className="btn btn-secondary"
                            onClick={handleClearSearch}
                        >
                            Clear Search
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            SAVE
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ScopeHeader;
