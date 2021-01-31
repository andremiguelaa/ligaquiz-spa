import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans, SelectOrdinal } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import EmptyState from 'components/EmptyState';

import classes from './SpecialQuizzes.module.scss';

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
      <div className="table-container">
        <table className="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>
                <Trans>Título</Trans>
              </th>
              <th>
                <span className="is-hidden-mobile">
                  <Trans>Classificação</Trans>
                </span>
                <span className="is-hidden-tablet">#</span>
              </th>
              <th className="is-hidden-mobile">
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
                          <i className="fa fa-trophy" aria-hidden="true"></i>
                          <span className="is-hidden-mobile">
                            {' '}
                            <Trans>Campeão</Trans>
                          </span>
                        </>
                      )}
                      {specialQuiz.user_rank > 1 && (
                        <SelectOrdinal
                          value={specialQuiz.user_rank}
                          one="1º"
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
                <td className={classnames(classes.date, 'is-hidden-mobile')}>
                  {convertToLongDate(specialQuiz.date, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SpecialQuizzes;
