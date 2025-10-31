import React from 'react';
import '../css/Terminology.css';

function Terminologies() {

    return (
        <div className='termi-main'>
            <h1 className='termi-top-heading'>OBE Terms</h1>
            <div className='termi-a4'>

                <section className='termi-section'>
                    <h2 className='termi-term'>01. Attainment Level Criteria</h2>
                    <ul className='termi-list'>
                        <li><span>Level 0 :</span> Score &lt; 40% for UG and &lt; 50% for PG.</li>
                        <li><span>Level 1 :</span> 40% &le; Score &lt; 60%.</li>
                        <li><span>Level 2 :</span> 60% &le; Score &lt; 75%.</li>
                        <li><span>Level 3 :</span> Score &ge; 75%.</li>
                    </ul>
                </section>

                <section className='termi-section'>
                    <h2 className='termi-term'>02. Attainment Grade Criteria</h2>
                    <ul className='termi-list'>
                        <li><span>Low :</span> Mean overall score correlation &lt; 1.5</li>
                        <li><span>Medium :</span> 1.5 &le; Mean overall score correlation &lt; 2.5</li>
                        <li><span>High :</span> Mean overall score correlation &ge; 2.5</li>
                    </ul>
                </section>

                <section className='termi-section'>
                    <h2 className='termi-term'>03. Student Cognitive Level Attainment (SCLA)</h2>
                    <p className='termi-para'>
                        The attainment level for each student in a course is calculated by analyzing their performance across three cognitive levels:
                        Lower-Order Thinking (LOT), Medium-Order Thinking (MOT), and Higher-Order Thinking (HOT). Each cognitive level is assessed
                        for Continuous Internal Assessment (CIA) and End-Semester Examination (ESE).
                    </p>
                </section>

                <section className='termi-section'>
                    <h2 className='termi-term'>04. Course Outcome (CO)</h2>
                    <p className='termi-para'>
                        Course outcomes define what students should know, understand, or be able to do after completing the course.
                        They are measurable and focused on skills, knowledge, or competencies. Example:
                        <i> “Students will be able to write efficient algorithms to solve complex problems.”</i>
                    </p>
                </section>

                <section className='termi-section'>
                    <h2 className='termi-term'>05. Attainments of Course Outcome</h2>
                    <ul className='termi-list'>
                        <li>
                            <span>Course Cognitive Level Attainment (CCLA) :</span> Measures how well students achieve cognitive-level outcomes (LOT, MOT, HOT) in the course. Input: assessment scores of students.
                        </li>
                        <li>
                            <span>Course Attainment by Programme Specific Outcome (CAPSO) :</span> Evaluates the impact of a course on achieving the program-specific outcome (PSO). Input: Relationship Matrix + cognitive levels from CCLA.
                        </li>
                    </ul>
                </section>

                <section className='termi-section'>
                    <h2 className='termi-term'>06. Programme Specific Outcome (PSO)</h2>
                    <p className='termi-para'>
                        Programme Specific Outcomes define objectives and expected achievements after completing a program. Example for MCA:
                        <i> "Graduates will be equipped to design, develop, and deploy software systems, leveraging contemporary programming languages and frameworks."</i>
                        <br /><br />
                        <span className='termi-span'>Note:</span> Both CO and PSO are well-defined in our syllabus.
                    </p>
                </section>

            </div>
        </div>
    );
}

export default Terminologies;
