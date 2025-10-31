// DeleteStaffModal.jsx
import React from 'react';

function DeleteStaffModal({
    deletestaff, staffDeleteClose, deletestaffname, deletestaffid, Confirmdelete
}) {
    if (!deletestaff) return null;

    return (
        <div className="modal-overlay">
            <div className="modal modal-sm">
                <div className="modal-header">
                    <h3>Confirm Delete</h3>
                    <button className="modal-close" onClick={staffDeleteClose}>✕</button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to permanently delete the following staff?</p>
                    <p className="del-info">
                        <strong>{deletestaffname}</strong> ({deletestaffid})
                    </p>
                    <div className="modal-actions">
                        <button className="btn btn-danger" onClick={Confirmdelete}>
                            Delete
                        </button>
                        <button className="btn btn-outline" onClick={staffDeleteClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteStaffModal;