import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import getAcronym from 'utils/getAcronym';
import EmptyState from 'components/EmptyState';
import ConditionalWrapper from 'components/ConditionalWrapper';

const List = ({
  individualQuizPlayers,
  setPage,
  editPlayer,
  setPlayerToDelete,
}) => (
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
          {individualQuizPlayers.map((player) => (
            <tr key={player.id}>
              <td className="is-vertical-middle">
                <ConditionalWrapper
                  condition={player.info}
                  wrapper={(children) => (
                    <Link to={`/statistics/${player.info.id}`}>{children}</Link>
                  )}
                >
                  <span className="is-hidden-mobile">
                    {player.name} {player.surname}
                  </span>
                  <abbr
                    data-tooltip={`${player.name} ${player.surname}`}
                    className="is-hidden-tablet has-tooltip-right"
                  >
                    {getAcronym(player.name)}
                    {getAcronym(player.surname)}
                  </abbr>
                </ConditionalWrapper>
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
          ))}
        </tbody>
      </table>
    ) : (
      <EmptyState>
        <Trans>Sem registos</Trans>
      </EmptyState>
    )}
  </>
);

export default List;
