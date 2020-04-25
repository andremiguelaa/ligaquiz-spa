import React, { useState, useEffect, useRef } from 'react';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'utils/Loading';
import Error from 'utils/Error';
import EmptyState from 'utils/EmptyState';
import Modal from 'utils/Modal';

const Ranking = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const [monthToDelete, setMonthToDelete] = useState();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiRequest.get('national-rankings')
      .then(({ data }) => {
        setData(data.data);
      })
      .catch(() => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  const deleteRanking = (date) => {
    setDeleting(true);
    ApiRequest.delete('national-rankings', { data: { month: date } })
      .then(() => {
        setData(data.filter((item) => item !== date));
        setMonthToDelete();
      })
      .catch(() => {
        setError(true);
      })
      .then(() => {
        setDeleting(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  return (
    <>
      <a href="#" className="button is-primary">
        <span className="icon">
          <i className="fa fa-plus"></i>
        </span>
        <span>
          <Trans>Adicionar ranking mensal</Trans>
        </span>
      </a>
      <br />
      <br />
      {data.length ? (
        <table className="table is-fullwidth is-hoverable is-striped">
          <thead>
            <tr>
              <th>
                <Trans>Mês</Trans>
              </th>
              <th>
                <Trans>Acções</Trans>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => {
              return (
                <tr key={entry}>
                  <td>{entry}</td>
                  <td>
                    <a href="#">
                      <i className="fa fa-eye"></i> Ver
                    </a>
                    &nbsp;&nbsp;
                    <a href="#">
                      <i className="fa fa-edit"></i> Editar
                    </a>
                    &nbsp;&nbsp;
                    <button
                      className="link"
                      onClick={() => setMonthToDelete(entry)}
                    >
                      <i className="fa fa-trash"></i> Apagar
                    </button>
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
      <Modal
        type="danger"
        open={monthToDelete}
        title={<Trans>Apagar ranking mensal</Trans>}
        body={
          <Trans>
            Tens a certeza que queres apagar este ranking mensal (
            {monthToDelete}) e todos os quizzes associados?
          </Trans>
        }
        action={() => deleteRanking(monthToDelete)}
        doingAction={deleting}
        onClose={() => setMonthToDelete()}
      />
    </>
  );
};

export default Ranking;
