import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchableDropdown from "../../../common/SearchableDropdown";

function AddStudentModal({ addModal, closeAddModal }) {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [regNo, setRegNo] = useState("");
    const [stuName, setStuName] = useState("");
    const [deptId, setDeptId] = useState("");
    const [category, setCategory] = useState("");
    const [semester, setSemester] = useState("");
    const [section, setSection] = useState("");
    const [batch, setBatch] = useState("");
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [sections, setSections] = useState([]);
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        async function fetchDropdowns() {
            try {
                const response = await axios.get(`${apiUrl}/api/student/manage/add/dropdownValues`);
                setDepartments(response.data.uniqueDeptId || []);
                setSemesters(response.data.uniqueSemester || []);
                setBatches(response.data.uniqueBatch || []);
                setSections(response.data.uniqueSection || []);
            } catch (e) {
                console.error("Error fetching student add dropdown data : ", e);
            }
        }
        fetchDropdowns();
    }, [apiUrl]);

    const getOptions = (items) => items.map(item => ({ value: String(item), label: String(item) }))

    const handleSave = async () => {
        if (!regNo || !stuName || !deptId || !category || !semester || !section || !batch) {
            alert("Please fill in all fields before saving."); return;
        }
        const payload = {
            reg_no: regNo, stu_name: stuName, dept_id: deptId,
            category, semester, section, batch,
        }
        try {
            const response = await axios.post(`${apiUrl}/api/newStudentAdd`, payload);
            console.log(response.data)
            if (response.status === 201) {
                alert("Student has been added successfully.");
            }
            else {
                alert(response.data.message || 'Error occurred in adding student')
            }
        } catch (error) {
            console.log("Failed to add new student. Please try again.", error);
        }
    }

    if (!addModal) return null;

    return (
        <div className="smst-overlay">
            <div className="smst-modal">

                <div className="smsm-close-div">
                    <button className="smst-close" onClick={closeAddModal}>✖</button>
                </div>

                <h3>ADD NEW STUDENT</h3>

                <div className="smst-form-grid">
                    {/* Register No */}
                    <input
                        type="text"
                        value={regNo}
                        placeholder="REGISTER NO."
                        onChange={(e) => setRegNo(e.target.value)}
                    />

                    {/* Student Name */}
                    <input
                        type="text"
                        value={stuName}
                        placeholder="STUDENT NAME"
                        onChange={(e) => setStuName(e.target.value)}
                    />

                    {/* Category */}
                    <SearchableDropdown
                        options={getOptions(["AIDED", "SFM", "SFW"])}
                        value={category}
                        placeholder="CATEGORY"
                        getOptionLabel={(opt) =>
                            typeof opt === "string" ? opt : opt.label
                        }
                        onSelect={(opt) => {
                            if (typeof opt === "string") setCategory(opt);
                            else if (opt) setCategory(opt.value);
                            else setCategory("");
                        }}
                    />

                    {/* Department ID */}
                    <SearchableDropdown
                        options={getOptions(departments)}
                        value={deptId}
                        placeholder="DEPARTMENT ID"
                        getOptionLabel={(opt) =>
                            typeof opt === "string" ? opt : opt.label
                        }
                        onSelect={(opt) => {
                            if (typeof opt === "string") setDeptId(opt);
                            else if (opt) setDeptId(opt.value);
                            else setDeptId("");
                        }}
                    />

                    {/* Semester */}
                    <SearchableDropdown
                        options={getOptions(semesters)}
                        value={semester}
                        placeholder="SEMESTER"
                        getOptionLabel={(opt) =>
                            typeof opt === "string" ? opt : opt.label
                        }
                        onSelect={(opt) => {
                            if (typeof opt === "string") setSemester(opt);
                            else if (opt) setSemester(opt.value);
                            else setSemester("");
                        }}
                    />

                    {/* Section */}
                    <SearchableDropdown
                        options={getOptions(sections)}
                        value={section}
                        placeholder="SECTION"
                        getOptionLabel={(opt) =>
                            typeof opt === "string" ? opt : opt.label
                        }
                        onSelect={(opt) => {
                            if (typeof opt === "string") setSection(opt);
                            else if (opt) setSection(opt.value);
                            else setSection("");
                        }}
                    />

                    {/* Batch */}
                    <SearchableDropdown
                        options={getOptions(batches)}
                        value={batch}
                        placeholder="BATCH"
                        getOptionLabel={(opt) =>
                            typeof opt === "string" ? opt : opt.label
                        }
                        onSelect={(opt) => {
                            if (typeof opt === "string") setBatch(opt);
                            else if (opt) setBatch(opt.value);
                            else setBatch("");
                        }}
                    />
                </div>

                <div className="smst-delete-btn-container">
                    <button className="smsm-add-save-btn" onClick={handleSave}>
                        SAVE
                    </button>
                    <button className="smsm-save-edit-btn" onClick={closeAddModal}>
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddStudentModal;