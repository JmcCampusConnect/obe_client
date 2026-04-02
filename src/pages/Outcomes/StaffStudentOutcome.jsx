import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../../css/StaffStudentOutcome.css';
import Loading from '../../assets/load.svg';

function StaffStudentOutcome() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { staffId } = useParams();

    // UI state
    const [showSclaPopup, setShowSclaPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);

    // Filter options
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [semesters, setSemesters] = useState([]);

    // Selected values
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSection, setSelectedSection] = useState("");

    const [academicSem, setAcademicSem] = useState('');
    const [outcomeTable, setOutcomeTable] = useState(false);
    const [outcomeData, setOutcomeData] = useState([]);

    // ------------------------------------------------------------------
    // Fetch active academic semester
    // ------------------------------------------------------------------
    useEffect(() => {
        const fetchAcademicSem = async () => {
            try {
                const response = await axios.post(`${apiUrl}/activesem`);
                setAcademicSem(response.data.academic_sem || "");
            } catch (err) {
                console.error("Error fetching academic year:", err);
            }
        };
        fetchAcademicSem();
    }, [apiUrl]);

    // ------------------------------------------------------------------
    // Fetch categories 
    // ------------------------------------------------------------------
    useEffect(() => {
        const fetchCategory = async () => {
            if (!staffId) return;
            try {
                setFilterLoading(true);
                const response = await axios.get(`${apiUrl}/api/category/${staffId}`);
                if (response.data) {
                    const uniqueCats = [...new Set(response.data.map(item => item.category))].sort();
                    setCategories(uniqueCats);
                }
            } catch (err) {
                console.error("Error fetching category:", err);
                alert("Error fetching category");
            } finally {
                setFilterLoading(false);
            }
        };
        fetchCategory();
    }, [apiUrl, staffId]);

    // ------------------------------------------------------------------
    // Helper functions to load dependent dropdowns (no array-passing bug)
    // ------------------------------------------------------------------
    const fetchDepartments = async (category) => {
        if (!category) return;
        try {
            setFilterLoading(true);
            const response = await axios.get(`${apiUrl}/api/stucoursemapping`, {
                params: { academic_sem: academicSem, category: category, staff_id: staffId }
            });
            const data = response.data || [];
            const uniqueDepts = [...new Set(data.map(item => item.dept_name))].sort();
            setDepartments(uniqueDepts);
        } catch (err) {
            console.error("Error fetching departments:", err);
        } finally {
            setFilterLoading(false);
        }
    };

    const fetchClasses = async (category, deptName) => {
        if (!category || !deptName) return;
        try {
            setFilterLoading(true);
            const response = await axios.get(`${apiUrl}/api/stucoursemapping`, {
                params: { academic_sem: academicSem, category: category, dept_name: deptName, staff_id: staffId }
            });
            const data = response.data || [];
            const uniqueClasses = [...new Set(data.map(item => item.dept_id))].sort();
            setClasses(uniqueClasses);
        } catch (err) {
            console.error("Error fetching classes:", err);
        } finally {
            setFilterLoading(false);
        }
    };

    const fetchSemesters = async (category, deptName, classId) => {
        if (!category || !deptName || !classId) return;
        try {
            setFilterLoading(true);
            const response = await axios.get(`${apiUrl}/api/stucoursemapping`, {
                params: { academic_sem: academicSem, category: category, dept_name: deptName, dept_id: classId, staff_id: staffId }
            });
            const data = response.data || [];
            const uniqueSemesters = [...new Set(data.map(item => item.semester))].sort((a, b) => a - b);
            setSemesters(uniqueSemesters);
        } catch (err) {
            console.error("Error fetching semesters:", err);
        } finally {
            setFilterLoading(false);
        }
    };

    const fetchSections = async (category, deptName, classId, semester) => {
        if (!category || !deptName || !classId || !semester) return;
        try {
            setFilterLoading(true);
            const response = await axios.get(`${apiUrl}/api/stucoursemapping`, {
                params: { academic_sem: academicSem, category: category, dept_name: deptName, dept_id: classId, semester: semester, staff_id: staffId }
            });
            const data = response.data || [];
            const uniqueSections = [...new Set(data.map(item => item.section))].sort();
            setSections(uniqueSections);
        } catch (err) {
            console.error("Error fetching sections:", err);
        } finally {
            setFilterLoading(false);
        }
    };

    // ------------------------------------------------------------------
    // Event handlers (cascade with clearing)
    // ------------------------------------------------------------------
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setSelectedDepartment("");
        setSelectedClass("");
        setSelectedSemester("");
        setSelectedSection("");
        setDepartments([]);
        setClasses([]);
        setSemesters([]);
        setSections([]);
        if (value) fetchDepartments(value);
    };

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
        setSelectedClass("");
        setSelectedSemester("");
        setSelectedSection("");
        setClasses([]);
        setSemesters([]);
        setSections([]);
        if (value && selectedCategory) fetchClasses(selectedCategory, value);
    };

    const handleClassChange = (value) => {
        setSelectedClass(value);
        setSelectedSemester("");
        setSelectedSection("");
        setSemesters([]);
        setSections([]);
        if (value && selectedCategory && selectedDepartment) {
            fetchSemesters(selectedCategory, selectedDepartment, value);
        }
    };

    const handleSemesterChange = (value) => {
        setSelectedSemester(value);
        setSelectedSection("");
        setSections([]);
        if (value && selectedCategory && selectedDepartment && selectedClass) {
            fetchSections(selectedCategory, selectedDepartment, selectedClass, value);
        }
    };

    const handleSectionChange = (value) => {
        setSelectedSection(value);
    };

    // ------------------------------------------------------------------
    // Fetch outcome (with validation)
    // ------------------------------------------------------------------
    const sendData = async () => {
        // Validate required fields
        if (!selectedCategory || !selectedClass || !selectedSemester || !selectedSection) {
            alert("Please select all required fields: Category, Class, Semester, Section");
            return;
        }
        try {
            setLoading(true);
            const dropDownData = await axios.post(`${apiUrl}/api/staffstuoutcome`, {
                academicSem, selectedCategory, selectedDepartment, selectedClass, selectedSection, selectedSemester, staffId
            });
            setOutcomeData(dropDownData.data || []);
            setOutcomeTable(true);
        } catch (err) {
            console.log("Error", err);
            alert("Error fetching outcome data");
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    if (loading) {
        return (
            <div>
                <center> <img src={Loading} alt="Loading..." className="img" /> </center>
            </div>
        );
    }

    return (
        <div className="sso-main">
            <div className="sso-dropdown-container">
                <div className="sso-search-cnt">
                    <span className="sso-label">Academic Year : </span>
                    <input type="text" className="sso-select" value={academicSem} readOnly disabled />
                </div>
                <div className="sso-search-cnt">
                    <span className="sso-label">Category : </span>
                    <select className="sso-select" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} disabled={filterLoading}>
                        <option className="sso-option" value="">Select</option>
                        {categories.map((category, index) => (
                            <option className="sso-option" key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="sso-search-cnt">
                    <span className="sso-label">Department : </span>
                    <select className="sso-select" value={selectedDepartment} onChange={(e) => handleDepartmentChange(e.target.value)} disabled={!selectedCategory || filterLoading}>
                        <option className="sso-option" value="">Select</option>
                        {departments.map((dept, index) => (
                            <option className="sso-option" key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
                <div className="sso-search-cnt">
                    <span className="sso-label">Class : </span>
                    <select className="sso-select" value={selectedClass} onChange={(e) => handleClassChange(e.target.value)} disabled={!selectedDepartment || filterLoading}>
                        <option className="sso-option" value="">Select</option>
                        {classes.map((className, index) => (
                            <option className="sso-option" key={index} value={className}>{className}</option>
                        ))}
                    </select>
                </div>
                <div className="sso-search-cnt">
                    <span className="sso-label">Semester : </span>
                    <select className="sso-select" value={selectedSemester} onChange={(e) => handleSemesterChange(e.target.value)} disabled={!selectedClass || filterLoading}>
                        <option className="sso-option" value="">Select</option>
                        {semesters.map((semester, index) => (
                            <option className="sso-option" key={index} value={semester}>{semester}</option>
                        ))}
                    </select>
                </div>
                <div className="sso-search-cnt">
                    <span className="sso-label">Section : </span>
                    <select className="sso-select" value={selectedSection} onChange={(e) => handleSectionChange(e.target.value)} disabled={!selectedSemester || filterLoading}>
                        <option className="sso-option" value="">Select</option>
                        {sections.map((section, index) => (
                            <option className="sso-option" key={index} value={section}>{section}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="sso-btn-content">
                <button className="sso-btn" onClick={sendData}>Fetch Outcome</button>
            </div>
            {outcomeTable && (
                <div className="sso-table-container">
                    <div className="sso-header">
                        <div className="sso-header-title1">
                            <h1 className="">JAMAL MOHAMED COLLEGE (Autonomous)</h1>
                            <span>Nationally Accredited with A++ Grade by NAAC (4th Cycle) with CGPA 3.69 out of 4.0</span>
                            <span>Affiliated to Bharathidasan University</span>
                            <span>TIRUCHIRAPPALLI - 620 020 .</span>
                        </div>
                    </div>
                    <div className="sso-header-title2">
                        <h3>OUTCOME BASED EDUCATION - {academicSem}</h3>
                    </div>
                    <h2 className="aso-heading" title="Click to View" onClick={() => setShowSclaPopup(true)}>
                        SCLA - Student Cognitive Level Attainment
                    </h2>
                    {showSclaPopup && (
                        <div className="alert-overlay">
                            <div className="alert-box">
                                <p>
                                    The attainment level for each student in a course is calculated by analyzing their performance across three cognitive levels:
                                    Lower-Order Thinking (LOT), Medium-Order Thinking (MOT), and Higher-Order Thinking (HOT). Each cognitive level is assessed
                                    for Continuous Internal Assessment (CIA) and End-Semester Examination (ESE).
                                </p>
                                <button onClick={() => setShowSclaPopup(false)} className="alert-button">OK</button>
                            </div>
                        </div>
                    )}
                    {outcomeData && outcomeData.length > 0 ? (
                        <table className="sso-table">
                            <thead>
                                <tr>
                                    <th className="sso-header" rowSpan={2}>Reg No</th>
                                    <th className="sso-header" rowSpan={2}>Course Code</th>
                                    <th className="sso-header" colSpan={3}>INTERNAL</th>
                                    <th className="sso-header" colSpan={3}>EXTERNAL</th>
                                    <th className="sso-header" colSpan={3}>TOTAL</th>
                                    <th className="sso-header" rowSpan={2}>GRADE</th>
                                </tr>
                                <tr>
                                    <th className="sso-header">LOT</th>
                                    <th className="sso-header">MOT</th>
                                    <th className="sso-header">HOT</th>
                                    <th className="sso-header">LOT</th>
                                    <th className="sso-header">MOT</th>
                                    <th className="sso-header">HOT</th>
                                    <th className="sso-header">LOT</th>
                                    <th className="sso-header">MOT</th>
                                    <th className="sso-header">HOT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outcomeData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="aso-content">{item.reg_no}</td>
                                        <td className="aso-content">{item.course_code}</td>
                                        <td className="aso-content-cia">{item.lot_attainment}</td>
                                        <td className="aso-content-cia">{item.mot_attainment}</td>
                                        <td className="aso-content-cia">{item.hot_attainment}</td>
                                        <td className="aso-content-ese">{item.elot_attainment}</td>
                                        <td className="aso-content-ese">{item.emot_attainment}</td>
                                        <td className="aso-content-ese">{item.ehot_attainment}</td>
                                        <td className="aso-content-all">{item.overAll_lot}</td>
                                        <td className="aso-content-all">{item.overAll_mot}</td>
                                        <td className="aso-content-all">{item.overAll_hot}</td>
                                        <td className="aso-content">{item.final_grade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="sso-no-content">No data available. Please refine your Search.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default StaffStudentOutcome;