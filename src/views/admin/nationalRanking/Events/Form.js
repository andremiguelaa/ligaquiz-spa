import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

import { useStateValue } from 'state/State';
import { convertToLongMonth } from 'utils/formatDate';
import Error from 'components/Error';
import ApiRequest from 'utils/ApiRequest';
import Modal from 'components/Modal';
import PageHeader from 'components/PageHeader';
import Loading from 'components/Loading';
import { individualQuizTypeOptions, monthListOptions } from '../utils/options';
import Event from './Form/Event';

const Form = () => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  const { month } = useParams();
  const history = useHistory();
  const [error, setError] = useState(false);

  const [monthList, setMonthList] = useState();
  const [individualQuizTypes, setIndividualQuizTypes] = useState();
  const [individualQuizPlayers, setIndividualQuizPlayers] = useState();
  const [loadingMonthData, setLoadingMonthData] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState();
  const [individualQuizTypeModal, setIndividualQuizTypeModal] = useState(false);
  const [chosenIndividualQuizType, setChosenIndividualQuizType] = useState();
  const [
    availableIndividualQuizTypes,
    setAvailableIndividualQuizTypes,
  ] = useState();

  useEffect(() => {
    ApiRequest.get('individual-quizzes')
      .then(({ data }) => {
        const list = [
          ...new Set(data.map((event) => event.month)),
        ].sort((a, b) => b.localeCompare(a));
        setMonthList(list);
        setFormData({
          month: monthListOptions(list)[0],
          individual_quizzes: [],
        });
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
    ApiRequest.get('individual-quiz-types')
      .then(({ data }) => {
        setIndividualQuizTypes(data);
        setChosenIndividualQuizType(data[0]);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
    ApiRequest.get('individual-quiz-players')
      .then(({ data }) => {
        setIndividualQuizPlayers(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
    if (month) {
      setLoadingMonthData(true);
      ApiRequest.get(`individual-quizzes?results&month[]=${month}`)
        .then(({ data }) => {
          setFormData({
            month: data[0].month,
            individual_quizzes: data.map(
              ({ individual_quiz_type, results }) => ({
                individual_quiz_type,
                results,
              })
            ),
          });
        })
        .catch(() => {
          toast.error(
            <Trans>Não foi possível abrir a edição das provas mensais.</Trans>
          );
        })
        .then(() => {
          setLoadingMonthData(false);
        });
    }
  }, [month]);

  useEffect(() => {
    if (individualQuizTypes && formData) {
      const addedIndividualQuizTypes = formData.individual_quizzes.map(
        (individualQuiz) => individualQuiz.individual_quiz_type
      );
      const filteredIndividualQuizTypes = individualQuizTypes.filter(
        (type) => !addedIndividualQuizTypes.includes(type)
      );
      setAvailableIndividualQuizTypes(filteredIndividualQuizTypes);
      setChosenIndividualQuizType(filteredIndividualQuizTypes[0]);
    }
  }, [formData, individualQuizTypes]);

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

  const saveRanking = () => {
    setSaving(true);
    if (!month) {
      ApiRequest.post('individual-quizzes', formData)
        .then(() => {
          toast.success(<Trans>Provas mensais criadas com sucesso.</Trans>);
          history.push(`/admin/national-ranking/events/${formData.month}/edit`);
        })
        .catch(() => {
          toast.error(
            <Trans>Não foi possível gravar as provas mensais.</Trans>
          );
        })
        .then(() => {
          setSaving(false);
        });
    } else {
      ApiRequest.patch('individual-quizzes', formData)
        .then(() => {
          toast.success(
            <Trans>Provas mensais actualizadas com sucesso.</Trans>
          );
        })
        .catch(() => {
          toast.error(
            <Trans>Não foi possível gravar as provas mensais.</Trans>
          );
        })
        .then(() => {
          setSaving(false);
        });
    }
  };

  if (!user) {
    return <Error status={401} />;
  }

  if (!user.valid_roles.admin && !user.valid_roles.national_ranking_manager) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (
    !monthList ||
    !individualQuizTypes ||
    !individualQuizPlayers ||
    loadingMonthData ||
    !formData
  ) {
    return <Loading />;
  }

  const validMonthListOptions = monthListOptions(monthList);

  const saveDisabled =
    !formData.individual_quizzes.length ||
    formData.individual_quizzes.some(
      (quiz) =>
        quiz.results.length === 0 ||
        quiz.results.some(
          (result) =>
            !result.result === undefined ||
            result.result?.toString() !== Math.round(result?.result).toString()
        )
    );

  return (
    <>
      <PageHeader
        title={
          !month ? (
            <Trans>Adicionar provas mensais</Trans>
          ) : (
            <Trans>
              Editar provas mensais de {convertToLongMonth(month, language)}
            </Trans>
          )
        }
      />
      <div className="section content">
        <form>
          <div className="columns">
            <div className="column">
              {!month && (
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
                className={`button is-primary ${saving ? 'is-loading' : ''}`}
                onClick={saveRanking}
                disabled={saveDisabled || saving}
              >
                <span className="icon">
                  <i className="fa fa-plus"></i>
                </span>
                <span>
                  <Trans>Guardar provas mensais</Trans>
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
      </div>
    </>
  );
};

export default Form;
