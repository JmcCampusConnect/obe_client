import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/common/Authenticate';
import PrivateRoute from './components/common/Privaterouter';


import StudentManage from './components/manage/studentmanage/studentmanage';
import ProgramOC from './components/prooutcome/prooutcome';
import ObeReport from './components/obereport/obereport';



import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard/Dashboard';
import Layout from './pages/Layout';
import CourseList from './pages/CourseList';
import StudentMark from './pages/StudentMark';
import FileUpload from './pages/FileUpload';
import RsMatrix from './pages/RsMatrix';
import Settings from './pages/Settings';
import Terminologies from './pages/Terminology';

// ENTRY REPORT FOR HOD, TUTOR, ADMIN
import TutorReport from './pages/Reports/TutorReport';
import HodReport from './pages/Reports/HodReport';
import WorkProgressReport from './pages/Reports/WorkProgressReport';
import EseReport from './pages/Reports/EseReport';
import RsMatrixReport from './pages/Reports/RsMatrixReport';
import DepartmentReport from './pages/Reports/DepartmentReport';

// MANAGE FOR STAFF, COURSEMAP, STUDENT ETC
import Manage from './pages/Manage/Manage';
import Staff from './pages/Manage/Staff';
import StaffMaster from './pages/Manage/StaffMaster';
import HodManage from './pages/Manage/HodManage';
import TutorManage from './pages/Manage/TutorManage';
import BlockShow from './pages/Manage/BlockShow'
import StaffCourseManage from './pages/Manage/StaffCourseManage';
import MarkRelease from './pages/Manage/MarkRelease';
import MarkManage from './pages/Manage/MarkManage';
import ScopeManage from './pages/Manage/ScopeManage';

// OUTCOME FOR STUDENT COURSE AND PROGRAM
import StudentOutcome from './pages/Outcomes/StudentOutcome';
import CourseOutcome from './pages/Outcomes/CourseOutcome';
import ProgramSpecOutcome from './pages/Outcomes/ProgramSpecOutcome';
import AdminStudentOutcome from './pages/Outcomes/AdminStudentOutcome';
import HodStudentOutcome from './pages/Outcomes/HodStudentOutcome';
import TutorStudentOutcome from './pages/Outcomes/TutorStudentOutcome';
import StaffStudentOutcome from './pages/Outcomes/StaffStudentOutcome';
import AdminCourseOutcome from './pages/Outcomes/AdminCourseOutcome';
import HodCourseOutcome from './pages/Outcomes/HodCourseOutcome';
import TutorCourseOutcome from './pages/Outcomes/TutorCourseOutcome';
import StaffCourseOutcome from './pages/Outcomes/StaffCourseOutcome/';

function App() {

	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<LoginPage />} />

					{/* Checked */}
					<Route path="staff/:staffId/*" element={<PrivateRoute element={<Layout />} />} >



						<Route path="obereport" element={<ObeReport />} />
						<Route path="studentmanage" element={<StudentManage />} />
						<Route path="programoutcome" element={<ProgramOC />} />





						<Route path="dashboard" element={<Dashboard />} />
						<Route path="courselist" element={<CourseList />} />
						<Route path="studentmark" element={<StudentMark />} />
						<Route path="inputfiles" element={<FileUpload />} />
						<Route path="rsmatrix" element={<RsMatrix />} />
						<Route path="settings" element={<Settings />} />
						<Route path="terminologies" element={<Terminologies />} />

						{/*  REPORT FOR HOD, TUTOR, ADMIN */}
						<Route path="tutorreport" element={<TutorReport />} />
						<Route path="hodreport" element={<HodReport />} />
						<Route path="workprogressreport" element={<WorkProgressReport />} />
						<Route path="matrixreport" element={<RsMatrixReport />} />
						<Route path="esereport" element={<EseReport />} />
						<Route path=":dept/departmentreport" element={<DepartmentReport />} />

						{/* MANAGE FOR STAFF, COURSEMAP, STUDENT ETC */}
						<Route path="manage" element={<Manage />} />
						<Route path="staffmanage" element={<Staff />} />
						<Route path="staffmastermanage" element={<StaffMaster />} />
						<Route path="hodmanage" element={<HodManage />} />
						<Route path="tutormanage" element={<TutorManage />} />
						<Route path="staffcoursemapmanage" element={<StaffCourseManage />} />
						<Route path="showandblock" element={<BlockShow />} />
						<Route path="markmanage" element={<MarkManage />} />
						<Route path="markrelease" element={<MarkRelease />} />
						<Route path="scopemanage" element={<ScopeManage />} />

						{/* OUTCOME FOR STUDENT COURSE AND PROGRAM */}
						<Route path="studentoutcome" element={<StudentOutcome />} />
						<Route path="courseoutcome" element={<CourseOutcome />} />
						<Route path="programspecificoutcome" element={<ProgramSpecOutcome />} />
						<Route path="adminstudentoutcome" element={<AdminStudentOutcome />} />
						<Route path="hodstudentoutcome" element={<HodStudentOutcome />} />
						<Route path="tutorstudentoutcome" element={<TutorStudentOutcome />} />
						<Route path="staffstudentoutcome" element={<StaffStudentOutcome />} />
						<Route path="admincourseoutcome" element={<AdminCourseOutcome />} />
						<Route path="hodcourseoutcome" element={<HodCourseOutcome />} />
						<Route path="tutorcourseoutcome" element={<TutorCourseOutcome />} />
						<Route path="staffcourseoutcome" element={<StaffCourseOutcome />} />


					</Route>
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App;