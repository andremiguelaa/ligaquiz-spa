import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans, SelectOrdinal } from '@lingui/macro';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import EmptyState from 'components/EmptyState';

const SpecialQuizzes = ({ user, setError }) => {
  const [specialQuizzes, setSpecialQuizzes] = useState();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  useEffect(() => {
    ApiRequest.get(`special-quizzes?past&user=${user.id}`)
      .then(({ data }) => {
        const userQuizzes = data.reduce((acc, item) => {
          if (item.user_rank) {
            acc.push(item);
          }
          return acc;
        }, []);
        setSpecialQuizzes(userQuizzes);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [user.id, setError]);

  if (!specialQuizzes) {
    return <Loading />;
  }

  if (!specialQuizzes || !specialQuizzes.length) {
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
              <Trans>Tema</Trans>
            </th>
            <th>
              <Trans>Classificação</Trans>
            </th>
            <th>
              <Trans>Data</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {specialQuizzes.map((specialQuiz) => (
            <tr key={specialQuiz.id}>
              <td>
                <Link to={`/special-quiz/${specialQuiz.date}`}>
                  {specialQuiz.subject}
                </Link>
              </td>
              <td>
                {specialQuiz.past ? (
                  <>
                    {specialQuiz.user_rank === 1 && (
                      <>
                        <i className="fa fa-trophy" aria-hidden="true"></i>{' '}
                        <Trans>Campeão</Trans>
                      </>
                    )}
                    {specialQuiz.user_rank > 1 && (
                      <SelectOrdinal
                        value={specialQuiz.user_rank}
                        two="2º"
                        few="3º"
                        other="#º"
                      />
                    )}
                  </>
                ) : (
                  '-'
                )}
              </td>
              <td>{convertToLongDate(specialQuiz.date, language)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default SpecialQuizzes;
