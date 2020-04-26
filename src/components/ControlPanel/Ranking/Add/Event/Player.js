import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import Modal from 'utils/Modal';

const Player = ({ player, individualQuizPlayers, removePlayer }) => {
  const [playerToRemove, setPlayerToRemove] = useState();
  const playerInfo = individualQuizPlayers.find(
    (individualQuizPlayer) =>
      individualQuizPlayer.id === player.individual_quiz_player_id
  );
  return (
    <>
      <div className="field has-addons">
        <div className="control">
          <div type="button" className="button" disabled>
            <span className="icon">
              <i className="fa fa-user"></i>
            </span>
            <span>
              {playerInfo.name} {playerInfo.surname}
            </span>
          </div>
        </div>
        <div className="control has-icons-left">
          <input className="input" type="number" />
          <span className="icon is-small is-left">
            <i className="fa fa-star" />
          </span>
        </div>
        <div className="control">
          <button
            type="button"
            className="button is-danger"
            onClick={() => setPlayerToRemove(player.individual_quiz_player_id)}
          >
            <span className="icon">
              <i className="fa fa-trash"></i>
            </span>
            <span>
              <Trans>Remover jogador</Trans>
            </span>
          </button>
        </div>
      </div>
      {playerToRemove && (
        <Modal
          type="danger"
          open={playerToRemove}
          title={<Trans>Remover jogador</Trans>}
          body={
            <Trans>
              Tens a certeza que queres apagar este jogador e o resultado
              associado?
            </Trans>
          }
          action={() => {
            removePlayer(playerToRemove);
            setPlayerToRemove();
          }}
          onClose={() => setPlayerToRemove()}
        />
      )}
    </>
  );
};

export default Player;
