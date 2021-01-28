import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';

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
  const [users, setUsers] = useState();
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
          .then(({ data: userAnswersData }) => {
            setUserAnswers(userAnswersData);
            setLoading(false);
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
        ApiRequest.get(`users`)
          .then(({ data: usersData }) => {
            const mappedUsers = usersData.reduce((acc, user) => {
              acc[user.id] = user;
              return acc;
            }, {});
            setUsers(mappedUsers);
            if (data.quiz.user_id) {
              setAuthor(mappedUsers[data.quiz.user_id]);
            }
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date, history]);

  if (error) {
    return <Error status={error} />;
  }

  if (loading || !users) {
    return <Loading />;
  }

  let globalPercentage;
  if (data.quiz.result && data.quiz.result.ranking.length > 0) {
    const stats = Object.values(data.quiz.result.question_statistics);
    globalPercentage = Math.round(
      stats.reduce((acc, item) => {
        return acc + item.percentage;
      }, 0) / stats.length
    );
  }

  return (
    <>
      <PageHeader
        title={`${data.quiz.subject} ${
          date ? `(${convertToLongDate(data.quiz.date, language)})` : ''
        }`}
        subtitle={
          (author || globalPercentage) && (
            <>
              {author && (
                <Trans>
                  Por {author.name} {author.surname}
                </Trans>
              )}
              {author && globalPercentage && ' / '}
              {globalPercentage && (
                <>
                  <Trans>Percentagem global de acerto</Trans>
                  {': '}
                  {globalPercentage}%
                </>
              )}
            </>
          )
        }
      />
      <div className="section">
        {(date && !data.quiz.today) || data.quiz.submitted ? (
          <SpecialQuizDone
            data={data}
            users={users}
            userAnswers={userAnswers}
          />
        ) : (
          <SpecialQuizForm data={data} userAnswers={userAnswers} />
        )}
      </div>
    </>
  );
};

export default SpecialQuiz;
