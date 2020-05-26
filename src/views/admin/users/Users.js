import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';

import classes from './Users.module.scss';

const Users = () => {
  const [error, setError] = useState(false);
  const [users, setUsers] = useState();

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
                        <td>
                          <div className="buttons has-addons is-pulled-right">
                            <button
                              className="button is-danger"
                              onClick={() => {}}
                            >
                              <span className="icon">
                                <i className="fa fa-ban"></i>
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
    </>
  );
};

export default Users;
