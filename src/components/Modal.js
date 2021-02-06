import React from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import classes from './Modal.module.scss';

const Modal = ({
  type,
  size = 'regular',
  title,
  open,
  body,
  action,
  actionDisabled,
  doingAction,
  onClose,
  confirmButtonText,
  hideCancel,
}) => (
  <article className={`modal ${open && 'is-active'}`}>
    <div className="modal-background"></div>
    <div className={classnames('modal-card', classes[`size-${size}`])}>
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
          {!hideCancel && (
            <button
              type="button"
              className="button"
              onClick={onClose}
              disabled={doingAction}
            >
              <Trans>Cancelar</Trans>
            </button>
          )}
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
  hideCancel: false,
};

export default Modal;
