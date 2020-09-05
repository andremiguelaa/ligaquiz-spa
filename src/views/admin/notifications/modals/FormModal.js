import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import marked from 'marked';

import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';
import {
  notificationTypes,
  notificationTypesTranslations,
} from '../utils/notificationTypes';
import notificationSort from '../utils/notificationSort';
import formatDate from 'utils/formatDate';

marked.setOptions({
  gfm: true,
  breaks: true,
});

const FormModal = ({
  notification,
  notifications,
  setNotifications,
  closeModal,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [dates, setDates] = useState(
    notification
      ? [
          new Date(notification.start_date.replace(/ /g, 'T')),
          new Date(notification.end_date.replace(/ /g, 'T')),
        ]
      : [new Date(), new Date()]
  );
  const [content, setContent] = useState(
    notification ? notification.content : undefined
  );
  const [type, setType] = useState(
    notification ? notification.type : notificationTypes[0]
  );

  return (
    <Modal
      type="info"
      actionDisabled={!content}
      open
      title={
        notification ? (
          <Trans>Editar notificação</Trans>
        ) : (
          <Trans>Criar notificação</Trans>
        )
      }
      body={
        <>
          <div className="field">
            <label className="label">
              <Trans>Início</Trans>
            </label>
            <div className="control has-icons-left">
              <DatePicker
                selected={dates[0]}
                onChange={(date) => {
                  setDates((prev) => {
                    if (date > prev[1]) {
                      return [date, date];
                    }
                    return [date, prev[1]];
                  });
                }}
                selectsStart
                startDate={dates[0]}
                endDate={dates[1]}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
              />
              <span className="icon is-small is-left">
                <i className="fa fa-calendar" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">
              <Trans>Fim</Trans>
            </label>
            <div className="control has-icons-left">
              <DatePicker
                selected={dates[1]}
                onChange={(date) => {
                  setDates((prev) => [prev[0], date]);
                }}
                selectsEnd
                startDate={dates[0]}
                endDate={dates[1]}
                minDate={dates[0]}
                dateFormat="yyyy-MM-dd"
              />
              <span className="icon is-small is-left">
                <i className="fa fa-calendar" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">
              <Trans>Tipo de notificação</Trans>
            </label>
            <div className="control has-icons-left">
              <div className="select">
                <select
                  defaultValue={type}
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                >
                  {notificationTypes.map((notificationType) =>
                    notificationTypesTranslations(
                      notificationType,
                      <option value={notificationType} />
                    )
                  )}
                </select>
              </div>
              <div className="icon is-small is-left">
                <i className="fa fa-bell"></i>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">
              <Trans>Conteúdo</Trans>
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
          {content && (
            <div
              className={`notification is-${type}`}
              dangerouslySetInnerHTML={{ __html: marked(content) }}
            ></div>
          )}
        </>
      }
      action={() => {
        setSubmitting(true);
        if (notification) {
          ApiRequest.patch('notifications', {
            id: notification.id,
            content,
            type,
            start_date: `${formatDate(dates[0])} 00:00:00`,
            end_date: `${formatDate(dates[1])} 23:59:59`,
          })
            .then(({ data }) => {
              setNotifications(
                [
                  ...notifications.filter(
                    (item) => item.id !== notification.id
                  ),
                  data,
                ].sort(notificationSort)
              );
              toast.success(<Trans>Notificação editada com sucesso.</Trans>);
              closeModal();
            })
            .catch(() => {
              toast.error(
                <Trans>Não foi possível editar a notificação.</Trans>
              );
              setSubmitting(false);
            });
        } else {
          ApiRequest.post('notifications', {
            content,
            type,
            start_date: `${formatDate(dates[0])} 00:00:00`,
            end_date: `${formatDate(dates[1])} 23:59:59`,
          })
            .then(({ data }) => {
              setNotifications([...notifications, data].sort(notificationSort));
              toast.success(<Trans>Notificação criada com sucesso.</Trans>);
              closeModal();
            })
            .catch(() => {
              toast.error(<Trans>Não foi possível criar a notificação.</Trans>);
              setSubmitting(false);
            });
        }
      }}
      doingAction={submitting}
      onClose={() => closeModal()}
    />
  );
};

export default FormModal;
