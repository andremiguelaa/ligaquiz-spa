import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import getLocaleMonth from 'utils/getLocaleMonth';
import { useStateValue } from 'state/State';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Modal from 'components/Modal';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';

import { monthListOptions } from './utils/options';

const Rankings = () => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();

  const [error, setError] = useState(false);
  const [months, setMonths] = useState();

  const [monthToDelete, setMonthToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  const [publishModal, setPublishModal] = useState(false);
  const [validMonthListOptions, setValidMonthListOptions] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [monthToPublish, setMonthToPublish] = useState();

  useEffect(() => {
    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        setMonths(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  useEffect(() => {
    if (months) {
      setValidMonthListOptions(monthListOptions(months));
    }
  }, [months]);

  useEffect(() => {
    if (validMonthListOptions.length) {
      setMonthToPublish(validMonthListOptions[0]);
    }
  }, [validMonthListOptions]);

  const deleteMonth = (month) => {
    setDeleting(true);
    ApiRequest.delete('national-rankings', { data: { month } })
      .then(() => {
        setMonths(months.filter((item) => item !== month));
        toast.success(<Trans>Ranking mensal apagado com sucesso.</Trans>);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível apagar o ranking mensal.</Trans>);
      })
      .then(() => {
        setMonthToDelete();
        setDeleting(false);
      });
  };

  if (!user) {
    return <Error status={401} />;
  }

  if (!user.valid_roles.admin && !user.valid_roles.national_ranking_manager) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  return (
    <>
      <PageHeader title={<Trans>Rankings mensais</Trans>} />
      <div className="section content">
        {!months ? (
          <Loading />
        ) : (
          <>
            {validMonthListOptions.length && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setPublishModal(true);
                  }}
                  className="button is-primary"
                >
                  <span className="icon">
                    <i className="fa fa-plus"></i>
                  </span>
                  <span>
                    <Trans>Publicar ranking mensal</Trans>
                  </span>
                </button>
                <br />
                <br />
              </>
            )}
            {months.length ? (
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>
                      <Trans>Mês</Trans>
                    </th>
                    <th className="has-text-right">
                      <Trans>Acções</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((month) => {
                    return (
                      <tr key={month}>
                        <td className="is-vertical-middle">
                          <Link to={`/national-ranking/${month}`}>
                            <Trans>
                              {getLocaleMonth(
                                language,
                                parseInt(month.substring(5, 7))
                              )}{' '}
                              de {month.substring(0, 4)}
                            </Trans>
                          </Link>
                        </td>
                        <td>
                          <div className="buttons has-addons is-pulled-right">
                            <button
                              className="button is-danger"
                              type="button"
                              onClick={() => setMonthToDelete(month)}
                            >
                              <span className="icon">
                                <i className="fa fa-trash"></i>
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <EmptyState>
                <Trans>Sem registos</Trans>
              </EmptyState>
            )}
          </>
        )}
      </div>
      <Modal
        type="danger"
        open={monthToDelete}
        title={<Trans>Apagar ranking mensal</Trans>}
        body={
          <Trans>Tens a certeza que queres apagar este ranking mensal?</Trans>
        }
        action={() => deleteMonth(monthToDelete)}
        doingAction={deleting}
        onClose={() => setMonthToDelete()}
      />
      {publishModal && (
        <Modal
          type="info"
          open={publishModal}
          title={<Trans>Publicar ranking mensal</Trans>}
          body={
            <>
              <div className="field">
                <label className="label">
                  <Trans>Mês</Trans>
                </label>
                <div className="control has-icons-left">
                  <div className="select">
                    <select
                      onChange={(event) => {
                        setMonthToPublish(event.target.value);
                      }}
                    >
                      {validMonthListOptions.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="icon is-small is-left">
                    <i className="fa fa-calendar"></i>
                  </div>
                </div>
              </div>
            </>
          }
          action={() => {
            setPublishing(true);
            ApiRequest.post('national-rankings', { month: monthToPublish })
              .then(() => {
                setMonths(
                  [...months, monthToPublish].sort((a, b) => b.localeCompare(a))
                );
                setPublishModal(false);
                toast.success(
                  <Trans>Ranking mensal publicado com sucesso.</Trans>
                );
              })
              .catch(() => {
                toast.error(
                  <Trans>Não foi possível publicar o ranking mensal.</Trans>
                );
              })
              .then(() => {
                setPublishing(false);
              });
          }}
          doingAction={publishing}
          onClose={() => setPublishModal(false)}
        />
      )}
    </>
  );
};

export default Rankings;
