import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import ApiRequest from 'utils/ApiRequest';
import PageHeader from 'components/PageHeader';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';
import PaginatedTable from 'components/PaginatedTable';

import classes from './Seasons/Seasons.module.scss';

const Seasons = () => {
  const { page } = useParams();
  let history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seasonsList, setSeasonsList] = useState();

  useEffect(() => {
    ApiRequest.get(`seasons`)
      .then(({ data: seasonsData }) => {
        ApiRequest.get(`cups`)
          .then(({ data: cupsData }) => {
            const cupsBySeasonId = cupsData.reduce((acc, item) => {
              acc[item.season_id] = item;
              return acc;
            }, {});
            setSeasonsList(
              seasonsData.reduce((acc, season) => {
                if (season.public && season.leagues.length > 0) {
                  acc.push({
                    ...season,
                    hasCup: Boolean(cupsBySeasonId[season.id]),
                  });
                }
                return acc;
              }, [])
            );
            setLoading(false);
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  if (error) {
    return <Error status={error} />;
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
                        className: classes.season,
                        render: (item) => (
                          <Trans>Temporada {item.season}</Trans>
                        ),
                      },
                      {
                        id: 'actions',
                        className: classnames(
                          'has-text-right',
                          classes.actions
                        ),
                        render: (item) => (
                          <>
                            <Link
                              to={`/ranking/${item.season}`}
                              className={classes.action}
                            >
                              <Trans>Liga</Trans>
                            </Link>
                            {item.hasCup && (
                              <Link
                                to={`/cup/${item.season}`}
                                className={classes.action}
                              >
                                <Trans>Taça</Trans>
                              </Link>
                            )}
                            <Link
                              to={`/genre-rankings/${item.season}`}
                              className={classes.action}
                            >
                              <Trans>Rankings temáticos</Trans>
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
