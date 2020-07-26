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

  useEffect(() => {
    ApiRequest.get(`quizzes?${date ? `date=${date}` : 'today'}`)
      .then(({ data }) => {
        setData(data);
        setLoading(false);
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
            <div className={classes.questionText}>
              <Markdown content={question.content} />
            </div>
            <div>
              <strong>Resposta correcta:</strong> {question.answer}
            </div>
            <div>
              <strong>
                <Trans>Percentagem de acerto</Trans>:
              </strong>{' '}
              -
            </div>
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
