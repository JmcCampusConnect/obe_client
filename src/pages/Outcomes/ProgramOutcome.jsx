import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/ProgramOutcome.css';

function ProgramOutcome() {

    const [loading, setLoading] = useState(false);
    const [academicYear, setAcademicYear] = useState('');
    const [programType, setProgramType] = useState('UG');
    const [attainmentAllData, setAttainmentAllData] = useState({});
    const [allTable, setAllTable] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchAcademicYear = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/academicYear`);
                setAcademicYear(response.data.academic_year);
            } catch (error) {
                alert('Error fetching academic year');
            }
        };
        fetchAcademicYear();
    }, [apiUrl]);

    const handleProgramTypeChange = (event) => { setProgramType(event.target.value) };

    const handleGetOutcomeAll = async () => {
        try {
            setLoading(true);
            setAllTable(false);
            const response = await axios.post(`${apiUrl}/api/po/outcome`, {
                academicYear,
                programType,
            });
            setAttainmentAllData(response.data);
            setAllTable(true);
        } catch (error) {
            alert('Error fetching outcome results');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="spec-ugpg-container">
            <div className="spec-dd-container">
                <div className="aso-dropdown-container">
                    <div className="aso-search-cnt">
                        <span className="aso-label">Academic Year :</span>
                        <input type="text" className="aso-select" value={academicYear} readOnly disabled />
                    </div>
                    <div className="aso-search-cnt">
                        <span className="aso-label">Program Type :</span>
                        <div className="spec-radio-cnt">
                            <label className="spec-label">
                                <input
                                    type="radio"
                                    name="programType"
                                    value="UG"
                                    checked={programType === 'UG'}
                                    onChange={handleProgramTypeChange}
                                />
                                <span>UG</span>
                            </label>
                            <label className="spec-label">
                                <input
                                    type="radio"
                                    name="programType"
                                    value="PG"
                                    checked={programType === 'PG'}
                                    onChange={handleProgramTypeChange}
                                />
                                <span>PG</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="spec-btn-content">
                    <button className="aso-btn" onClick={handleGetOutcomeAll}>
                        Fetch Outcome
                    </button>
                </div>

                {loading ? (
                    <p className="aso-loading">Loading outcomes...</p>
                ) : (
                    allTable && (
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
                            {attainmentAllData?.departmentResults ? (
                                <table className="aso-table">
                                    <thead>
                                        <tr>
                                            <th>S No</th>
                                            <th>Department Name</th>
                                            <th>Pso value</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(attainmentAllData.departmentResults).map(([department, data], deptIndex) => {
                                            const psoValue = data.meanScores?.pso?.toFixed(2);
                                            const grade = data.grade;
                                            return (
                                                <tr key={department}>
                                                    <td>{deptIndex + 1}</td>
                                                    <td>{department}</td>
                                                    <td>{psoValue || '-'}</td>
                                                    <td>{grade || '-'}</td>
                                                </tr>
                                            );
                                        })}
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

export default ProgramOutcome;