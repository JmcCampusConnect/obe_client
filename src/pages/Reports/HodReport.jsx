import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import HodReportHeader from '../../components/HodReport/HodReportHeader';
import HodReportFilter from '../../components/HodReport/HodReportFilters';
import HodReportTable from '../../components/HodReport/HodReportTable';
import '../../css/HodReport.css';

const apiUrl = import.meta.env.VITE_API_URL;

function HodReport() {
    
    const { staffId } = useParams();
    const [deptStatus, setDeptStatus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filterDeptId, setFilterDeptId] = useState("");
    const [filterStaffId, setFilterStaffId] = useState("");
    const [filterCourseCode, setFilterCourseCode] = useState("");
    const [filterSection, setFilterSection] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchDeptStatus = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/deptStatus`, { staff_id: staffId });
                const uniqueData = Array.from(new Set(response.data.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
                setDeptStatus(uniqueData);
            } catch (error) {
                console.error("Error fetching department status:", error);
            }
        };
        fetchDeptStatus();
    }, [staffId]);

    const staffOptions = useMemo(() => {
        const unique = [...new Set(deptStatus.map(d => d.staff_id))];
        return unique.map(v => ({ value: v, label: v }));
    }, [deptStatus]);

    const deptOptions = useMemo(() => {
        const unique = [...new Set(deptStatus.map(d => d.dept_id))];
        return unique.map(v => ({ value: v, label: v }));
    }, [deptStatus]);

    const courseCodeOptions = useMemo(() => {
        const unique = [...new Set(deptStatus.map(d => d.course_code))];
        return unique.map(v => ({ value: v, label: v }));
    }, [deptStatus]);

    const sectionOptions = useMemo(() => {
        const unique = [...new Set(deptStatus.map(d => d.section))];
        return unique.map(v => ({ value: v, label: v }));
    }, [deptStatus]);

    const filteredStaffData = useMemo(() => {
        let data = deptStatus;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            data = data.filter((item) =>
                (item.staff_id?.toLowerCase() || "").includes(lower) ||
                (item.dept_id?.toLowerCase() || "").includes(lower) ||
                (item.course_code?.toLowerCase() || "").includes(lower) ||
                (item.section?.toLowerCase() || "").includes(lower)
            );
        }
        const applyFilter = (value, field) => {
            if (!value) return data;
            return data.filter(item => (item[field]?.toString().toLowerCase() || "") === value.toLowerCase());
        };
        data = applyFilter(filterDeptId, 'dept_id');
        data = applyFilter(filterStaffId, 'staff_id');
        data = applyFilter(filterCourseCode, 'course_code');
        data = applyFilter(filterSection, 'section');
        return data;
    }, [deptStatus, searchTerm, filterDeptId, filterStaffId, filterCourseCode, filterSection]);

    const totalPages = useMemo(() => {
        if (filteredStaffData.length > 0 && page > Math.ceil(filteredStaffData.length / pageSize)) {
            setPage(1);
        }
        return Math.ceil(filteredStaffData.length / pageSize);
    }, [filteredStaffData.length, pageSize, page]);

    const clearAllFilters = () => {
        setFilterDeptId("");
        setFilterStaffId("");
        setFilterCourseCode("");
        setFilterSection("");
        setPage(1);
    };

    const getStatusClass = (status = "") => {
        const s = status.trim().toLowerCase();
        if (s === "completed") return "status-completed";
        if (s === "processing" || s === "in progress") return "status-processing";
        return "status-incomplete";
    };

    return (
        <div className="staff-management-shell">
            <HodReportHeader
                searchText={searchTerm}
                handleSearch={setSearchTerm}
                handleDownload={() => console.log("Download to Excel triggered.")}
                setShowFilters={setShowFilters}
            />
            <HodReportFilter
                showFilters={showFilters}
                clearAllFilters={clearAllFilters}
                filterDeptId={filterDeptId} setFilterDeptId={setFilterDeptId}
                filterStaffId={filterStaffId} setFilterStaffId={setFilterStaffId}
                filterCourseCode={filterCourseCode} setFilterCourseCode={setFilterCourseCode}
                filterSection={filterSection} setFilterSection={setFilterSection}
                deptOptions={deptOptions}
                staffOptions={staffOptions}
                courseCodeOptions={courseCodeOptions}
                sectionOptions={sectionOptions}
            />
            <HodReportTable
                staffData={filteredStaffData}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                getStatusClass={getStatusClass}
            />
        </div>
    )
}

export default HodReport;