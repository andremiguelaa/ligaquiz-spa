import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import Modal from 'utils/Modal';
import { individualQuizTypeOptions } from '../Add/options';

const Event = ({
  individualQuiz,
  individualQuizPlayers,
  formData,
  setFormData,
}) => {
  const [removeEventModal, setRemoveEventModal] = useState(false);
  const [addPlayersModal, setAddPlayersModal] = useState();
  const [playersToAdd, setPlayersToAdd] = useState([]);
  const [playerToRemove, setPlayerToRemove] = useState();

  const individualQuizPlayersIds = individualQuizPlayers.map(
    (player) => player.id
  );

  const getNonSelectedPlayers = () =>
    individualQuizPlayersIds.filter(
      (playerId) =>
        !individualQuiz.players
          .map((player) => player.individual_quiz_player_id)
          .includes(playerId)
    );

  const removeEvent = () => {
    let newIndividualQuizzes = [...formData.individualQuizzes];
    newIndividualQuizzes = newIndividualQuizzes.filter(
      (quiz) => quiz.type !== individualQuiz.type
    );
    setFormData({
      ...formData,
      individualQuizzes: newIndividualQuizzes,
    });
  };

  const addPlayers = (players) => {
    const individualQuizIndex = formData.individualQuizzes.findIndex(
      (event) => individualQuiz.key === event.key
    );
    const newIndividualQuizzes = [...formData.individualQuizzes];
    players.forEach((id) => {
      newIndividualQuizzes[individualQuizIndex].players.push({
        individual_quiz_player_id: id,
        result: undefined,
      });
    });
    setFormData({
      ...formData,
      individualQuizzes: newIndividualQuizzes,
    });
  };

  const removePlayer = () => {
    const individualQuizIndex = formData.individualQuizzes.findIndex(
      (event) => individualQuiz.key === event.key
    );
    const newIndividualQuizzes = [...formData.individualQuizzes];
    newIndividualQuizzes[individualQuizIndex].players = newIndividualQuizzes[
      individualQuizIndex
    ].players.filter(
      (player) => player.individual_quiz_player_id !== playerToRemove
    );
    setFormData({
      ...formData,
      individualQuizzes: newIndividualQuizzes,
    });
    setPlayerToRemove();
  };

  return (
    <>
      <div className="columns">
        <div className="column">
          <div className="box">
            <label className="label">
              {individualQuizTypeOptions(individualQuiz.type)}
            </label>
            <div className="field has-addons">
              <div className="control">
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    setPlayersToAdd([]);
                    setAddPlayersModal(true);
                  }}
                  disabled={
                    !(
                      individualQuiz.players.length <
                      individualQuizPlayers.length
                    )
                  }
                >
                  <span className="icon">
                    <i className="fa fa-plus"></i>
                  </span>
                  <span>
                    <Trans>Adicionar jogadores</Trans>
                  </span>
                </button>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-danger"
                  onClick={() => setRemoveEventModal(true)}
                >
                  <span className="icon">
                    <i className="fa fa-trash"></i>
                  </span>
                  <span>
                    <Trans>Remover prova</Trans>
                  </span>
                </button>
              </div>
            </div>
            {individualQuiz.players.map((player) => {
              const playerInfo = individualQuizPlayers.find(
                (individualQuizPlayer) =>
                  individualQuizPlayer.id === player.individual_quiz_player_id
              );
              return (
                <div
                  className="field has-addons"
                  key={player.individual_quiz_player_id}
                >
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
                      onClick={() =>
                        setPlayerToRemove(player.individual_quiz_player_id)
                      }
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
            })}
          </div>
        </div>
      </div>
      {removeEventModal && (
        <Modal
          type="danger"
          open={removeEventModal}
          title={<Trans>Remover prova</Trans>}
          body={
            <Trans>
              Tens a certeza que queres apagar esta prova e todos os resultados
              associados?
            </Trans>
          }
          action={() => {
            removeEvent();
            setRemoveEventModal(false);
          }}
          onClose={() => setRemoveEventModal(false)}
        />
      )}
      {addPlayersModal && (
        <Modal
          type="info"
          open={addPlayersModal}
          title={<Trans>Adicionar jogadores</Trans>}
          body={
            <>
              <Trans>Selecciona os jogadores que jogaram esta prova:</Trans>
              {getNonSelectedPlayers().map((player) => {
                const playerInfo = individualQuizPlayers.find(
                  (individualQuizPlayer) => individualQuizPlayer.id === player
                );
                return (
                  <div key={player}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        value={player}
                        onChange={(event) => {
                          const newPlayersToAdd = [...playersToAdd];
                          if (event.target.checked) {
                            newPlayersToAdd.push(parseInt(event.target.value));
                            setPlayersToAdd(newPlayersToAdd);
                          } else {
                            setPlayersToAdd(
                              newPlayersToAdd.filter(
                                (playerToAdd) =>
                                  playerToAdd !== parseInt(event.target.value)
                              )
                            );
                          }
                        }}
                      />{' '}
                      {playerInfo.name} {playerInfo.surname}
                    </label>
                  </div>
                );
              })}
            </>
          }
          action={() => {
            addPlayers(playersToAdd);
            setAddPlayersModal(false);
          }}
          onClose={() => setAddPlayersModal(false)}
        />
      )}
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
            removePlayer();
          }}
          onClose={() => setPlayerToRemove()}
        />
      )}
    </>
  );
};

export default Event;
