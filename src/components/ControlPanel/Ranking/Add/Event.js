import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import Modal from 'utils/Modal';
import { individualQuizTypeOptions } from '../Add/options';
import Player from './Event/Player';

const Event = ({
  individualQuiz,
  individualQuizPlayers,
  formData,
  setFormData,
}) => {
  const [removeEventModal, setRemoveEventModal] = useState(false);
  const [addPlayersModal, setAddPlayersModal] = useState();
  const [playersToAdd, setPlayersToAdd] = useState([]);
  
  const individualQuizPlayersIds = individualQuizPlayers.map(
    (player) => player.id
  );

  const getNonSelectedPlayers = () =>
    individualQuizPlayersIds.filter(
      (playerId) =>
        !individualQuiz.results
          .map((player) => player.individual_quiz_player_id)
          .includes(playerId)
    );

  const removeEvent = () => {
    let newIndividualQuizzes = [...formData.individualQuizzes];
    newIndividualQuizzes = newIndividualQuizzes.filter(
      (quiz) =>
        quiz.individual_quiz_type !== individualQuiz.individual_quiz_type
    );
    setFormData({
      ...formData,
      individualQuizzes: newIndividualQuizzes,
    });
  };

  const addPlayers = (players) => {
    const individualQuizIndex = formData.individualQuizzes.findIndex(
      (event) =>
        individualQuiz.individual_quiz_type === event.individual_quiz_type
    );
    const newIndividualQuizzes = [...formData.individualQuizzes];
    players.forEach((id) => {
      newIndividualQuizzes[individualQuizIndex].results.push({
        individual_quiz_player_id: id,
        result: undefined,
      });
    });
    setFormData({
      ...formData,
      individualQuizzes: newIndividualQuizzes,
    });
  };

  const removePlayer = (playerToRemove) => {
    const individualQuizIndex = formData.individualQuizzes.findIndex(
      (event) =>
        individualQuiz.individual_quiz_type === event.individual_quiz_type
    );
    const newIndividualQuizzes = [...formData.individualQuizzes];
    newIndividualQuizzes[individualQuizIndex].results = newIndividualQuizzes[
      individualQuizIndex
    ].results.filter(
      (player) => player.individual_quiz_player_id !== playerToRemove
    );
    setFormData({
      ...formData,
      individualQuizzes: newIndividualQuizzes,
    });
  };

  return (
    <>
      <div className="columns">
        <div className="column">
          <div className="box">
            <label className="label">
              {individualQuizTypeOptions(individualQuiz.individual_quiz_type)}
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
                      individualQuiz.results.length <
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
            {individualQuiz.results.map((player) => (
              <Player
                key={player.individual_quiz_player_id}
                player={player}
                individualQuizPlayers={individualQuizPlayers}
                removePlayer={removePlayer}
              />
            ))}
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
    </>
  );
};

export default Event;
