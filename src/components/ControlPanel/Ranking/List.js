import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import EmptyState from 'utils/EmptyState';

const List = ({ monthList, setPage, editMonth, setMonthToDelete }) => {
  return (
    <>
      <button onClick={() => setPage('add')} className="button is-primary">
        <span className="icon">
          <i className="fa fa-plus"></i>
        </span>
        <span>
          <Trans>Adicionar ranking mensal</Trans>
        </span>
      </button>
      <br />
      <br />
      {monthList.length ? (
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
            {monthList.map((entry) => {
              return (
                <tr key={entry}>
                  <td className="is-vertical-middle">
                    <Link to="/">{entry}</Link>
                  </td>
                  <td>
                    <div className="buttons has-addons is-pulled-right">
                      <button
                        className="button"
                        onClick={() => editMonth(entry)}
                      >
                        <span className="icon">
                          <i className="fa fa-edit"></i>
                        </span>
                      </button>
                      <button
                        className="button is-danger"
                        onClick={() => setMonthToDelete(entry)}
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
  );
};

export default List;
