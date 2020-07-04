import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import { individualQuizTypeOptions } from 'views/admin/nationalRanking/utils/options';
import { quizTypeAbbr } from 'views/NationalRanking/consts';

import classes from './Statistics/Statistics.module.scss';

const Statistics = () => {
  const { id: userId } = useParams();
  const [{ user: authUser }] = useStateValue();
  const [user, setUser] = useState();
  const [error, setError] = useState(false);
  const [individualQuizzes, setIndividualQuizzes] = useState();

  useEffect(() => {
    setIndividualQuizzes();
    ApiRequest.get(`users?id=${userId || authUser.id}`)
      .then(({ data }) => {
        setUser(data[0]);
      })
      .catch(() => {
        setError(true);
      });
  }, [userId, authUser]);

  useEffect(() => {
    if (user && user.individual_quiz_player_id) {
      ApiRequest.get(
        `individual-quizzes?results&individual_quiz_player_id[]=${user.individual_quiz_player_id}`
      ).then(({ data }) => {
        setIndividualQuizzes(data);
      });
    }
  }, [user]);

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
              Estatísticas de {user.name} {user.surname}
            </Trans>
          ) : (
            <Trans>As minhas estatísticas</Trans>
          )
        }
      />
      <section className="section content">
        <div className={classes.info}>
          {user.avatar ? (
            <div className={classes.avatarWrapper}>
              <img
                className={classes.avatar}
                src={user.avatar}
                alt={`${user.name} ${user.surname}`}
              />
            </div>
          ) : (
            <i className={classames('fa', 'fa-user', classes.icon)} />
          )}
          {user.email && (
            <div className={classes.emailWrapper}>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
          )}
        </div>
      </section>
      {individualQuizzes && individualQuizzes.length && (
        <section className="section content">
          <h1 className="has-text-weight-bold is-size-4">
            <Trans>Provas individuais</Trans>
          </h1>
          <table className="table">
            <thead>
              <tr>
                <th>
                  <Trans>Prova</Trans>
                </th>
                <th>
                  <Trans>Mês</Trans>
                </th>
                <th>
                  <Trans>Resultado</Trans>
                </th>
                <th>
                  <span className="is-hidden-mobile">
                    <Trans>Pontos</Trans>
                  </span>
                  <span className="is-hidden-tablet">
                    <Trans>Pts</Trans>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {individualQuizzes.map((individualQuiz) => {
                const playerResult = individualQuiz.results.filter(
                  (result) =>
                    result.individual_quiz_player_id ===
                    user.individual_quiz_player_id
                )[0];
                return (
                  <tr
                    key={`${individualQuiz.individual_quiz_type}-${individualQuiz.month}`}
                  >
                    <td>
                      <span className="is-hidden-mobile">
                        {individualQuizTypeOptions(
                          individualQuiz.individual_quiz_type
                        )}
                      </span>
                      <abbr className="is-hidden-tablet">
                        {quizTypeAbbr[individualQuiz.individual_quiz_type].abbr}
                      </abbr>
                    </td>
                    <td>{individualQuiz.month}</td>
                    <td>{playerResult.result}</td>
                    <td>{Math.round(playerResult.score)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};

export default Statistics;
