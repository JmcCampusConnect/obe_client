import { useEffect, useState, React } from 'react';
import axios from "axios";
import './tutorreport.css';
import { useParams } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

function TutorReport() 
{
    const { staffId } = useParams();
    const [deptStatus, setDeptStatus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => 
    {
        const fetchTutorReport = async () => 
        {
            try {
                const response = await axios.post(`${apiUrl}/api/tutorStatusReport`, {
                    staff_id: staffId
                });
                
                const uniqueData = Array.from(new Set(response.data.map(item => JSON.stringify(item))))
                .map(item => JSON.parse(item));
                
                const allCompleted = uniqueData.every(
                    (item) =>
                        item.cia_1 === "Completed" &&
                        item.cia_2 === "Completed" &&
                        item.ass_1 === "Completed" &&
                        item.ass_2 === "Completed"
                )
    
                if (allCompleted) {
                    setDeptStatus([]); 
                } 
                else {
                    setDeptStatus(uniqueData); 
                }
            } 
            catch (error) {
                console.error("Error fetching Department Status : ", error);
            }
        };
        fetchTutorReport();

    }, [apiUrl,staffId]);

    const filteredData = deptStatus.filter(
        (item) =>
            item.cia_1 !== "Completed" ||
            item.cia_2 !== "Completed" ||
            item.ass_1 !== "Completed" ||
            item.ass_2 !== "Completed"
    );

    const filteredStaffData = filteredData.filter((staff) =>
        (staff.course_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.staff_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )

    const getStatusClass = (status) => 
    {
        switch (status) 
        {
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
                <div className='tutor-main'>
                    <span className="tutor-top-heading">OBE MARK ENTRY REPORT</span>
                    <div className="tutor-input-btn">
                        <input
                            className="scope-search"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <h3>Total No of Records : {filteredStaffData.length}</h3>
                    </div>
                    <table className='tutor-repo-table'>
                        <thead>
                            <tr>
                                <th className='tutor-repo-th'>S No</th>
                                <th className='tutor-repo-th'>Staff Name</th>
                                <th className='tutor-repo-th'>Course Title</th>
                                <th className='tutor-repo-th'>CIA 1</th>
                                <th className='tutor-repo-th'>CIA 2</th>
                                <th className='tutor-repo-th'>ASS 1</th>
                                <th className='tutor-repo-th'>ASS 2</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredStaffData.length > 0 ? (
                            filteredStaffData.map((dept, index) => (
                                <tr key={index}>
                                    <td className='tutor-repo-td'>{index + 1}</td>
                                    <td className='tutor-repo-td'>{dept.staff_name}</td>
                                    <td className='tutor-repo-td'>{dept.course_title}</td>
                                    <td className={`tutor-repo-td-status ${getStatusClass(dept.cia_1)}`}>{dept.cia_1}</td>
                                    <td className={`tutor-repo-td-status ${getStatusClass(dept.cia_2)}`}>{dept.cia_2}</td>
                                    <td className={`tutor-repo-td-status ${getStatusClass(dept.ass_1)}`}>{dept.ass_1}</td>
                                    <td className={`tutor-repo-td-status ${getStatusClass(dept.ass_2)}`}>{dept.ass_2}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="tutor-repo-td">
                                    No Data Available.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                </div>
            )}
            {deptStatus.length === 0 && (
                <div className='process-main'>
                    <div className='process-content'>
                        <p className="process-code">All Assessments are Completed. </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TutorReport;

// import React from 'react'

// function TutorReport() {
//   return (
//     <div>TutorReport</div>
//   )
// }

// export default TutorReport