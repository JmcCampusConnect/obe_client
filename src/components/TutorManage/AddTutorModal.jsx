import React from 'react';
import SearchableDropdown from '../common/SearchableDropdown';

function AddTutorModal({
    addTutur, tututaddClose, getUniqueStaffsForDropdown, newTuturId, setNewTuturId, newtuturName, setNewtuturName,
	data, getUniqueValues, tuturCategory, setTuturCategory, tuturDegree, setTuturDegree, tuturgraduate, setTuturGraduate,
	tuturSection, setTuturSection, tuturDeptId, setTuturDeptId, tuturdeptName, setTuturdeptName, tuturBatch, setTuturBatch, handleNewMentor
}) {
    if (!addTutur) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        handleNewMentor();
    };

    const handleStaffSelect = (opt) => {
        if (typeof opt === "string") {
            setNewTuturId(opt);
            setNewtuturName("");
        } else if (opt) {
            setNewTuturId(opt.value);
            setNewtuturName(data.find(s => s.staff_id === opt.value)?.staff_name || "");
        } else {
            setNewTuturId("");
            setNewtuturName("");
        }
    };

    const handleDropdownSelect = (setter) => (opt) => {
        setter(opt ? (typeof opt === "string" ? opt : opt.value) : "");
    };

    const mapUniqueOptions = (key) => getUniqueValues(key).map(v => ({ value: v, label: v }));

    return (
        <div className="modal-overlay">
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3>ADD NEW TUTOR</h3>
                    <button className="modal-close" onClick={tututaddClose}>✕</button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <label>
                            <div className="label">Staff ID :</div>
                            <SearchableDropdown
                                options={getUniqueStaffsForDropdown()}
                                value={newTuturId}
                                getOptionLabel={(opt) => typeof opt === "string" ? opt : opt.label}
                                onSelect={handleStaffSelect}
                                placeholder="Select Staff ID"
                            />
                        </label>

                        <label>
                            <div className="label">Tutor Name :</div>
                            <input
                                className="input-box-correction"
                                type="text"
                                value={newtuturName}
                                placeholder="Tutor Name (Auto-filled)"
                                readOnly
                            />
                        </label>

                        <label>
                            <div className="label">Category :</div>
                            <SearchableDropdown
                                options={mapUniqueOptions("category")}
                                value={tuturCategory}
                                getOptionLabel={(c) => (typeof c === "string" ? c : c.label)}
                                onSelect={handleDropdownSelect(setTuturCategory)}
                                placeholder="Select Category"
                            />
                        </label>

                        <label>
                            <div className="label">Degree :</div>
                            <SearchableDropdown
                                options={mapUniqueOptions("degree")}
                                value={tuturDegree}
                                getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                                onSelect={handleDropdownSelect(setTuturDegree)}
                                placeholder="Select Degree"
                            />
                        </label>

                        <label>
                            <div className="label">Graduate :</div>
                            <SearchableDropdown
                                options={mapUniqueOptions("graduate")}
                                value={tuturgraduate}
                                getOptionLabel={(g) => (typeof g === "string" ? g : g.label)}
                                onSelect={handleDropdownSelect(setTuturGraduate)}
                                placeholder="Select Graduate"
                            />
                        </label>

                        <label>
                            <div className="label">Section :</div>
                            <SearchableDropdown
                                options={mapUniqueOptions("section")}
                                value={tuturSection}
                                getOptionLabel={(s) => (typeof s === "string" ? s : s.label)}
                                onSelect={handleDropdownSelect(setTuturSection)}
                                placeholder="Select Section"
                            />
                        </label>

                        <label>
                            <div className="label">Dept ID :</div>
                            <SearchableDropdown
                                options={mapUniqueOptions("dept_id")}
                                value={tuturDeptId}
                                getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                                onSelect={handleDropdownSelect(setTuturDeptId)}
                                placeholder="Select Dept ID"
                            />
                        </label>

                        <label>
                            <div className="label">Dept Name :</div>
                            <SearchableDropdown
                                options={mapUniqueOptions("dept_name")}
                                value={tuturdeptName}
                                getOptionLabel={(d) => (typeof d === "string" ? d : d.label)}
                                onSelect={handleDropdownSelect(setTuturdeptName)}
                                placeholder="Select Dept Name"
                            />
                        </label>

                        <label>
                            <div className="label">Batch :</div>
                            <SearchableDropdown
                                options={mapUniqueOptions("batch")}
                                value={tuturBatch}
                                getOptionLabel={(b) => (typeof b === "string" ? b : b.label)}
                                onSelect={handleDropdownSelect(setTuturBatch)}
                                placeholder="Select Batch"
                            />
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">SAVE</button>
                        <button type="button" className="btn btn-outline" onClick={tututaddClose}>CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTutorModal;