import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import Modal from 'utils/Modal';

const individualQuizTypeOptions = (type, render) =>
  ({
    cnq: (
      <Trans key="cnq" render={render}>
        Campeonato Nacional de Quiz
      </Trans>
    ),
    eqc: (
      <Trans key="eqc" render={render}>
        Campeonato Europeu de Quiz
      </Trans>
    ),
    inquizicao: (
      <Trans key="inquizicao" render={render}>
        Inquizição
      </Trans>
    ),
    squizzed: (
      <Trans key="squizzed" render={render}>
        Squizzed
      </Trans>
    ),
    wqc: (
      <Trans key="wqc" render={render}>
        Campeonato Mundial de Quiz
      </Trans>
    ),
    hot_100: (
      <Trans key="hot_100" render={render}>
        HOT 100
      </Trans>
    ),
  }[type]);

let monthListOptions = [];
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
while (!(currentYear === 2016 && currentMonth === 10)) {
  monthListOptions.push(`${currentYear}-${`${currentMonth}`.padStart(2, '0')}`);
  currentMonth--;
  if (!currentMonth) {
    currentMonth = 12;
    currentYear--;
  }
}

const Add = ({ monthList, individualQuizTypes, setPage }) => {
  const validMonthListOptions = monthListOptions.filter(
    (month) => !monthList.includes(month)
  );

  const [formData, setFormData] = useState({
    month: validMonthListOptions[0],
    individualQuizzes: [],
  });
  const [individualQuizTypeModal, setIndividualQuizTypeModal] = useState(false);
  const [chosenIndividualQuizType, setChosenIndividualQuizType] = useState(
    individualQuizTypes[0]
  );
  const [
    availableIndividualQuizTypes,
    setAvailableIndividualQuizTypes,
  ] = useState(individualQuizTypes);

  useEffect(() => {
    const addedIndividualQuizTypes = formData.individualQuizzes.map(
      (individualQuiz) => individualQuiz.type
    );
    const filteredIndividualQuizTypes = individualQuizTypes.filter(
      (type) => !addedIndividualQuizTypes.includes(type)
    );
    setAvailableIndividualQuizTypes(filteredIndividualQuizTypes);
    setChosenIndividualQuizType(filteredIndividualQuizTypes[0]);
  }, [formData.individualQuizzes]);

  const addEvent = (type) => {
    setFormData({
      ...formData,
      individualQuizzes: [
        ...formData.individualQuizzes,
        {
          key: Date.now(),
          type,
          players: [],
        },
      ],
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
          <button
            type="button"
            onClick={() => setPage('list')}
            className="button is-primary"
          >
            <span className="icon">
              <i className="fa fa-chevron-left"></i>
            </span>
            <span>
              <Trans>Voltar à listagem</Trans>
            </span>
          </button>
        </div>
      </div>
      <form>
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">
                <Trans>Mês</Trans>
              </label>
              <div className="control has-icons-left">
                <div className="select">
                  <select
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        month: event.target.value,
                      });
                    }}
                  >
                    {validMonthListOptions.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="icon is-small is-left">
                  <i className="fa fa-calendar"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {formData.individualQuizzes.map((individualQuiz) => (
          <div className="columns" key={individualQuiz.key}>
            <div className="column">
              <fieldset>
                <label className="label">
                  {individualQuizTypeOptions(individualQuiz.type)}
                </label>
                <button
                  type="button"
                  className="button is-primary"
                  onClick={() => addPlayerToEvent(individualQuiz)}
                >
                  <span className="icon">
                    <i className="fa fa-plus"></i>
                  </span>
                  <span>
                    <Trans>Adicionar jogador</Trans>
                  </span>
                </button>
                <button type="button" className="button is-danger">
                  <span className="icon">
                    <i className="fa fa-trash"></i>
                  </span>
                </button>
                {individualQuiz.players.map((player) => (
                  <fieldset key={player.key}>
                    <select>
                      <option value="cenas">cenas</option>
                    </select>
                    <input type="number" value={player.result} />
                    <button type="button" className="button is-danger">
                      <span className="icon">
                        <i className="fa fa-trash"></i>
                      </span>
                    </button>
                  </fieldset>
                ))}
              </fieldset>
            </div>
          </div>
        ))}
        {availableIndividualQuizTypes.length ? (
          <div className="columns">
            <div className="column">
              <button
                type="button"
                className="button is-primary"
                onClick={() => setIndividualQuizTypeModal(true)}
              >
                <span className="icon">
                  <i className="fa fa-plus"></i>
                </span>
                <span>
                  <Trans>Adicionar prova</Trans>
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </form>
      <Modal
        type="primary"
        open={individualQuizTypeModal}
        title={<Trans>Escolher tipo de prova</Trans>}
        body={
          <div className="control has-icons-left">
            <div className="select">
              <select
                onChange={(event) => {
                  setChosenIndividualQuizType(event.target.value);
                }}
              >
                {availableIndividualQuizTypes.map((individualQuizType) =>
                  individualQuizTypeOptions(
                    individualQuizType,
                    <option value={individualQuizType} />
                  )
                )}
              </select>
            </div>
            <div className="icon is-small is-left">
              <i className="fa fa-trophy"></i>
            </div>
          </div>
        }
        action={() => {
          addEvent(chosenIndividualQuizType);
          setIndividualQuizTypeModal(false);
        }}
        onClose={() => setIndividualQuizTypeModal(false)}
      />
    </>
  );
};

export default Add;
