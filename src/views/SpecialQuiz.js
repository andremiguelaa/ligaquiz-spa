import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import Loading from 'components/Loading';
import NoMatch from './NoMatch';
import SpecialQuizDone from './SpecialQuiz/SpecialQuizDone';
import SpecialQuizForm from './SpecialQuiz/SpecialQuizForm';

import PageHeader from 'components/PageHeader';

const SpecialQuiz = () => {
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
  const [author, setAuthor] = useState();

  useEffect(() => {
    setLoading(true);
    ApiRequest.get(`special-quizzes?${date ? `date=${date}` : 'today'}`)
      .then(({ data }) => {
        setData(data);
        ApiRequest.get(`answers?special_quiz=${data.quiz.id}&mine=true`)
          .then(({ data }) => {
            setUserAnswers(data);
            setLoading(false);
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
        if (data.quiz.user_id) {
          ApiRequest.get(`users?id[]=${data.quiz.user_id}`)
            .then(({ data }) => {
              setAuthor(data[0]);
            })
            .catch(() => {
              setError(true);
            });
        }
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
        title={`${data.quiz.subject} ${
          date ? `(${convertToLongDate(data.quiz.date, language)})` : ''
        }`}
        subtitle={
          author && (
            <>
              Por {author.name} {author.surname}
            </>
          )
        }
      />
      <div className="section">
        {(date && !data.quiz.today) || data.quiz.submitted ? (
          <SpecialQuizDone data={data} userAnswers={userAnswers} />
        ) : (
          <SpecialQuizForm data={data} userAnswers={userAnswers} />
        )}
      </div>
    </>
  );
};

export default SpecialQuiz;
