import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';
import slugify from 'slugify';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import Markdown from 'components/Markdown';
import Answer from './Answer';

import classes from './Quizzes.module.scss';

const QuizCorrect = () => {
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
            const mappedAnswers = Object.entries(data).reduce(
              (acc, [key, value]) => {
                acc[key] = value.reduce((acc, item) => {
                  acc[item.id] = {
                    ...item,
                    loading: false,
                  };
                  return acc;
                }, {});
                return acc;
              },
              {}
            );
            setAnswers(mappedAnswers);
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date]);

  const bulkCorrectAnswer = (answerIds, questionId, correct) => {
    setAnswers((prev) => {
      const newValue = { ...prev };
      answerIds.forEach((id) => {
        newValue[questionId][id].loading = true;
      });
      return newValue;
    });
    ApiRequest.patch(`answers`, { id: answerIds, correct }).then(({ data }) => {
      setAnswers((prev) => {
        const newValue = { ...prev };
        data.forEach((answer) => {
          newValue[answer.question_id][answer.id] = {
            ...answer,
            loading: false,
          };
        });
        return newValue;
      });
    });
  };

  const correctAnswers = (id, questionId, correct) => {
    const slugifiedMainAnswer = slugify(
      answers[questionId][id].text.replace(/\s/g, '').toLowerCase()
    );
    const answerIds = [];
    Object.values(answers[questionId]).forEach((answer) => {
      const slugifiedAnswer = slugify(
        answer.text.replace(/\s/g, '').toLowerCase()
      );
      if (slugifiedMainAnswer === slugifiedAnswer) {
        answerIds.push(answer.id);
      }
    });
    bulkCorrectAnswer(answerIds, questionId, correct);
  };

  if (error) {
    return <Error status={error} />;
  }

  if (!quiz || !answers) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={
          <Trans>
            Corrigir quiz de {convertToLongDate(quiz.date, language)}
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
                  {Object.values(answers[question.id]).map((answer) => (
                    <Answer
                      key={answer.id}
                      answer={answer}
                      correctAnswers={correctAnswers}
                    />
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

export default QuizCorrect;
