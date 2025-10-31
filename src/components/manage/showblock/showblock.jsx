import { useState, useEffect } from "react";
import axios from "axios";
import './showblock.css';

function Showblock() 
{
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeData, setActiveData] = useState({
        cia_1: 0,
        cia_2: 0,
        ass_1: 0,
        ass_2: 0
    });

    useEffect(() => {
        const showBlock = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/showblock`);
                if (response.data) { setActiveData(response.data) }
            }
            catch (err) { console.error("Error fetching data:", err) }
        }
        showBlock()
    }, [])

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setActiveData((prevData) => ({
            ...prevData,
            [name]: checked ? 1 : 0,
        }))
    }

    const handleUpdateLock = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/updatelock`, activeData);
            if (response.data.message === "Success") { alert("Updated Successfully!") }
        }
        catch (err) { console.error("Error updating data:", err) }
    }

    return (
        <div className="course-main">
            <div className="show-content-box">
                <h2>SHOW AND BLOCK</h2>
                <div className="show-check">
                    <input type='checkbox' checked={false} readOnly />
                    <span>SHOW</span>
                    <input type='checkbox' checked readOnly />
                    <span>BLOCK</span>
                </div>
                <hr />
                <div className="show-check">
                    <label>CIA-1</label>
                    <label>CIA-2</label>
                    <label>ASS-1</label>
                    <label>ASS-2</label>
                </div>
                <div className="show-check-check">
                    <input
                        type="checkbox"
                        name="cia_1"
                        checked={activeData.cia_1 === 1}
                        onChange={handleCheckboxChange}
                    />
                    <input
                        type="checkbox"
                        name="cia_2"
                        checked={activeData.cia_2 === 1}
                        onChange={handleCheckboxChange}
                    />
                    <input
                        type="checkbox"
                        name="ass_1"
                        checked={activeData.ass_1 === 1}
                        onChange={handleCheckboxChange}
                    />
                    <input
                        type="checkbox"
                        name="ass_2"
                        checked={activeData.ass_2 === 1}
                        onChange={handleCheckboxChange}
                    />
                    <button onClick={handleUpdateLock} className="scope-save-btn">UPDATE</button>
                </div>
            </div>
        </div>
    )
}

export default Showblock;