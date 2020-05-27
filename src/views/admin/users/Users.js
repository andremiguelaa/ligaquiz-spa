import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classNames from 'classnames';
import { toast } from 'react-toastify';

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
  const [{ user: authUser }] = useStateValue();
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
                            <span className="icon">
                              <i className="fa fa-superpowers"></i>
                            </span>
                          )}
                          {user.roles?.regular_player &&
                            user.roles?.regular_player >=
                              formatDate(new Date()) && (
                              <span className="icon">
                                <i className="fa fa-user"></i>
                              </span>
                            )}
                          {user.roles?.ranking_manager && (
                            <span className="icon">
                              <i className="fa fa-trophy"></i>
                            </span>
                          )}
                          {user.roles?.blocked && (
                            <span className="icon">
                              <i className="fa fa-ban"></i>
                            </span>
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
              <div className="field">
                <label className="checkbox">
                  <input
                    type="checkbox"
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
                  &nbsp;
                  <Trans>Administrador</Trans>
                </label>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    defaultChecked={Boolean(userToEdit.roles?.regular_player)}
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
                  />
                  &nbsp;
                  <Trans>Jogador regular</Trans>
                </label>
              </div>
              <div
                className={classNames('field', {
                  'is-hidden': !Boolean(userToEdit.newRoles?.regular_player),
                })}
              >
                <div className="control">
                  <label className="label">
                    <Trans>Validade da subscrição</Trans>
                  </label>
                  <input
                    className="input"
                    type="text"
                    defaultValue={userToEdit.newRoles?.regular_player}
                    onChange={(event) => {
                      setUserToEdit({
                        ...userToEdit,
                        newRoles: {
                          ...userToEdit.newRoles,
                          regular_player: event.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input
                    type="checkbox"
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
                  &nbsp;
                  <Trans>Gestor de Ranking Nacional</Trans>
                </label>
              </div>
              <div className="field">
                <label className="checkbox">
                  <input
                    type="checkbox"
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
                  &nbsp;
                  <Trans>Bloqueado</Trans>
                </label>
              </div>
            </>
          }
          action={() => {
            console.log(userToEdit);
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
