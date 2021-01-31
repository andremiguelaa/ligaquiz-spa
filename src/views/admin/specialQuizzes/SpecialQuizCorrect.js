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
import Answer from '../quizzes/Answer';

import classes from '../quizzes/Quizzes.module.scss';

const SpecialQuizCorrect = () => {
  const { date } = useParams();
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState();
  const [answers, setAnswers] = useState();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    ApiRequest.get(`special-quizzes?date=${date}&submitted=1`)
      .then(({ data }) => {
        setQuiz(data.quiz);
        ApiRequest.get(`answers?special_quiz=${data.quiz.id}&submitted=1`)
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

  if (!user) {
    return <Error status={401} />;
  }

  if (!(user.valid_roles.admin || user.valid_roles.answer_reviewer)) {
    return <Error status={403} />;
  }

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
            Corrigir quiz especial de {convertToLongDate(quiz.date, language)}
          </Trans>
        }
      />
      <div className="section">
        <div className="field">
          <input
            id="show-all"
            type="checkbox"
            className="switch"
            value={showAll}
            onClick={(event) => setShowAll(event.target.checked)}
            defaultChecked={showAll}
          />
          <label htmlFor="show-all">
            <Trans>Mostrar respostas já corrigidas</Trans>
          </label>
        </div>
        <hr />
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
                      showIfCorrected={showAll}
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

export default SpecialQuizCorrect;
