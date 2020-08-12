import React from 'react';
import { Trans } from '@lingui/macro';

import classes from './Modal.module.scss';

const Modal = ({
  type,
  title,
  open,
  body,
  action,
  actionDisabled,
  doingAction,
  onClose,
  confirmButtonText,
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
            disabled={doingAction}
          ></button>
        </div>{' '}
        <div className={`message-body ${classes.modalBody}`}>{body}</div>
        <div className="message-actions">
          <button
            type="button"
            className={`button ${type ? `is-${type}` : ''} ${
              doingAction ? `is-loading` : ''
            }`}
            onClick={action}
            disabled={actionDisabled}
          >
            {confirmButtonText ? confirmButtonText : <Trans>OK</Trans>}
          </button>
          <button
            type="button"
            className="button"
            onClick={onClose}
            disabled={doingAction}
          >
            <Trans>Cancelar</Trans>
          </button>
        </div>
      </article>
    </div>
  </article>
);

Error.defaultProps = {
  open: false,
  action: () => {},
  actionDisabled: false,
  doingAction: false,
  onClose: () => {},
};

export default Modal;
