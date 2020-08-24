import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';
import getAcronym from 'utils/getAcronym';
import Markdown from 'components/Markdown';
import Loading from 'components/Loading';

import classes from './SpecialQuiz.module.scss';

const SpecialQuizDone = ({ data, userAnswers, setError }) => {
  const [users, setUsers] = useState();
  useEffect(() => {
    if (data.quiz.result && !users) {
      ApiRequest.get(`users`)
        .then(({ data }) => {
          setUsers(
            data.reduce((acc, user) => {
              acc[user.id] = user;
              return acc;
            }, {})
          );
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [data.quiz.result, users, setError]);

  return (
    <>
      {data.quiz.result && (
        <div className={classes.results}>
          {users ? (
            <>
              <h2 className="subtitle has-text-weight-bold">
                <Trans>Classificação</Trans>
              </h2>
              <div className="table-container">
                <table className="table is-fullwidth is-hoverable">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>
                        <Trans>Jogador</Trans>
                      </th>
                      {data.quiz.questions.map((_, index) => (
                        <th key={index} className="has-text-centered">
                          {index + 1}
                        </th>
                      ))}
                      <th className="has-text-centered">
                        <Trans>Total</Trans>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.quiz.result.ranking.map((player) => (
                      <tr key={player.user_id}>
                        <td>{player.rank}</td>
                        <td className={classes.userCellContent}>
                          <Link to={`/statistics/${player.user_id}`}>
                            <div className={classes.avatar}>
                              {users[player.user_id].avatar ? (
                                <img
                                  alt={`${users[player.user_id].name} ${
                                    users[player.user_id].surname
                                  }`}
                                  src={users[player.user_id].avatar}
                                />
                              ) : (
                                <i className="fa fa-user" />
                              )}
                            </div>
                            <span className="is-hidden-mobile">
                              {users[player.user_id].name}{' '}
                              {users[player.user_id].surname}
                            </span>
                            <abbr
                              data-tooltip={`${users[player.user_id].name} ${
                                users[player.user_id].surname
                              }`}
                              className="is-hidden-tablet"
                            >
                              {getAcronym(users[player.user_id].name)}
                              {getAcronym(users[player.user_id].surname)}
                            </abbr>
                          </Link>
                          {users[player.user_id].national_rank && (
                            <Link
                              to="/national-ranking"
                              className={classes.nationalRank}
                            >
                              {users[player.user_id].national_rank}
                            </Link>
                          )}
                        </td>
                        {data.quiz.questions.map((question) => (
                          <td
                            key={question.id}
                            className={classnames('has-text-centered', {
                              'is-success':
                                player.questions[question.id].joker &&
                                player.questions[question.id].points > 0,
                              'is-danger':
                                player.questions[question.id].points < 0,
                            })}
                          >
                            {player.questions[question.id].points}
                          </td>
                        ))}
                        <td className="has-text-centered">{player.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <Loading />
          )}
        </div>
      )}
      {data.quiz.description && (
        <div className={classes.description}>
          <h2 className="subtitle has-text-weight-bold">
            <Trans>Descrição</Trans>
          </h2>
          <p>
            <Markdown content={data.quiz.description} />
          </p>
        </div>
      )}
      {data.quiz.questions.map((question, index) => (
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
          {userAnswers?.[question.id]?.[0] && (
            <>
              <div>
                <strong>
                  <Trans>Resposta dada</Trans>:
                </strong>{' '}
                {userAnswers[question.id][0].text
                  ? userAnswers[question.id][0].text
                  : '-'}
              </div>
              <div>
                <strong>
                  <Trans>Joker usado</Trans>:
                </strong>{' '}
                {userAnswers[question.id][0].points ? (
                  <Trans>Sim</Trans>
                ) : (
                  <Trans>Não</Trans>
                )}
              </div>
            </>
          )}
          {data.quiz.result && (
            <div>
              <strong>
                <Trans>Percentagem de acerto</Trans>:
              </strong>{' '}
              <Link to={`/question/${question.id}`}>
                {Math.round(
                  data.quiz.result.question_statistics[question.id].percentage
                )}
                %
              </Link>
            </div>
          )}
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
        </div>
      ))}
    </>
  );
};

export default SpecialQuizDone;
