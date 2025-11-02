import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../../css/RsMatrixReport.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import RsMartixReportTable from "../../components/RsMatrixReport/RsMartixReportTable";
import RsMartixReportHeader from "../../components/RsMatrixReport/RsMartixReportHeader";
import RsMartixReportFilters from "../../components/RsMatrixReport/RsMartixReportFilters";

function RsMatrixReport() {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [academicYear, setAcademicYear] = useState("");
    const [allMatrixReport, setAllMatrixReport] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [courseCount, setCourseCount] = useState("");
    const [comCount, setComCount] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterDeptId, setFilterDeptId] = useState("");
    const [filterStaffId, setFilterStaffId] = useState("");
    const [filterCourseCode, setFilterCourseCode] = useState("");
    const [filterSection, setFilterSection] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [depts, setDepts] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [courseCodeOptions, setCourseCodeOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const academicYearSet = async () => {
            try {
                const response = await axios.post(`${apiUrl}/activesem`, {});
                setAcademicYear(response.data.academic_sem);
            } catch (err) {
                console.error("Error fetching Academic Year : ", err);
            }
        };
        academicYearSet();
    }, [apiUrl]);

    useEffect(() => {

        if (!academicYear) return;

        const fetchMatrixReport = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/allmatrixreport`, {
                    academic_sem: academicYear,
                });
                setAllMatrixReport(response.data);

                const uniqueDepts = [...new Set(response.data.map(item => item.dept_id))].filter(Boolean);
                setDepts(uniqueDepts.map(dept => ({ value: dept, label: dept })));

                const uniqueStaff = [...new Set(response.data.map(item => item.staff_id))]
                    .filter(Boolean)
                    .map(id => {
                        const staff = response.data.find(item => item.staff_id === id);
                        return staff ? { value: staff.staff_id, label: ` ${staff.staff_id} - ${staff.staff_name}` } : null;
                    })
                    .filter(Boolean);
                setStaffOptions(uniqueStaff);

                const uniqueCourseCodes = [...new Set(response.data.map(item => item.course_code))].filter(Boolean);
                setCourseCodeOptions(uniqueCourseCodes.map(code => ({ value: code, label: code })));

                const uniqueSections = [...new Set(response.data.map(item => item.section))].filter(Boolean);
                setSectionOptions(uniqueSections.map(sec => ({ value: sec, label: sec })));
            } catch (err) {
                console.error("Error Fetching Data:", err);
            }
        };

        const matrixCompletedCount = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/matrixcount`, {
                    academic_sem: academicYear,
                });
                if (response.data) {
                    setCourseCount(response.data.uniqueCourseCount);
                    setComCount(response.data.completeCount);
                }
            } catch (err) {
                console.error("Error Fetching Status Report count:", err);
            }
        };

        fetchMatrixReport();
        matrixCompletedCount();
    }, [academicYear, apiUrl]);

    const handleSearch = (text) => {
        setSearchTerm(text);
        setPage(1);
    };

    const clearAllFilters = () => {
        setFilterCategory("");
        setFilterDeptId("");
        setFilterStaffId("");
        setFilterCourseCode("");
        setFilterSection("");
        setFilterStatus("");
        setPage(1);
    };

    const handleDownload = () => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const date = new Date();
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear().toString().slice(-2)}`;
        const fileName = `Rs Matrix ${formattedDate}`;

        const data = filteredReports.map((dept) => ({
            "Staff Id": dept.staff_id,
            "Staff Name": dept.staff_name,
            "Dept Id": dept.dept_id,
            "Course Code": dept.course_code,
            "Category": dept.category,
            "Section": dept.section,
            Status: dept.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = { Sheets: { "Rs Matrix": worksheet }, SheetNames: ["Rs Matrix"] };
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: fileType });
        saveAs(dataBlob, fileName + fileExtension);
    };

    const getStatusPriority = (status) => {
        if (status === "Incomplete") return 1;
        if (status === "Processing") return 2;
        if (status === "Completed") return 3;
        return 4;
    };

    const filteredReports = useMemo(() => {
        const sorted = [...allMatrixReport].sort((a, b) => {
            const statusPriorityA = getStatusPriority(a.status);
            const statusPriorityB = getStatusPriority(b.status);
            if (statusPriorityA !== statusPriorityB) return statusPriorityA - statusPriorityB;
            return a.staff_id.localeCompare(b.staff_id);
        });

        return sorted.filter((matrix) => {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const matchesSearch =
                matrix.staff_id?.toLowerCase().includes(lowerSearchTerm) ||
                matrix.staff_name?.toLowerCase().includes(lowerSearchTerm) ||
                matrix.category?.toLowerCase().includes(lowerSearchTerm) ||
                matrix.course_code?.toLowerCase().includes(lowerSearchTerm);

            if (!matchesSearch) return false;

            const matchesCategory = !filterCategory || matrix.category === filterCategory;
            const matchesDept = !filterDeptId || matrix.dept_id === filterDeptId;
            const matchesStaff = !filterStaffId || matrix.staff_id === filterStaffId;
            const matchesCourseCode = !filterCourseCode || matrix.course_code === filterCourseCode;
            const matchesSection = !filterSection || matrix.section === filterSection;
            const matchesStatus = !filterStatus || matrix.status === filterStatus;

            return (
                matchesCategory &&
                matchesDept &&
                matchesStaff &&
                matchesCourseCode &&
                matchesSection &&
                matchesStatus
            );
        });
    }, [
        allMatrixReport,
        searchTerm,
        filterCategory,
        filterDeptId,
        filterStaffId,
        filterCourseCode,
        filterSection,
        filterStatus,
    ]);

    const totalPages = Math.ceil(filteredReports.length / pageSize);

    const getActiveField = (dept) => dept.status || "";
    const getStatus = (status) => status || "-";
    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return { color: "green" };
            case "Incomplete":
                return { color: "red" };
            case "Processing":
                return { color: "orange" };
            default:
                return { color: "gray" };
        }
    };

    return (
        <div className="staff-management-shell">
            <RsMartixReportHeader
                searchText={searchTerm}
                handleSearch={handleSearch}
                handleDownload={handleDownload}
                setShowFilters={setShowFilters}
                showFilters={showFilters}
            />

            <RsMartixReportFilters
                showFilters={showFilters}
                clearAllFilters={clearAllFilters}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterDeptId={filterDeptId}
                setFilterDeptId={setFilterDeptId}
                filterStaffId={filterStaffId}
                setFilterStaffId={setFilterStaffId}
                filterCourseCode={filterCourseCode}
                setFilterCourseCode={setFilterCourseCode}
                filterSection={filterSection}
                setFilterSection={setFilterSection}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                depts={depts}
                staffOptions={staffOptions}
                courseCodeOptions={courseCodeOptions}
                sectionOptions={sectionOptions}
            />

            <div className="rsm-repo-com-status">
                <b>No of Course Codes Completed : </b>
                {comCount} / {courseCount}
            </div>

            <RsMartixReportTable
                sortedReport={filteredReports}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
                getStatus={getStatus}
                getActiveField={getActiveField}
                getStatusColor={getStatusColor}
            />
        </div>
    )
}

export default RsMatrixReport;