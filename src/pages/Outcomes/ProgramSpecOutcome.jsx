import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/ProgramSpecOutcome.css';

function ProgramSpecOutcome() {

    const [loading, setLoading] = useState(false);
    const [academicYear, setAcademicYear] = useState('');
    const [dept, setDept] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [deptId, setDeptId] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState('');
    const [attainmentSpecData, setAttainmentSpecData] = useState({});
    const [specTable, setSpecTable] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchDeptName = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/proDeptName`);
                const sortedDeptNames = response.data.dept_name.sort((a, b) => a.localeCompare(b));
                setAcademicYear(response.data.academic_year);
                setDept(sortedDeptNames);
            } catch (error) {
                alert('Error fetching Dept Names');
            }
        };
        fetchDeptName();
    }, [apiUrl]);

    const handleDeptChange = async (value) => {
        setSelectedDept(value);
        setSelectedDeptId('');
        try {
            const response = await axios.post(`${apiUrl}/api/proDeptIdChange`, { changeDept: value });
            const sortedDeptIds = response.data.sort((a, b) => a.localeCompare(b));
            setDeptId(sortedDeptIds);
        } catch (error) {
            alert('Error fetching Dept Id Names');
            console.error(error);
        }
    };

    const handleGetOutcomeSpec = async () => {
        if (!selectedDept || !selectedDeptId) {
            alert('Please select Department and Class');
            return;
        }
        try {
            setLoading(true);
            setSpecTable(false);
            const response = await axios.post(`${apiUrl}/api/proSpecOutcome`, {
                academicYear,
                selectedDept,
                selectedDeptId,
            });
            setAttainmentSpecData(response.data);
            setSpecTable(true);
        } catch (error) {
            alert('Error fetching outcome results');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="spec-dept-container">
            <div className="spec-dd-container">
                <div className="aso-dropdown-container">
                    <div className="aso-search-cnt">
                        <span className="aso-label">Academic Year :</span>
                        <input type="text" className="aso-select" value={academicYear} readOnly disabled />
                    </div>
                    <div className="aso-search-cnt">
                        <span className="aso-label">Department :</span>
                        <select
                            className="aso-select"
                            onChange={(e) => handleDeptChange(e.target.value)}
                            value={selectedDept}
                        >
                            <option value="">Select</option>
                            {dept.map((deptName, index) => (
                                <option key={index} value={deptName}>
                                    {deptName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="aso-search-cnt">
                        <span className="aso-label">Class :</span>
                        <select
                            className="aso-select"
                            onChange={(e) => setSelectedDeptId(e.target.value)}
                            value={selectedDeptId}
                        >
                            <option value="">Select</option>
                            {deptId.map((id, index) => (
                                <option key={index} value={id}>
                                    {id}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="spec-btn-content">
                    <button className="aso-btn" onClick={handleGetOutcomeSpec}>
                        Fetch Outcome
                    </button>
                </div>

                {loading ? (
                    <p className="aso-loading">Loading outcomes...</p>
                ) : (
                    specTable && (
                        <div className="aso-table-container">
                            <div className="aso-header">
                                <div className="aso-header-title1">
                                    <h1>JAMAL MOHAMED COLLEGE (Autonomous)</h1>
                                    <span>
                                        Nationally Accredited with A++ Grade by NAAC (4th Cycle) with CGPA 3.69 out of 4.0
                                    </span>
                                    <span>Affiliated to Bharathidasan University</span>
                                    <h3>TIRUCHIRAPPALLI - 620 020</h3>
                                </div>
                            </div>
                            <div className="aso-header-title2">
                                <h3>OUTCOME BASED EDUCATION - {academicYear}</h3>
                            </div>
                            <h2 className="aso-heading">PSO - Program Specific Outcome</h2>
                            {attainmentSpecData?.overall ? (
                                <table className="aso-table">
                                    <thead>
                                        <tr>
                                            <th>S No</th>
                                            <th>Course Code</th>
                                            <th>OBE Level</th>
                                            <th>Course Outcome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(attainmentSpecData.overall).map((courseCode, index) => (
                                            <tr key={courseCode}>
                                                <td>{index + 1}</td>
                                                <td>{courseCode}</td>
                                                <td>{attainmentSpecData.avgOverallScore?.[courseCode]?.toFixed(2) || '-'}</td>
                                                <td>{attainmentSpecData.grade?.[courseCode] || '-'}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="3">
                                                <strong>Program Specific Outcome (PSO)</strong>
                                            </td>
                                            <td>{attainmentSpecData.meanScores?.pso?.toFixed(2) || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <p className="aso-no-content">No Data Available. Please refine your Search.</p>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default ProgramSpecOutcome;