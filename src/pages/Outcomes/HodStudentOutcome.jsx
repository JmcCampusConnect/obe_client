import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../../css/HodStudentOutcome.css';
import Loading from '../../assets/load.svg'

function HodStudentOutcome() {

	const { staffId } = useParams();
	const [showSclaPopup, setShowSclaPopup] = useState(false);
	const apiUrl = import.meta.env.VITE_API_URL;
	const [academicSem, setAcademicSem] = useState("");
	const [categories, setCategories] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [classes, setClasses] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [sections, setSections] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedDept, setSelectedDept] = useState('');
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedSemester, setSelectedSemester] = useState("");
	const [selectedSection, setSelectedSection] = useState("");
	const [outcomeData, setOutcomeData] = useState("");
	const [outcomeTable, setOutcomeTable] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchacademicSem = async () => {
			try {
				const response = await axios.post(`${apiUrl}/activesem`);
				setAcademicSem(response.data.academic_sem || "");
			}
			catch (err) {
				console.error("Error fetching academic year : ", err);
			}
		}
		fetchacademicSem();
	}, [apiUrl]);

	useEffect(() => {
		const fetchHodData = async () => {
			try {
				const response = await axios.get(`${apiUrl}/api/hoddata`, { params: { staffId } });
				setCategories(response.data)
			}
			catch (err) {
				console.error("Error fetching HOD data : ", err);
			}
		}
		fetchHodData();
	}, [apiUrl, staffId]);

	const handlePopup = () => { setShowSclaPopup(true) }
	const closePopup = () => { setShowSclaPopup(false) }

	const fetchCourseData = async (filters) => {
		try {
			const response = await axios.get(`${apiUrl}/api/coursemapping`, {
				params: filters,
			})

			const data = response.data || [];

			if (!filters.category) {
				const sortedCategories = [...new Set(data.map((item) => item.category))].sort();
				setCategories(sortedCategories);
			}
			if (!filters.dept_name) {
				const sortedDepartments = [...new Set(data.map((item) => item.dept_name))].sort();
				setDepartments(sortedDepartments);
			}
			if (!filters.dept_id) {
				const sortedClasses = [...new Set(data.map((item) => item.dept_id))].sort();
				setClasses(sortedClasses);
			}
			if (!filters.semester) {
				const sortedSemesters = [...new Set(data.map((item) => item.semester))].sort((a, b) => a - b);
				setSemesters(sortedSemesters);
			}
			if (!filters.section) {
				const sortedSections = [...new Set(data.map((item) => item.section))].sort();
				setSections(sortedSections);
			}
		}
		catch (error) {
			console.error("Error fetching course data : ", error);
			alert("Error fetching course data");
		}
	}

	const handleCategoryChange = async (value) => {
		const category = value;
		setSelectedCategory(category);

		try {
			const response = await axios.post(`${apiUrl}/api/hodDept`, {
				staff_id: staffId,
				category: category
			})
			setDepartments(response.data)
		}
		catch (error) {
			console.log('Error fetching department : ', error)
		}
	}

	const handleDeptChange = (value) => {
		setSelectedDept(value);
		setSelectedClass("");
		setSelectedSection("");
		setSelectedSemester("");
		fetchCourseData({
			academic_sem: academicSem,
			category: selectedCategory,
			dept_name: value,
			staff_id: staffId,
		})
	}

	const handleClassChange = (value) => {
		setSelectedClass(value);
		setSelectedSection("");
		setSelectedSemester("");
		fetchCourseData({
			academic_sem: academicSem,
			category: selectedCategory,
			dept_name: selectedDept,
			staff_id: staffId,
			dept_id: value
		})
	}

	const handleSemesterChange = (value) => {
		setSelectedSemester(value);
		setSelectedSection("");
		fetchCourseData({
			academic_sem: academicSem,
			category: categories,
			dept_name: departments,
			dept_id: selectedClass,
			semester: value,
		})
	}

	const handleSectionChange = (value) => {
		setSelectedSection(value);
		fetchCourseData({
			academic_sem: academicSem,
			category: categories,
			dept_name: departments,
			dept_id: selectedClass,
			semester: selectedSemester,
			section: value,
		})
	}

	const sendData = async () => {
		if (!selectedClass || !selectedSemester || !selectedSection) {
			alert("Please select class, semester, and section before submitting.");
			return;
		}
		try {
			setLoading(true);
			const payload = {
				category: categories,
				department: departments,
				deptId: selectedClass,
				semester: selectedSemester,
				section: selectedSection,
				academicSem: academicSem,
			};

			const dropDownData = await axios.post(`${apiUrl}/api/hoduoutcome`, payload);

			if (dropDownData.data) {
				setOutcomeData(dropDownData.data);
				setOutcomeTable(true);
			}
		}
		catch (err) {
			console.error("Error sending data:", err);
			alert("Failed to send data");
		} finally { setLoading(false) }
	}

	if (loading) {
		return (
			<div>
				<center> <img src={Loading} alt="Loading..." className="img" /> </center>
			</div>
		)
	}

	return (
		<div className="hso-main">
			<div className="hso-dropdown-container">
				<div className="hso-search-cnt">
					<span className="hso-label">Academic Year :</span>
					<input type="text" className="hso-select" value={academicSem} readOnly disabled />
				</div>
				<div className="hso-search-cnt">
					<span className="hso-label">Category : </span>
					<select className="hso-select" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} >
						<option className="hso-option" value="">Select</option>
						{categories.map((catgry, index) => (
							<option className="hso-option" key={index} value={catgry}>
								{catgry}
							</option>
						))}
					</select>
				</div>
				<div className="hso-search-cnt">
					<span className="hso-label">Department : </span>
					<select className="hso-select" value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)}>
						<option className="hso-option" value="">Select</option>
						{departments.map((dept, index) => (
							<option className="hso-option" key={index} value={dept}>
								{dept}
							</option>
						))}
					</select>
				</div>
				<div className="hso-search-cnt">
					<span className="hso-label">Class :</span>
					<select className="hso-select" value={selectedClass} onChange={(e) => handleClassChange(e.target.value)}>
						<option className="hso-option" value="">Select</option>
						{classes.map((cls, index) => (
							<option className="hso-option" key={index} value={cls}>
								{cls}
							</option>
						))}
					</select>
				</div>
				<div className="hso-search-cnt">
					<span className="hso-label">Semester :</span>
					<select className="hso-select" value={selectedSemester} onChange={(e) => handleSemesterChange(e.target.value)}>
						<option className="hso-option" value="">Select</option>
						{semesters.map((sem, index) => (
							<option className="hso-option" key={index} value={sem}>
								{sem}
							</option>
						))}
					</select>
				</div>
				<div className="hso-search-cnt">
					<span className="hso-label">Section :</span>
					<select className="hso-select" value={selectedSection} onChange={(e) => handleSectionChange(e.target.value)}>
						<option className="hso-option" value="">Select</option>
						{sections.map((sec, index) => (
							<option className="hso-option" key={index} value={sec}>
								{sec}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="hso-btn-content">
				<button className="hso-btn" onClick={sendData}>Fetch Outcome</button>
			</div>
			{outcomeTable && (
				<div className="hso-table-container" >
					<div className="hso-header">
						<div className="hso-header-title1">
							<h1 className="">JAMAL MOHAMED COLLEGE (Autonomous)</h1>
							<span>
								Nationally Accredited with A++ Grade by NAAC (4th Cycle) with CGPA
								3.69 out of 4.0
							</span>
							<span>Affiliated to Bharathidasan University</span>
							<span>TIRUCHIRAPPALLI - 620 020 .</span>
						</div>
					</div>
					<div className="hso-header-title2">
						<h3>OUTCOME BASED EDUCATION - {academicSem}</h3>
					</div>
					<h2 className='aso-heading' title='Click to View' onClick={handlePopup}>
						SCLA - Student Cognitive Level Attainment
					</h2>
					{showSclaPopup && (
						<div className="alert-overlay">
							<div className="alert-box">
								<p>
									The attainment level for each student in a course is calculated by analyzing their performance across three cognitive levels :
									Lower-Order Thinking (LOT), Medium-Order Thinking (MOT), and Higher-Order Thinking (HOT). Each cognitive level is assessed
									for Continuous Internal Assessment (CIA) and End-Semester Examination (ESE).
								</p>
								<button onClick={closePopup} className="alert-button">
									OK
								</button>
							</div>
						</div>
					)}
					{outcomeData && outcomeData.length > 0 ? (
						<table className="hso-table">
							<thead>
								<tr>
									<th className='hso-header' rowSpan={2}>Reg No</th>
									<th className='hso-header' rowSpan={2}>Course Code</th>
									<th className='hso-header' colSpan={3}>INTERNAL</th>
									<th className='hso-header' colSpan={3}>EXTERNAL</th>
									<th className='hso-header' colSpan={3}>TOTAL</th>
									<th className='hso-header' rowSpan={2}>GRADE</th>
								</tr>
								<tr>
									<th className='hso-header'>LOT</th>
									<th className='hso-header'>MOT</th>
									<th className='hso-header'>HOT</th>
									<th className='hso-header'>LOT</th>
									<th className='hso-header'>MOT</th>
									<th className='hso-header'>HOT</th>
									<th className='hso-header'>LOT</th>
									<th className='hso-header'>MOT</th>
									<th className='hso-header'>HOT</th>
								</tr>
							</thead>
							<tbody>
								{outcomeData.map((item, index) => (
									<tr key={index}>
										<td className='aso-content'>{item.reg_no}</td>
										<td className='aso-content'>{item.course_code}</td>
										<td className='aso-content-cia'>{item.lot_attainment}</td>
										<td className='aso-content-cia'>{item.mot_attainment}</td>
										<td className='aso-content-cia'>{item.hot_attainment}</td>
										<td className='aso-content-ese'>{item.elot_attainment}</td>
										<td className='aso-content-ese'>{item.emot_attainment}</td>
										<td className='aso-content-ese'>{item.ehot_attainment}</td>
										<td className='aso-content-all'>{item.overAll_lot}</td>
										<td className='aso-content-all'>{item.overAll_mot}</td>
										<td className='aso-content-all'>{item.overAll_hot}</td>
										<td className='aso-content'>{item.final_grade}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="hso-no-content">No data available. Please refine your Search.</p>
					)}
				</div>
			)}
		</div>
	);
}

export default HodStudentOutcome;
