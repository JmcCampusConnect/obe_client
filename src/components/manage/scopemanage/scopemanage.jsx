import React, { useState, useEffect } from "react";
import axios from "axios";
import './scopemanage.css';

function Scope() 
{
    const [scopeData, setScopeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => 
    {
        const scopeDetailsFetch = async () => 
        {
            try {
                const response = await axios.get(`${apiUrl}/api/scopeset`);
                setScopeData(response.data);
                setFilteredData(response.data);
            } 
            catch (err) {
                console.log('Error fetching data:', err);
            }
        };
        scopeDetailsFetch();
    }, [apiUrl]);

    const handleCheckboxChange = (staffId, field, checked) => 
    {
        setScopeData(prevData =>
            prevData.map(item => 
                item.staff_id === staffId ? { ...item, [field]: checked ? 1 : 0 } : item
            )
        );
        setFilteredData(prevData =>
            prevData.map(item => 
                item.staff_id === staffId ? { ...item, [field]: checked ? 1 : 0 } : item
            )
        );
    };

    const handleAllCheckboxChange = (field) => 
    {
        const allChecked = scopeData.every(item => item[field] === 1);
        setScopeData(prevData =>
            prevData.map(item => ({ ...item, [field]: allChecked ? 0 : 1 }))
        );
        setFilteredData(prevData =>
            prevData.map(item => ({ ...item, [field]: allChecked ? 0 : 1 }))
        );
    };

    const handleSave = async () => 
    {
        const updates = {};
        scopeData.forEach(item => 
        {
            updates[item.staff_id] = 
            {
                dashboard: item.dashboard,
                course_list: item.course_list,
                course_outcome: item.course_outcome,
                student_outcome: item.student_outcome,
                program_outcome: item.program_outcome,
                program_specific_outcome: item.program_specific_outcome,
                // obe_report: item.obe_report,
                work_progress_report: item.work_progress_report,
                input_files: item.input_files,
                manage: item.manage,
                relationship_matrix: item.relationship_matrix,
                settings: item.settings,
            };
        });

        try {
            await axios.put(`${apiUrl}/api/updateScope`, { updates });
            alert("Data Saved Successfully!");
        } 
        catch (error) {
            alert("Failed to Save Data. " + (error.response?.data.message || error.message));
        }
    };

    const handleSearch = (e) => 
    {
        const searchText = e.target.value.toLowerCase();
        const filterList = scopeData.filter(scope =>
            scope.staff_id.toLowerCase().includes(searchText)
        )
        setFilteredData(filterList);
    }
    
    return (
        <div className="scope-main">
            <span className="scope-top-heading">SCOPE DATA</span>
            <div className="scope-input-btn">
                <input className="scope-search"
                    type="text"
                    placeholder="Search by Staff ID..."
                    onChange={handleSearch}
                />
                <button onClick={handleSave} className="scope-save-btn">SAVE</button>
            </div>
            <div className="scope-table-wrapper">
                <table className="scope-table">
                    <thead className="scope-table-head">
                        <tr>
                            <th className="scope-table-header-checkbox">Options</th>
                            {/* <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('dashboard')}
                                    checked={scopeData.every(item => item.dashboard === 1)}
                                />
                            </th> */}
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('course_list')}
                                    checked={scopeData.every(item => item.course_list === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('course_outcome')}
                                    checked={scopeData.every(item => item.course_outcome === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('student_outcome')}
                                    checked={scopeData.every(item => item.student_outcome === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('program_outcome')}
                                    checked={scopeData.every(item => item.program_outcome === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('program_specific_outcome')}
                                    checked={scopeData.every(item => item.program_specific_outcome === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('work_progress_report')}
                                    checked={scopeData.every(item => item.work_progress_report === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('input_files')}
                                    checked={scopeData.every(item => item.input_files === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('manage')}
                                    checked={scopeData.every(item => item.manage === 1)}
                                />
                            </th>
                            {/* <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('obe_report')}
                                    checked={scopeData.every(item => item.obe_report === 1)}
                                />
                            </th> */}
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('relationship_matrix')}
                                    checked={scopeData.every(item => item.relationship_matrix === 1)}
                                />
                            </th>
                            <th className="scope-table-header-checkbox">
                                <input
                                    type="checkbox"
                                    className="scope-header-inputbox"
                                    onChange={() => handleAllCheckboxChange('settings')}
                                    checked={scopeData.every(item => item.settings === 1)}
                                />
                            </th>
                        </tr>
                        <tr className="scope-table-options">
                            <th className="scope-table-header">STAFF ID</th>
                            {/* <th className="scope-table-header">Dashboard</th> */}
                            <th className="scope-table-header">Course</th>
                            <th className="scope-table-header">CO</th>
                            <th className="scope-table-header">SO</th>
                            <th className="scope-table-header">PO</th>
                            <th className="scope-table-header">PSO</th>
                            <th className="scope-table-header">Report</th>
                            <th className="scope-table-header">Input</th>
                            <th className="scope-table-header">Manage</th>
                            {/* <th className="scope-table-header">OBE Report</th> */}
                            <th className="scope-table-header">RSM</th>
                            <th className="scope-table-header">Settings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((scopeItem, rowIndex) => (
                                <tr key={scopeItem.staff_id} className="scope-staffid">
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        {scopeItem.staff_id}
                                    </td>
                                    {/* <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.dashboard === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'dashboard', e.target.checked)}
                                        />
                                    </td> */}
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.course_list === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'course_list', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.course_outcome === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'course_outcome', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.student_outcome === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'student_outcome', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.program_outcome === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'program_outcome', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.program_specific_outcome === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'program_specific_outcome', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input  
                                            type="checkbox"
                                            checked={scopeItem.work_progress_report === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'work_progress_report', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.input_files === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'input_files', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.manage === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'manage', e.target.checked)}
                                        />
                                    </td>
                                    {/* <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.obe_report === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'mentor_report', e.target.checked)}
                                        />
                                    </td> */}
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.relationship_matrix === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'relationship_matrix', e.target.checked)}
                                        />
                                    </td>
                                    <td className={rowIndex % 2 === 0 ? 'scope-dark' : 'scope-light'}>
                                        <input 
                                            type="checkbox"
                                            checked={scopeItem.settings === 1}
                                            onChange={(e) => handleCheckboxChange(scopeItem.staff_id, 'settings', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="15" className="hod-repo-td">
                                    No Data Available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Scope;
