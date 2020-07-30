import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import { covertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import Markdown from 'components/Markdown';
import NoMatch from 'views/NoMatch';
import Answer from './Answer';

import classes from './Quizzes.module.scss';

const Quizzes = () => {
  const { date } = useParams();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState();
  const [answers, setAnswers] = useState();

  useEffect(() => {
    ApiRequest.get(`quizzes?date=${date}&submitted=1`)
      .then(({ data }) => {
        setQuiz(data.quiz);
        ApiRequest.get(`answers?quiz=${data.quiz.id}&submitted=1`)
          .then(({ data }) => {
            setAnswers(data);
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date]);

  if (error) {
    if (error === 404 || error === 400) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!quiz || !answers) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={
          <Trans>
            Corrigir quiz de {covertToLongDate(quiz.date, language)}
          </Trans>
        }
      />
      <div className="section">
        {quiz.questions.map((question) => (
          <div key={question.id} className={classes.question}>
            {question.content && (
              <div className={classes.questionText}>
                <Markdown content={question.content} />
              </div>
            )}
            {question.answer && (
              <div>
                <strong>
                  <Trans>Resposta correcta</Trans>:
                </strong>{' '}
                {question.answer}
              </div>
            )}
            {answers[question.id] && (
              <table
                className={classnames(
                  'table is-fullwidth',
                  classes.answersTable
                )}
              >
                <thead>
                  <tr>
                    <th>
                      <Trans>Resposta dada</Trans>
                    </th>
                    <th colSpan="2">
                      <Trans>Correcção</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {answers[question.id].map((answer) => (
                    <Answer key={answer.id} answer={answer} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Quizzes;
