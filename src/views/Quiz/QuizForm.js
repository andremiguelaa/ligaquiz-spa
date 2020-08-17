import React, { Fragment, useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';
import { getGenreTranslation } from 'utils/getGenreTranslation';
import Markdown from 'components/Markdown';
import Modal from 'components/Modal';
import Loading from 'components/Loading';
import Error from 'components/Error';

import classes from './Quiz.module.scss';

const saveDraft = debounce((id, text, points) => {
  ApiRequest.post(`answers`, {
    question_id: id,
    text,
    points: points === -1 ? undefined : points,
  });
}, 1000);

const QuizForm = ({ data, userAnswers }) => {
  const [
    {
      settings: { language },
      user,
    },
    dispatch,
  ] = useStateValue();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    answers: data.quiz.questions.map((question) => ({
      question_id: question.id,
      text: userAnswers[question.id]?.[0].text,
      points: data.quiz.solo ? undefined : userAnswers[question.id]?.[0].points,
    })),
  });
  const [missingPointsModal, setMissingPointsModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [genres, setGenres] = useState();
  const [opponent, setOpponent] = useState();
  const [opponentStats, setOpponentStats] = useState();
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    ApiRequest.post(`logs`, {
      action: `Quiz form opened`,
    });
    if (!data.quiz.solo && data.quiz.game) {
      const opponent =
        data.quiz.game.user_id_1 === user.id
          ? data.quiz.game.user_id_2
          : data.quiz.game.user_id_1;
      ApiRequest.get(`genres`)
        .then(({ data: genres }) => {
          setGenres(genres);
          ApiRequest.get(`users?id[]=${opponent}&statistics=true`)
            .then(({ data }) => {
              const user = data[0];
              const computedStatistics = genres.map((genre) => {
                let genreStatistics = {
                  id: genre.id,
                  slug: genre.slug,
                  total: 0,
                  correct: 0,
                  percentage: 0,
                  subgenres: [],
                };
                genre.subgenres.forEach((subgenre) => {
                  genreStatistics.total +=
                    user.statistics[subgenre.id]?.total || 0;
                  genreStatistics.correct +=
                    user.statistics[subgenre.id]?.correct || 0;
                  genreStatistics.subgenres.push({
                    id: subgenre.id,
                    slug: subgenre.slug,
                    total: user.statistics[subgenre.id]?.total || 0,
                    correct: user.statistics[subgenre.id]?.correct || 0,
                    percentage:
                      ((user.statistics[subgenre.id]?.correct || 0) /
                        (user.statistics[subgenre.id]?.total || 1)) *
                      100,
                  });
                });
                genreStatistics.percentage =
                  ((genreStatistics?.correct || 0) /
                    (genreStatistics?.total || 1)) *
                  100;
                return genreStatistics;
              });
              setOpponent(user);
              setOpponentStats(computedStatistics);
            })
            .catch(() => {
              setStatsError(true);
            });
        })
        .catch(() => {
          setStatsError(true);
        });
    }
  }, [data.quiz, user]);

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

  return (
    <>
      <div className="columns">
        <div className="column is-8">
          <form onSubmit={handleSubmit}>
            {data.quiz.questions.map((question, index) => (
              <div key={question.id} className={classes.question}>
                <div className={classes.questionText}>
                  <Markdown content={question.content} />
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
                        formData.answers[index].points
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
                      <Trans>Pontos a atribuir ao adversário</Trans>
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
                                : 0
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
                                : 1
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
                                : 2
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
                                : 3
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
              </div>
            ))}
            <div className="field">
              <div className="control">
                <button className="button is-primary">
                  <Trans>Gravar</Trans>
                </button>
              </div>
            </div>
          </form>
        </div>
        {!data.quiz.solo && data.quiz.game && (
          <div className="column is-4">
            {statsError ? (
              <Error>
                <Trans>
                  Não foi possível obter as estatísticas do adversário
                </Trans>
              </Error>
            ) : (
              <>
                {!opponentStats || !genres ? (
                  <Loading />
                ) : (
                  <div className={classnames('card', classes.statistics)}>
                    <div className="card-content">
                      <h2
                        className={classnames(
                          'subtitle',
                          'has-text-weight-bold',
                          classes.opponentTitle
                        )}
                      >
                        <Trans>Estatísticas do adversário</Trans>
                      </h2>
                      <p className={classes.opponentName}>
                        {opponent.name} {opponent.surname}
                      </p>
                      <div className="table-container">
                        <table
                          className={classnames(
                            'table is-fullwidth is-hoverable',
                            classes.genresTable
                          )}
                        >
                          <thead>
                            <tr>
                              <th>
                                <Trans>Tema</Trans>
                              </th>
                              <th>
                                <I18n>
                                  {({ i18n }) => (
                                    <span
                                      className="icon has-tooltip-bottom"
                                      data-tooltip={i18n._(
                                        t`Total de respostas`
                                      )}
                                    >
                                      <Trans>T</Trans>
                                    </span>
                                  )}
                                </I18n>
                              </th>
                              <th>
                                <I18n>
                                  {({ i18n }) => (
                                    <span
                                      className="icon has-tooltip-bottom has-tooltip-left"
                                      data-tooltip={i18n._(
                                        t`Percentagem de acerto`
                                      )}
                                    >
                                      %
                                    </span>
                                  )}
                                </I18n>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {opponentStats.map((genre) => (
                              <Fragment key={genre.id}>
                                <tr>
                                  <th>
                                    {getGenreTranslation(genre.slug, language)}
                                  </th>
                                  <td>{genre.total}</td>
                                  <td>{Math.round(genre.percentage)}%</td>
                                </tr>
                                {genre.subgenres.length > 1 && (
                                  <>
                                    {genre.subgenres.map((subgenre) => (
                                      <tr
                                        key={subgenre.id}
                                        className={classes.subgenre}
                                      >
                                        <th>
                                          {getGenreTranslation(
                                            subgenre.slug,
                                            language
                                          )}
                                        </th>
                                        <td>{subgenre.total}</td>
                                        <td>
                                          {Math.round(subgenre.percentage)}%
                                        </td>
                                      </tr>
                                    ))}
                                  </>
                                )}
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
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
        body={<Trans>Tens a certeza que queres submeter o quiz?</Trans>}
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
