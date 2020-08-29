import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';
import PaginatedTable from 'components/PaginatedTable';
import NoMatch from './NoMatch';

import classes from './Seasons/Seasons.module.scss';

const Seasons = () => {
  const { page } = useParams();
  let history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seasonsList, setSeasonsList] = useState();

  useEffect(() => {
    ApiRequest.get(`seasons`)
      .then(({ data }) => {
        setSeasonsList(
          data.reduce((acc, season) => {
            if (season.public && season.leagues.length > 0) {
              acc.push(season);
            }
            return acc;
          }, [])
        );
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    if (error === 404) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageHeader title={<Trans>Arquivo de temporadas</Trans>} />
          <section className="section">
            <>
              {seasonsList && seasonsList.length > 0 ? (
                <>
                  <PaginatedTable
                    array={seasonsList}
                    initialPage={page ? page : 1}
                    hideHeader
                    columns={[
                      {
                        id: 'season',
                        render: (item) => (
                          <Trans>Temporada {item.season}</Trans>
                        ),
                      },
                      {
                        id: 'actions',
                        className: 'has-text-right',
                        render: (item) => (
                          <>
                            <Link
                              to={`/genre-rankings/${item.season}`}
                              className={classes.action}
                            >
                              <Trans>Rankings temáticos</Trans>
                            </Link>
                            <Link
                              to={`/ranking/${item.season}`}
                              className={classes.action}
                            >
                              <Trans>Classificação</Trans>
                            </Link>
                          </>
                        ),
                      },
                    ]}
                    onChange={(newPage) => {
                      history.push(`/seasons/${newPage}`);
                    }}
                    onError={(code) => {
                      setError(code);
                    }}
                  />
                </>
              ) : (
                <EmptyState>
                  <Trans>Sem registos</Trans>
                </EmptyState>
              )}
            </>
          </section>
        </>
      )}
    </>
  );
};

export default Seasons;
