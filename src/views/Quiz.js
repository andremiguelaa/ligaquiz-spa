import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import Loading from 'components/Loading';
import NoMatch from './NoMatch';
import QuizDone from './Quiz/QuizDone';
import QuizForm from './Quiz/QuizForm';

import PageHeader from 'components/PageHeader';

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
    setLoading(true);
    ApiRequest.get(`quizzes?${date ? `date=${date}` : 'today'}`)
      .then(({ data }) => {
        setData(data);
        ApiRequest.get(`answers?quiz=${data.quiz.id}&mine=true`)
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={
          <Trans>
            Quiz de{' '}
            {date ? convertToLongDate(data.quiz.date, language) : 'hoje'}
          </Trans>
        }
      />
      <div className="section">
        {(date && !data.quiz.today) || data.quiz.submitted ? (
          <QuizDone data={data} userAnswers={userAnswers} />
        ) : (
          <QuizForm data={data} userAnswers={userAnswers} />
        )}
      </div>
    </>
  );
};

export default Quiz;
