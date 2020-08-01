import React, { Fragment, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { Radar } from 'react-chartjs-2';

import { useStateValue } from 'state/State';
import { convertToLongDate } from 'utils/formatDate';
import { getGenreTranslation } from 'utils/getGenreTranslation';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import NoMatch from './NoMatch';

import classes from './Statistics/Statistics.module.scss';

const Statistics = () => {
  const { id1: userId1, id2: userId2 } = useParams();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [users, setUsers] = useState();
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState();
  const [chartSeries, setChartSeries] = useState();
  const [games, setGames] = useState();
  const [gameStatistics, setGameStatistics] = useState();

  useEffect(() => {
    ApiRequest.get(`genres`)
      .then(({ data }) => {
        setGenres(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    setUsers();
    setChartSeries();
    setGames();
    if (userId1 === userId2) {
      return;
    }
    ApiRequest.get(`users?id[]=${userId1}&id[]=${userId2}&statistics=true`)
      .then(({ data }) => {
        setUsers(data);
        ApiRequest.get(`games?user=${userId1}&opponent=${userId2}`)
          .then(({ data }) => {
            const statistics = {
              total: 0,
              wins: 0,
              draws: 0,
              losses: 0,
            };
            setGames(
              data.results.reverse().map((game) => {
                const mappedGame = {
                  id: game.id,
                  corrected: game.corrected,
                  done: game.done,
                  date: game.round.date,
                  originalUser1: game.user_id_1,
                  originalUser2: game.user_id_2,
                  user1_points:
                    game.user_id_1 === parseInt(userId1)
                      ? game.user_id_1_game_points
                      : game.user_id_2_game_points,
                  user1_answers:
                    game.user_id_1 === parseInt(userId1)
                      ? game.user_id_1_correct_answers
                      : game.user_id_2_correct_answers,
                  user2_points:
                    game.user_id_2 === parseInt(userId2)
                      ? game.user_id_2_game_points
                      : game.user_id_1_game_points,
                  user2_answers:
                    game.user_id_2 === parseInt(userId2)
                      ? game.user_id_2_correct_answers
                      : game.user_id_1_correct_answers,
                };
                if (game.done && game.corrected) {
                  statistics.total++;
                  if (
                    !(
                      mappedGame.user1_points === 'F' &&
                      mappedGame.user2_points === 'F'
                    )
                  ) {
                    if (mappedGame.user1_points === 'F') {
                      statistics.losses++;
                    } else if (mappedGame.user2_points === 'F') {
                      statistics.wins++;
                    } else if (
                      mappedGame.user1_points > mappedGame.user2_points
                    ) {
                      statistics.wins++;
                    } else if (
                      mappedGame.user1_points < mappedGame.user2_points
                    ) {
                      statistics.losses++;
                    } else {
                      statistics.draws++;
                    }
                  }
                }
                return mappedGame;
              })
            );
            setGameStatistics(statistics);
          })
          .catch(() => {
            setError(true);
          });
      })
      .catch(() => {
        setError(true);
      });
  }, [userId1, userId2]);

  useEffect(() => {
    if (users && genres) {
      const usersComputedStatistics = [];
      for (let userIndex = 0; userIndex < 2; userIndex++) {
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
              users[userIndex].statistics[subgenre.id]?.total || 0;
            genreStatistics.correct +=
              users[userIndex].statistics[subgenre.id]?.correct || 0;
            genreStatistics.subgenres.push({
              id: subgenre.id,
              slug: subgenre.slug,
              total: users[userIndex].statistics[subgenre.id]?.total || 0,
              correct: users[userIndex].statistics[subgenre.id]?.correct || 0,
              percentage:
                ((users[userIndex].statistics[subgenre.id]?.correct || 0) /
                  (users[userIndex].statistics[subgenre.id]?.total || 1)) *
                100,
            });
          });
          genreStatistics.percentage =
            ((genreStatistics?.correct || 0) / (genreStatistics?.total || 1)) *
            100;
          return genreStatistics;
        });
        usersComputedStatistics[userIndex] = computedStatistics;
      }
      setChartSeries([
        usersComputedStatistics[0].map((genre) => Math.round(genre.percentage)),
        usersComputedStatistics[1].map((genre) => Math.round(genre.percentage)),
      ]);
    }
  }, [users, genres]);

  if (userId1 === userId2) {
    return <NoMatch />;
  }

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!users || !genres || !chartSeries) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={<Trans>Comparação de Estatísticas</Trans>}
        subtitle={
          <Trans>
            {users[0].name} {users[0].surname} e {users[1].name}{' '}
            {users[1].surname}
          </Trans>
        }
      />
      <section className="section content">
        <h1 className="has-text-weight-bold is-size-4">
          <Trans>Liga Quiz</Trans>
        </h1>
        <div className={classes.chart}>
          <Radar
            data={{
              labels: genres.map((genre) =>
                getGenreTranslation(genre.slug, language)
              ),
              datasets: [
                {
                  data: chartSeries[0],
                  backgroundColor: 'hsla(204, 86%, 53%, 0.3)',
                  borderColor: 'hsl(204, 86%, 53%)',
                  pointRadius: 0,
                  tension: 0.2,
                },
                {
                  data: chartSeries[1],
                  backgroundColor: 'hsla(171, 100%, 41%, 0.3)',
                  borderColor: 'hsl(171, 100%, 41%)',
                  pointRadius: 0,
                  tension: 0.2,
                },
              ],
            }}
            options={{
              scale: {
                ticks: {
                  beginAtZero: true,
                  max: 100,
                  display: false,
                },
                pointLabels: {
                  fontSize: 12,
                },
              },
              legend: {
                display: false,
              },
            }}
          />
          <ul className={classes.chartLegend}>
            <li className={classes.user1}>
              {users[0].name} {users[0].surname}
            </li>
            <li className={classes.user2}>
              {users[1].name} {users[1].surname}
            </li>
          </ul>
        </div>
      </section>
      {games && gameStatistics ? (
        <>
          {games.length > 0 && (
            <section className="section content">
              <table className="table is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>
                      <Trans>Jogos</Trans>
                    </th>
                    <th>
                      {users[0].name} {users[0].surname}
                    </th>
                    <th>
                      <Trans>Empates</Trans>
                    </th>
                    <th>
                      {users[1].name} {users[1].surname}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{gameStatistics.total}</td>
                    <td>
                      {gameStatistics.wins} (
                      {Math.round(
                        (gameStatistics.wins / gameStatistics.total) * 100
                      )}
                      %)
                    </td>
                    <td>
                      {gameStatistics.draws} (
                      {Math.round(
                        (gameStatistics.draws / gameStatistics.total) * 100
                      )}
                      %)
                    </td>
                    <td>
                      {gameStatistics.losses} (
                      {Math.round(
                        (gameStatistics.losses / gameStatistics.total) * 100
                      )}
                      %)
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table is-fullwidth is-hoverable is-striped">
                <thead>
                  <tr>
                    <th>
                      <Trans>Data</Trans>
                    </th>
                    <th>
                      <Trans>Resultado</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <Fragment key={game.id}>
                      {game.done && game.corrected && (
                        <tr>
                          <td>
                            <Link to={`/quiz/${game.date}`}>
                              {convertToLongDate(game.date, language)}
                            </Link>
                          </td>
                          <td>
                            <Link
                              to={`/game/${game.date}/${game.originalUser1}/${game.originalUser2}`}
                            >
                              {users[0].name} {users[0].surname}{' '}
                              {game.user1_points}
                              {game.user1_points !== 'F' && (
                                <> ({game.user1_answers})</>
                              )}{' '}
                              -{' '}
                              {game.user2_points !== 'F' && (
                                <>({game.user2_answers})</>
                              )}{' '}
                              {game.user2_points} {users[1].name}{' '}
                              {users[1].surname}
                            </Link>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Statistics;
