import React from "react";


interface ConfirmModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="button-group">
                    <button className="confirm-btn" onClick={onConfirm}>확인</button>
                    <button className="cancel-btn" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;