import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import Loading from 'components/Loading';
import SpecialQuizDone from './SpecialQuiz/SpecialQuizDone';
import SpecialQuizForm from './SpecialQuiz/SpecialQuizForm';

import PageHeader from 'components/PageHeader';

const SpecialQuiz = () => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const history = useHistory();

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
        if (date && data.quiz.today && !data.quiz.submitted) {
          history.push('/special-quiz');
          return;
        }
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
            .catch(({ response }) => {
              setError(response?.status);
            });
        }
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date, history]);

  if (error) {
    return <Error status={error} />;
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
          <SpecialQuizDone
            data={data}
            userAnswers={userAnswers}
            setError={setError}
          />
        ) : (
          <SpecialQuizForm data={data} userAnswers={userAnswers} />
        )}
      </div>
    </>
  );
};

export default SpecialQuiz;
