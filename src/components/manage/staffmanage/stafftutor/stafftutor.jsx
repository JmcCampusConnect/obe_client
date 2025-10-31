import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './stafftutor.css';
import Loading from '../../../../assets/load.svg'
import SearchableDropdown from "../../../../common/SearchableDropdown";

function StaffTutorManage() {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStaff, setEditingStaff] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteStaff, setDeleteStaff] = useState(null);
    const [addtutur, setAddtutur] = useState(false);
    const [newTuturId, setNewTuturId] = useState("");
    const [newtuturName, setNewtuturName] = useState("");
    const [tuturgraduate, setTuturGraduate] = useState("");
    const [tuturCategory, setTuturCategory] = useState("");
    const [tuturdeptName, setTuturdeptName] = useState("");
    const [tuturDeptId, setTuturDeptId] = useState("");
    const [tuturBatch, setTuturBatch] = useState("");
    const [tuturDegree, setTuturDegree] = useState("");
    const [tuturSection, setTuturSection] = useState("");
    const API_URL = "http://localhost:5000/api/mentor";
    const apiUrl = import.meta.env.VITE_API_URL;
    const [deptDetails, setDeptDetails] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                setData(response.data.mentorData);
                setFilteredData(response.data.mentorData);
                setDeptDetails(response.data.deptDetails);
            } catch (err) { setError(err.message) }
            finally { setLoading(false) }
        }
        fetchData();
    }, []);

    const handleSearch = (e) => {
        const searchText = e.target.value.toLowerCase();
        const filtered = data.filter((row) =>
            (row.staff_id?.toLowerCase() || "").includes(searchText) ||
            (row.staff_name?.toLowerCase() || "").includes(searchText) ||
            (row.category?.toLowerCase() || "").includes(searchText) ||
            (row.dept_name?.toLowerCase() || "").includes(searchText)
        );
        setFilteredData(filtered);
    };

    const handleDelete = (row) => { setDeleteStaff(row); };
    const cancelDelete = () => setDeleteStaff(null);

    const handleEditClick = (row) => {
        setEditingStaff(row);
        setEditForm({ ...row });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleaddtutur = () => { setAddtutur(true); };
    const tututaddClose = () => { setAddtutur(false); };

    const handleSelectstaff = (selectedId) => {
        const selectedStaff = filteredData.filter((staff) => staff.staff_id == selectedId);
        setNewtuturName(selectedStaff[0].staff_name);
    }

    const handleNewMentor = async () => {
        const newMentor = {
            staff_id: newTuturId,
            staff_name: newtuturName,
            graduate: tuturgraduate,
            category: tuturCategory,
            dept_name: tuturdeptName,
            dept_id: tuturDeptId,
            batch: tuturBatch,
            degree: tuturDegree,
            section: tuturSection,
        };
        try {
            const response = await axios.post(`${apiUrl}/api/newtutoradded`, newMentor);
            if (response.status === 201) {
                setData((prev) => [...prev, response.data.mentor]);
                setFilteredData((prev) => [...prev, response.data.mentor]);
                setAddtutur(false);
                alert("Mentor has been added successfully.");
            }
        } catch {
            console.log("Failed to add new mentor. Please try again.");
        }
    }

    const handleEditSave = async () => {
        try {
            await axios.put(`${API_URL}/${editForm.staff_id}`, editForm);
            const updatedData = data.map((row) =>
                row.staff_id === editForm.staff_id ? editForm : row
            );
            setData(updatedData);
            setFilteredData(updatedData);
            setEditingStaff(null);
            alert("Mentor has been modified successfully");
        } catch {
            alert("Failed to update the record. Please try again.");
        }
    }

    const confirmDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/mentor/${id}`);
            const updatedData = data.filter((row) => row.staff_id !== id);
            setData(updatedData);
            setFilteredData(updatedData);
            setDeleteStaff(null);
            alert("Mentor has been deleted successfully.");
        } catch (err) {
            alert("Failed to delete the record. Please try again.");
        }
    }

    const getUniqueValues = (key) => {
        return [...new Set(deptDetails.map((item) => item[key]).filter(Boolean))];
    }

    if (loading) return <div><center><img src={Loading} alt="" className="img" /></center></div>;

    return (
        <div className="smst-main">
            <span className="smst-top-heading">MENTOR DETAILS</span>

            <div className="smst-input-btn">
                <input
                    className="smst-search"
                    type="text"
                    placeholder="Search ..."
                    onChange={handleSearch}
                />
                <button className="smsm-save-btn" onClick={handleaddtutur}>
                    <FontAwesomeIcon icon={faPlus} className="smsm-icon" />
                    <span>Add</span>
                </button>
            </div>

            {/* <div className="smst-count">
                <span><b>Total Records :</b> {filteredData.length}</span>
            </div> */}

            {/* Mentor Table */}
            <table className="smst-table">
                <thead>
                    <tr>
                        <th>Sno</th>
                        <th>Staff ID</th>
                        <th>Mentor Name</th>
                        <th>Category</th>
                        <th>Dept Name</th>
                        <th>Section</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? filteredData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'smst-repo-light' : 'smst-repo-dark'}>
                            <td>{index + 1}</td>
                            <td>{row.staff_id}</td>
                            <td>{row.staff_name}</td>
                            <td>{row.category}</td>
                            <td>{row.dept_name}</td>
                            <td>{row.section}</td>
                            <td className='staff-repo-action'>
                                <button
                                    className="smsm-edit-btn"
                                    onClick={() => handleEditClick(row)}
                                >
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                            </td>
                            <td className='staff-repo-action'>
                                <button className="smsm-del-btn" onClick={() => handleDelete(row)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="8">No Data Available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add Tutor Modal */}
            {addtutur && (
                <div className="smst-overlay">
                    <div className="smst-modal">
                        <div className='smsm-close-div'>
                            <button className="smst-close" onClick={tututaddClose}>✖</button>
                        </div>
                        <h3>ADD NEW TUTOR</h3>

                        {/* STAFF ID Dropdown */}
                        <SearchableDropdown
                            options={filteredData.map(staff => ({ value: staff.staff_id, label: `${staff.staff_id} - ${staff.staff_name}` }))}
                            value={newTuturId}
                            getOptionLabel={(opt) => typeof opt === "string" ? opt : opt.label}
                            onSelect={(opt) => {
                                if (typeof opt === "string") {
                                    setNewTuturId(opt);
                                    setNewtuturName("");
                                } else if (opt) {
                                    setNewTuturId(opt.value);
                                    setNewtuturName(filteredData.find(s => s.staff_id === opt.value)?.staff_name || "");
                                }
                            }}
                            placeholder="STAFF ID"
                        />

                        {/* Tutor Name (auto-filled) */}
                        <div className="smst-form-grid">
                            <input
                                type="text"
                                value={newtuturName}
                                readOnly
                                placeholder="TUROR NAME"
                            />

                            {/* CATEGORY Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("category").map(c => ({ value: c, label: c }))}
                                value={tuturCategory}
                                getOptionLabel={(c) => (typeof c === "string" ? c : c.label)}
                                onSelect={(c) => {
                                    if (typeof c === "string") setTuturCategory(c);
                                    else if (c) setTuturCategory(c.value);
                                    else setTuturCategory("");
                                }}
                                placeholder="CATEGORY"
                            />

                            {/* DEGREE Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("degree").map(d => ({ value: d, label: d }))}
                                value={tuturDegree}
                                getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                                onSelect={(d) => {
                                    if (typeof d === "string") setTuturDegree(d);
                                    else if (d) setTuturDegree(d.value);
                                    else setTuturDegree("");
                                }}
                                placeholder="DEGREE"
                            />

                            {/* GRADUATE Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("graduate").map(g => ({ value: g, label: g }))}
                                value={tuturgraduate}
                                getOptionLabel={(g) => (typeof g === "string" ? g : g.label)}
                                onSelect={(g) => {
                                    if (typeof g === "string") setTuturGraduate(g);
                                    else if (g) setTuturGraduate(g.value);
                                    else setTuturGraduate("");
                                }}
                                placeholder="GRADUATE"
                            />

                            {/* SECTION Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("section").map(s => ({ value: s, label: s }))}
                                value={tuturSection}
                                getOptionLabel={(s) => (typeof s === "string" ? s : s.label)}
                                onSelect={(s) => {
                                    if (typeof s === "string") setTuturSection(s);
                                    else if (s) setTuturSection(s.value);
                                    else setTuturSection("");
                                }}
                                placeholder="SECTION"
                            />

                            {/* DEPT ID Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("dept_id").map(d => ({ value: d, label: d }))}
                                value={tuturDeptId}
                                getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                                onSelect={(d) => {
                                    if (typeof d === "string") setTuturDeptId(d);
                                    else if (d) setTuturDeptId(d.value);
                                    else setTuturDeptId("");
                                }}
                                placeholder="DEPT ID"
                            />

                            {/* DEPT NAME Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("dept_name").map(d => ({ value: d, label: d }))}
                                value={tuturdeptName}
                                getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                                onSelect={(d) => {
                                    if (typeof d === "string") setTuturdeptName(d);
                                    else if (d) setTuturdeptName(d.value);
                                    else setTuturdeptName("");
                                }}
                                placeholder="DEPT NAME"
                            />

                            {/* BATCH Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("batch").map(b => ({ value: b, label: b }))}
                                value={tuturBatch}
                                getOptionLabel={(b) => (typeof b === "string" ? b : b.label)}
                                onSelect={(b) => {
                                    if (typeof b === "string") setTuturBatch(b);
                                    else if (b) setTuturBatch(b.value);
                                    else setTuturBatch("");
                                }}
                                placeholder="BATCH"
                            />
                        </div>

                        <div className="smst-delete-btn-container">
                            <button onClick={handleNewMentor} className="smsm-add-save-btn">SAVE</button>
                            <button onClick={tututaddClose} className="smsm-save-edit-btn">CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Tutor Modal */}
            {editingStaff && (
                <div className="smst-overlay">
                    <div className="smst-modal">
                        <div className='smsm-close-div'>
                            <button className="smst-close" onClick={() => setEditingStaff(null)}>✖</button>
                        </div>
                        <h3>EDIT TUTOR</h3>

                        {/* STAFF ID Dropdown */}
                        <SearchableDropdown
                            options={filteredData.map(staff => ({ value: staff.staff_id, label: `${staff.staff_id} - ${staff.staff_name}` }))}
                            value={editForm.staff_id}
                            getOptionLabel={(opt) => typeof opt === "string" ? opt : opt.label}
                            onSelect={(opt) => {
                                if (typeof opt === "string") {
                                    setEditForm(prev => ({ ...prev, staff_id: opt, staff_name: "" }));
                                } else if (opt) {
                                    const selectedStaff = filteredData.find(s => s.staff_id === opt.value);
                                    setEditForm(prev => ({
                                        ...prev,
                                        staff_id: opt.value,
                                        staff_name: selectedStaff?.staff_name || ""
                                    }));
                                }
                            }}
                            placeholder="STAFF ID"
                        />

                        {/* Tutor Name (auto-filled) */}
                        <div className="smst-form-grid">
                            <input
                                type="text"
                                value={editForm.staff_name || ""}
                                readOnly
                                placeholder="TUTOR NAME"
                            />

                            {/* CATEGORY Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("category").map(c => ({ value: c, label: c }))}
                                value={editForm.category || ""}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : (opt ? opt.label : "")}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setEditForm(prev => ({ ...prev, category: opt }));
                                    else if (opt) setEditForm(prev => ({ ...prev, category: opt.value }));
                                    else setEditForm(prev => ({ ...prev, category: "" }));
                                }}
                                placeholder="CATEGORY"
                            />

                            {/* DEGREE Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("degree").map(d => ({ value: d, label: d }))}
                                value={editForm.degree || ""}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : (opt ? opt.label : "")}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setEditForm(prev => ({ ...prev, degree: opt }));
                                    else if (opt) setEditForm(prev => ({ ...prev, degree: opt.value }));
                                    else setEditForm(prev => ({ ...prev, degree: "" }));
                                }}
                                placeholder="DEGREE"
                            />

                            {/* GRADUATE Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("graduate").map(g => ({ value: g, label: g }))}
                                value={editForm.graduate || ""}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : (opt ? opt.label : "")}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setEditForm(prev => ({ ...prev, graduate: opt }));
                                    else if (opt) setEditForm(prev => ({ ...prev, graduate: opt.value }));
                                    else setEditForm(prev => ({ ...prev, graduate: "" }));
                                }}
                                placeholder="GRADUATE"
                            />

                            {/* SECTION Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("section").map(s => ({ value: s, label: s }))}
                                value={editForm.section || ""}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : (opt ? opt.label : "")}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setEditForm(prev => ({ ...prev, section: opt }));
                                    else if (opt) setEditForm(prev => ({ ...prev, section: opt.value }));
                                    else setEditForm(prev => ({ ...prev, section: "" }));
                                }}
                                placeholder="SECTION"
                            />

                            {/* DEPT ID Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("dept_id").map(d => ({ value: d, label: d }))}
                                value={editForm.dept_id || ""}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : (opt ? opt.label : "")}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setEditForm(prev => ({ ...prev, dept_id: opt }));
                                    else if (opt) setEditForm(prev => ({ ...prev, dept_id: opt.value }));
                                    else setEditForm(prev => ({ ...prev, dept_id: "" }));
                                }}
                                placeholder="DEPT ID"
                            />

                            {/* DEPT NAME Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("dept_name").map(d => ({ value: d, label: d }))}
                                value={editForm.dept_name || ""}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : (opt ? opt.label : "")}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setEditForm(prev => ({ ...prev, dept_name: opt }));
                                    else if (opt) setEditForm(prev => ({ ...prev, dept_name: opt.value }));
                                    else setEditForm(prev => ({ ...prev, dept_name: "" }));
                                }}
                                placeholder="DEPT NAME"
                            />

                            {/* BATCH Dropdown */}
                            <SearchableDropdown
                                options={getUniqueValues("batch").map(b => ({ value: b, label: b }))}
                                value={editForm.batch || ""}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : (opt ? opt.label : "")}
                                onSelect={(opt) => {
                                    if (typeof opt === "string") setEditForm(prev => ({ ...prev, batch: opt }));
                                    else if (opt) setEditForm(prev => ({ ...prev, batch: opt.value }));
                                    else setEditForm(prev => ({ ...prev, batch: "" }));
                                }}
                                placeholder="BATCH"
                            />
                        </div>

                        <div className="smst-delete-btn-container">
                            <button className="smsm-add-save-btn" onClick={handleEditSave}>SAVE</button>
                            <button className="smsm-save-edit-btn" onClick={() => setEditingStaff(null)}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Tutor Modal */}
            {deleteStaff && (
                <div className="smst-overlay">
                    <div className="smst-modal">
                        <div className='smsm-close-div'>
                            <button className="smst-close" onClick={cancelDelete}>✖</button>
                        </div>
                        <h3>CONFIRM DELETE</h3>
                        <p>Staff ID : {deleteStaff.staff_id}</p>
                        <p>Mentor Name : {deleteStaff.staff_name}</p>
                        <p>Category : {deleteStaff.category}</p>
                        <p>Class : {deleteStaff.degree} {deleteStaff.dept_name} - {deleteStaff.section}</p>
                        <div className="smshh-delete-btn-container">
                            <button onClick={() => confirmDelete(deleteStaff.staff_id)} className="smsm-add-save-btn">DELETE</button>
                            <button onClick={cancelDelete} className="smsm-save-edit-btn">CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default StaffTutorManage;
