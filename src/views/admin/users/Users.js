import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classames from 'classnames';
import { get } from 'lodash';

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
  const [order, setOrder] = useState({
    column: 'id',
    direction: 'asc',
  });

  useEffect(() => {
    ApiRequest.get('users')
      .then(({ data }) => {
        setUsers(data);
      })
      .catch(() => {
        setError(true);
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
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th className="sortable">
                      <button onClick={() => sortUsersBy('fullName')}>
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
                        classes.subscriptionCell
                      )}
                    >
                      <button
                        onClick={() => sortUsersBy('roles.regular_player')}
                      >
                        <Trans>Subscrição</Trans>
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
                          className={classames(
                            'is-vertical-middle',
                            'is-hidden-mobile',
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
                            user.roles?.regular_player.localeCompare(
                              formatDate(new Date())
                            ) > 0 && (
                              <I18n>
                                {({ i18n }) => (
                                  <span
                                    className="icon"
                                    data-tooltip={`${i18n._(
                                      t`Jogador regular`
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
                          {user.roles?.quiz_editor && (
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
                          {user.roles?.special_quiz_editor && (
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
                          {user.roles?.answer_reviewer && (
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
                        <td
                          className={classames(
                            classes.subscriptionCell,
                            'is-vertical-middle'
                          )}
                        >
                          {get(user, 'roles.regular_player', '-')}
                        </td>
                        <td className={classes.actionsCell}>
                          <div className="is-pulled-right">
                            <button
                              className="button"
                              disabled={user.id === authUser.id}
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
