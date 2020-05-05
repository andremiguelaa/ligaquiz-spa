import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

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
        }
      })
      .catch(() => {
        setError(true);
      });
  }, [month]);

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
          <div className={`${classes.tableWrapper}`}>
            <div className={`table-container ${classes.tableContainer}`}>
              <table className="table">
                <thead>
                  <tr>
                    <th className={`${classes.rankCell} has-background-white`}>
                      #
                    </th>
                    <th
                      className={`${classes.changeCell} has-background-white has-text-centered`}
                    >
                      ±
                    </th>
                    <th className={`${classes.userCell} has-background-white`}>
                      <Trans>Nome</Trans>
                    </th>
                    <th>
                      <Trans>Pontos</Trans>
                    </th>
                    <th>
                      <Trans>Soma</Trans>
                    </th>
                    {quizzesOrder.map(
                      (quizType) =>
                        quizzes[quizType] &&
                        quizzes[quizType].map((date) => (
                          <th key={`${quizType}-${date}`}>
                            {quizTypeAbbr[quizType].abbr}
                            {quizTypeAbbr[quizType].includeMonth &&
                              parseInt(date.substring(5, 7))}
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
            </div>
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
