import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

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
  const { season, tier } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seasonNumber, setSeasonNumber] = useState();
  const [tierNumber, setTierNumber] = useState();
  const [seasonData, setSeasonData] = useState();
  const [seasonsList, setSeasonsList] = useState();
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
      ApiRequest.get(`seasons`).then(({ data }) => {
        setSeasonsList(data);
      });
    } else {
      ApiRequest.get(`seasons`)
        .then(({ data }) => {
          setSeasonsList(data);
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
              <>
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
                {seasonsList && (
                  <article>
                    <h1 className="is-size-4">Arquivo de temporadas</h1>
                    {seasonsList.reverse().map((season) => (
                      <div key={season.season}>
                        <Link
                          to={`/ranking/${season.season}`}
                          onClick={() => setSeasonNumber(season.season)}
                        >
                          Temporada {season.season}
                        </Link>
                      </div>
                    ))}
                  </article>
                )}
              </>
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
