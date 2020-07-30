import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';
import formatDate from 'utils/formatDate';

import classes from '../Users.module.scss';

const EditPermissionsModal = ({
  userToEdit,
  setUserToEdit,
  users,
  setUsers,
}) => {
  const [patching, setPatching] = useState(false);

  const patchUser = (user) => {
    setPatching(true);
    let newRoles = Object.entries(user.newRoles).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    ApiRequest.patch('users', {
      id: user.id,
      roles: newRoles,
    })
      .then(({ data: { user } }) => {
        setUsers(
          users.map((item) => {
            if (item.id !== user.id) {
              return item;
            } else {
              return user;
            }
          })
        );
        setPatching(false);
        setUserToEdit();
        toast.success(<Trans>Utilizador actualizado com sucesso.</Trans>);
      })
      .catch(() => {
        setPatching(false);
        toast.error(<Trans>Não foi possível actualizar o utilizador.</Trans>);
      });
  };

  return (
    <Modal
      open
      title={
        <Trans>
          Editar permissões de {`${userToEdit.name} ${userToEdit.surname}`}
        </Trans>
      }
      body={
        <div className={classes.editPermissionModalBody}>
          <fieldset className="fieldset">
            <div className="field">
              <input
                id="admin"
                type="checkbox"
                className="switch"
                value="true"
                onClick={(event) => {
                  setUserToEdit({
                    ...userToEdit,
                    newRoles: {
                      ...userToEdit.newRoles,
                      admin: event.target.checked,
                    },
                  });
                }}
                defaultChecked={Boolean(userToEdit.newRoles?.admin)}
              />
              <label htmlFor="admin">
                <Trans>Administrador</Trans>
              </label>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <div className="field">
              <input
                id="regular-player"
                type="checkbox"
                className="switch"
                value="true"
                onClick={(event) => {
                  setUserToEdit({
                    ...userToEdit,
                    newRoles: {
                      ...userToEdit.newRoles,
                      regular_player: event.target.checked
                        ? userToEdit.roles.regular_player ||
                          formatDate(new Date())
                        : event.target.checked,
                    },
                  });
                }}
                defaultChecked={Boolean(userToEdit.roles?.regular_player)}
              />
              <label htmlFor="regular-player">
                <Trans>Jogador regular</Trans>
              </label>
            </div>
            <div className="field">
              <div className="control">
                <label className="label">
                  <Trans>Validade da subscrição</Trans>
                </label>
                <div className="control has-icons-left">
                  <DatePicker
                    disabled={!Boolean(userToEdit.newRoles?.regular_player)}
                    selected={
                      userToEdit.newRoles?.regular_player
                        ? new Date(userToEdit.newRoles?.regular_player)
                        : userToEdit.roles?.regular_player
                        ? new Date(userToEdit.roles?.regular_player)
                        : new Date()
                    }
                    onChange={(value) => {
                      setUserToEdit({
                        ...userToEdit,
                        newRoles: {
                          ...userToEdit.newRoles,
                          regular_player: formatDate(value),
                        },
                      });
                    }}
                    dateFormat="yyyy-MM-dd"
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-calendar" />
                  </span>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <div className="field">
              <input
                id="national-ranking-manager"
                type="checkbox"
                className="switch"
                value="true"
                onClick={(event) => {
                  setUserToEdit({
                    ...userToEdit,
                    newRoles: {
                      ...userToEdit.newRoles,
                      ranking_manager: event.target.checked,
                    },
                  });
                }}
                defaultChecked={Boolean(userToEdit.newRoles?.ranking_manager)}
              />
              <label htmlFor="national-ranking-manager">
                <Trans>Gestor de Ranking Nacional</Trans>
              </label>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <div className="field">
              <input
                id="blocked"
                type="checkbox"
                className="switch"
                value="true"
                onClick={(event) => {
                  setUserToEdit({
                    ...userToEdit,
                    newRoles: {
                      ...userToEdit.newRoles,
                      blocked: event.target.checked,
                    },
                  });
                }}
                defaultChecked={Boolean(userToEdit.newRoles?.blocked)}
              />
              <label htmlFor="blocked">
                <Trans>Bloqueado</Trans>
              </label>
            </div>
          </fieldset>
        </div>
      }
      action={() => {
        patchUser(userToEdit);
      }}
      doingAction={patching}
      onClose={() => setUserToEdit()}
    />
  );
};

export default EditPermissionsModal;
