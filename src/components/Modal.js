import React from 'react';
import { Trans } from '@lingui/macro';

import classes from './Modal.module.scss';

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
        <div className={`message-body ${classes.modalBody}`}>{body}</div>
        <div className="message-actions">
          <button
            type="button"
            className={`button ${type ? `is-${type}` : ''} ${
              doingAction ? `is-loading` : ''
            }`}
            onClick={action}
          >
            <Trans>OK</Trans>
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
  doingAction: false,
  onClose: () => {},
};

export default Modal;