import React from 'react';
import { Trans } from '@lingui/macro';

const Player = ({player, individualQuizPlayers, setPlayerToRemove}) => {
  const playerInfo = individualQuizPlayers.find(
    (individualQuizPlayer) =>
      individualQuizPlayer.id === player.individual_quiz_player_id
  );
  return (
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
  );
};

export default Player;
