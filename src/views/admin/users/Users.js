import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classames from 'classnames';
import { get } from 'lodash';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
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
  const [order, setOrder] = useState({
    column: 'id',
    direction: 'asc',
  });

  useEffect(() => {
    ApiRequest.get('users')
      .then(({ data }) => {
        setUsers(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  const sortUsersBy = (column) => {
    let newOrder;
    if (order && order.column === column) {
      if (
        (order.column !== 'fullName' && order.direction === 'asc') ||
        (order.column === 'fullName' && order.direction === 'desc')
      ) {
        newOrder = {
          column: 'id',
          direction: 'asc',
        };
      } else {
        newOrder = {
          column,
          direction: order.direction === 'asc' ? 'desc' : 'asc',
        };
      }
    } else {
      newOrder = { column, direction: column === 'fullName' ? 'asc' : 'desc' };
    }
    const sortedUsers = [].concat(users).sort((a, b) => {
      let aValue;
      let bValue;
      if (newOrder.column === 'fullName') {
        aValue = `${a.name} ${a.surname}`;
        bValue = `${b.name} ${b.surname}`;
      } else {
        aValue = get(a, newOrder.column, '');
        bValue = get(b, newOrder.column, '');
      }
      if (newOrder.direction === 'asc') {
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        return aValue - bValue;
      }
      if (typeof aValue === 'string') {
        return bValue.localeCompare(aValue);
      }
      return bValue - aValue;
    });
    setUsers(sortedUsers);
    setOrder(newOrder);
  };

  if (!authUser) {
    return <Error status={401} />;
  }

  if (!authUser.valid_roles.admin) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
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
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th className="sortable">
                      <button
                        type="button"
                        onClick={() => sortUsersBy('fullName')}
                      >
                        <Trans>Nome</Trans>
                        <span className="icon">
                          <i
                            className={classames('fa', {
                              'fa-sort': order.column !== 'fullName',
                              [`fa-sort-alpha-${order.direction}`]:
                                order.column === 'fullName',
                            })}
                          ></i>
                        </span>
                      </button>
                    </th>
                    <th
                      className={classames(
                        classes.permissionsCell,
                        'is-hidden-mobile'
                      )}
                    >
                      <Trans>Permissões</Trans>
                    </th>
                    <th
                      className={classames(
                        'sortable',
                        'is-hidden-touch',
                        classes.subscriptionCell
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => sortUsersBy('roles.regular_player')}
                      >
                        <Trans>Subscrição p/ quizzes da liga</Trans>
                        <span className="icon">
                          <i
                            className={classames('fa', {
                              'fa-sort':
                                order.column !== 'roles.regular_player',
                              [`fa-sort-amount-${order.direction}`]:
                                order.column === 'roles.regular_player',
                            })}
                          ></i>
                        </span>
                      </button>
                    </th>
                    <th
                      className={classames(
                        'sortable',
                        'is-hidden-touch',
                        classes.subscriptionCell
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => sortUsersBy('roles.special_quiz_player')}
                      >
                        <Trans>Subscrição p/ quizzes especiais</Trans>
                        <span className="icon">
                          <i
                            className={classames('fa', {
                              'fa-sort':
                                order.column !== 'roles.special_quiz_player',
                              [`fa-sort-amount-${order.direction}`]:
                                order.column === 'roles.special_quiz_player',
                            })}
                          ></i>
                        </span>
                      </button>
                    </th>
                    <th
                      className={classames(
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
                            <Link
                              to={`/statistics${
                                user.id !== authUser.id ? `/${user.id}` : ''
                              }`}
                            >
                              <div className={classes.avatar}>
                                {user.avatar ? (
                                  <img
                                    alt={`${user.name} ${user.surname}`}
                                    src={user.avatar}
                                  />
                                ) : (
                                  <i className="fa fa-user" />
                                )}
                              </div>
                              <span className={classes.username}>
                                {user.name} {user.surname}
                              </span>
                            </Link>
                          </div>
                        </td>
                        <td
                          className={classames(
                            'is-vertical-middle',
                            'is-hidden-mobile',
                            classes.permissionsCell
                          )}
                        >
                          {user.valid_roles?.admin && (
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
                          {user.valid_roles?.regular_player && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={`${i18n._(t`Jogador regular`)}`}
                                >
                                  <i className="fa fa-user"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                          {user.valid_roles?.special_quiz_player && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={`${i18n._(
                                    t`Jogador de quizzes especiais`
                                  )}`}
                                >
                                  <i className="fa fa-user"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                          {user.valid_roles?.ranking_manager && (
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
                          {user.valid_roles?.quiz_editor && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={i18n._(t`Editor de Quizzes`)}
                                >
                                  <i className="fa fa-question-circle"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                          {user.valid_roles?.special_quiz_editor && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={i18n._(
                                    t`Editor de Quizzes Especiais`
                                  )}
                                >
                                  <i className="fa fa-question-circle-o"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                          {user.valid_roles?.answer_reviewer && (
                            <I18n>
                              {({ i18n }) => (
                                <span
                                  className="icon"
                                  data-tooltip={i18n._(t`Corrector`)}
                                >
                                  <i className="fa fa-check-square-o"></i>
                                </span>
                              )}
                            </I18n>
                          )}
                          {user.valid_roles?.blocked && (
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
                        <td
                          className={classames(
                            classes.subscriptionCell,
                            'is-hidden-touch',
                            'is-vertical-middle'
                          )}
                        >
                          {get(user, 'roles.regular_player', '-')}
                        </td>
                        <td
                          className={classames(
                            classes.subscriptionCell,
                            'is-hidden-touch',
                            'is-vertical-middle'
                          )}
                        >
                          {get(user, 'roles.special_quiz_player', '-')}
                        </td>
                        <td className={classes.actionsCell}>
                          <div className="is-pulled-right">
                            <button
                              className="button"
                              disabled={user.id === authUser.id}
                              type="button"
                              onClick={() => {
                                setUserToEdit({
                                  ...user,
                                  roles: user.roles || {},
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
