import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import { covertToLongDate } from 'utils/formatDate';
import renderMedia from 'utils/renderMedia';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import Loading from 'components/Loading';
import Markdown from 'components/Markdown';
import NoMatch from './NoMatch';

import PageHeader from 'components/PageHeader';

import classes from './Quiz/Quiz.module.scss';

const Quiz = () => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();

  const { date } = useParams();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [userAnswers, setUserAnswers] = useState();

  useEffect(() => {
    ApiRequest.get(`quizzes?${date ? `date=${date}` : 'today'}`)
      .then(({ data }) => {
        setData(data);
        ApiRequest.get(`answers?quiz=${data.quiz.id}&submitted=1&mine=true`)
          .then(({ data }) => {
            setUserAnswers(data);
            setLoading(false);
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    if (error === 404) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <PageHeader
        title={
          <Trans>Quiz de {covertToLongDate(data.quiz.date, language)}</Trans>
        }
      />
      <div className="section">
        {data.quiz.questions.map((question, index) => (
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
            {userAnswers?.[question.id]?.[0] && (
              <div>
                <strong>
                  <Trans>Resposta dada</Trans>:
                </strong>{' '}
                {userAnswers[question.id][0].text}
              </div>
            )}
            {question.hasOwnProperty('percentage') && (
              <div>
                <strong>
                  <Trans>Percentagem de acerto</Trans>:
                </strong>{' '}
                {Math.round(question.percentage)}%
              </div>
            )}
            {question.media_id && (
              <div className={classes.media}>
                {renderMedia(
                  data.media[question.media_id].type,
                  data.media[question.media_id].url,
                  index
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Quiz;
