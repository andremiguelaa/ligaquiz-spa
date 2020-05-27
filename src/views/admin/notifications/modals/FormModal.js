import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import marked from 'marked';

import { useStateValue } from 'state/State';
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
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [submitting, setSubmitting] = useState(false);
  const [dates, setDates] = useState(
    notification
      ? [new Date(notification.start_date), new Date(notification.end_date)]
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
              <Trans>Datas</Trans>
            </label>
            <div className="control has-icons-left">
              <DateRangePicker
                value={dates}
                onChange={setDates}
                calendarIcon={null}
                clearIcon={null}
                minDate={new Date()}
                format="yyyy-MM-dd"
                locale={language}
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
                  data.data,
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
              setNotifications(
                [...notifications, data.data].sort(notificationSort)
              );
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
