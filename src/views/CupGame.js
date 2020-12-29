import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import renderMedia from 'utils/renderMedia';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import Loading from 'components/Loading';
import Markdown from 'components/Markdown';

import classes from './Game/Game.module.scss';

const Game = () => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();

  const { date, user1, user2 } = useParams();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    ApiRequest.get(
      `cup-games?date=${date}&user=${user1}&opponent=${user2 ? user2 : user1}`
    )
      .then(({ data }) => {
        setGame(data);
        setLoading(false);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date, user1, user2]);

  if (error) {
    return <Error status={error} />;
  }

  if (game && !game.quiz) {
    return <Error status={404} />;
  }

  return (
    <>
      {loading || !users ? (
        <Loading />
      ) : (
        <>
          <PageHeader
            title={
              <>
                {users[user1].name} {users[user1].surname}{' '}
                {game.user_id_1_game_points}{' '}
                {game.user_id_1_game_points !== 'F' && (
                  <>({game.user_id_1_correct_answers})</>
                )}
                {!game.solo && (
                  <>
                    {' '}
                    -{' '}
                    {game.user_id_2_game_points !== 'F' && (
                      <>({game.user_id_2_correct_answers})</>
                    )}{' '}
                    {game.user_id_2_game_points} {users[user2].name}{' '}
                    {users[user2].surname}
                  </>
                )}
              </>
            }
            subtitle={game.quiz && convertToLongDate(game.quiz.date, language)}
          />
          <section className="section">
            {game.quiz &&
              game.quiz.questions.map((question, index) => (
                <div key={question.id} className={classes.question}>
                  <h2 className="subtitle has-text-weight-bold">
                    <Trans>Pergunta {index + 1}</Trans>
                  </h2>
                  <div>
                    <Markdown content={question.content} />
                  </div>
                  {question.media_id && (
                    <div
                      className={classnames(
                        classes.media,
                        classes[game.media[question.media_id].type]
                      )}
                    >
                      {renderMedia(
                        game.media[question.media_id].type,
                        game.media[question.media_id].url,
                        index
                      )}
                    </div>
                  )}
                  <table
                    className={classnames(
                      'table',
                      'is-fullwidth',
                      classes.table
                    )}
                  >
                    <thead>
                      <tr>
                        <th className="has-text-centered">
                          {users[user1].name} {users[user1].surname}
                        </th>
                        <th className="has-text-centered">
                          <Trans>Percentagem de acerto</Trans>
                        </th>
                        {!game.solo && (
                          <th className="has-text-centered">
                            {users[user2].name} {users[user2].surname}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className={classnames(
                            'has-text-centered',
                            'has-text-weight-bold',
                            {
                              'has-text-success':
                                game.answers?.[question.id]?.[user1]?.correct,
                              'has-text-danger': !game.answers?.[question.id]?.[
                                user1
                              ]?.correct,
                            }
                          )}
                        >
                          {game.answers?.[question.id]?.[user1] ? (
                            <>
                              {game.answers?.[question.id]?.[user2] ? (
                                game.answers[question.id][user2].cup_points
                              ) : (
                                <>
                                  {game.answers?.[question.id]?.[user1]
                                    ?.correct ? (
                                    <Trans>Correcta</Trans>
                                  ) : (
                                    <Trans>Errada</Trans>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <Trans>Falta</Trans>
                          )}
                        </td>
                        <td className="has-text-centered">
                          <Link to={`/question/${question.id}`}>
                            {question.percentage
                              ? `${Math.round(question.percentage)}%`
                              : '-'}
                          </Link>
                        </td>
                        {!game.solo && (
                          <td
                            className={classnames(
                              'has-text-centered',
                              'has-text-weight-bold',
                              {
                                'has-text-success':
                                  game.answers?.[question.id]?.[user2]?.correct,
                                'has-text-danger': !game.answers?.[
                                  question.id
                                ]?.[user2]?.correct,
                              }
                            )}
                          >
                            {game.answers?.[question.id]?.[user2] ? (
                              <>
                                {game.answers?.[question.id]?.[user1] ? (
                                  game.answers[question.id][user1].cup_points
                                ) : (
                                  <>
                                    {game.answers?.[question.id]?.[user2]
                                      ?.correct ? (
                                      <Trans>Correcta</Trans>
                                    ) : (
                                      <Trans>Errada</Trans>
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              <Trans>Falta</Trans>
                            )}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
          </section>
        </>
      )}
    </>
  );
};

export default Game;
