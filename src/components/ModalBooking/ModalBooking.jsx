import React, { useRef } from "react";
import "./index.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ModalBooking = ({
  data,
  onClose,
  isOpen,
  nameService,
  staffName,
  slotText,
  date,
}) => {
  console.log(slotText);
  const modalRef = useRef(null);
  const handleModalClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  const history = useNavigate();

  const submitBooking = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/appointment/add",
        data
      );

      toast.success("Appointment successfully!!");
      setTimeout(() => {
        onClose();
        history("/home");
      }, 3000);
    } catch (error) {
      toast.error("Appointment failed");
    }
  };
  return (
    <div
      id="authentication-modal"
      tabIndex={-1}
      aria-hidden={true}
      onClick={handleModalClick}
      className={`modal-container ${isOpen ? "open" : "closed"}`}
    >
      <div ref={modalRef} className="modal-content">
        <div className="custom-container">
          <button
            onClick={onClose}
            type="button"
            className="custom-button"
            data-modal-hide="authentication-modal"
          >
            <svg
              className="custom-svg"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>{" "}
          <div className="modal-content-ty">
            <h2>Confirm Appointment</h2>
            <div>
              <div className="item-content-span">
                <span>Service:</span>
                <strong>{nameService}</strong>
              </div>
              <div className="item-content-span">
                <span>Staff:</span>
                <strong>{staffName}</strong>
              </div>
              <div className="item-content-span">
                <span>Date:</span>
                <strong>{date}</strong>
              </div>
              <div className="item-content-span">
                <span>Time:</span>
                <strong>{slotText}</strong>
              </div>
              <button
                style={{ marginBottom: 20 }}
                onClick={submitBooking}
                className="submit-booking true"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBooking;
