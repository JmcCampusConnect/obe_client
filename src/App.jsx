import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/login/authenticate/authenticate';
import Login from './components/login/login';
import PrivateRoute from './components/login/authenticate/privaterouter';
import Dash from './components/dash/dash';
import ScopeManage from './components/manage/scopemanage/scopemanage';
import MarkRelease from './components/manage/markrelease/markrelease';
import StaffCourseManage from './components/manage/staffcoursemanage/staffcoursemanage';
import StudentManage from './components/manage/studentmanage/studentmanage';
import MarkManage from './components/manage/markmanage/markmanage';
import StudentOutcome from './components/studentoutcome/studentoutcome';
import CourseOutcome from './components/courseoutcome/courseoutcome';
import AdminStuOC from './components/studentoutcome/adminstuoutcome/adminstuoutcome';
import AdminCouOC from './components/courseoutcome/admincououtcome/admincououtcome';
import HodCouOC from './components/courseoutcome/hodcououtcome/hodcououtcome';
import HodStuOC from './components/studentoutcome/hodstuoutcome/hodstuoutcome';
import StaffCouOC from './components/courseoutcome/handlecououtcome/handlecououtcome';
import StaffStuOC from './components/studentoutcome/handlestuoutcome/handlestuoutcome';
import TutorCouOC from './components/courseoutcome/tutorcououtcome/tutorcououtcome';
import TutorStuOC from './components/studentoutcome/tutorstuoutcome/tutorstuoutcome';
import ProgramOC from './components/prooutcome/prooutcome';
import ProgramSpecOc from './components/prospecoutcome/prospecoutcome';
import Lock from './components/manage/showblock/showblock';
import ObeReport from './components/obereport/obereport';



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



function App() {

	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />

					{/* Checked */}
					<Route path="staff/:staffId/*" element={<PrivateRoute element={<Layout />} />} >



						<Route path="dashboard" element={<Dash />} />
						<Route path="obereport" element={<ObeReport />} />
						<Route path="scopemanage" element={<ScopeManage />} />
						<Route path="studentmanage" element={<StudentManage />} />
						<Route path="markrelease" element={<MarkRelease />} />
						<Route path="markmanage" element={<MarkManage />} />
						<Route path="staffcoursemapmanage" element={<StaffCourseManage />} />
						<Route path="studentoutcome" element={<StudentOutcome />} />
						<Route path="courseoutcome" element={<CourseOutcome />} />
						<Route path="admincourseoutcome" element={<AdminCouOC />} />
						<Route path="adminstudentoutcome" element={<AdminStuOC />} />
						<Route path="hodcourseoutcome" element={<HodCouOC />} />
						<Route path="hodstudentoutcome" element={<HodStuOC />} />
						<Route path="staffcourseoutcome" element={<StaffCouOC />} />
						<Route path="staffstudentoutcome" element={<StaffStuOC />} />
						<Route path="tutorcourseoutcome" element={<TutorCouOC />} />
						<Route path="tutorstudentoutcome" element={<TutorStuOC />} />
						<Route path="programoutcome" element={<ProgramOC />} />
						<Route path="programspecificoutcome" element={<ProgramSpecOc />} />
						<Route path="showandblock" element={<Lock />} />





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

					</Route>
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App;