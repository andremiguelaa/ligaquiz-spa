import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';

import TableHeader from './Ranking/TableHeader';
import Player from './Ranking/Player';
import Rounds from './Ranking/Rounds';

import classes from './Ranking/Ranking.module.scss';

const Ranking = () => {
  const [{ user }] = useStateValue();
  const { season, tier } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seasonNumber, setSeasonNumber] = useState();
  const [tierNumber, setTierNumber] = useState();
  const [seasonData, setSeasonData] = useState();
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
    setLoading(true);
    if (season) {
      ApiRequest.get(`seasons?season=${season}`)
        .then(({ data: seasonData }) => {
          let defaultTier = parseInt(tier) || 1;
          if (!tier) {
            const userLeague = seasonData.leagues.find(({ user_ids }) =>
              user_ids.includes(user.id)
            );
            if (userLeague) {
              defaultTier = userLeague.tier;
            }
          }
          ApiRequest.get(`leagues?season=${season}&tier=${defaultTier}`)
            .then(({ data: leagueData }) => {
              const newSeasonData = {
                leagues: seasonData.leagues,
                ranking: leagueData.ranking,
                rounds: seasonData.rounds.map((round) => ({
                  ...round,
                  games: leagueData.rounds[round.round],
                })),
              };
              setTierNumber(defaultTier);
              setSeasonData(newSeasonData);
              setSeasonNumber(parseInt(season));
              setLoading(false);
            })
            .catch(({ response }) => {
              setError(response?.status);
            });
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    } else {
      ApiRequest.get(`seasons`)
        .then(({ data: seasonsData }) => {
          if (seasonsData.length) {
            let lastSeason = seasonsData.find((season) => season.public);
            if (!lastSeason) {
              lastSeason = seasonsData[0];
            }
            const userLeague = lastSeason.leagues.find(({ user_ids }) =>
              user_ids.includes(user.id)
            );
            let defaultTier = 1;
            if (userLeague) {
              defaultTier = userLeague.tier;
            }
            ApiRequest.get(
              `leagues?season=${lastSeason.season}&tier=${defaultTier}`
            )
              .then(({ data: seasonData }) => {
                const seasonNumber = parseInt(lastSeason.season);
                setSeasonNumber(seasonNumber);
                setTierNumber(defaultTier);
                const lastSeasonData = seasonsData.find(
                  (item) => item.season === seasonNumber
                );
                const newSeasonData = {
                  leagues: lastSeasonData.leagues,
                  ranking: seasonData.ranking,
                  rounds: lastSeasonData.rounds.map((round) => ({
                    ...round,
                    games: seasonData.rounds[round.round],
                  })),
                };
                setSeasonData(newSeasonData);
                setLoading(false);
              })
              .catch(({ response }) => {
                setError(response?.status);
              });
          } else {
            setSeasonData({
              leagues: [],
            });
            setLoading(false);
          }
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [season, tier, user]);

  if (error) {
    return <Error status={error} />;
  }

  if (loading || !users || !seasonData) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={<Trans>Classificação</Trans>}
        subtitle={
          seasonData.leagues.length > 0 && (
            <Trans>Temporada {seasonNumber}</Trans>
          )
        }
      />
      {seasonData.leagues.length > 0 ? (
        <>
          <div className="section">
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
          </div>
          <section
            className={classnames('section', 'content', classes.ranking)}
          >
            <div className="table-container">
              <table className="table is-fullwidth">
                <TableHeader />
                <tbody>
                  {seasonData.ranking.map((player, index) => (
                    <Player
                      key={player.id}
                      player={player}
                      index={index}
                      tierNumber={tierNumber}
                      users={users}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <Rounds rounds={seasonData.rounds} users={users} />
          </section>
        </>
      ) : (
        <EmptyState>
          <Trans>Sem registos</Trans>
        </EmptyState>
      )}
    </>
  );
};

export default Ranking;
