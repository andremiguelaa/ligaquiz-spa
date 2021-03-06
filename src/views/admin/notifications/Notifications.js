import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';

import FormModal from './modals/FormModal';
import DeleteModal from './modals/DeleteModal';
import { notificationTypesTranslations } from './utils/notificationTypes';
import notificationSort from './utils/notificationSort';

const Notifications = () => {
  const [{ user }] = useStateValue();
  const [error, setError] = useState(false);
  const [notifications, setNotifications] = useState();
  const [notificationToEdit, setNotificationToEdit] = useState();
  const [notificationToDelete, setNotificationToDelete] = useState();
  const [createModal, setCreateModal] = useState(false);

  useEffect(() => {
    ApiRequest.get('notifications')
      .then(({ data }) => {
        setNotifications(data.manual.sort(notificationSort));
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  if (!user) {
    return <Error status={401} />;
  }

  if (!user.valid_roles.admin) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  return (
    <>
      <PageHeader title={<Trans>Notificações</Trans>} />
      <div className="section content">
        {!notifications ? (
          <Loading />
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setCreateModal(true);
              }}
              className="button is-primary"
            >
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Criar notificação</Trans>
              </span>
            </button>
            <br />
            <br />
            {notifications.length ? (
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>
                      <Trans>Notificação</Trans>
                    </th>
                    <th className="is-hidden-mobile">
                      <Trans>Data de início</Trans>
                    </th>
                    <th className="is-hidden-mobile">
                      <Trans>Data de fim</Trans>
                    </th>
                    <th className="is-hidden-mobile">
                      <Trans>Tipo</Trans>
                    </th>
                    <th className="has-text-right">
                      <Trans>Acções</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => {
                    return (
                      <tr key={notification.id}>
                        <td className="is-vertical-middle is-nowrap">
                          {`${notification.content.slice(0, 10)}${
                            notification.content.length > 10 ? '...' : ''
                          }`}
                        </td>
                        <td className="is-vertical-middle is-nowrap is-hidden-mobile">
                          {notification.start_date.slice(0, 10)}
                        </td>
                        <td className="is-vertical-middle is-nowrap is-hidden-mobile">
                          {notification.end_date.slice(0, 10)}
                        </td>
                        <td className="is-vertical-middle is-nowrap is-hidden-mobile">
                          {notificationTypesTranslations(notification.type)}
                        </td>
                        <td>
                          <div className="buttons has-addons is-pulled-right">
                            <button
                              className="button"
                              type="button"
                              onClick={() =>
                                setNotificationToEdit(notification)
                              }
                            >
                              <span className="icon">
                                <i className="fa fa-edit"></i>
                              </span>
                            </button>
                            <button
                              className="button is-danger"
                              type="button"
                              onClick={() =>
                                setNotificationToDelete(notification.id)
                              }
                            >
                              <span className="icon">
                                <i className="fa fa-trash"></i>
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <EmptyState>
                <Trans>Sem registos</Trans>
              </EmptyState>
            )}
          </>
        )}
      </div>
      {createModal && (
        <FormModal
          notifications={notifications}
          setNotifications={setNotifications}
          closeModal={() => setCreateModal(false)}
        />
      )}
      {notificationToEdit && (
        <FormModal
          notification={notificationToEdit}
          notifications={notifications}
          setNotifications={setNotifications}
          closeModal={() => setNotificationToEdit()}
        />
      )}
      {notificationToDelete && (
        <DeleteModal
          notifications={notifications}
          setNotifications={setNotifications}
          notificationToDelete={notificationToDelete}
          setNotificationToDelete={setNotificationToDelete}
        />
      )}
    </>
  );
};

export default Notifications;
