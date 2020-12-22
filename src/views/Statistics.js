import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';

import League from './Statistics/League';
import SpecialQuizzes from './Statistics/SpecialQuizzes';
import IndividualQuizzes from './Statistics/IndividualQuizzes';
import Logs from './Statistics/Logs';

const logsDays = 2;

const Statistics = () => {
  const { id: userId, tab } = useParams();
  const [{ user: authUser }] = useStateValue();
  const [error, setError] = useState(false);
  const [user, setUser] = useState();

  const userStatisticsId = parseInt(userId || authUser?.id);

  useEffect(() => {
    if (!user || user?.id !== userStatisticsId) {
      setUser();
      ApiRequest.get(`users?id[]=${userStatisticsId}&statistics=true`)
        .then(({ data }) => {
          setUser(data[0]);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [user, userStatisticsId]);

  if (!authUser) {
    return <Error status={401} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={
          userStatisticsId && userStatisticsId !== authUser.id ? (
            <Trans>
              Estatísticas de {user.name} {user.surname}
            </Trans>
          ) : (
            <Trans>As minhas estatísticas</Trans>
          )
        }
      />
      <div className="section">
        <div className="tabs is-fullwidth">
          <ul>
            <li
              className={classnames({
                'is-active': !tab || tab === 'league',
              })}
            >
              <Link to={`/statistics/${userStatisticsId}/league`}>
                {process.env.REACT_APP_NAME}
              </Link>
            </li>
            <li
              className={classnames({
                'is-active': tab === 'special-quizzes',
              })}
            >
              <Link to={`/statistics/${userStatisticsId}/special-quizzes`}>
                <Trans>Quizzes especiais</Trans>
              </Link>
            </li>
            {process.env.REACT_APP_NATIONAL_RANKING === 'true' && (
              <li
                className={classnames({
                  'is-active': tab === 'individual-quizzes',
                })}
              >
                <Link to={`/statistics/${userStatisticsId}/individual-quizzes`}>
                  <Trans>Provas individuais</Trans>
                </Link>
              </li>
            )}
            {authUser?.valid_roles.admin && (
              <li
                className={classnames({
                  'is-active': tab === 'logs',
                })}
              >
                <Link to={`/statistics/${userStatisticsId}/logs`}>
                  <Trans>Registo de acções (últimos {logsDays} dias)</Trans>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      {(!tab || tab === 'league') && <League user={user} setError={setError} />}
      {tab === 'special-quizzes' && (
        <SpecialQuizzes user={user} setError={setError} />
      )}
      {tab === 'individual-quizzes' &&
        process.env.REACT_APP_NATIONAL_RANKING === 'true' && (
          <IndividualQuizzes user={user} setError={setError} />
        )}
      {tab === 'logs' && authUser?.valid_roles.admin && (
        <Logs logsDays={logsDays} setError={setError} />
      )}
    </>
  );
};

export default Statistics;
