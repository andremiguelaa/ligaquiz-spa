import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';

const Seasons = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seasonsList, setSeasonsList] = useState();

  useEffect(() => {
    ApiRequest.get(`seasons`)
      .then(({ data }) => {
        setSeasonsList(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <PageHeader title={<Trans>Arquivo de temporadas</Trans>} />
      <section className="section content">
        {loading ? (
          <Loading />
        ) : (
          <>
            {seasonsList && seasonsList.length > 0 ? (
              <>
                {seasonsList.reverse().map((season) => (
                  <div key={season.season}>
                    <Link to={`/ranking/${season.season}`}>
                      <Trans>Temporada {season.season}</Trans>
                    </Link>
                  </div>
                ))}
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

export default Seasons;
