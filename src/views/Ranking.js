import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

import getAcronym from 'utils/getAcronym';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';

import classes from './Ranking/Ranking.module.scss';

const Ranking = () => {
  const { season, tier } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seasonNumber, setSeasonNumber] = useState();
  const [tierNumber, setTierNumber] = useState();
  const [seasonData, setSeasonData] = useState();
  const [users, setUsers] = useState();

  const setSeasonDetails = (seasonNumber, seasonData) => {
    ApiRequest.get(`seasons?season=${seasonNumber}`)
      .then(({ data }) => {
        const newSeasonData = {
          leagues: data.leagues,
          ranking: seasonData.ranking,
          rounds: data.rounds.map((round) => ({
            ...round,
            games: seasonData.rounds[round.round],
          })),
        };
        setSeasonData(newSeasonData);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  };

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
    setLoading(true);
    if (season) {
      ApiRequest.get(`leagues?season=${season}&tier=${tier ? tier : 1}`)
        .then(({ data }) => {
          setSeasonNumber(parseInt(season));
          setTierNumber(tier ? parseInt(tier) : 1);
          setSeasonDetails(season, data);
        })
        .catch(() => {
          setError(true);
        });
    } else {
      ApiRequest.get(`seasons`)
        .then(({ data }) => {
          if (data.length) {
            const lastSeason = data[data.length - 1].season;
            ApiRequest.get(`leagues?season=${lastSeason}&tier=1`)
              .then(({ data }) => {
                setSeasonNumber(parseInt(lastSeason));
                setTierNumber(1);
                setSeasonDetails(lastSeason, data);
              })
              .catch(() => {
                setError(true);
              });
          }
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [season, tier]);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <PageHeader
        title={
          <>
            {seasonNumber ? (
              <Trans>Classificação ({seasonNumber}ª temporada)</Trans>
            ) : (
              <Trans>Classificação</Trans>
            )}
          </>
        }
      />
      {!loading && users && seasonData && (
        <div className="tabs is-fullwidth">
          <ul>
            {seasonData.leagues.map((league) => (
              <li
                key={league.tier}
                className={classnames({
                  'is-active': league.tier === tierNumber,
                })}
              >
                <Link to={`/ranking/${seasonNumber}/${league.tier}`}>
                  <Trans>{league.tier}ª divisão</Trans>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <section className={classnames('section', 'content', classes.ranking)}>
        {loading || !users ? (
          <Loading />
        ) : (
          <>
            {seasonData ? (
              <div className="table-container">
                <table className="table is-fullwidth">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th><Trans>Nome</Trans></th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Pontos na liga`)}
                            >
                              <Trans>Pts</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Pontos a favor`)}
                            >
                              <Trans>PaF</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Pontos contra`)}
                            >
                              <Trans>PC</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Diferença de pontos`)}
                            >
                              <Trans>DdP</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Jogos`)}
                            >
                              <Trans>J</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Faltas`)}
                            >
                              <Trans>F</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Vitórias`)}
                            >
                              <Trans>V</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Empates`)}
                            >
                              <Trans>E</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom"
                              data-tooltip={i18n._(t`Derrotas`)}
                            >
                              <Trans>D</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                      <th className="has-text-centered">
                        <I18n>
                          {({ i18n }) => (
                            <span
                              className="icon has-tooltip-bottom has-tooltip-left"
                              data-tooltip={i18n._(t`Respostas correctas`)}
                            >
                              <Trans>RC</Trans>
                            </span>
                          )}
                        </I18n>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonData.ranking.map((player, index) => (
                      <tr
                        key={player.id}
                        className={classnames({
                          'has-background-warning': player.forfeits === 3,
                          'has-background-success':
                            index === 0 || (index === 1 && tierNumber > 1),
                          'has-background-danger': index >= 8 || player.forfeits > 3,
                        })}
                      >
                        <td>{player.rank}</td>
                        <td className={classes.userCellContent}>
                          <Link to={`/statistics/${player.id}`}>
                            <div className={classes.avatar}>
                              {users[player.id].avatar ? (
                                <img
                                  alt={`${users[player.id].name} ${
                                    users[player.id].surname
                                  }`}
                                  src={users[player.id].avatar}
                                />
                              ) : (
                                <i className="fa fa-user" />
                              )}
                            </div>
                            <span className="is-hidden-mobile">
                              {users[player.id].name} {users[player.id].surname}
                            </span>
                            <abbr
                              data-tooltip={`${users[player.id].name} ${
                                users[player.id].surname
                              }`}
                              className="is-hidden-tablet"
                            >
                              {getAcronym(users[player.id].name)}
                              {getAcronym(users[player.id].surname)}
                            </abbr>
                          </Link>
                        </td>
                        <td className="has-text-centered">
                          {player.league_points}
                        </td>
                        <td className="has-text-centered">
                          {player.game_points}
                        </td>
                        <td className="has-text-centered">
                          {player.game_points_against}
                        </td>
                        <td className="has-text-centered">
                          {player.game_points - player.game_points_against}
                        </td>
                        <td className="has-text-centered">
                          {player.played_games}
                        </td>
                        <td className="has-text-centered">{player.forfeits}</td>
                        <td className="has-text-centered">{player.wins}</td>
                        <td className="has-text-centered">{player.draws}</td>
                        <td className="has-text-centered">{player.losses}</td>
                        <td className="has-text-centered">
                          {player.correct_answers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState>
                <Trans>Sem registos</Trans>
              </EmptyState>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Ranking;
