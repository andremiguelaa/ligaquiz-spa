import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans, SelectOrdinal } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import EmptyState from 'components/EmptyState';

const League = ({ user, setError }) => {
  const [seasons, setSeasons] = useState();

  useEffect(() => {
    ApiRequest.get(`seasons?user=${user.id}`)
      .then(({ data }) => {
        const seasonsData = [...data];
        seasonsData.shift();
        setSeasons(seasonsData.filter((item) => item.user_rank));
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [user, setError]);

  if (!seasons) {
    return <Loading />;
  }

  return (
    <section className="section content">
      {seasons.length > 0 ? (
        <table className="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>
                <Trans>Temporada</Trans>
              </th>
              <th>
                <Trans>Divisão</Trans>
              </th>
              <th>
                <Trans>Classificação</Trans>
              </th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((season) => (
              <tr key={season.id}>
                <td>
                  <Link to={`/ranking/${season.season}/${season.user_tier}`}>
                    <Trans>Temporada {season.season}</Trans>
                  </Link>
                </td>
                <td>
                  <SelectOrdinal
                    value={season.user_tier}
                    one="1ª"
                    two="2ª"
                    few="3ª"
                    other="#ª"
                  />
                </td>
                <td>
                  {season.user_tier === 1 && season.user_rank === 1 && (
                    <>
                      <i className="fa fa-trophy" aria-hidden="true"></i>{' '}
                      <Trans>Campeão</Trans>
                    </>
                  )}
                  {(season.user_tier > 1 || season.user_rank > 1) && (
                    <SelectOrdinal
                      value={season.user_rank}
                      one="1º"
                      two="2º"
                      few="3º"
                      other="#º"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState>
          <Trans>Sem registos</Trans>
        </EmptyState>
      )}
    </section>
  );
};

export default League;
