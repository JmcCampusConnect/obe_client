import { useEffect, useState } from 'react';
import axios from "axios";
import '../../css/HodReport.css';
import { useParams } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

function HodReport() {

    const { staffId } = useParams();
    const [deptStatus, setDeptStatus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDeptStatus = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/deptStatus`, {
                    staff_id: staffId
                });
                const uniqueData = Array.from(new Set(response.data.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
                setDeptStatus(uniqueData);
            }
            catch (error) {
                console.error("Error fetching department status:", error);
            }
        };
        fetchDeptStatus();
    }, [staffId]);

    const filteredStaffData = deptStatus.filter((staff) =>
        (staff.staff_id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.section?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.dept_id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.course_code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.course_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.staff_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )

    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
                return "status-completed";
            case "Processing":
                return "status-processing";
            case "Incomplete":
                return "status-incomplete";
        }
    }

    return (
        <div>
            {deptStatus.length > 0 && (
                <div className="hod-main">
                    <span className="hod-top-heading">OBE MARK ENTRY REPORT</span>
                    <div className="hod-input-btn">
                        <input
                            className="scope-search"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <h3>Total No of Records : {filteredStaffData.length}</h3>
                    </div>
                    <table className="hod-repo-table">
                        <thead>
                            <tr>
                                <th className="hod-repo-th">S No</th>
                                <th className="hod-repo-th">Staff Name</th>
                                <th className="hod-repo-th">Class</th>
                                <th className="hod-repo-th">Course Title</th>
                                <th className="hod-repo-th">CIA 1</th>
                                <th className="hod-repo-th">CIA 2</th>
                                <th className="hod-repo-th">ASS 1</th>
                                <th className="hod-repo-th">ASS 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaffData.length > 0 ? (
                                filteredStaffData.map((dept, index) => (
                                    <tr key={index}>
                                        <td className="hod-repo-td">{index + 1}</td>
                                        <td className="hod-repo-td">{dept.staff_name}</td>
                                        <td className="hod-repo-td">{dept.semester} {dept.dept_id} {dept.section}</td>
                                        <td className="hod-repo-td">{dept.course_title}</td>
                                        <td className={`hod-repo-td-status ${getStatusClass(dept.cia_1)}`}>{dept.cia_1}</td>
                                        <td className={`hod-repo-td-status ${getStatusClass(dept.cia_2)}`}>{dept.cia_2}</td>
                                        <td className={`hod-repo-td-status ${getStatusClass(dept.ass_1)}`}>{dept.ass_1}</td>
                                        <td className={`hod-repo-td-status ${getStatusClass(dept.ass_2)}`}>{dept.ass_2}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="hod-repo-td">
                                        No Data Available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {deptStatus.length === 0 && (
                <div className="process-main">
                    <div className="process-content">
                        <p className="process-code">All Assessments are Completed</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HodReport;