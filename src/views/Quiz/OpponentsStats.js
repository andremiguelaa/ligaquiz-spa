import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { getGenreTranslation } from 'utils/getGenreTranslation';

import OpponentStats from './OpponentStats';

import classes from './Quiz.module.scss';

const OpponentsStats = ({ quiz, setPoints, setCupPoints }) => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();

  const [genres, setGenres] = useState();
  const [leagueOpponent, setLeagueOpponent] = useState();
  const [opponents, setOpponents] = useState();
  const [statsError, setStatsError] = useState(false);
  const [tab, setTab] = useState(!quiz.solo && quiz.game ? 'league' : 'cup');

  useEffect(() => {
    if ((!quiz.solo && quiz.game) || quiz.cupOpponent) {
      const opponent =
        !quiz.solo && quiz.game
          ? quiz.game?.user_id_1 === user.id
            ? quiz.game?.user_id_2
            : quiz.game?.user_id_1
          : undefined;
      setLeagueOpponent(opponent);
      const opponents = [opponent, quiz.cupOpponent].filter((item) => item);
      ApiRequest.get(`genres`)
        .then(({ data: genres }) => {
          setGenres(genres);
          ApiRequest.get(
            `users?id[]=${opponents[0]}${
              opponents[1] ? `&id[]=${opponents[1]}` : ''
            }&statistics=true`
          )
            .then(({ data }) => {
              data.forEach((userOpponent) => {
                const computedGenreStatistics = genres.map((genre) => {
                  let genreStatistics = {
                    id: genre.id,
                    slug: genre.slug,
                    name: getGenreTranslation(genre.slug, language),
                    total: 0,
                    correct: 0,
                    percentage: 0,
                    subgenres: [],
                  };
                  genre.subgenres.forEach((subgenre) => {
                    genreStatistics.total +=
                      userOpponent.statistics[subgenre.id]?.total || 0;
                    genreStatistics.correct +=
                      userOpponent.statistics[subgenre.id]?.correct || 0;
                  });
                  genreStatistics.percentage =
                    ((genreStatistics?.correct || 0) /
                      (genreStatistics?.total || 1)) *
                    100;
                  return genreStatistics;
                });
                const computedSubgenreStatistics = genres.reduce(
                  (acc, genre) => {
                    genre.subgenres.forEach((subgenre) => {
                      acc.push({
                        id: subgenre.id,
                        slug: subgenre.slug,
                        name: getGenreTranslation(subgenre.slug, language),
                        total: userOpponent.statistics[subgenre.id]?.total || 0,
                        correct:
                          userOpponent.statistics[subgenre.id]?.correct || 0,
                        percentage:
                          (userOpponent.statistics[subgenre.id]?.correct
                            ? userOpponent.statistics[subgenre.id]?.correct /
                              userOpponent.statistics[subgenre.id]?.total
                            : 0) * 100,
                      });
                    });
                    return acc;
                  },
                  []
                );
                setOpponents((prev) => ({
                  ...prev,
                  [userOpponent.id]: {
                    ...userOpponent,
                    genreStats: computedGenreStatistics,
                    subgenreStats: computedSubgenreStatistics,
                  },
                }));
              });
            })
            .catch(({ response }) => {
              setStatsError(response?.status);
            });
        })
        .catch(({ response }) => {
          setStatsError(response?.status);
        });
    }
  }, [quiz, user, language]);

  return (
    <>
      {((!quiz.solo && quiz.game) || quiz.cupOpponent) && (
        <div className="column is-4">
          {statsError ? (
            <Error status={statsError} />
          ) : (
            <>
              {!opponents || !genres ? (
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
                    {leagueOpponent && quiz.cupOpponent && (
                      <div className="tabs is-fullwidth">
                        <ul>
                          {leagueOpponent && opponents[leagueOpponent] && (
                            <li
                              className={classnames({
                                'is-active': tab === 'league',
                              })}
                            >
                              <button
                                className="is-link"
                                onClick={() => setTab('league')}
                              >
                                <Trans>Liga</Trans>
                              </button>
                            </li>
                          )}
                          {quiz.cupOpponent && opponents[quiz.cupOpponent] && (
                            <li
                              className={classnames({
                                'is-active': tab === 'cup',
                              })}
                              onClick={() => setTab('cup')}
                            >
                              <button
                                className="is-link"
                                onClick={() => setTab('cup')}
                              >
                                <Trans>Taça</Trans>
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    {leagueOpponent &&
                      opponents[leagueOpponent] &&
                      tab === 'league' && (
                        <OpponentStats
                          opponent={opponents[leagueOpponent]}
                          setPoints={setPoints}
                        />
                      )}
                    {quiz.cupOpponent &&
                      opponents[quiz.cupOpponent] &&
                      tab === 'cup' && (
                        <OpponentStats
                          opponent={opponents[quiz.cupOpponent]}
                          setPoints={setCupPoints}
                        />
                      )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default OpponentsStats;
