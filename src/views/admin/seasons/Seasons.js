import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import PaginatedTable from 'components/PaginatedTable';

import classes from './Seasons.module.scss';

const Seasons = () => {
  const { page } = useParams();
  const history = useHistory();
  const [{ user }] = useStateValue();
  const [error, setError] = useState(false);
  const [seasons, setSeasons] = useState();
  const [seasonToDelete, setSeasonToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSeasons();
  }, []);

  const getSeasons = () => {
    setSeasons();
    ApiRequest.get('seasons')
      .then(({ data: seasonsData }) => {
        ApiRequest.get(`cups`)
          .then(({ data: cupsData }) => {
            const cupsBySeasonId = cupsData.reduce((acc, item) => {
              acc[item.season_id] = item;
              return acc;
            }, {});
            setSeasons(
              seasonsData.map((season) => ({
                ...season,
                hasCup: Boolean(cupsBySeasonId[season.id]),
              }))
            );
          })
          .catch(({ response }) => {
            setError(response?.status);
          });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  };

  const deleteSeason = (id) => {
    setDeleting(true);
    ApiRequest.delete('seasons', { data: { id } })
      .then(() => {
        toast.success(<Trans>Temporada apagada com sucesso.</Trans>);
        getSeasons();
        setSeasonToDelete();
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar a temporada.</Trans>);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  if (!user) {
    return <Error status={401} />;
  }

  if (!user.valid_roles.admin) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  return (
    <>
      <PageHeader title={<Trans>Temporadas</Trans>} />
      <div className="section">
        {!seasons ? (
          <Loading />
        ) : (
          <>
            <Link className="button is-primary" to="/admin/season/create">
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Criar temporada</Trans>
              </span>
            </Link>
            <br />
            <br />
            {seasons.length ? (
              <PaginatedTable
                array={seasons}
                initialPage={page ? page : 1}
                hideHeader
                columns={[
                  {
                    id: 'season',
                    className: classnames('is-vertical-middle', classes.season),
                    render: (item) => (
                      <>
                        <span className="is-hidden-mobile">
                          <Trans>Temporada {item.season}</Trans>
                        </span>
                        <span className="is-hidden-tablet">
                          <Trans>T. {item.season}</Trans>
                        </span>
                      </>
                    ),
                  },
                  {
                    id: 'competitions',
                    className: 'is-vertical-middle',
                    render: (item) => (
                      <>
                        {item.leagues.length > 0 && (
                          <Link
                            to={`/ranking/${item.season}`}
                            className={classes.competition}
                          >
                            <Trans>Liga</Trans>
                          </Link>
                        )}
                        {item.hasCup && (
                          <Link
                            to={`/cup/${item.season}`}
                            className={classes.competition}
                          >
                            <Trans>Taça</Trans>
                          </Link>
                        )}
                      </>
                    ),
                  },
                  {
                    id: 'actions',
                    className: classes.actions,
                    render: (item) => (
                      <>
                        <div className="buttons has-addons is-pulled-right">
                          {!item.past && (
                            <>
                              <Link
                                className="button"
                                to={`/admin/season/${item.season}/edit`}
                              >
                                <span className="icon">
                                  <i className="fa fa-edit"></i>
                                </span>
                              </Link>
                              <button
                                className="button is-danger"
                                type="button"
                                onClick={() => {
                                  setSeasonToDelete(item.id);
                                }}
                              >
                                <span className="icon">
                                  <i className="fa fa-trash"></i>
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    ),
                  },
                ]}
                onChange={(newPage) => {
                  history.push(`/admin/seasons/${newPage}`);
                }}
                onError={(code) => {
                  setError(code);
                }}
              />
            ) : (
              <EmptyState>
                <Trans>Sem registos</Trans>
              </EmptyState>
            )}
          </>
        )}
      </div>
      {seasonToDelete && (
        <Modal
          type="danger"
          open
          title={<Trans>Apagar temporada</Trans>}
          body={<Trans>Tens a certeza que queres apagar esta temporada?</Trans>}
          action={() => deleteSeason(seasonToDelete)}
          doingAction={deleting}
          onClose={() => setSeasonToDelete()}
        />
      )}
    </>
  );
};

export default Seasons;
