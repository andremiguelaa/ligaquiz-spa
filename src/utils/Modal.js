import React from 'react';

export const Modal = ({
  type,
  title,
  open,
  body,
  action,
  doingAction,
  onClose,
}) => (
  <article className={`modal ${open && 'is-active'}`}>
    <div className="modal-background"></div>
    <div className="modal-card">
      <article className={`message ${type ? `is-${type}` : ''}`}>
        <div className="message-header">
          {title}
          <button
            type="button"
            className={`delete ${doingAction ? `is-invisible` : ''}`}
            onClick={onClose}
          ></button>
        </div>{' '}
        <div className="message-body">{body}</div>
        <div className="message-actions">
          <button
            className={`button ${type ? `is-${type}` : ''} ${
              doingAction ? `is-loading` : ''
            }`}
            onClick={action}
          >
            Save changes
          </button>
          <button className="button" onClick={onClose} disabled={doingAction}>
            Cancel
          </button>
        </div>
      </article>
    </div>
  </article>
);

Error.defaultProps = {
  open: false,
  action: () => {},
  doingAction: false,
  onClose: () => {},
};

export default Modal;
