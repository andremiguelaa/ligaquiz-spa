import React from 'react';
import { Trans } from '@lingui/macro';

import EmptyState from 'components/EmptyState';

const List = ({
  individualQuizPlayers,
  setPage,
  editPlayer,
  setPlayerToDelete,
}) => {
  return (
    <>
      <button onClick={() => setPage('add')} className="button is-primary">
        <span className="icon">
          <i className="fa fa-plus"></i>
        </span>
        <span>
          <Trans>Adicionar jogador</Trans>
        </span>
      </button>
      <br />
      <br />
      {individualQuizPlayers.length ? (
        <table className="table is-fullwidth is-hoverable is-striped">
          <thead>
            <tr>
              <th>
                <Trans>Jogador</Trans>
              </th>
              <th className="has-text-right">
                <Trans>Acções</Trans>
              </th>
            </tr>
          </thead>
          <tbody>
            {individualQuizPlayers.map((player) => {
              return (
                <tr key={player.id}>
                  <td className="is-vertical-middle">
                    {player.name} {player.surname}
                  </td>
                  <td>
                    <div className="buttons has-addons is-pulled-right">
                      <button
                        className="button"
                        onClick={() =>
                          editPlayer({
                            id: player.id,
                            name: player.name,
                            surname: player.surname,
                            ...(player.info && {
                              user_id: player.info.id,
                            }),
                          })
                        }
                      >
                        <span className="icon">
                          <i className="fa fa-edit"></i>
                        </span>
                      </button>
                      <button
                        className="button is-danger"
                        onClick={() => setPlayerToDelete(player.id)}
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
