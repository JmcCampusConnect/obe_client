import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import '../../css/TutorReport.css';
import { useParams } from 'react-router-dom';
import TutorReportTable from '../../components/TutorReport/TutorReportTable';
import TutorHeader from '../../components/TutorManage/TutorHeader';

const apiUrl = import.meta.env.VITE_API_URL;

function TutorReport() {

    const { staffId } = useParams();
    const [deptStatus, setDeptStatus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [showPopup, setShowPopup] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchTutorReport = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/tutorStatusReport`, {
                    staff_id: staffId
                });
                const uniqueData = Array.from(new Set(response.data.map(item => JSON.stringify(item))))
                    .map(item => JSON.parse(item));
                const allCompleted = uniqueData.every(
                    item =>
                        item.cia_1 === "Completed" &&
                        item.cia_2 === "Completed" &&
                        item.ass_1 === "Completed" &&
                        item.ass_2 === "Completed"
                )
                if (allCompleted) setDeptStatus([]);
                else setDeptStatus(uniqueData);
            } catch (error) {
                console.error("Error fetching Department Status:", error);
            }
        }
        fetchTutorReport();
    }, [staffId]);

    const filteredStaffData = useMemo(() => {
        return deptStatus
            .filter(
                item =>
                    item.cia_1 !== "Completed" ||
                    item.cia_2 !== "Completed" ||
                    item.ass_1 !== "Completed" ||
                    item.ass_2 !== "Completed"
            )
            .filter(
                staff =>
                    (staff.course_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                    (staff.staff_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
            );
    }, [deptStatus, searchTerm]);

    const totalPages = Math.ceil(filteredStaffData.length / pageSize);

    const getStatusClass = (status = "") => {
        switch (status.trim().toLowerCase()) {
            case "completed":
                return "status-completed";
            case "processing":
            case "in progress":
                return "status-processing";
            default:
                return "status-incomplete";
        }
    };

    const handleSearch = (value) => setSearchTerm(value);
    const handleAddTutor = () => setShowPopup(true);

    return (
        <div className="staff-management-shell">
            
            <TutorHeader
                searchText={searchTerm}
                handleSearch={handleSearch}
                showPopup={handleAddTutor}
                setShowFilters={setShowFilters}
            />

            <TutorReportTable
                filteredStaffData={filteredStaffData}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                getStatusClass={getStatusClass}
            />
        </div>
    )
}

export default TutorReport;