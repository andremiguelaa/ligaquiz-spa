import React, { Fragment, useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classnames from 'classnames';
import { differenceInYears } from 'date-fns';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import { getRegionTranslations } from 'utils/getRegionTranslation';
import { getGenreTranslation } from 'utils/getGenreTranslation';
import Loading from 'components/Loading';
import Error from 'components/Error';

import classes from './Quiz.module.scss';

const OpponentsStats = ({ quiz }) => {
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

  useEffect(() => {
    ApiRequest.post(`logs`, {
      action: `Quiz form opened`,
    });
    if ((!quiz.solo && quiz.game) || quiz.cupOpponent) {
      const opponent =
        quiz.game?.user_id_1 === user.id
          ? quiz.game?.user_id_2
          : quiz.game?.user_id_1;
      setLeagueOpponent(opponent);
      const opponents = [opponent, quiz.cupOpponent].filter((item) => item);
      ApiRequest.get(`genres`)
        .then(({ data: genres }) => {
          setGenres(genres);
          ApiRequest.get(
            `users?id[]=${opponents[0]}${
              opponents[1] && `&id[]=${opponents[1]}`
            }&statistics=true`
          )
            .then(({ data }) => {
              data.forEach((userOpponent) => {
                const computedGenreStatistics = genres.map((genre) => {
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
                    genreStats: computedGenreStatistics.sort(
                      (a, b) => b.percentage - a.percentage
                    ),
                    subgenreStats: computedSubgenreStatistics.sort(
                      (a, b) => b.percentage - a.percentage
                    ),
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
  }, [quiz, user]);

  return (
    <>
      {!quiz.solo && quiz.game && (
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
                    {leagueOpponent && opponents[leagueOpponent] && (
                      <>
                        <p className={classes.opponentName}>
                          {opponents[leagueOpponent].name}{' '}
                          {opponents[leagueOpponent].surname}
                          {opponents[leagueOpponent].birthday &&
                            opponents[leagueOpponent].birthday !== 'hidden' && (
                              <>
                                {' '}
                                <Trans>
                                  (
                                  {differenceInYears(
                                    new Date(),
                                    new Date(opponents[leagueOpponent].birthday)
                                  )}{' '}
                                  anos)
                                </Trans>
                              </>
                            )}
                          {opponents[leagueOpponent].region &&
                            opponents[leagueOpponent].region !== 'hidden' && (
                              <>
                                <br />
                                {getRegionTranslations(
                                  opponents[leagueOpponent].region,
                                  language
                                )}
                              </>
                            )}
                          {opponents[leagueOpponent].birthday === 'hidden' && (
                            <small className={classes.missing}>
                              <span className="icon has-text-warning">
                                <i className="fa fa-exclamation-triangle"></i>
                              </span>
                              <Trans>
                                Preenche a tua data de nascimento para veres a
                                idade do teu adversário
                              </Trans>
                            </small>
                          )}
                          {opponents[leagueOpponent].region === 'hidden' && (
                            <small className={classes.missing}>
                              <span className="icon has-text-warning">
                                <i className="fa fa-exclamation-triangle"></i>
                              </span>
                              <Trans>
                                Preenche a tua região para veres a região do teu
                                adversário
                              </Trans>
                            </small>
                          )}
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
                                <th className={classes.total}>
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
                                <th className={classes.percentage}>
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
                              {opponents[leagueOpponent].genreStats.map(
                                (genre) => (
                                  <Fragment key={genre.id}>
                                    <tr>
                                      <th>
                                        {getGenreTranslation(
                                          genre.slug,
                                          language
                                        )}
                                      </th>
                                      <td className={classes.total}>
                                        {genre.total}
                                      </td>
                                      <td className={classes.percentage}>
                                        {Math.round(genre.percentage)}%
                                      </td>
                                    </tr>
                                  </Fragment>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
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
                                  <Trans>Subtema</Trans>
                                </th>
                                <th className={classes.total}>
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
                                <th className={classes.percentage}>
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
                              {opponents[leagueOpponent].subgenreStats.map(
                                (genre) => (
                                  <Fragment key={genre.id}>
                                    <tr>
                                      <th>
                                        {getGenreTranslation(
                                          genre.slug,
                                          language
                                        )}
                                      </th>
                                      <td className={classes.total}>
                                        {genre.total}
                                      </td>
                                      <td className={classes.percentage}>
                                        {Math.round(genre.percentage)}%
                                      </td>
                                    </tr>
                                  </Fragment>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
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
