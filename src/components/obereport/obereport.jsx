import React, { useState } from 'react';
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import jmclogo from "../../assets/jmclogo.png";
import './obereport.css';

function Obereport() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeTab, setActiveTab] = useState('DeptReport');
    const [attainmentSpecData, setAttainmentSpecData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleTab = (tabName) => { setActiveTab(tabName); };

    const handleViewReport = async () => {
        if (activeTab === 'DeptReport') {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/api/specReport`);
                setAttainmentSpecData(response.data);
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally { setLoading(false) }
        }
    }

    const downloadpdf = async () => {
        console.log('Triggered')
		const allDeptSections = document.querySelectorAll(".rep-a4");
		const deptIds = Object.keys(attainmentSpecData);
		const toBase64 = (url) =>
			fetch(url).then((res) => res.blob()).then(
				(blob) =>
					new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onloadend = () => resolve(reader.result);
						reader.onerror = reject;
						reader.readAsDataURL(blob);
					}))

		const logoBase64 = await toBase64(jmclogo);

		const cloneAndFixLogo = (node, isSecond = false) => {
			const cloned = node.cloneNode(true);
			const header = cloned.querySelector(".rep-top");
			if (header) header.innerHTML = "";
			const logoContainer = document.createElement("div");
			logoContainer.style.cssText = ` display: flex;
      			align-items: center; width: 100%;
      			justify-content: center; gap: 20px;
                margin-top:40px;
      			margin-bottom: 20px; padding-bottom: 0; `;

			const logo = document.createElement("img");
			logo.src = logoBase64;
			logo.style.cssText = "width: 80px; height: auto;";

			const textContainer = document.createElement("div");
			textContainer.style.cssText = `
				text-align: center;
				line-height: 1.6; `;
			textContainer.innerHTML = `
				<p style="margin: 0; font-size: 20px; font-weight: bold;">JAMAL MOHAMED COLLEGE (Autonomous)</p>
				<p style="margin: 0; font-size: 18px;">TIRUCHIRAPPALLI - 620 020.</p>
				<p style="margin: 0; font-size: 18px;">OFFICE OF THE CONTROLLER OF EXAMINATIONS</p> `;

			logoContainer.appendChild(logo);
			logoContainer.appendChild(textContainer);
			cloned.style.marginTop = isSecond ? "40px" : "0px";
			cloned.style.paddingTop = "0px";
			cloned.insertBefore(logoContainer, cloned.firstChild);
			return cloned;
		};

		for (let i = 0; i < allDeptSections.length; i += 2) {
			const page1 = cloneAndFixLogo(allDeptSections[i]);
			const page2 = allDeptSections[i + 1]
				? cloneAndFixLogo(allDeptSections[i + 1], true) : null;

			const makeCanvas = async (element) => {
				const container = document.createElement("div");
				container.style.cssText = `
					width: 800px; padding:0; margin: 0;
                    background: white; position: fixed; 
                    left: -9999px; box-sizing: border-box;`
				container.appendChild(element);
				document.body.appendChild(container);
				const canvas = await html2canvas(container, { scale: 2, useCORS: true });
				document.body.removeChild(container);
				return canvas;
			};

			const canvas1 = await makeCanvas(page1);
			const canvas2 = page2 ? await makeCanvas(page2) : null;

			const pdf = new jsPDF("p", "mm", "a4");
			const pageWidth = 210;
			const pageHeight = 297;

			const imgData1 = canvas1.toDataURL("image/png");
			const imgProps1 = {
				width: pageWidth,
				height: (canvas1.height * pageWidth) / canvas1.width,
			};

			pdf.addImage(imgData1, "PNG", 0, 0, imgProps1.width, imgProps1.height);

			if (canvas2) {

				const imgData2 = canvas2.toDataURL("image/png");
				const imgHeight2 = (canvas2.height * pageWidth) / canvas2.width;
				const onePageHeightPx = (canvas2.width * pageHeight) / pageWidth;

				let position = 0;

				while (position < canvas2.height) {

					const canvasSlice = document.createElement("canvas");
					const context = canvasSlice.getContext("2d");
					const sliceHeight = Math.min(onePageHeightPx, canvas2.height - position);

					canvasSlice.width = canvas2.width; canvasSlice.height = sliceHeight;

					context.drawImage(canvas2, 0, position, canvas2.width,
						sliceHeight, 0, 0, canvas2.width, sliceHeight
					);

					const sliceData = canvasSlice.toDataURL("image/png");
					pdf.addPage();
					pdf.addImage(sliceData, "PNG", 0, 0, pageWidth,
						(sliceHeight * pageWidth) / canvas2.width
					);

					position += sliceHeight;
				}
			}
			const deptId = deptIds[i / 2];
			pdf.save(`${deptId}.pdf`);
		}
	}

    return (
        <div className='rep-div-main'>
            <div className='spec-btn-container'>
                <button
                    onClick={() => handleTab('DeptReport')}
                    className={activeTab === 'DeptReport' ? 'spec-btn-active' : 'spec-btn-inactive'}
                >
                    Department Report
                </button>
                <button
                    onClick={() => handleTab('GraduateReport')}
                    className={activeTab === 'GraduateReport' ? 'spec-btn-active' : 'spec-btn-inactive'}
                >
                    Graduate Report
                </button>
            </div>
            <div className='rep-view-div'>
                {Object.keys(attainmentSpecData).length > 0 && (
                    <button
                        className="rep-view-btn-download"
                        onClick={downloadpdf}
                    >
                        <span>Download Report</span>
                    </button>
                )}
                {Object.keys(attainmentSpecData).length === 0 && !loading && (
                    <button
                        className="rep-view-btn"
                        onClick={handleViewReport}
                    >
                        <span>View Report</span>
                    </button>
                )}
            </div>
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p>Loading Report...</p>
                </div>
            ) : Object.keys(attainmentSpecData).length === 0 ? (
                <p className="rep-no-content">No Data Available. Please refine your Search.</p>
            ) : (
                <div className="rep-main">
                    {
                        Object.entries(attainmentSpecData).map(([deptId, deptData]) => (
                            <React.Fragment key={deptId}>
                                <div className="rep-a4">
                                    <div className="rep-top">
                                        <div>
                                            <img src={jmclogo} alt="LOGO" className="rep-logo" />
                                        </div>
                                        <div className="rep-clg">
                                            <p className="rep-p1">JAMAL MOHAMED COLLEGE (Autonomous)</p>
                                            <p className="rep-p2">TIRUCHIRAPPALLI - 620 020.</p>
                                            <p className="rep-p3">OFFICE OF THE CONTROLLER OF EXAMINATIONS.</p>
                                        </div>
                                    </div>
                                    <h4 className="rep-procedure">Steps to Calculate the Attainment of Programme Specific Outcome</h4>
                                    <ol className="rep-olist">
                                        <li className="rep-list">The CIA and ESE marks are normalized to a common scale value of 100.</li>
                                        <li className="rep-list">Weightage of 40% to CIA and 60% to ESE.</li>
                                        <li className="rep-list">OBE score is derived and used to assign a scale value (1–4) and level (Low to Excellent).</li>
                                        <li className="rep-list">Mean of OBE scale for all students gives course attainment (Table 2).</li>
                                        <li className="rep-list">Mean of all course values gives program level attainment (Table 3).</li>
                                    </ol>
                                    <h4 className="rep-procedure-table">Table 1: PG Student Outcome Assessment Scale</h4>
                                    <table className="rep-table">
                                        <thead>
                                            <tr><th>Weightage Obtained</th><th>Scale Used</th><th>Level</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>0 - 50</td><td>1</td><td>Low</td></tr>
                                            <tr><td>51 - 80</td><td>2</td><td>Moderate</td></tr>
                                            <tr><td>81 - 100</td><td>3</td><td>High</td></tr>
                                        </tbody>
                                    </table>
                                    <h4 className="rep-procedure-table">Table 2: Course Outcome Assessment Scale</h4>
                                    <table className="rep-table">
                                        <thead>
                                            <tr><th>Scale Used</th><th>Level</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>0 - 1.0</td><td>Low</td></tr>
                                            <tr><td>1.1 - 2.0</td><td>Moderate</td></tr>
                                            <tr><td>2.1 - 3.0</td><td>High</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="rep-a4">
                                    <div className="rep-top">
                                        <div>
                                            <img src={jmclogo} alt="LOGO" className="rep-logo" />
                                        </div>
                                        <div className="rep-clg">
                                            <p className="rep-p1">JAMAL MOHAMED COLLEGE (Autonomous)</p>
                                            <p className="rep-p2">TIRUCHIRAPPALLI - 620 020.</p>
                                            <p className="rep-p3">OFFICE OF THE CONTROLLER OF EXAMINATIONS.</p>
                                        </div>
                                    </div>
                                    <p className="rep-title">Attainment of Course Outcome</p>
                                    <div className="rep-info">
                                        <p><strong>Programme :</strong> {deptId}</p>
                                        <p><strong>Period of Study :</strong> </p>
                                    </div>
                                    {deptData?.overall ? (
                                        <table className="rep-table">
                                            <thead>
                                                <tr>
                                                    <th>S No</th>
                                                    <th>Course Code</th>
                                                    <th>OBE Level</th>
                                                    <th>Course Outcome</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(deptData.overall).map((courseCode, idx) => (
                                                    <tr key={courseCode}>
                                                        <td>{idx + 1}</td>
                                                        <td>{courseCode}</td>
                                                        <td>{deptData.avgOverallScore[courseCode]?.toFixed(2)}</td>
                                                        <td>{deptData.grade[courseCode]}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan={3}><strong>Program Specific Outcome (PSO)</strong></td>
                                                    <td>{deptData.meanScores?.pso?.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="rep-no-content">No Data Available for this department.</p>
                                    )}
                                    <h3 className="rep-coe">Controller of Examinations</h3>
                                </div>
                            </React.Fragment>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default Obereport;
