import React, { useState, useEffect } from "react";
import axios from "axios";
import './TutorStudentOutcome.css';
import '../../css/AdminCourseOutcome.css';

function TutorStudentOutcome() {

	const apiUrl = process.env.REACT_APP_API_URL;
	const { staffId } = useParams();
	const [showSclaPopup, setShowSclaPopup] = useState(false);
	const [outcomeData, setOutcomeData] = useState("");
	const [academicSem, setAcademicSem] = useState('');
	const [outcomeTable, setOutcomeTable] = useState('');
	const [category, setCategory] = useState('');
	const [department, setDepartment] = useState('');
	const [deptId, setDeptId] = useState('');
	const [section, setSection] = useState('');
	const [semester, setSemester] = useState('');

	useEffect(() => {
		const academicSemSet = async () => {
			try {
				const response = await axios.post(`${apiUrl}/activesem`, {});
				setAcademicSem(response.data.academic_sem);
			}
			catch (err) {
				console.log('Error Fetching Academic Year:', err);
			}
		}
		academicSemSet();

	}, []);

	useEffect(() => {
		const fetchacademicSemAndData = async () => {
			try {
				const tutorDetails = await axios.post(`${apiUrl}/api/tutordetails`, { staffId })
				setCategory(tutorDetails.data.tutorDetails.category);
				setDepartment(tutorDetails.data.tutorDetails.dept_name);
				setDeptId(tutorDetails.data.tutorDetails.dept_id);
				setSemester(tutorDetails.data.studentSem.semester);
				setSection(tutorDetails.data.tutorDetails.section);
			}
			catch (error) {
				console.error("Error Fetching Active Academic Year or Course Data :", error);
				alert("Failed to fetch Academic Year and Related Data");
			}
		};
		fetchacademicSemAndData();
	}, []);

	const handlePopup = () => { setShowSclaPopup(true) }
	const closePopup = () => { setShowSclaPopup(false) }

	const sendData = async () => {
		const values = await axios.post(`${apiUrl}/api/tutorstuoutcome`, {
			category, department, deptId, semester, section, academicSem
		})
		setOutcomeData(values.data);
		setOutcomeTable(true);
	}

	return (
		<div className="tso-main">
			<div className="tso-dropdown-container">
				<div className="tso-search-cnt">
					<span className="tso-label">Academic Year : </span>
					<input
						type="text"
						className="tso-select"
						value={academicSem}
						readOnly
						disabled
					/>
				</div>
				<div className="tso-search-cnt">
					<span className="tso-label">Category : </span>
					<input
						type="text"
						className="tso-select"
						value={category}
						readOnly
						disabled
					/>
				</div>
				<div className="tso-search-cnt">
					<span className="tso-label">Department : </span>
					<input
						type="text"
						className="tso-select"
						value={department}
						readOnly
						disabled
					/>
				</div>
				<div className="tso-search-cnt">
					<span className="tso-label">Class : </span>
					<input
						type="text"
						className="tso-select"
						value={deptId}
						readOnly
						disabled
					/>
				</div>
				<div className="tso-search-cnt">
					<span className="tso-label">Semester : </span>
					<input
						type="text"
						className="tso-select"
						value={semester}
						readOnly
						disabled
					/>
				</div>
				<div className="tso-search-cnt">
					<span className="tso-label">Section : </span>
					<input
						type="text"
						className="tso-select"
						value={section}
						readOnly
						disabled
					/>
				</div>
			</div>
			<div className="tso-btn-content">
				<button className="tso-btn" onClick={sendData}>Fetch Outcome</button>
			</div>
			{outcomeTable && (
				<div className="tso-table-container" >
					<div className="tso-header">
						<div className="tso-header-title1">
							<h1 className="">JAMAL MOHAMED COLLEGE (Autonomous)</h1>
							<span>
								Nationally Accredited with A++ Grade by NAAC (4th Cycle) with CGPA
								3.69 out of 4.0
							</span>
							<span>Affiliated to Bharathidasan University</span>
							<span>TIRUCHIRAPPALLI - 620 020 .</span>
						</div>
					</div>
					<div className="tso-header-title2">
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
						<table className="tso-table">
							<thead>
								<tr>
									<th className='tso-header' rowSpan={2}>Reg No</th>
									<th className='tso-header' rowSpan={2}>Course Code</th>
									<th className='tso-header' colSpan={3}>INTERNAL</th>
									<th className='tso-header' colSpan={3}>EXTERNAL</th>
									<th className='tso-header' colSpan={3}>TOTAL</th>
									<th className='tso-header' rowSpan={2}>GRADE</th>
								</tr>
								<tr>
									<th className='tso-header'>LOT</th>
									<th className='tso-header'>MOT</th>
									<th className='tso-header'>HOT</th>
									<th className='tso-header'>LOT</th>
									<th className='tso-header'>MOT</th>
									<th className='tso-header'>HOT</th>
									<th className='tso-header'>LOT</th>
									<th className='tso-header'>MOT</th>
									<th className='tso-header'>HOT</th>
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
						<p className="tso-no-content">No data available. Please refine your Search.</p>
					)}
				</div>
			)}
		</div>
	)
}

export default TutorStudentOutcome;