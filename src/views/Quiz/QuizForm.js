import React, { useState, useEffect, useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';

import Markdown from 'components/Markdown';
import Modal from 'components/Modal';

import OpponentsStats from './OpponentsStats';

import classes from './Quiz.module.scss';

const QuizForm = ({ data, userAnswers }) => {
  const [, dispatch] = useStateValue();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    answers: data.quiz.questions.map((question) => ({
      question_id: question.id,
      text: userAnswers[question.id]?.[0].text,
      points: data.quiz.solo ? undefined : userAnswers[question.id]?.[0].points,
      cup_points: !data.quiz.cupOpponent
        ? undefined
        : userAnswers[question.id]?.[0].cup_points,
    })),
  });
  const [missingPointsModal, setMissingPointsModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);

  const saveAnswerDraft = useMemo(
    () =>
      data.quiz.questions.map((item, index) =>
        debounce(() => {
          ApiRequest.post(`answers`, {
            question_id: item.id,
            text: formData.answers[index].text,
            points:
              formData.answers[index].points >= 0
                ? formData.answers[index].points
                : undefined,
            cup_points:
              formData.answers[index].cup_points >= 0
                ? formData.answers[index].cup_points
                : undefined,
          });
        }, 1000)
      ),
    [data.quiz.questions, formData.answers]
  );

  useEffect(() => {
    ApiRequest.post(`logs`, {
      action: `Quiz form opened`,
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!data.quiz.solo || data.quiz.cupOpponent) {
      const missingPoints = formData.answers.some(
        (answer) =>
          answer.points === undefined ||
          answer.points === null ||
          answer.points === -1
      );
      const cupMissingPoints = formData.answers.some(
        (answer) =>
          answer.cup_points === undefined ||
          answer.cup_points === null ||
          answer.cup_points === -1
      );
      if (
        (!data.quiz.solo && missingPoints) ||
        (data.quiz.cupOpponent && cupMissingPoints)
      ) {
        setMissingPointsModal(true);
        return;
      }
    }
    setSubmitModal(true);
  };

  const submitQuiz = () => {
    setSubmitting(true);
    ApiRequest.post(`quizzes/submit`, formData)
      .then(() => {
        dispatch({
          type: 'notifications.set',
          payload: {
            quiz: false,
          },
        });
        toast.success(<Trans>Quiz submetido com sucesso.</Trans>);
        history.push(`/quiz/${data.quiz.date}`);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível submeter o quiz.</Trans>);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const setPoints = (index, points) => {
    const previousPointsValue = formData.answers[index].points;
    setFormData((prev) => {
      const newFormData = { ...prev };
      newFormData.answers[index].points = points;
      return newFormData;
    });
    if (previousPointsValue !== points) {
      saveAnswerDraft[index]();
    }
  };

  const setCupPoints = (index, points) => {
    const previousPointsValue = formData.answers[index].cup_points;
    setFormData((prev) => {
      const newFormData = { ...prev };
      newFormData.answers[index].cup_points = points;
      return newFormData;
    });
    if (previousPointsValue !== points) {
      saveAnswerDraft[index]();
    }
  };

  let pointsGiven;
  if (!data.quiz.solo) {
    pointsGiven = formData.answers.reduce(
      (acc, item) => {
        if (item.points >= 0) {
          acc[item.points]++;
        }
        return acc;
      },
      {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
      }
    );
  }

  let cupPointsGiven;
  if (data.quiz.cupOpponent) {
    cupPointsGiven = formData.answers.reduce(
      (acc, item) => {
        if (item.cup_points >= 0) {
          acc[item.cup_points]++;
        }
        return acc;
      },
      {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
      }
    );
  }

  const blankAnsers = formData.answers.filter((item) => !item.text).length;

  return (
    <>
      <div className="columns">
        <div className="column is-8">
          <form onSubmit={handleSubmit}>
            {data.quiz.questions.map((question, index) => (
              <div key={question.id} className={classes.question}>
                <h2 className="subtitle has-text-weight-bold">
                  <Trans>Pergunta {index + 1}</Trans>
                </h2>
                <div className={classes.questionText}>
                  <Markdown content={question.content} />
                </div>
                {question.media_id && (
                  <div
                    className={classnames(
                      classes.media,
                      classes[data.media[question.media_id].type]
                    )}
                  >
                    {renderMedia(
                      data.media[question.media_id].type,
                      data.media[question.media_id].url,
                      index
                    )}
                  </div>
                )}
                <div className="field">
                  <label className="label">
                    <Trans>Resposta</Trans>
                  </label>
                  <input
                    defaultValue={formData.answers[index].text}
                    className="input"
                    onChange={(event) => {
                      event.persist();
                      setFormData((prev) => {
                        const newFormData = { ...prev };
                        newFormData.answers[index].text = event.target.value;
                        return newFormData;
                      });
                      saveAnswerDraft[index]();
                    }}
                    onPaste={(event) => {
                      ApiRequest.post(`logs`, {
                        action: `Paste on question ${
                          question.id
                        }: ${event.clipboardData.getData('Text')}`,
                      });
                    }}
                  />
                </div>
                {!data.quiz.solo && (
                  <>
                    <label className="label">
                      <Trans>Pontos a atribuir ao adversário da Liga</Trans>
                    </label>
                    <div className="field has-addons">
                      <div className="control">
                        <button
                          disabled={
                            pointsGiven[0] === 1 &&
                            formData.answers[index].points !== 0
                          }
                          type="button"
                          className={classnames('button', {
                            'is-success': formData.answers[index].points === 0,
                          })}
                          onClick={() =>
                            setPoints(
                              index,
                              formData.answers[index].points === 0
                                ? undefined
                                : 0
                            )
                          }
                        >
                          0
                        </button>
                      </div>
                      <div className="control">
                        <button
                          disabled={
                            pointsGiven[1] === 3 &&
                            formData.answers[index].points !== 1
                          }
                          type="button"
                          className={classnames('button', {
                            'is-warning': formData.answers[index].points === 1,
                          })}
                          onClick={() =>
                            setPoints(
                              index,
                              formData.answers[index].points === 1
                                ? undefined
                                : 1
                            )
                          }
                        >
                          1
                        </button>
                      </div>
                      <div className="control">
                        <button
                          disabled={
                            pointsGiven[2] === 3 &&
                            formData.answers[index].points !== 2
                          }
                          type="button"
                          className={classnames('button', {
                            'is-warning': formData.answers[index].points === 2,
                          })}
                          onClick={() =>
                            setPoints(
                              index,
                              formData.answers[index].points === 2
                                ? undefined
                                : 2
                            )
                          }
                        >
                          2
                        </button>
                      </div>
                      <div className="control">
                        <button
                          disabled={
                            pointsGiven[3] === 1 &&
                            formData.answers[index].points !== 3
                          }
                          type="button"
                          className={classnames('button', {
                            'is-danger': formData.answers[index].points === 3,
                          })}
                          onClick={() =>
                            setPoints(
                              index,
                              formData.answers[index].points === 3
                                ? undefined
                                : 3
                            )
                          }
                        >
                          3
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {data.quiz.cupOpponent && (
                  <>
                    <label className="label">
                      <Trans>Pontos a atribuir ao adversário da Taça</Trans>
                    </label>
                    <div className="field has-addons">
                      <div className="control">
                        <button
                          disabled={
                            cupPointsGiven[0] === 1 &&
                            formData.answers[index].cup_points !== 0
                          }
                          type="button"
                          className={classnames('button', {
                            'is-success':
                              formData.answers[index].cup_points === 0,
                          })}
                          onClick={() =>
                            setCupPoints(
                              index,
                              formData.answers[index].cup_points === 0
                                ? undefined
                                : 0
                            )
                          }
                        >
                          0
                        </button>
                      </div>
                      <div className="control">
                        <button
                          disabled={
                            cupPointsGiven[1] === 3 &&
                            formData.answers[index].cup_points !== 1
                          }
                          type="button"
                          className={classnames('button', {
                            'is-warning':
                              formData.answers[index].cup_points === 1,
                          })}
                          onClick={() =>
                            setCupPoints(
                              index,
                              formData.answers[index].cup_points === 1
                                ? undefined
                                : 1
                            )
                          }
                        >
                          1
                        </button>
                      </div>
                      <div className="control">
                        <button
                          disabled={
                            cupPointsGiven[2] === 3 &&
                            formData.answers[index].cup_points !== 2
                          }
                          type="button"
                          className={classnames('button', {
                            'is-warning':
                              formData.answers[index].cup_points === 2,
                          })}
                          onClick={() =>
                            setCupPoints(
                              index,
                              formData.answers[index].cup_points === 2
                                ? undefined
                                : 2
                            )
                          }
                        >
                          2
                        </button>
                      </div>
                      <div className="control">
                        <button
                          disabled={
                            cupPointsGiven[3] === 1 &&
                            formData.answers[index].cup_points !== 3
                          }
                          type="button"
                          className={classnames('button', {
                            'is-danger':
                              formData.answers[index].cup_points === 3,
                          })}
                          onClick={() =>
                            setCupPoints(
                              index,
                              formData.answers[index].cup_points === 3
                                ? undefined
                                : 3
                            )
                          }
                        >
                          3
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="field">
              <div className="control">
                <button className="button is-primary">
                  <Trans>Submeter</Trans>
                </button>
              </div>
            </div>
          </form>
        </div>
        <OpponentsStats
          quiz={data.quiz}
          setPoints={setPoints}
          setCupPoints={setCupPoints}
        />
      </div>
      <Modal
        type="danger"
        open={missingPointsModal}
        title={<Trans>Submissão inválida</Trans>}
        body={
          <Trans>
            Tens pontos por atribuir.
            <br />
            Atribui-os antes de fazer a submissão.
          </Trans>
        }
        action={() => setMissingPointsModal(false)}
        onClose={() => setMissingPointsModal(false)}
      />
      <Modal
        type="info"
        open={submitModal}
        title={<Trans>Submeter quiz</Trans>}
        body={
          <>
            {blankAnsers > 0 && (
              <>
                {blankAnsers > 1 ? (
                  <Trans>Ainda tens {blankAnsers} perguntas em branco.</Trans>
                ) : (
                  <Trans>Ainda tens uma pergunta em branco.</Trans>
                )}
                <br />
              </>
            )}
            <Trans>Tens a certeza que queres submeter o quiz?</Trans>
          </>
        }
        action={() => {
          submitQuiz();
        }}
        doingAction={submitting}
        onClose={() => setSubmitModal(false)}
      />
    </>
  );
};

export default QuizForm;
