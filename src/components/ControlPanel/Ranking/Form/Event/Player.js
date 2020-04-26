import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import Modal from 'utils/Modal';

const Player = ({
  individualQuiz,
  player,
  individualQuizPlayers,
  removePlayer,
  formData,
  setFormData,
}) => {
  const [playerToRemove, setPlayerToRemove] = useState();
  const playerInfo = individualQuizPlayers.find(
    (individualQuizPlayer) =>
      individualQuizPlayer.id === player.individual_quiz_player_id
  );

  const updatePlayerResult = (score) => {
    const individualQuizIndex = formData.individualQuizzes.findIndex(
      (quiz) =>
        individualQuiz.individual_quiz_type === quiz.individual_quiz_type
    );
    const newIndividualQuizzes = [...formData.individualQuizzes];

    const playerIndex = newIndividualQuizzes[
      individualQuizIndex
    ].results.findIndex(
      (result) =>
        player.individual_quiz_player_id === result.individual_quiz_player_id
    );
    newIndividualQuizzes[individualQuizIndex].results[
      playerIndex
    ].result = score;
    setFormData({
      ...formData,
      individualQuizzes: newIndividualQuizzes,
    });
  };
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
          <input
            className="input"
            type="number"
            onChange={(event) => {
              updatePlayerResult(event.target.value);
            }}
          />
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
