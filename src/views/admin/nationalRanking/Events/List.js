import React from 'react';
import { Trans } from '@lingui/macro';

import getLocaleMonth from 'utils/getLocaleMonth';
import { useStateValue } from 'state/State';
import EmptyState from 'components/EmptyState';

const List = ({ monthList, setPage, editMonth, setMonthToDelete }) => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  return (
    <>
      <button onClick={() => setPage('add')} className="button is-primary">
        <span className="icon">
          <i className="fa fa-plus"></i>
        </span>
        <span>
          <Trans>Adicionar provas mensais</Trans>
        </span>
      </button>
      <br />
      <br />
      {monthList.length ? (
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
            {monthList.map((entry) => {
              return (
                <tr key={entry}>
                  <td className="is-vertical-middle">
                    <Trans>
                      {getLocaleMonth(
                        language,
                        parseInt(entry.substring(5, 7))
                      )}{' '}
                      de {entry.substring(0, 4)}
                    </Trans>
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
