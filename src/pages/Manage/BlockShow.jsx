import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/BlockShow.css";

function BlockShow() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeData, setActiveData] = useState({
        cia_1: 0, cia_2: 0, ass_1: 0, ass_2: 0
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/showblock`);
                if (res.data) setActiveData(res.data);
            } catch (err) {
                console.error("Error fetching:", err);
            }
        })();
    }, []);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setActiveData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.post(`${apiUrl}/api/updatelock`, activeData);
            alert(res.data.message === "Success" ? "✅ Updated successfully!" : "⚠️ Update failed!");
        } catch (err) {
            console.error("Error updating:", err);
            alert("❌ Failed to update!");
        }
    };

    const items = [
        { name: "cia_1", label: "CIA - 1" },
        { name: "cia_2", label: "CIA - 2" },
        { name: "ass_1", label: "Assignment - 1" },
        { name: "ass_2", label: "Assignment - 2" }
    ];

    return (
        <div className="showblock-container">
            <div className="showblock-header">
                <h2>Evaluation Visibility Settings</h2>
                <p>Control which evaluations are visible to students.</p>
                <p className="info-text">
                    Toggle <strong>ON</strong> to show marks, <strong>OFF</strong> to block access.
                </p>
            </div>
            <hr className="showblock-divider" />
            <div className="showblock-controls">
                {items.map((item) => (
                    <div key={item.name} className="showblock-control">
                        <span className="showblock-label">{item.label}</span>
                        <div className="toggle-wrapper">
                            <input
                                id={item.name}
                                type="checkbox"
                                className="toggle-input"
                                checked={activeData[item.name] === 1}
                                onChange={handleCheckboxChange}
                                name={item.name}
                            />
                            <label htmlFor={item.name} className="toggle-track">
                                <div className="toggle-thumb"></div>
                            </label>
                        </div>

                    </div>
                ))}
            </div>
            <div className="save-section">
                <button className="save-btn" onClick={handleUpdate}>
                    Save Configuration
                </button>
            </div>
        </div>
    )
}

export default BlockShow;