import "./Modal.css";

export const Modal: React.FC<{
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
}> = ({ children, onClose, open }) => {
  return (
    <>
      <div
        id="myModal"
        className="modal"
        style={{ display: open ? "block" : "none" }}
      >
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          {children}
        </div>
      </div>
    </>
  );
};
