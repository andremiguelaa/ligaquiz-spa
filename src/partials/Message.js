import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { toast } from 'react-toastify';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';

import classes from './Message.module.scss';

const Message = () => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();

  const [modal, setModal] = useState(false);
  const [content, setContent] = useState();
  const [submitting, setSubmitting] = useState(false);

  const sendMessage = (content) => {
    setSubmitting(true);
    ApiRequest.post('messages', { language, message: content })
      .then(() => {
        toast.success(<Trans>Mensagem enviada com sucesso.</Trans>);
        setModal(false);
        setContent();
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível enviar a mensagem.</Trans>);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!user) {
    return null;
  }

  return (
    <I18n>
      {({ i18n }) => (
        <>
          <button
            className={classnames(
              'button',
              'is-large',
              'is-info',
              classes.button
            )}
            onClick={() => setModal(true)}
            aria-label={i18n._(t`Enviar mensagem`)}
          >
            <span className="icon">
              <i className="fa fa-envelope-o"></i>
            </span>
          </button>
          {modal && (
            <Modal
              type="info"
              open
              title={<Trans>Enviar sugestão/reclamação</Trans>}
              body={
                <div className="field">
                  <label className="label">
                    <Trans>Mensagem</Trans>
                  </label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      defaultValue={content}
                      onChange={(event) => {
                        setContent(event.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
              }
              doingAction={submitting}
              action={() => sendMessage(content)}
              onClose={() => setModal(false)}
              confirmButtonText={<Trans>Enviar</Trans>}
            />
          )}
        </>
      )}
    </I18n>
  );
};

export default Message;
