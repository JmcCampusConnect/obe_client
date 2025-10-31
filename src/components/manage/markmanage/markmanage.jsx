import React, { useState } from "react";
import { useEffect } from "react";
import './markmanage.css';
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

function MarkManage() 
{
    const [academicSem, setAcademicSem] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [isModifying, setIsModifying] = useState(false); 
    const [inputValue, setInputValue] = useState('');

    const [values, setValues] = useState({
        cia1: { lot: '', mot: '', hot: '', weightage: '' },
        cia2: { lot: '', mot: '', hot: '' },
        ass1: { lot: '', mot: '', hot: '' },
        ass2: { lot: '', mot: '', hot: '' },
        level0: { ugStartRange: "0", ugEndRange: "", pgStartRange: "0", pgEndRange: "" },
        level1: { ugStartRange: "", ugEndRange: "", pgStartRange: "", pgEndRange: "" },
        level2: { ugStartRange: "", ugEndRange: "", pgStartRange: "", pgEndRange: "" },
        level3: { ugStartRange: "", ugEndRange: "100", pgStartRange: "", pgEndRange: "100" },
        maxEse: { lot: '', mot: '', hot: '', weightage: '' },
    })

    useEffect(() => 
    {
        const fetchDatas = async () => 
        {
            try 
            {
                const response = await axios.get(`${apiUrl}/api/fetchCalDatas`);
                const data = response.data;
                setInputValue(data.co_thresh_value)

                setValues((prevValues) => (
                {
                    ...prevValues,
                    cia1: { lot: data.c1_lot, mot: data.c1_mot, hot: data.c1_hot, weightage: data.cia_weightage },
                    cia2: { lot: data.c2_lot, mot: data.c2_mot, hot: data.c2_hot },
                    ass1: { lot: data.a1_lot, mot: data.a1_mot, hot: data.a1_hot },
                    ass2: { lot: data.a2_lot, mot: data.a2_mot, hot: data.a2_hot },
                    level0: {
                        ugStartRange: "0",
                        ugEndRange: data.so_l0_ug,
                        pgStartRange: "0",
                        pgEndRange: data.so_l0_pg,
                    },
                    level1: {
                        ugStartRange: (parseInt(data.so_l0_ug) + 1).toString(),
                        ugEndRange: data.so_l1_ug,
                        pgStartRange: (parseInt(data.so_l0_pg) + 1).toString(),
                        pgEndRange: data.so_l1_pg,
                    },
                    level2: {
                        ugStartRange: (parseInt(data.so_l1_ug) + 1).toString(),
                        ugEndRange: data.so_l2_ug,
                        pgStartRange: (parseInt(data.so_l1_pg) + 1).toString(),
                        pgEndRange: data.so_l2_pg,
                    },
                    level3: {
                        ugStartRange: (parseInt(data.so_l2_ug) + 1).toString(),
                        ugEndRange: data.so_l3_ug,
                        pgStartRange: (parseInt(data.so_l2_pg) + 1).toString(),
                        pgEndRange: data.so_l3_pg,
                    },
                    maxEse: { lot: data.e_lot, mot: data.e_mot, hot: data.e_hot, weightage: data.ese_weightage }
                }));
            } 
            catch (err) {
                console.error('Error Fetching Data:', err);
            }
        }

        fetchDatas();

    }, [apiUrl]);

    const academicSemSet = async () => 
    {
        try {
            const response = await axios.post(`${apiUrl}/activesem`, {});
            setAcademicSem(response.data.academic_sem);
        }
        catch (err) {
            console.log('Error fetching data:', err);
        }
    }
    academicSemSet();

    const maxCia =
    {
        lot: (parseInt(values.cia1.lot || 0, 10) + parseInt(values.cia2.lot || 0, 10) +
            parseInt(values.ass1.lot || 0, 10) + parseInt(values.ass2.lot || 0, 10)) || '',
        mot: (parseInt(values.cia1.mot || 0, 10) + parseInt(values.cia2.mot || 0, 10) +
            parseInt(values.ass1.mot || 0, 10) + parseInt(values.ass2.mot || 0, 10)) || '',
        hot: (parseInt(values.cia1.hot || 0, 10) + parseInt(values.cia2.hot || 0, 10) +
            parseInt(values.ass1.hot || 0, 10) + parseInt(values.ass2.hot || 0, 10)) || '',
    }

    const handleChange = (event, section, type) => 
    {
        const value = event.target.value.slice(0, 3); 
        if (/^\d*$/.test(value)) 
        {
            setValues((prevValues) => 
            {
                const newValues = {
                    ...prevValues,
                    [section]: {
                        ...prevValues[section],
                        [type]: value,
                    },
                }

                if (type === "ugEndRange" && section.startsWith("level")) 
                {
                    const currentLevel = parseInt(section.replace("level", ""), 10);
                    const nextLevel = `level${currentLevel + 1}`;
                    if (newValues[nextLevel]) 
                    {
                        newValues[nextLevel] = {
                            ...newValues[nextLevel],
                            ugStartRange: parseInt(value, 10) + 1 || "",
                        }
                    }
                }

                if (type === "pgEndRange" && section.startsWith("level")) 
                {
                    const currentLevel = parseInt(section.replace("level", ""), 10);
                    const nextLevel = `level${currentLevel + 1}`;
                    if (newValues[nextLevel]) 
                    {
                        newValues[nextLevel] = {
                            ...newValues[nextLevel],
                            pgStartRange: parseInt(value, 10) + 1 || "", 
                        }
                    }
                }
                return newValues;
            })
        }
    }

    const handleSave = async () => 
    {
        setIsModifying(false);
        const ciaSections = ['cia1', 'cia2', 'ass1', 'ass2', 'maxEse'];
        const levelSections = ['level0', 'level1', 'level2', 'level3'];

        const areCiaFieldsFilled = ciaSections.every(section =>
            Object.values(values[section]).every(value => value !== '')
        )

        const areLevelFieldsFilled = levelSections.every(section =>
            Object.values(values[section]).every(value => value !== '')
        )

        if (!areCiaFieldsFilled || !areLevelFieldsFilled) {
            alert('All Fields are Required');
            return;
        }

        try 
        {
            const ciaData = 
            {
                cia1: values.cia1,
                cia2: values.cia2,
                ass1: values.ass1,
                ass2: values.ass2,
                maxEse: values.maxEse,
                maxCia,
                academicSem,
                inputValue,
                level0: values.level0,
                level1: values.level1,
                level2: values.level2,
                level3: values.level3,
            }

            // console.log(ciaData)

            const [ciaResponse] = await Promise.all([
                axios.post(`${apiUrl}/api/calc`, ciaData)
            ])

            if (ciaResponse.data) {
                alert('Data Saved Successfully!');
            }
        } 
        catch (error) {
            console.error('Error Saving Data:', error);
            alert('Failed to Save Data. Please Try Again.');
        }
    }

    const handleInputChange = (event) => 
    {
        setInputValue(event.target.value);
    }

    const handleModify = () => 
    {
        setIsModifying(true);
    }

    return (
        <div className="mark-mng-main">
            <span className="mark-mng-header">INPUT VALUES FOR CALCULATION</span>
            <div className="mark-mng-top-container">
                <table className="mark-mng-mark-table">
                    <thead>
                        <tr>
                            <th className='mark-mng-th'>COMPONENT</th>
                            <th className='mark-mng-th'>LOT</th>
                            <th className='mark-mng-th'>MOT</th>
                            <th className='mark-mng-th'>HOT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='mark-mng-td'>CIA 1</td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.cia1.lot}
                                    onChange={e => handleChange(e, 'cia1', 'lot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.cia1.mot}
                                    onChange={e => handleChange(e, 'cia1', 'mot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.cia1.hot}
                                    onChange={e => handleChange(e, 'cia1', 'hot')}
                                    disabled={!isModifying}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='mark-mng-td'>CIA 2</td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.cia2.lot}
                                    onChange={e => handleChange(e, 'cia2', 'lot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.cia2.mot}
                                    onChange={e => handleChange(e, 'cia2', 'mot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.cia2.hot}
                                    onChange={e => handleChange(e, 'cia2', 'hot')}
                                    disabled={!isModifying}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='mark-mng-td'>ASS 1</td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.ass1.lot}
                                    onChange={e => handleChange(e, 'ass1', 'lot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.ass1.mot}
                                    onChange={e => handleChange(e, 'ass1', 'mot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.ass1.hot}
                                    onChange={e => handleChange(e, 'ass1', 'hot')}
                                    disabled={!isModifying}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='mark-mng-td'>ASS 2</td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.ass2.lot}
                                    onChange={e => handleChange(e, 'ass2', 'lot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.ass2.mot}
                                    onChange={e => handleChange(e, 'ass2', 'mot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.ass2.hot}
                                    onChange={e => handleChange(e, 'ass2', 'hot')}
                                    disabled={!isModifying}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='mark-mng-td'>MAX CIA</td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number" value={maxCia.lot}
                                    readOnly
                                    disabled
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={maxCia.mot}
                                    readOnly
                                    disabled
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number" value={maxCia.hot}
                                    readOnly
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className='mark-mng-td'>MAX ESE</td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.maxEse.lot}
                                    onChange={e => handleChange(e, 'maxEse', 'lot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.maxEse.mot}
                                    onChange={e => handleChange(e, 'maxEse', 'mot')}
                                    disabled={!isModifying}
                                />
                            </td>
                            <td className='mark-mng-td'>
                                <input
                                    className='mark-mng-input'
                                    type="number"
                                    value={values.maxEse.hot}
                                    onChange={e => handleChange(e, 'maxEse', 'hot')}
                                    disabled={!isModifying}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="mark-mng-left-wrapper">
                    <table className="mark-mng-mark-wtable" >
                        <thead>
                            <tr>
                                <th className='mark-mng-th'></th>
                                <th className='mark-mng-th'>CIA</th>
                                <th className='mark-mng-th'>ESE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='mark-mng-td'>WEIGHTAGE</td>
                                <td className='mark-mng-td'>
                                    <input
                                        className='mark-mng-input'
                                        type="number"
                                        value={values.cia1.weightage}
                                        onChange={e => handleChange(e, 'cia1', 'weightage')}
                                        disabled={!isModifying}
                                    />
                                </td>
                                <td className='mark-mng-td'>
                                    <input
                                        className='mark-mng-input'
                                        type="number"
                                        value={values.maxEse.weightage}
                                        onChange={e => handleChange(e, 'maxEse', 'weightage')}
                                        disabled={!isModifying}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className='mark-mng-td'>THRESHOLD FOR CO</td>
                                <td className='mark-mng-td' colSpan={2}>
                                    <input
                                        className='mark-mng-input'
                                        type="number"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        disabled={!isModifying}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <table className="mark-mng-ltable">
                    <thead>
                        <tr>
                            <th className="mark-mng-thg" rowSpan={2}>Level</th>
                            <th className="mark-mng-thg" colSpan={2}>UG</th>
                            <th className="mark-mng-thg" colSpan={2}>PG</th>
                        </tr>
                        <tr>
                            <th className="mark-mng-thg">START RANGE</th>
                            <th className="mark-mng-thg">END RANGE</th>
                            <th className="mark-mng-thg">START RANGE</th>
                            <th className="mark-mng-thg">END RANGE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {["level0", "level1", "level2", "level3"].map((level, index) => (
                            <tr key={level}>
                                <td className="mark-mng-td">{`Level ${index}`}</td>
                                <td className="mark-mng-td">
                                    <input
                                        className="mark-mng-input"
                                        type="number"
                                        value={values[level].ugStartRange}
                                        readOnly
                                        disabled
                                    />
                                </td>
                                <td className="mark-mng-td">
                                    <input
                                        className="mark-mng-input"
                                        type="number"
                                        value={values[level].ugEndRange}
                                        onChange={(e) => handleChange(e, level, "ugEndRange")}
                                        disabled={!isModifying}
                                    />
                                </td>
                                <td className="mark-mng-td">
                                    <input
                                        className="mark-mng-input"
                                        type="number"
                                        value={values[level].pgStartRange}
                                        readOnly
                                        disabled
                                    />
                                </td>
                                <td className="mark-mng-td">
                                    <input
                                        className="mark-mng-input"
                                        type="number"
                                        value={values[level].pgEndRange}
                                        onChange={(e) => handleChange(e, level, "pgEndRange")}
                                        disabled={!isModifying}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <div className="mark-mng-level-save-btn">
                    {!isModifying && (
                        <button className="mark-mng-button" onClick={handleModify}>MODIFY</button>
                    )}
                    {isModifying && (<button className="mark-mng-button" onClick={handleSave}>SAVE</button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MarkManage;