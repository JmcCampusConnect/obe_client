import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "../../css/EseReport.css";
import EseReportTable from "../../components/EseReport/EseReportTable";
import EseReportFilters from "../../components/EseReport/EseReportFilters";
import EseReportHeader from "../../components/EseReport/EseReportHeader";

function EseReport() {
    
    const apiUrl = import.meta.env.VITE_API_URL;
    const [courseCode, setCourseCode] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filterCourseCode, setFilterCourseCode] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchEseData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/esereport`);
                const sortedCourses = response.data.courses.sort((a, b) =>
                    a.course_code.localeCompare(b.course_code)
                );
                setCourseCode(sortedCourses);
            } catch (err) {
                console.error("Error fetching ESE Report Data:", err);
            }
        };
        fetchEseData();
    }, [apiUrl]);

    const filteredCourses = useMemo(() => {
        return courseCode.filter((item) => {
            const matchesSearch =
                item.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.course_title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourseCode =
                !filterCourseCode || item.course_code === filterCourseCode;
            const matchesStatus = !filterStatus || item.status === filterStatus;
            return matchesSearch && matchesCourseCode && matchesStatus;
        });
    }, [courseCode, searchTerm, filterCourseCode, filterStatus]);

    const totalPages = Math.ceil(filteredCourses.length / pageSize);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1);
    };

    const clearAllFilters = () => {
        setFilterCourseCode("");
        setFilterStatus("");
        setPage(1);
    };

    const handleDownload = () => {
        const worksheetData = filteredCourses.map((course) => ({
            "Course Code": course.course_code,
            "Course Title": course.course_title,
            Status: course.status || "Incomplete",
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ESE Report");
        XLSX.writeFile(workbook, "ESE Report.xlsx");
    };

    const getStatusColor = (statusText) => {
        switch (statusText) {
            case "Complete":
                return { color: "green" };
            case "Pending":
                return { color: "#ff9900" };
            default:
                return { color: "red" };
        }
    };

    return (
        <div className="ese-repo-main">
            
            <EseReportHeader
                searchText={searchTerm}
                handleSearch={handleSearch}
                handleDownload={handleDownload}
                setShowFilters={setShowFilters}
            />
            <EseReportFilters
                showFilters={showFilters}
                clearAllFilters={clearAllFilters}
                filterCourseCode={filterCourseCode}
                setFilterCourseCode={setFilterCourseCode}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                courseCodeOptions={courseCode.map((c) => ({
                    value: c.course_code,
                    label: c.course_code,
                }))}
            />
            <EseReportTable
                courseCode={filteredCourses}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                getStatusColor={getStatusColor}
            />
        </div>
    )
}

export default EseReport;