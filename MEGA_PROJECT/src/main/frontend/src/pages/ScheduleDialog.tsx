import React from "react";

interface ModalProps {
  date: Date;
  onClose: () => void;
}

const ScheduleDialog: React.FC<ModalProps> = ({ date, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{date.toDateString()} 일정</h2>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ScheduleDialog;