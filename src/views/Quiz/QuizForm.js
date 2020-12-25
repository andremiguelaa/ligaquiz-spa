import React, { useState, useEffect } from 'react';
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

const saveDraft = debounce((id, text, points, cup_points) => {
  ApiRequest.post(`answers`, {
    question_id: id,
    text,
    points: points === -1 ? undefined : points,
    cup_points: cup_points === -1 ? undefined : cup_points,
  });
}, 1000);

const QuizForm = ({ data, userAnswers }) => {
  const [dispatch] = useStateValue();
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

  useEffect(() => {
    ApiRequest.post(`logs`, {
      action: `Quiz form opened`,
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!data.quiz.solo) {
      const missingPoints = formData.answers.some(
        (answer) => answer.points === undefined || answer.points === -1
      );
      if (missingPoints) {
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
                      saveDraft(
                        question.id,
                        event.target.value,
                        formData.answers[index].points,
                        formData.answers[index].cup_points
                      );
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points === 0
                                ? undefined
                                : 0,
                              formData.answers[index].cup_points
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].points =
                                formData.answers[index].points === 0
                                  ? undefined
                                  : 0;
                              return newFormData;
                            });
                          }}
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points === 1
                                ? undefined
                                : 1,
                              formData.answers[index].cup_points
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].points =
                                formData.answers[index].points === 1
                                  ? undefined
                                  : 1;
                              return newFormData;
                            });
                          }}
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points === 2
                                ? undefined
                                : 2,
                              formData.answers[index].cup_points
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].points =
                                formData.answers[index].points === 2
                                  ? undefined
                                  : 2;
                              return newFormData;
                            });
                          }}
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points === 3
                                ? undefined
                                : 3,
                              formData.answers[index].cup_points
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].points =
                                formData.answers[index].points === 3
                                  ? undefined
                                  : 3;
                              return newFormData;
                            });
                          }}
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points,
                              formData.answers[index].cup_points === 0
                                ? undefined
                                : 0
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].cup_points =
                                formData.answers[index].cup_points === 0
                                  ? undefined
                                  : 0;
                              return newFormData;
                            });
                          }}
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points,
                              formData.answers[index].cup_points === 1
                                ? undefined
                                : 1
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].cup_points =
                                formData.answers[index].cup_points === 1
                                  ? undefined
                                  : 1;
                              return newFormData;
                            });
                          }}
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points,
                              formData.answers[index].cup_points === 2
                                ? undefined
                                : 2
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].cup_points =
                                formData.answers[index].cup_points === 2
                                  ? undefined
                                  : 2;
                              return newFormData;
                            });
                          }}
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
                          onClick={() => {
                            saveDraft(
                              question.id,
                              formData.answers[index].text,
                              formData.answers[index].points,
                              formData.answers[index].cup_points === 3
                                ? undefined
                                : 3
                            );
                            setFormData((prev) => {
                              const newFormData = { ...prev };
                              newFormData.answers[index].cup_points =
                                formData.answers[index].cup_points === 3
                                  ? undefined
                                  : 3;
                              return newFormData;
                            });
                          }}
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
        <OpponentsStats quiz={data.quiz} />
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
