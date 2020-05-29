import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import WorkInProgress from 'components/WorkInProgress';

import classes from './Statistics/Statistics.module.scss';

const Statistics = () => {
  const { id: userId } = useParams();
  const [{ user: authUser }] = useStateValue();
  const [user, setUser] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    ApiRequest.get(`users?id=${userId || authUser.id}`)
      .then(({ data: { data } }) => {
        setUser(data[0]);
      })
      .catch(() => {
        setError(true);
      });
  }, [userId]);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={
          userId ? (
            <Trans>
              Estatísicas de {user.name} {user.surname}
            </Trans>
          ) : (
            <Trans>As minhas estatísicas</Trans>
          )
        }
      />
      <div className="section content">
        <div className={classes.info}>
          <div className={classes.avatarWrapper}>
            <img
              className={classes.avatar}
              src={user.avatar}
              alt={`${user.name} ${user.surname}`}
            />
          </div>
          {user.email && (
            <div className={classes.emailWrapper}>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
          )}
        </div>
      </div>
      <WorkInProgress>
        <Trans>Em desenvolvimento...</Trans>
      </WorkInProgress>
    </>
  );
};

export default Statistics;
