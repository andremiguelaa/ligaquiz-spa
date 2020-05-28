import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classNames from 'classnames';

import { useStateValue } from 'state/State';
import getAcronym from 'utils/getAcronym';
import ApiRequest from 'utils/ApiRequest';
import formatDate from 'utils/formatDate';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import EditPermissionsModal from './modals/EditPermissionsModal';

import classes from './Users.module.scss';

const Users = () => {
  const [error, setError] = useState(false);
  const [users, setUsers] = useState();
  const [{ user: authUser }] = useStateValue();
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
                    <th className={classes.permissionsCell}>
                      <Trans>Permissões</Trans>
                    </th>
                    <th
                      className={classNames(
                        'has-text-right',
                        classes.actionsCell
                      )}
                    >
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
                              <span className="is-hidden-mobile">
                                {user.name} {user.surname}
                              </span>
                              <abbr
                                data-tooltip={`${user.name} ${user.surname}`}
                                className="is-hidden-tablet has-tooltip-right"
                              >
                                {getAcronym(user.name)}
                                {getAcronym(user.surname)}
                              </abbr>
                            </Link>
                          </div>
                        </td>
                        <td
                          className={classNames(
                            'is-vertical-middle',
                            classes.permissionsCell
                          )}
                        >
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
                        <td className={classes.actionsCell}>
                          <div className="is-pulled-right">
                            <button
                              className="button"
                              disabled={user.id === authUser.id}
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
        <EditPermissionsModal
          userToEdit={userToEdit}
          setUserToEdit={setUserToEdit}
          users={users}
          setUsers={setUsers}
        />
      )}
    </>
  );
};

export default Users;
