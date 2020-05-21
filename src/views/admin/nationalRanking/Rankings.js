import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import Modal from 'components/Modal';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';

const Rankings = () => {
  const [error, setError] = useState(false);
  const [months, setMonths] = useState();

  const [monthToDelete, setMonthToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        setMonths(data.data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

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

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <PageHeader title={<Trans>Rankings mensais</Trans>} />
      <div className="section content">
        {!months ? (
          <Loading />
        ) : (
          <>
            <button onClick={() => {}} className="button is-primary">
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Adicionar ranking mensal</Trans>
              </span>
            </button>
            <br />
            <br />
            {months.length ? (
              <table className="table is-fullwidth is-hoverable is-striped">
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
                        <td className="is-vertical-middle">{month}</td>
                        <td>
                          <div className="buttons has-addons is-pulled-right">
                            <button
                              className="button is-danger"
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
    </>
  );
};

export default Rankings;
