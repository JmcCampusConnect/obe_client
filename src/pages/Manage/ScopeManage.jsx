import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import ScopeHeader from "../../components/ScopeManage/ScopeHeader";
import ScopeTable from "../../components/ScopeManage/ScopeTable";
import '../../css/ScopeManage.css';

function ScopeManage() {
    
    const [scopeData, setScopeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const scopeDetailsFetch = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/scopeset`);
                const data = response.data.map(item => ({
                    ...item,
                    dashboard: item.dashboard === 1 ? 1 : 0,
                    course_list: item.course_list === 1 ? 1 : 0,
                    relationship_matrix: item.relationship_matrix === 1 ? 1 : 0,
                    course_outcome: item.course_outcome === 1 ? 1 : 0,
                    student_outcome: item.student_outcome === 1 ? 1 : 0,
                    program_outcome: item.program_outcome === 1 ? 1 : 0,
                    program_specific_outcome: item.program_specific_outcome === 1 ? 1 : 0,
                    work_progress_report: item.work_progress_report === 1 ? 1 : 0,
                    input_files: item.input_files === 1 ? 1 : 0,
                    obe_report: item.obe_report === 1 ? 1 : 0,
                    work_progress_report: item.work_progress_report === 1 ? 1 : 0,
                    settings: item.settings === 1 ? 1 : 0,
                }));
                setScopeData(data);
                setFilteredData(data);
                setPage(1);
            } catch (err) {
                console.error('Error fetching Scope data:', err);
            }
        };
        scopeDetailsFetch();
    }, [apiUrl]);

    const handleSearch = useCallback((e) => {
        const text = e.target.value;
        setSearchText(text);
        const lowerCaseSearch = text.toLowerCase();
        const filterList = scopeData.filter(scope =>
            (scope.staff_id?.toLowerCase() || '').includes(lowerCaseSearch) ||
            (scope.staff_name?.toLowerCase() || '').includes(lowerCaseSearch)
        );
        setFilteredData(filterList);
        setPage(1);
    }, [scopeData]);

    const updateDataState = (prevData, staffId, field, checked) =>
        prevData.map(item =>
            item.staff_id === staffId ? { ...item, [field]: checked ? 1 : 0 } : item
        );

    const handleCheckboxChange = useCallback((staffId, field, checked) => {
        setScopeData(prevData => updateDataState(prevData, staffId, field, checked));
        setFilteredData(prevData => updateDataState(prevData, staffId, field, checked));
    }, []);

    const handleAllCheckboxChange = useCallback((field) => {
        const allChecked = scopeData.every(item => item[field] === 1);
        const newValue = allChecked ? 0 : 1;
        setScopeData(prevData =>
            prevData.map(item => ({ ...item, [field]: newValue }))
        );
        setFilteredData(prevData =>
            prevData.map(item => ({ ...item, [field]: newValue }))
        );
    }, [scopeData]);

    const handleSave = async () => {
        const updates = {};
        scopeData.forEach(item => {
            updates[item.staff_id] = {
                dashboard: item.dashboard,
                course_list: item.course_list,
                relationship_matrix: item.relationship_matrix,
                course_outcome: item.course_outcome,
                student_outcome: item.student_outcome,
                program_outcome: item.program_outcome,
                program_specific_outcome: item.program_specific_outcome,
                work_progress_report: item.work_progress_report,
                input_files: item.input_files,
                manage: item.manage,
                obe_report: item.obe_report,
                settings: item.settings,
            };
        });
        try {
            await axios.put(`${apiUrl}/api/updateScope`, { updates });
            alert("Scope Data Saved Successfully!");
        } catch (error) {
            alert("Failed to Save Scope Data. " + (error.response?.data.message || error.message));
        }
    };

    const totalPages = useMemo(() => {
        return Math.ceil(filteredData.length / pageSize);
    }, [filteredData.length]);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(totalPages);
        } else if (page === 0 && totalPages > 0) {
            setPage(1);
        }
    }, [page, totalPages]);

    return (
        <div className="scope-main">
            <ScopeHeader
                searchText={searchText}
                handleSearch={handleSearch}
                handleSave={handleSave}
            />
            <ScopeTable
                filteredData={filteredData}
                scopeData={scopeData}
                handleCheckboxChange={handleCheckboxChange}
                handleAllCheckboxChange={handleAllCheckboxChange}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    )
}

export default ScopeManage;