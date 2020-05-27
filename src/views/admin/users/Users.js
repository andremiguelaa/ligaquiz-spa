import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { toast } from 'react-toastify';
import DatePicker from 'react-date-picker';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import formatDate from 'utils/formatDate';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import Modal from 'components/Modal';

import classes from './Users.module.scss';

const Users = () => {
  const [error, setError] = useState(false);
  const [users, setUsers] = useState();
  const [
    {
      user: authUser,
      settings: { language },
    },
  ] = useStateValue();
  const [patching, setPatching] = useState(false);
  const [userToEdit, setUserToEdit] = useState();

  useEffect(() => {
    ApiRequest.get('users')
      .then(({ data }) => {
        setUsers(data.data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

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
      .then(
        ({
          data: {
            data: { user },
          },
        }) => {
          setUsers(
            users.map((item) => {
              if (item.id !== user.id) {
                return item;
              } else {
                return user;
              }
            })
          );
          setUserToEdit();
          toast.success(<Trans>Utilizador actualizado com sucesso.</Trans>);
        }
      )
      .catch(() => {
        toast.error(<Trans>Não foi possível actualizar o utilizador.</Trans>);
      })
      .finally(() => {
        setPatching(false);
      });
  };

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <PageHeader title={<Trans>Utilizadores</Trans>} />
      <div className="section content">
        {!users ? (
          <Loading />
        ) : (
          <>
            {users.length ? (
              <table className="table is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>
                      <Trans>Nome</Trans>
                    </th>
                    <th>
                      <Trans>Permissões</Trans>
                    </th>
                    <th className="has-text-right">
                      <Trans>Acções</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    return (
                      <tr key={user.id}>
                        <td className="is-vertical-middle">
                          <div className={classes.userCellContent}>
                            <Link to={`/statistics/${user.id}`}>
                              <div className={classes.avatar}>
                                {user.avatar_url ? (
                                  <img
                                    alt={`${user.name} ${user.surname}`}
                                    src={user.avatar_url}
                                  />
                                ) : (
                                  <i className="fa fa-user" />
                                )}
                              </div>
                              <div className={classes.userName}>
                                {user.name} {user.surname}
                              </div>
                            </Link>
                          </div>
                        </td>
                        <td className="is-vertical-middle">
                          {user.roles?.admin && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={i18n._(t`Administrador`)}
                                >
                                  <i className="fa fa-superpowers"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                          {user.roles?.regular_player &&
                            user.roles?.regular_player >=
                              formatDate(new Date()) && (
                              <I18n>
                                {({ i18n }) => (
                                  <span
                                    className="icon"
                                    data-tooltip={`${i18n._(
                                      t`Jogador regular`
                                    )}: ${formatDate(
                                      new Date(user.roles?.regular_player)
                                    )}`}
                                  >
                                    <i className="fa fa-user"></i>
                                  </span>
                                )}
                              </I18n>
                            )}
                          {user.roles?.ranking_manager && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={i18n._(
                                    t`Gestor de Ranking Nacional`
                                  )}
                                >
                                  <i className="fa fa-trophy"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                          {user.roles?.blocked && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={i18n._(t`Bloqueado`)}
                                >
                                  <i className="fa fa-ban"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                        </td>
                        <td>
                          <div className="is-pulled-right">
                            <button
                              className="button"
                              disabled={patching || user.id === authUser.id}
                              onClick={() => {
                                setUserToEdit({
                                  ...user,
                                  newRoles: user.roles,
                                });
                              }}
                            >
                              <span className="icon">
                                <i className="fa fa-edit"></i>
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
      {userToEdit && (
        <Modal
          open
          title={
            <Trans>
              Editar permissões de {`${userToEdit.name} ${userToEdit.surname}`}
            </Trans>
          }
          body={
            <>
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
                  <label for="admin">
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
                  <label for="regular-player">
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
                        value={
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
                        calendarIcon={null}
                        clearIcon={null}
                        format="yyyy-MM-dd"
                        locale={language}
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
                    defaultChecked={Boolean(
                      userToEdit.newRoles?.ranking_manager
                    )}
                  />
                  <label for="national-ranking-manager">
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
                  <label for="blocked">
                    <Trans>Bloqueado</Trans>
                  </label>
                </div>
              </fieldset>
            </>
          }
          action={() => {
            patchUser(userToEdit);
          }}
          doingAction={patching}
          onClose={() => setUserToEdit()}
        />
      )}
    </>
  );
};

export default Users;
