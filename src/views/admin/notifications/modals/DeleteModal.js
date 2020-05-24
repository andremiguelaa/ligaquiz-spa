import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';

const DeleteModal = ({
  notifications,
  setNotifications,
  notificationToDelete,
  setNotificationToDelete,
}) => {
  const [deleting, setDeleting] = useState(false);

  const deleteNotification = (id) => {
    setDeleting(true);
    ApiRequest.delete('notifications', { data: { id } })
      .then(() => {
        setNotifications(notifications.filter((item) => item.id !== id));
        toast.success(<Trans>Notificação apagada com sucesso.</Trans>);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar notificação.</Trans>);
      })
      .then(() => {
        setNotificationToDelete();
        setDeleting(false);
      });
  };

  return (
    <Modal
      type="danger"
      open
      title={<Trans>Apagar notificação</Trans>}
      body={<Trans>Tens a certeza que queres apagar esta notificação?</Trans>}
      action={() => deleteNotification(notificationToDelete)}
      doingAction={deleting}
      onClose={() => setNotificationToDelete()}
    />
  );
};

export default DeleteModal;
