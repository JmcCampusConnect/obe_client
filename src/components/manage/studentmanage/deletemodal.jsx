import axios from 'axios'
import React from 'react'

function DeleteModal({ deleteModal, closeDeleteModal, student }) {

    const apiUrl = import.meta.env.VITE_API_URL;

    const deletestudent = async () => {
        const response = await axios.delete(`${apiUrl}/api/student/delete`, {
            data: { reg_no: student.reg_no }
        })
        if (response.data.message === 'Deleted successfully') {
            alert('Student deleted successfully')
            closeDeleteModal()
        }
        else { alert(response.data.message || 'Error occurred in deleting student') }
    }

    return (
        <>
            {deleteModal && (
                <div className="smst-overlay">
                    <div className="smst-modal">
                        <div className='smsm-close-div'>
                            <button className="smst-close" onClick={closeDeleteModal}>✖</button>
                        </div>
                        <h3>CONFIRM DELETE</h3>
                        <p>Reg No : {student.reg_no}</p>
                        <p>Name : {student.stu_name}</p>
                        <p>Batch : {student.batch}</p>
                        <p>Class : {student.semester} {student.dept_id} {student.section}</p>
                        <div className="smshh-delete-btn-container">
                            <button className="smsm-add-save-btn" onClick={deletestudent}>DELETE</button>
                            <button className="smsm-save-edit-btn" onClick={closeDeleteModal}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DeleteModal