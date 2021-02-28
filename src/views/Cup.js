import React, { Fragment, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import getAcronym from 'utils/getAcronym';
import { convertToLongDate } from 'utils/formatDate';
import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';
import ConditionalWrapper from 'components/ConditionalWrapper';

import classes from './Cup/Cup.module.scss';

const Cup = () => {
  const [
    {
      user: authUser,
      settings: { language },
    },
  ] = useStateValue();
  const { season } = useParams();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState();
  const [cupData, setCupData] = useState();

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
    setLoading(true);
    if (season) {
      ApiRequest.get(`cups?season=${season}`)
        .then(({ data: cupsData }) => {
          setCupData(cupsData);
          setLoading(false);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    } else {
      ApiRequest.get(`seasons`)
        .then(({ data }) => {
          if (data.length) {
            let lastSeason = data.find((season) => season.public);
            if (!lastSeason) {
              lastSeason = data[0];
            }
            ApiRequest.get(`cups?season=${lastSeason.season}`)
              .then(({ data: seasonCupData }) => {
                const seasonNumber = parseInt(lastSeason.season);
                setSeasonNumber(seasonNumber);
                let tempCupData = seasonCupData;
                if (authUser) {
                  const sortedRounds = tempCupData.rounds.map((round) => {
                    let roundGames = round.games.reduce((acc, game) => {
                      if (
                        game.user_id_1 === authUser.id ||
                        game.user_id_2 === authUser.id
                      ) {
                        acc.unshift(game);
                      } else {
                        acc.push(game);
                      }
                      return acc;
                    }, []);
                    return {
                      ...round,
                      games: roundGames,
                    };
                  });
                  tempCupData.rounds = sortedRounds;
                }
                setCupData(tempCupData);
                setLoading(false);
              })
              .catch(({ response }) => {
                if (response?.status !== 404) {
                  setError(response?.status);
                } else {
                  setLoading(false);
                }
              })
              .then(() => {});
          } else {
            setCupData();
            setLoading(false);
          }
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [season, authUser]);

  if (error) {
    return <Error status={error} />;
  }

  if (loading || !users) {
    return <Loading />;
  }

  const renderRoundTitle = (games) => {
    switch (games) {
      case 8:
        return <Trans>Oitavos-de-Final</Trans>;
      case 4:
        return <Trans>Quartos-de-Final</Trans>;
      case 2:
        return <Trans>Meias-finais</Trans>;
      case 1:
        return <Trans>Final</Trans>;
      default:
        return (
          <Trans>{language === 'pt' ? games : games * 2}-avos-de-Final</Trans>
        );
    }
  };

  return (
    <>
      <PageHeader
        title={<Trans>Taça</Trans>}
        subtitle={cupData && <Trans>Temporada {seasonNumber}</Trans>}
      />
      {cupData ? (
        <section className={classnames('section', 'content', classes.cup)}>
          {cupData.rounds.map((round, index) => (
            <Fragment key={round.date}>
              {round.games.length > 0 ? (
                <div className={classes.round}>
                  <h2 className={classnames('is-size-5', classes.roundTitle)}>
                    {renderRoundTitle(round.games.length)}
                  </h2>
                  <div className={classes.roundDate}>
                    {convertToLongDate(round.date, language)}
                  </div>
                  <div className={classes.games}>
                    {round.games.map((game) => (
                      <Fragment key={game.user_id_1}>
                        {game.user_id_1 && game.user_id_2 && (
                          <div className={classes.game}>
                            <div
                              className={classnames(
                                classes.nameCell,
                                classes.home
                              )}
                            >
                              <ConditionalWrapper
                                condition={game.winner === game.user_id_2}
                                wrapper={(children) => <del>{children}</del>}
                              >
                                <ConditionalWrapper
                                  condition={authUser?.id === game.user_id_1}
                                  wrapper={(children) => (
                                    <strong>{children}</strong>
                                  )}
                                >
                                  <span className="is-hidden-mobile">
                                    {users[game.user_id_1].name}{' '}
                                    {users[game.user_id_1].surname}
                                  </span>
                                  <abbr
                                    data-tooltip={`${
                                      users[game.user_id_1].name
                                    } ${users[game.user_id_1].surname}`}
                                    className="is-hidden-tablet"
                                  >
                                    {getAcronym(users[game.user_id_1].name)}
                                    {getAcronym(users[game.user_id_1].surname)}
                                  </abbr>
                                </ConditionalWrapper>
                              </ConditionalWrapper>
                            </div>
                            <div className={classes.avatarCell}>
                              <div className={classes.avatar}>
                                {users[game.user_id_1].avatar ? (
                                  <img
                                    alt={`${users[game.user_id_1].name} ${
                                      users[game.user_id_1].surname
                                    }`}
                                    src={users[game.user_id_1].avatar}
                                  />
                                ) : (
                                  <i className="fa fa-user" />
                                )}
                              </div>
                            </div>
                            <div className={classes.resultCell}>
                              {game.done &&
                                game.hasOwnProperty('user_id_1_game_points') &&
                                game.hasOwnProperty(
                                  'user_id_2_game_points'
                                ) && (
                                  <Link
                                    to={`/cup-game/${round.date}/${game.user_id_1}/${game.user_id_2}`}
                                  >
                                    {game.corrected && (
                                      <>
                                        {game.corrected && (
                                          <>
                                            {game.user_id_1_game_points}
                                            {game.user_id_1_game_points !==
                                              'F' && (
                                              <>
                                                {' '}
                                                (
                                                {game.user_id_1_correct_answers}
                                                )
                                              </>
                                            )}{' '}
                                            -{' '}
                                            {game.user_id_2_game_points !==
                                              'F' && (
                                              <>
                                                (
                                                {game.user_id_2_correct_answers}
                                                )
                                              </>
                                            )}{' '}
                                            {game.user_id_2_game_points}{' '}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </Link>
                                )}
                              {!game.done &&
                                game.hasOwnProperty('user_id_1') &&
                                game.hasOwnProperty('user_id_2') &&
                                'vs.'}
                              {game.done &&
                                !game.hasOwnProperty('user_id_1_game_points') &&
                                !game.hasOwnProperty('user_id_2_game_points') &&
                                'P'}
                            </div>
                            <div className={classes.avatarCell}>
                              <div className={classes.avatar}>
                                {users[game.user_id_2].avatar ? (
                                  <img
                                    alt={`${users[game.user_id_2].name} ${
                                      users[game.user_id_2].surname
                                    }`}
                                    src={users[game.user_id_2].avatar}
                                  />
                                ) : (
                                  <i className="fa fa-user" />
                                )}
                              </div>
                            </div>
                            <div
                              className={classnames(
                                classes.nameCell,
                                classes.away
                              )}
                            >
                              <ConditionalWrapper
                                condition={game.winner === game.user_id_1}
                                wrapper={(children) => <del>{children}</del>}
                              >
                                <ConditionalWrapper
                                  condition={authUser?.id === game.user_id_2}
                                  wrapper={(children) => (
                                    <strong>{children}</strong>
                                  )}
                                >
                                  <span className="is-hidden-mobile">
                                    {users[game.user_id_2].name}{' '}
                                    {users[game.user_id_2].surname}
                                  </span>
                                  <abbr
                                    data-tooltip={`${
                                      users[game.user_id_2].name
                                    } ${users[game.user_id_2].surname}`}
                                    className="is-hidden-tablet"
                                  >
                                    {getAcronym(users[game.user_id_2].name)}
                                    {getAcronym(users[game.user_id_2].surname)}
                                  </abbr>
                                </ConditionalWrapper>
                              </ConditionalWrapper>
                            </div>
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                  {round.games.map((game) => (
                    <Fragment key={game.user_id_1}>
                      {!game.user_id_2 && (
                        <div className={classes.soloGame}>
                          <ConditionalWrapper
                            condition={authUser?.id === game.user_id_1}
                            wrapper={(children) => <strong>{children}</strong>}
                          >
                            <span className="is-hidden-mobile">
                              {users[game.user_id_1].name}{' '}
                              {users[game.user_id_1].surname}
                            </span>
                            <abbr
                              data-tooltip={`${users[game.user_id_1].name} ${
                                users[game.user_id_1].surname
                              }`}
                              className="is-hidden-tablet"
                            >
                              {getAcronym(users[game.user_id_1].name)}
                              {getAcronym(users[game.user_id_1].surname)}
                            </abbr>
                          </ConditionalWrapper>
                          <div>
                            <div className={classes.avatar}>
                              {users[game.user_id_1].avatar ? (
                                <img
                                  alt={`${users[game.user_id_1].name} ${
                                    users[game.user_id_1].surname
                                  }`}
                                  src={users[game.user_id_1].avatar}
                                />
                              ) : (
                                <i className="fa fa-user" />
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="is-hidden-mobile">
                              <Trans>Isento para a próxima eliminatória</Trans>
                            </span>
                            <span className="is-hidden-tablet">
                              <Trans>Isento</Trans>
                            </span>
                          </div>
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              ) : (
                <div className={classes.round}>
                  <h2 className={classnames('is-size-5', classes.roundTitle)}>
                    {renderRoundTitle(
                      cupData.rounds[0].games.length / Math.pow(2, index)
                    )}
                  </h2>
                  <div className={classes.roundDate}>
                    {convertToLongDate(round.date, language)}
                  </div>
                  <Trans>A definir</Trans>
                </div>
              )}
            </Fragment>
          ))}
        </section>
      ) : (
        <EmptyState>
          <Trans>Sorteio ainda não disponível</Trans>
        </EmptyState>
      )}
    </>
  );
};

export default Cup;
