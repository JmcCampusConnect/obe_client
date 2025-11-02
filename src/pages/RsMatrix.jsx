import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/RsMatrix.css';
const apiUrl = import.meta.env.VITE_API_URL;

function RsMatrix() {

    const { staffId } = useParams();
    const [academicSem, setAcademicSem] = useState('');
    const [courseDetails, setCourseDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const [meanOverallScore, setMeanOverallScore] = useState('');
    const [correlation, setCorrelation] = useState('');
    const [staffName, setStaffName] = useState('');

    useEffect(() => {
        const fetchStaffName = async () => {
            try {
                const response = await axios.post(`${apiUrl}/staffName`, { staffId });
                setStaffName(response.data)
            }
            catch (err) { }
        }
        fetchStaffName();
    }, [apiUrl, staffId])

    useEffect(() => {
        const fetchacademicSem = async () => {
            try {
                const response = await axios.post(`${apiUrl}/activesem`, {});
                setAcademicSem(response.data.academic_sem);
            }
            catch (err) { console.log('Error fetching active semester:', err) }
        }
        fetchacademicSem();
    }, []);

    useEffect(() => {
        const fetchCourseCodes = async () => {
            if (academicSem) {
                try {
                    const response = await axios.post(`${apiUrl}/api/rsmcoursecode`, {
                        staff_id: staffId,
                        academic_sem: academicSem,
                    })
                    setCourseDetails(response.data);
                }
                catch (err) { console.log('Error fetching course codes:', err) }
            }
        }
        fetchCourseCodes();
    }, [staffId, academicSem, showModal]);

    const handleCourseClick = async (course) => {

        setSelectedCourse(course);
        setInputValues({
            CO1_0: '', CO1_1: '', CO1_2: '', CO1_3: '', CO1_4: '', CO1_5: '', CO1_6: '', CO1_7: '', CO1_8: '', CO1_9: '', CO1_meanScore: '',
            CO2_0: '', CO2_1: '', CO2_2: '', CO2_3: '', CO2_4: '', CO2_5: '', CO2_6: '', CO2_7: '', CO2_8: '', CO2_9: '', CO2_meanScore: '',
            CO3_0: '', CO3_1: '', CO3_2: '', CO3_3: '', CO3_4: '', CO3_5: '', CO3_6: '', CO3_7: '', CO3_8: '', CO3_9: '', CO3_meanScore: '',
            CO4_0: '', CO4_1: '', CO4_2: '', CO4_3: '', CO4_4: '', CO4_5: '', CO4_6: '', CO4_7: '', CO4_8: '', CO4_9: '', CO4_meanScore: '',
            CO5_0: '', CO5_1: '', CO5_2: '', CO5_3: '', CO5_4: '', CO5_5: '', CO5_6: '', CO5_7: '', CO5_8: '', CO5_9: '', CO5_meanScore: '',
        });
        setMeanOverallScore('');
        setCorrelation('');

        try {
            const response = await axios.get(`${apiUrl}/api/rsmatrix/${course.course_code}`);
            const matrixData = response.data;
            const updateData = {
                CO1_0: matrixData.co1_po1 || '',
                CO1_1: matrixData.co1_po2 || '',
                CO1_2: matrixData.co1_po3 || '',
                CO1_3: matrixData.co1_po4 || '',
                CO1_4: matrixData.co1_po5 || '',
                CO1_5: matrixData.co1_pso1 || '',
                CO1_6: matrixData.co1_pso2 || '',
                CO1_7: matrixData.co1_pso3 || '',
                CO1_8: matrixData.co1_pso4 || '',
                CO1_9: matrixData.co1_pso5 || '',
                CO1_meanScore: matrixData.co1_mean || '',
                CO2_0: matrixData.co2_po1 || '',
                CO2_1: matrixData.co2_po2 || '',
                CO2_2: matrixData.co2_po3 || '',
                CO2_3: matrixData.co2_po4 || '',
                CO2_4: matrixData.co2_po5 || '',
                CO2_5: matrixData.co2_pso1 || '',
                CO2_6: matrixData.co2_pso2 || '',
                CO2_7: matrixData.co2_pso3 || '',
                CO2_8: matrixData.co2_pso4 || '',
                CO2_9: matrixData.co2_pso5 || '',
                CO2_meanScore: matrixData.co2_mean || '',
                CO3_0: matrixData.co3_po1 || '',
                CO3_1: matrixData.co3_po2 || '',
                CO3_2: matrixData.co3_po3 || '',
                CO3_3: matrixData.co3_po4 || '',
                CO3_4: matrixData.co3_po5 || '',
                CO3_5: matrixData.co3_pso1 || '',
                CO3_6: matrixData.co3_pso2 || '',
                CO3_7: matrixData.co3_pso3 || '',
                CO3_8: matrixData.co3_pso4 || '',
                CO3_9: matrixData.co3_pso5 || '',
                CO3_meanScore: matrixData.co3_mean || '',
                CO4_0: matrixData.co4_po1 || '',
                CO4_1: matrixData.co4_po2 || '',
                CO4_2: matrixData.co4_po3 || '',
                CO4_3: matrixData.co4_po4 || '',
                CO4_4: matrixData.co4_po5 || '',
                CO4_5: matrixData.co4_pso1 || '',
                CO4_6: matrixData.co4_pso2 || '',
                CO4_7: matrixData.co4_pso3 || '',
                CO4_8: matrixData.co4_pso4 || '',
                CO4_9: matrixData.co4_pso5 || '',
                CO4_meanScore: matrixData.co4_mean || '',
                CO5_0: matrixData.co5_po1 || '',
                CO5_1: matrixData.co5_po2 || '',
                CO5_2: matrixData.co5_po3 || '',
                CO5_3: matrixData.co5_po4 || '',
                CO5_4: matrixData.co5_po5 || '',
                CO5_5: matrixData.co5_pso1 || '',
                CO5_6: matrixData.co5_pso2 || '',
                CO5_7: matrixData.co5_pso3 || '',
                CO5_8: matrixData.co5_pso4 || '',
                CO5_9: matrixData.co5_pso5 || '',
                CO5_meanScore: matrixData.co5_mean || '',
            };
            setInputValues(updateData)
            setMeanOverallScore(matrixData.mean);
            setCorrelation(matrixData.olrel);
        }
        catch (err) { console.log('Error Fetching Matrix Data :', err) }
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setSelectedCourse(null);
    }

    const handleInputChange = (co, index, value) => {
        const numericValue = parseFloat(value);
        if (numericValue > 3 || numericValue < 0) {
            alert('Value must be between 0 and 3');
            setInputValues((prev) => ({
                ...prev,
                [`${co}_${index}`]: '',
            }));
            return;
        }
        const updatedInputValues =
        {
            ...inputValues,
            [`${co}_${index}`]: value,
        }
        setInputValues(updatedInputValues);
        calculateMeanAndCorrelation(updatedInputValues);
    }

    const calculateMeanAndCorrelation = (inputData) => {

        let overallTotal = 0;
        let overallCount = 0;
        const newInputValues = { ...inputData };

        ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'].forEach((co) => {
            let total = 0;
            let count = 0;

            for (let i = 0; i < 10; i++) {
                const value = parseFloat(newInputValues[`${co}_${i}`]);
                if (!isNaN(value)) {
                    total += value;
                    count += 1;
                }
            }

            if (count > 0) {
                const meanScore = (total / count).toFixed(2);
                newInputValues[`${co}_meanScore`] = meanScore;
                overallTotal += parseFloat(meanScore);
                overallCount += 1;
            }
            else {
                newInputValues[`${co}_meanScore`] = '';
            }
        })
        setInputValues(newInputValues);

        const meanOverall = overallCount > 0 ? (overallTotal / overallCount).toFixed(2) : '';
        setMeanOverallScore(meanOverall);
        if (meanOverall !== '') {
            let corrLevel = '';
            if (meanOverall < 1.5) corrLevel = 'Low';
            else if (meanOverall >= 1.5 && meanOverall < 2.5) corrLevel = 'Medium';
            else if (meanOverall >= 2.5) corrLevel = 'High';
            setCorrelation(corrLevel);
        }
    }

    const handleSave = async () => {
        for (const key in inputValues) {
            if (!inputValues[key]) {
                alert('All fields are Required');
                return;
            }
        }

        try {
            const save = await axios.post(`${apiUrl}/api/rsmatrixSave`, {
                course_code: selectedCourse.course_code, scores: inputValues,
                meanOverallScore, correlation,
            })

            if (save.status === 200) { alert('Data Updated Successfully!') }
            else if (save.status === 201) { alert('Data Saved Successfully!') }
            setShowModal(false)
        }
        catch (err) {
            console.error('Error saving data:', err);
            alert('All Fields are Required');
        }
    }

    return (
        <div className="rsmatrix-main">
            <div className="course-layout-top-div">
                <p className="course-layout-staff-id">
                    <span className="course-staff">Welcome </span> {staffName.staff_name}
                </p>
                <p className="course-layout-staff-id">
                    <span className="course-staff">Staff Id :</span> {staffId}
                </p>
            </div>
            <div className="rsmatrix-parent">
                <div className="rsmatrix-container">
                    {courseDetails.length > 0 ? (
                        courseDetails.map((item, index) => (
                            <div
                                className="rsmatrix-box"
                                key={index}
                                onClick={() => handleCourseClick(item)}
                            >
                                <div className="course-status">
                                    {item.completed ? (
                                        <span className="rsmatrix-completed">Completed</span>
                                    ) : (
                                        <span className="rsmatrix-incomplete">Incomplete</span>
                                    )}
                                </div>
                                <p className='rsmatrix-header-code' style={{ color: '#007bff' }}>COURSE CODE :</p>
                                <p>{item.course_code}</p>
                            </div>
                        ))
                    ) : (
                        <p className="rsmatrix-no-code">No Course Codes Found for this ID</p>
                    )}
                </div>
            </div>
            {showModal && (
                <div className="rsmatrix-modal-overlay">
                    <div className="rsmatrix-modal-content">
                        <h2 className='rsmatrix-heading'>Relationship Matrix for {selectedCourse.course_code}</h2>
                        <table className='rsmatrix-table'>
                            <thead className='rsmartrix-thead'>
                                <tr className='rsmartrix-tr'>
                                    <th className='rsmatrix-th'>Course Outcomes (COs)</th>
                                    <th className='rsmatrix-th'>PO1</th>
                                    <th className='rsmatrix-th'>PO2</th>
                                    <th className='rsmatrix-th'>PO3</th>
                                    <th className='rsmatrix-th'>PO4</th>
                                    <th className='rsmatrix-th'>PO5</th>
                                    <th className='rsmatrix-th'>PSO1</th>
                                    <th className='rsmatrix-th'>PSO2</th>
                                    <th className='rsmatrix-th'>PSO3</th>
                                    <th className='rsmatrix-th'>PSO4</th>
                                    <th className='rsmatrix-th'>PSO5</th>
                                    <th className='rsmatrix-th'>Mean Score</th>
                                </tr>
                            </thead>
                            <tbody >
                                {['CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map((co, idx) => (
                                    <tr key={idx}>
                                        <td className='rsmatrix-td-co'>{co}</td>
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <td key={index} className="rsmatrix-td">
                                                <input
                                                    type="number"
                                                    className="rsmatrix-input"
                                                    value={inputValues[`${co}_${index}`]}
                                                    onChange={(e) => handleInputChange(co, index, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td className='rsmatrix-td'>
                                            <input type="number" className="rsmatrix-input" readOnly disabled value={inputValues[`${co}_meanScore`] || ''} />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={11} className='rsmatrix-course-colspan'>Mean Overall Score</td>
                                    <td className='rsmatrix-td'>
                                        <input type="number" className="rsmatrix-input" readOnly disabled value={meanOverallScore} />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={11} className='rsmatrix-course-colspan'>
                                        Correlation
                                    </td>
                                    <td className='rsmatrix-td'>
                                        <input type="text" className="rsmatrix-input" readOnly disabled value={correlation} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='rsmatrix-btn'>
                            <button className="rsmatrix-save-btn" onClick={handleSave}>SAVE</button>
                            <button className="rsmatrix-close-btn" onClick={closeModal}>CLOSE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RsMatrix;