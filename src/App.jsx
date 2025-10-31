import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/login/authenticate/authenticate';
import Login from './components/login/login';
import PrivateRoute from './components/login/authenticate/privaterouter';
import Layout from './components/layout/layout';
import Dash from './components/dash/dash';
import CourseList from './components/courselist/courselist';
import Stumark from './components/courselist/stumark/stumark';
import InputFile from './components/fileupload/fileupload';
import StatusReport from './components/statusreport/statusreport';
import Manage from './components/manage/manage';
import ScopeManage from './components/manage/scopemanage/scopemanage';
import StaffManage from './components/manage/staffmanage/staffmanage';
import MarkRelease from './components/manage/markrelease/markrelease';
import StaffCourseManage from './components/manage/staffcoursemanage/staffcoursemanage';
import StudentManage from './components/manage/studentmanage/studentmanage';
import MarkManage from './components/manage/markmanage/markmanage';
import StaffMasterManage from './components/manage/staffmanage/staffmaster/staffmaster';
import HodManage from './components/manage/staffmanage/staffhod/staffhod';
import TutorManage from './components/manage/staffmanage/stafftutor/stafftutor';
import Settings from './components/settings/settings';
import Rsmatrix from './components/rsmatrix/rsmatrix';
import DeptReport from './components/statusreport/deptreport/deptreport';
import Rsmatrixreport from './components/statusreport/rsmatrixreport/rsmatrixreport';
import EseReport from './components/statusreport/esereport/esereport';
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
import Terminologies from './components/terminologies/terminologies';
import Lock from './components/manage/showblock/showblock';
import HodReport from './components/hodreport/hodreport';
import TutorReport from './components/tutorreport/tutorreport';
import ObeReport from './components/obereport/obereport';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="staff/:staffId/*" element={<PrivateRoute element={<Layout />} />} >
						<Route path="dashboard" element={<Dash />} />
						<Route path="courselist" element={<CourseList />} />
						<Route path="studentmark" element={<Stumark />} />
						<Route path="inputfiles" element={<InputFile />} />
						<Route path="settings" element={<Settings />} />
						<Route path="workprogressreport" element={<StatusReport />} />
						<Route path="obereport" element={<ObeReport />} />
						<Route path="matrixreport" element={<Rsmatrixreport />} />
						<Route path="esereport" element={<EseReport />} />
						<Route path="manage" element={<Manage />} />
						<Route path="scopemanage" element={<ScopeManage />} />
						<Route path="staffmanage" element={<StaffManage />} />
						<Route path="studentmanage" element={<StudentManage />} />
						<Route path="markrelease" element={<MarkRelease />} />
						<Route path="markmanage" element={<MarkManage />} />
						<Route path="staffmastermanage" element={<StaffMasterManage />} />
						<Route path="hodmanage" element={<HodManage />} />
						<Route path="tutormanage" element={<TutorManage />} />
						<Route path="staffcoursemapmanage" element={<StaffCourseManage />} />
						<Route path="rsmatrix" element={<Rsmatrix />} />
						<Route path=":dept/departmentreport" element={<DeptReport />} />
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
						<Route path="terminologies" element={<Terminologies />} />
						<Route path="showandblock" element={<Lock />} />
						<Route path="hodreport" element={<HodReport />} />
						<Route path="tutorreport" element={<TutorReport />} />
					</Route>
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App;