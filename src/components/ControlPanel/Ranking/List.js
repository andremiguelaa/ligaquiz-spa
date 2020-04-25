import React from 'react';
import { Trans } from '@lingui/macro';
import EmptyState from 'utils/EmptyState';

const List = ({ data, setMonthToDelete }) => {
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
    </>
  );
};

export default List;
