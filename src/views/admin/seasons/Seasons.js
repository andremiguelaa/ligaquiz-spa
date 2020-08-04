import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import PaginatedTable from 'components/PaginatedTable';

const Seasons = () => {
  const { page } = useParams();
  let history = useHistory();
  const [error, setError] = useState(false);
  const [seasons, setSeasons] = useState();

  useEffect(() => {
    getSeasons();
  }, []);

  const getSeasons = () => {
    ApiRequest.get('seasons?rounds=true')
      .then(({ data }) => {
        setSeasons(data);
      })
      .catch(() => {
        setError(true);
      });
  };

  const deleteSeason = (id) => {
    setSeasons();
    ApiRequest.delete('seasons', { data: { id } })
      .then(() => {
        toast.success(<Trans>Temporada apagada com sucesso.</Trans>);
        getSeasons();
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar a temporada.</Trans>);
        getSeasons();
      });
  };

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
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
                    className: 'is-vertical-middle',
                    render: (item) => (
                      <Link to={`/ranking/${item.season}`}>
                        <Trans>Temporada {item.season}</Trans>
                      </Link>
                    ),
                  },
                  {
                    id: 'actions',
                    render: (item) => (
                      <>
                        <div className="buttons has-addons is-pulled-right">
                          {item.rounds[0].date > moment().format('YYYY-MM-DD') && (
                            <>
                              <Link
                                className="button"
                                to={`/admin/seasons/${item.season}/edit`}
                              >
                                <span className="icon">
                                  <i className="fa fa-edit"></i>
                                </span>
                              </Link>
                              <button
                                className="button is-danger"
                                onClick={() => {
                                  deleteSeason(item.id);
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
    </>
  );
};

export default Seasons;
