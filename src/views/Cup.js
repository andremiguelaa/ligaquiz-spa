import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import { convertToLongDate } from 'utils/formatDate';
import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';
import ConditionalWrapper from 'components/ConditionalWrapper';

const Cup = () => {
  const [
    {
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
        <section className="section content">
          {cupData.rounds.map((round, index) => (
            <>
              {round.games.length > 0 ? (
                <>
                  <h2 className="is-size-5">
                    {renderRoundTitle(round.games.length)} (
                    {convertToLongDate(round.date, language)})
                  </h2>
                  {round.games.map((game) => (
                    <div>
                      {game.user_id_1 && game.user_id_2 ? (
                        <>
                          <ConditionalWrapper
                            condition={game.winner === game.user_id_2}
                            wrapper={(children) => <del>{children}</del>}
                          >
                            {users[game.user_id_1].name}{' '}
                            {users[game.user_id_1].surname}
                          </ConditionalWrapper>{' '}
                          {game.done &&
                          game.hasOwnProperty('user_id_1_game_points') &&
                          game.hasOwnProperty('user_id_2_game_points') ? (
                            <>
                              {game.corrected && (
                                <>
                                  {game.user_id_1_game_points}
                                  {game.user_id_1_game_points !== 'F' && (
                                    <> ({game.user_id_1_correct_answers})</>
                                  )}{' '}
                                  -{' '}
                                  {game.user_id_2_game_points !== 'F' && (
                                    <>({game.user_id_2_correct_answers})</>
                                  )}{' '}
                                  {game.user_id_2_game_points}{' '}
                                </>
                              )}
                            </>
                          ) : (
                            'vs.'
                          )}
                          {game.done && !game.corrected && <>P</>}{' '}
                          <ConditionalWrapper
                            condition={game.winner === game.user_id_1}
                            wrapper={(children) => <del>{children}</del>}
                          >
                            {users[game.user_id_2].name}{' '}
                            {users[game.user_id_2].surname}
                          </ConditionalWrapper>
                        </>
                      ) : (
                        <>
                          {users[game.user_id_1].name}{' '}
                          {users[game.user_id_1].surname} (
                          <Trans>Isento para a próxima eliminatória</Trans>)
                        </>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h2 className="is-size-5">
                    {renderRoundTitle(
                      cupData.rounds[0].games.length / (2 * index)
                    )}{' '}
                    ({convertToLongDate(round.date, language)})
                  </h2>
                  <Trans>A definir</Trans>
                </>
              )}
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

export default Cup;
