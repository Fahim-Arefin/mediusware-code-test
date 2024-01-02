import React from "react";

const DetailsModal = ({ showModal, handleClose, modalData }) => {
  const modalStyle = {
    display: showModal ? "block" : "none",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
  };

  const contentStyle = {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
  };

  return (
    <div
      className={`modal ${showModal ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={modalStyle}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={contentStyle}>
          <div className="modal-header">
            <h5 className="modal-title">{modalData?.country?.name}</h5>
            <button
              type="button"
              className="close"
              onClick={handleClose}
              aria-label="Close"
              style={{
                borderRadius: "4px",
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{modalData?.phone}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn rounded-1"
              onClick={handleClose}
              style={{ border: "1px solid #46139f" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
