import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import { covertToLongDate } from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import Loading from 'components/Loading';
import Markdown from 'components/Markdown';
import NoMatch from './NoMatch';

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
      .catch(() => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    ApiRequest.get(`games?date=${date}&user=${user1}&opponent=${user2}`)
      .then(({ data }) => {
        setGame(data.results);
        setLoading(false);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date, user1, user2]);

  if (error) {
    if (error === 404) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
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
                {game.user_id_1_game_points} ({game.user_id_1_correct_answers})
                - ({game.user_id_2_correct_answers}){' '}
                {game.user_id_2_game_points} {users[user2].name}{' '}
                {users[user2].surname}
              </>
            }
            subtitle={covertToLongDate(game.quiz.date, language)}
          />
          <section className="section">
            {game.quiz.questions.map((question) => (
              <div key={question.id}>
                <div>
                  <Markdown content={question.content} />
                </div>
                <table
                  className={classnames('table', 'is-fullwidth', classes.table)}
                >
                  <thead>
                    <tr>
                      <th className="has-text-centered">
                        {users[user1].name} {users[user1].surname}
                      </th>
                      <th className="has-text-centered">
                        <Trans>Percentagem</Trans>
                      </th>
                      <th className="has-text-centered">
                        {users[user2].name} {users[user2].surname}
                      </th>
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
                              game.answers[question.id][user1][0].correct,
                            'has-text-danger': !game.answers[question.id][
                              user1
                            ][0].correct,
                          }
                        )}
                      >
                        {game.answers[question.id][user2][0].points}
                      </td>
                      <td className="has-text-centered">-</td>
                      <td
                        className={classnames(
                          'has-text-centered',
                          'has-text-weight-bold',
                          {
                            'has-text-success':
                              game.answers[question.id][user2][0].correct,
                            'has-text-danger': !game.answers[question.id][
                              user2
                            ][0].correct,
                          }
                        )}
                      >
                        {game.answers[question.id][user1][0].points}
                      </td>
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
