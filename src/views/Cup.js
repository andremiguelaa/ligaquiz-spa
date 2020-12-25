import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';

import classes from './Ranking/Ranking.module.scss';

const Ranking = () => {
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
              .then(({ data: cupsData }) => {
                const seasonNumber = parseInt(lastSeason.season);
                setSeasonNumber(seasonNumber);
                setCupData(cupsData);
                setLoading(false);
              })
              .catch(({ response }) => {
                setError(response?.status);
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
  }, [season]);

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
        return <Trans>{games}-avos-de-Final</Trans>;
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
          {cupData.rounds.map((round) => (
            <>
              <h2 className="is-size-5">
                {renderRoundTitle(round.games.length)}
              </h2>
              <ul>
                {round.games.map((game) => (
                  <li>
                    {game.user_id_1 && game.user_id_2 && (
                      <>
                        {users[game.user_id_1].name}{' '}
                        {users[game.user_id_1].surname} -{' '}
                        {users[game.user_id_2].name}{' '}
                        {users[game.user_id_2].surname}
                      </>
                    )}
                    {game.user_id_1 && !game.user_id_2 && (
                      <>
                        {users[game.user_id_1].name}{' '}
                        {users[game.user_id_1].surname} (
                        <Trans>Isento para a próxima eliminatória</Trans>)
                      </>
                    )}
                    {!game.user_id_1 && !game.user_id_2 && (
                      <Trans>Jogo a definir</Trans>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ))}
        </section>
      ) : (
        <EmptyState>
          <Trans>Sem registos</Trans>
        </EmptyState>
      )}
    </>
  );
};

export default Ranking;
