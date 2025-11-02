import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import '../../css/HodReport.css';
import { useParams } from 'react-router-dom';
import HodReportTable from '../../components/HodReport/HodReportTable';

const apiUrl = import.meta.env.VITE_API_URL;

function HodReport() {

    const { staffId } = useParams();
    const [deptStatus, setDeptStatus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // 💡 NEW: Pagination State
    const [page, setPage] = useState(1);
    const pageSize = 10; // Set a page size

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

    // Apply search filter
    const filteredStaffData = deptStatus.filter((staff) =>
        (staff.staff_id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.section?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.dept_id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.course_code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.course_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (staff.staff_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )

    // 💡 NEW: Calculate Total Pages based on filtered data
    const totalPages = useMemo(() => {
        // Reset page to 1 if the filter causes it to exceed total pages
        if (page > Math.ceil(filteredStaffData.length / pageSize) && filteredStaffData.length > 0) {
            setPage(1);
        }
        return Math.ceil(filteredStaffData.length / pageSize);
    }, [filteredStaffData.length, pageSize, page]);

    // Inside HodReport.jsx
    const getStatusClass = (status = "") => {
        const s = status.trim().toLowerCase();
        if (s === "completed") return "status-completed";
        if (s === "processing" || s === "in progress") return "status-processing";
        return "status-incomplete";
    };


    return (
        <div className="staff-management-shell">
            {/* 💡 THE FIX: Pass all required props */}
            <HodReportTable
                staffData={filteredStaffData} // The filtered data array
                page={page}                    // Current page
                pageSize={pageSize}            // Page size
                totalPages={totalPages}        // Total pages
                setPage={setPage}              // Function to change page
                getStatusClass={getStatusClass} // Function for conditional styling
            />
        </div>
    )
}

export default HodReport;