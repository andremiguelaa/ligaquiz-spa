import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import ScrollContainer from 'react-indiana-drag-scroll';

import Loading from 'utils/Loading';
import Error from 'utils/Error';
import NoMatch from './NoMatch';
import ApiRequest from 'utils/ApiRequest';
import getLocaleMonth from 'utils/getLocaleMonth';
import { useStateValue } from 'state/State';

import Player from './NationalRanking/Player';
import Legend from './NationalRanking/Legend';
import { quizzesOrder, quizTypeAbbr } from './NationalRanking/consts.js';

import classes from './NationalRanking/NationalRanking.module.scss';

const NationalRanking = ({
  match: {
    params: { month },
  },
}) => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [players, setPlayers] = useState();
  const [rankingList, setRankingList] = useState();
  const [quizzes, setQuizzes] = useState();
  const [ranking, setRanking] = useState();
  const [order, setOrder] = useState({
    path: 'score',
    direction: 'desc',
  });

  useEffect(() => {
    setRanking();
    ApiRequest.get('individual-quiz-players')
      .then(({ data }) => {
        setPlayers(
          data.data.reduce(
            (acc, player) => ({
              ...acc,
              [player.id]: player,
            }),
            {}
          )
        );
      })
      .catch(() => {
        setError(true);
      });

    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        const list = data.data;
        setRankingList(list);
        if (list.length) {
          let monthToLoad = list[0];
          if (month && list.includes(month)) {
            monthToLoad = month;
          }
          if (month && !list.includes(month)) {
            setRanking({});
            return;
          }

          const rankingIndex = list.findIndex(
            (element) => element === monthToLoad
          );
          ApiRequest.get(`national-rankings?month=${monthToLoad}`)
            .then(({ data }) => {
              setQuizzes(data.data.quizzes);
              if (list[rankingIndex + 1]) {
                ApiRequest.get(
                  `national-rankings?month=${list[rankingIndex + 1]}`
                )
                  .then(
                    ({
                      data: {
                        data: { ranking: previousRanking },
                      },
                    }) => {
                      const rankingWithChanges = data.data.ranking.map(
                        (player) => {
                          const previousRankingPlayerInfo = previousRanking.find(
                            (element) =>
                              element.individual_quiz_player_id ===
                              player.individual_quiz_player_id
                          );
                          if (previousRankingPlayerInfo) {
                            player.change =
                              previousRankingPlayerInfo.rank - player.rank;
                          }
                          return player;
                        }
                      );
                      setRanking(rankingWithChanges);
                    }
                  )
                  .catch(() => {
                    setError(true);
                  });
              } else {
                setRanking(data.data.ranking);
              }
            })
            .catch(() => {
              setError(true);
            });
        } else {
          setRanking({});
        }
      })
      .catch(() => {
        setError(true);
      });
  }, [month]);

  const sortRankingByPath = (path) => {
    let newOrder;
    if (order && order.path === path) {
      newOrder = {
        path,
        direction: order.direction === 'asc' ? 'desc' : 'asc',
      };
    } else {
      newOrder = { path, direction: 'desc' };
    }
    const sortedRanking = [].concat(ranking).sort((a, b) => {
      if (newOrder.direction === 'asc') {
        return get(a, path, 0) - get(b, path, 0);
      }
      return get(b, path, 0) - get(a, path, 0);
    });
    setRanking(sortedRanking);
    setOrder(newOrder);
  };

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!players || !ranking) {
    return <Loading />;
  }

  if (month && !rankingList.includes(month)) {
    return <NoMatch />;
  }

  if (isEmpty(ranking)) {
    return (
      <div className="columns">
        <div className="column is-6-widescreen is-offset-3-widescreen is-8-tablet is-offset-2-tablet">
          <article className="message">
            <div className="message-header">
              <h1>
                <Trans>Ranking Nacional</Trans>
              </h1>
            </div>
            <div className="message-body">
              <div className="content">
                <Trans>Não existe ranking nacional disponível.</Trans>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  const shownMonth = month || rankingList[0];

  return (
    <article className="message">
      <div className="message-header">
        <h1>
          <Trans>
            Ranking de{' '}
            {getLocaleMonth(language, parseInt(shownMonth.substring(5, 7)))} de{' '}
            {shownMonth.substring(0, 4)}
          </Trans>
        </h1>
      </div>
      <div className="message-body">
        <div className="content">
          <div className={classes.tableWrapper}>
            <ScrollContainer
              className={classNames('table-container', classes.tableContainer)}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th
                      className={classNames(
                        classes.rankCell,
                        'has-background-white'
                      )}
                    >
                      #
                    </th>
                    <th
                      className={classNames(
                        classes.changeCell,
                        'has-background-white',
                        'has-text-centered'
                      )}
                    >
                      ±
                    </th>
                    <th
                      className={classNames(
                        classes.userCell,
                        'has-background-white'
                      )}
                    >
                      <Trans>Nome</Trans>
                    </th>
                    <th className={classes.sortable}>
                      <button onClick={() => sortRankingByPath('score')}>
                        <Trans>Pontos</Trans>
                        <span className="icon">
                          <i
                            className={classNames('fa', {
                              'fa-sort': order.path !== 'score',
                              [`fa-sort-numeric-${order.direction}`]:
                                order.path === 'score',
                            })}
                          ></i>
                        </span>
                      </button>
                    </th>
                    <th className={classes.sortable}>
                      <button onClick={() => sortRankingByPath('sum')}>
                        <Trans>Soma</Trans>
                        <span className="icon">
                          <i
                            className={classNames('fa', {
                              'fa-sort': order.path !== 'sum',
                              [`fa-sort-numeric-${order.direction}`]:
                                order.path === 'sum',
                            })}
                          ></i>
                        </span>
                      </button>
                    </th>
                    <th className={classes.sortable}>
                      <button onClick={() => sortRankingByPath('average')}>
                        <Trans>Média</Trans>
                        <span className="icon">
                          <i
                            className={classNames('fa', {
                              'fa-sort': order.path !== 'average',
                              [`fa-sort-numeric-${order.direction}`]:
                                order.path === 'average',
                            })}
                          ></i>
                        </span>
                      </button>
                    </th>
                    <th className={classes.sortable}>
                      <button onClick={() => sortRankingByPath('quiz_count')}>
                        <Trans>Quizzes</Trans>
                        <span className="icon">
                          <i
                            className={classNames('fa', {
                              'fa-sort': order.path !== 'quiz_count',
                              [`fa-sort-numeric-${order.direction}`]:
                                order.path === 'quiz_count',
                            })}
                          ></i>
                        </span>
                      </button>
                    </th>
                    {quizzesOrder.map(
                      (quizType) =>
                        quizzes[quizType] &&
                        quizzes[quizType].map((date) => (
                          <th
                            key={`${quizType}-${date}`}
                            className={classes.sortable}
                          >
                            <button
                              onClick={() =>
                                sortRankingByPath(
                                  `quizzes.${quizType}.${date}.score`
                                )
                              }
                            >
                              {quizTypeAbbr[quizType].abbr}
                              {quizTypeAbbr[quizType].includeMonth &&
                                parseInt(date.substring(5, 7))}
                              <span className="icon">
                                <i
                                  className={classNames('fa', {
                                    'fa-sort':
                                      order.path !==
                                      `quizzes.${quizType}.${date}.score`,
                                    [`fa-sort-numeric-${order.direction}`]:
                                      order.path ===
                                      `quizzes.${quizType}.${date}.score`,
                                  })}
                                ></i>
                              </span>
                            </button>
                          </th>
                        ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((player) => {
                    player.data = players[player.individual_quiz_player_id];
                    return (
                      <Player
                        key={player.individual_quiz_player_id}
                        player={player}
                        quizzes={quizzes}
                      />
                    );
                  })}
                </tbody>
              </table>
            </ScrollContainer>
          </div>
          <Legend />
          {rankingList.length && (
            <>
              <h2 className="has-text-weight-bold is-size-5">
                <Trans>Arquivo</Trans>
              </h2>
              <ol className="links-list">
                {rankingList.map((month) => (
                  <li key={month}>
                    <Link to={`/national-ranking/${month}`}>
                      {getLocaleMonth(
                        language,
                        parseInt(month.substring(5, 7))
                      )}{' '}
                      de {month.substring(0, 4)}
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default NationalRanking;
