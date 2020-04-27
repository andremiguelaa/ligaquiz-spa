import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

import ApiRequest from 'utils/ApiRequest';
import Modal from 'utils/Modal';
import { individualQuizTypeOptions, monthListOptions } from './Form/options';
import Event from './Form/Event';

const Form = ({
  monthList,
  individualQuizTypes,
  individualQuizPlayers,
  setPage,
}) => {
  const validMonthListOptions = monthListOptions(monthList);
  const [backModal, setBackModal] = useState(false);

  const [formData, setFormData] = useState({
    month: validMonthListOptions[0],
    saved: false,
    individual_quizzes: [],
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
    const addedIndividualQuizTypes = formData.individual_quizzes.map(
      (individualQuiz) => individualQuiz.individual_quiz_type
    );
    const filteredIndividualQuizTypes = individualQuizTypes.filter(
      (type) => !addedIndividualQuizTypes.includes(type)
    );
    setAvailableIndividualQuizTypes(filteredIndividualQuizTypes);
    setChosenIndividualQuizType(filteredIndividualQuizTypes[0]);
  }, [formData.individual_quizzes, individualQuizTypes]);

  const addEvent = (type) => {
    setFormData({
      ...formData,
      individual_quizzes: [
        ...formData.individual_quizzes,
        {
          individual_quiz_type: type,
          results: [],
        },
      ],
    });
  };

  const saveDisabled =
    !formData.individual_quizzes.length ||
    formData.individual_quizzes.some(
      (quiz) =>
        quiz.results.length === 0 ||
        quiz.results.some((result) => !result.result)
    );

  const saveRanking = () => {
    if (!formData.saved) {
      ApiRequest.post('national-rankings', formData).then(({ data }) => {
        setFormData({
          ...formData,
          saved: true,
          individual_quizzes: data.data,
        });
      });
    } else {
      ApiRequest.patch('national-rankings', formData);
    }
  };

  return (
    <>
      <div className="columns">
        <div className="column">
          <button
            type="button"
            onClick={() => setBackModal(true)}
            className="button"
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
            {formData.saved ? (
              <>
                <div className="label">
                  <Trans>Mês</Trans>
                </div>
                <div>{formData.month}</div>
              </>
            ) : (
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
            )}
          </div>
        </div>
        {formData.individual_quizzes.map((individualQuiz) => (
          <Event
            key={individualQuiz.individual_quiz_type}
            individualQuiz={individualQuiz}
            individualQuizPlayers={individualQuizPlayers}
            formData={formData}
            setFormData={setFormData}
          />
        ))}
        {availableIndividualQuizTypes.length ? (
          <div className="columns">
            <div className="column">
              <button
                type="button"
                className="button"
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
        <div className="columns">
          <div className="column">
            <button
              type="button"
              className="button is-primary"
              onClick={saveRanking}
              disabled={saveDisabled}
            >
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Guardar ranking mensal</Trans>
              </span>
            </button>
          </div>
        </div>
      </form>
      {individualQuizTypeModal && (
        <Modal
          type="info"
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
      )}
      {backModal && (
        <Modal
          type="danger"
          open={backModal}
          title={<Trans>Voltar à listagem</Trans>}
          body={
            <Trans>
              Todos os dados deste formulário serão descartados.
              <br />
              Tens a certeza que queres voltar à listagem?
            </Trans>
          }
          action={() => {
            setPage('list');
          }}
          onClose={() => setBackModal(false)}
        />
      )}
    </>
  );
};

export default Form;
