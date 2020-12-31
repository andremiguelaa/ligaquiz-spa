import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import EmptyState from 'components/EmptyState';
import { individualQuizTypeOptions } from 'views/admin/nationalRanking/utils/options';
import { quizTypeAbbr } from 'views/NationalRanking/consts';

const IndividualQuizzes = ({ user, setError }) => {
  const [individualQuizzes, setIndividualQuizzes] = useState();

  useEffect(() => {
    if (
      process.env.REACT_APP_NATIONAL_RANKING === 'true' &&
      user &&
      user.individual_quiz_player_id
    ) {
      setIndividualQuizzes();
      ApiRequest.get(
        `individual-quizzes?results&individual_quiz_player_id[]=${user.individual_quiz_player_id}`
      )
        .then(({ data }) => {
          setIndividualQuizzes(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [user, setError]);

  if (!individualQuizzes && user.individual_quiz_player_id) {
    return <Loading />;
  }

  if (!individualQuizzes || !individualQuizzes.length) {
    return (
      <EmptyState>
        <Trans>Sem registos</Trans>
      </EmptyState>
    );
  }

  return (
    <section className="section content">
      <table className="table is-fullwidth is-hoverable">
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
                <th>
                  <span className="is-hidden-mobile">
                    {individualQuizTypeOptions(
                      individualQuiz.individual_quiz_type
                    )}
                  </span>
                  <abbr className="is-hidden-tablet">
                    {quizTypeAbbr[individualQuiz.individual_quiz_type].abbr}
                  </abbr>
                </th>
                <td>{individualQuiz.month}</td>
                <td>{playerResult.result}</td>
                <td>{Math.round(playerResult.score)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default IndividualQuizzes;
