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

  const addPlayerToEvent = (individualQuiz) => {
    const individualQuizIndex = formData.individualQuizzes.findIndex(
      (element) => individualQuiz.key === element.key
    );
    const newIndividualQuizzes = [...formData.individualQuizzes];
    newIndividualQuizzes[individualQuizIndex].players.push({
      key: Date.now(),
      individual_quiz_player_id: undefined,
      result: undefined,
    });
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
              {individualQuizTypeOptions(individualQuiz.type)}
            </label>
            <div className="field has-addons">
              <div className="control">
                <button
                  type="button"
                  className="button"
                  onClick={() => addPlayerToEvent(individualQuiz)}
                >
                  <span className="icon">
                    <i className="fa fa-plus"></i>
                  </span>
                  <span>
                    <Trans>Adicionar jogador</Trans>
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
            {individualQuiz.players.map((player) => (
              <div className="field has-addons" key={player.key}>
                <div className="control has-icons-left">
                  <div className="select">
                    <select>
                      {individualQuizPlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name} {player.surname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="icon is-small is-left">
                    <i className="fa fa-user"></i>
                  </div>
                </div>
                <div className="control has-icons-left">
                  <input className="input" type="number" />
                  <span className="icon is-small is-left">
                    <i className="fa fa-star" />
                  </span>
                </div>
                <div className="control">
                  <button type="button" className="button is-danger">
                    <span className="icon">
                      <i className="fa fa-trash"></i>
                    </span>
                    <span>
                      <Trans>Remover jogador</Trans>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
    </>
  );
};

export default Event;
