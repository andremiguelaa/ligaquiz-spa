import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';

import Statistics from './Profile/Statistics';
import League from './Profile/League';
import SpecialQuizzes from './Profile/SpecialQuizzes';
import IndividualQuizzes from './Profile/IndividualQuizzes';
import Logs from './Profile/Logs';

const logsDays = 2;

const Profile = () => {
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
              Perfil de {user.name} {user.surname}
            </Trans>
          ) : (
            <Trans>O meu perfil</Trans>
          )
        }
      />
      <div className="section">
        <div className="tabs is-fullwidth">
          <ul>
            <li
              className={classnames({
                'is-active': !tab || tab === 'statistics',
              })}
            >
              <Link to={`/profile/${userStatisticsId}/statistics`}>
                <Trans>Estatísticas</Trans>
              </Link>
            </li>
            <li
              className={classnames({
                'is-active': tab === 'league',
              })}
            >
              <Link to={`/profile/${userStatisticsId}/league`}>
                {process.env.REACT_APP_NAME}
              </Link>
            </li>
            <li
              className={classnames({
                'is-active': tab === 'special-quizzes',
              })}
            >
              <Link to={`/profile/${userStatisticsId}/special-quizzes`}>
                <Trans>Quizzes especiais</Trans>
              </Link>
            </li>
            {process.env.REACT_APP_NATIONAL_RANKING === 'true' && (
              <li
                className={classnames({
                  'is-active': tab === 'individual-quizzes',
                })}
              >
                <Link to={`/profile/${userStatisticsId}/individual-quizzes`}>
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
                <Link to={`/profile/${userStatisticsId}/logs`}>
                  <Trans>Registo de acções (últimos {logsDays} dias)</Trans>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      {(!tab || tab === 'statistics') && (
        <Statistics user={user} setError={setError} />
      )}
      {tab === 'league' && <League user={user} setError={setError} />}
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

export default Profile;
