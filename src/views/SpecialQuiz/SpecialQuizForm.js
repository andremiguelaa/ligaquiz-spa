import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';
import Markdown from 'components/Markdown';
import Modal from 'components/Modal';

import classes from './SpecialQuiz.module.scss';

const saveDraft = debounce((id, text, points) => {
  ApiRequest.post(`answers`, {
    question_id: id,
    text,
    points: points || 0,
  });
}, 1000);

const SpecialQuizForm = ({ data, userAnswers }) => {
  const [, dispatch] = useStateValue();
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    answers: data.quiz.questions.map((question) => ({
      question_id: question.id,
      text: userAnswers[question.id]?.[0].text,
      points: userAnswers[question.id]?.[0].points || 0,
    })),
  });
  const [submitModal, setSubmitModal] = useState(false);

  useEffect(() => {
    ApiRequest.post(`logs`, {
      action: `Special quiz form opened`,
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitModal(true);
  };

  const submitQuiz = () => {
    setSubmitting(true);
    ApiRequest.post(`special-quizzes/submit`, formData)
      .then(() => {
        dispatch({
          type: 'notifications.set',
          payload: {
            special_quiz: false,
          },
        });
        toast.success(<Trans>Quiz especial submetido com sucesso.</Trans>);
        history.push(`/special-quiz/${data.quiz.date}`);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível submeter o quiz especial.</Trans>);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const jokersAssigned = formData.answers.filter((item) => item.points === 1)
    .length;

  const blankAnsers = formData.answers.filter((item) => !item.text).length;

  return (
    <>
      <div className="columns">
        <div className="column is-8">
          {data.quiz.description && (
            <div className={classes.description}>
              <h2 className="subtitle has-text-weight-bold">
                <Trans>Descrição</Trans>
              </h2>
              <p>
                <Markdown content={data.quiz.description} />
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {data.quiz.questions.map((question, index) => (
              <div key={question.id} className={classes.question}>
                <h2 className="subtitle has-text-weight-bold">
                  <Trans>Pergunta {index + 1}</Trans>
                </h2>
                <div className={classes.questionText}>
                  <Markdown content={question.content} />
                </div>
                {question.media_id && (
                  <div
                    className={classnames(
                      classes.media,
                      classes[data.media[question.media_id].type]
                    )}
                  >
                    {renderMedia(
                      data.media[question.media_id].type,
                      data.media[question.media_id].url,
                      index
                    )}
                  </div>
                )}
                <div className="field">
                  <label className="label">
                    <Trans>Resposta</Trans>
                  </label>
                  <input
                    defaultValue={formData.answers[index].text}
                    className="input"
                    onChange={(event) => {
                      event.persist();
                      setFormData((prev) => {
                        const newFormData = { ...prev };
                        newFormData.answers[index].text = event.target.value;
                        return newFormData;
                      });
                      saveDraft(
                        question.id,
                        event.target.value,
                        formData.answers[index].points
                      );
                    }}
                    onPaste={(event) => {
                      ApiRequest.post(`logs`, {
                        action: `Paste on question ${
                          question.id
                        }: ${event.clipboardData.getData('Text')}`,
                      });
                    }}
                  />
                </div>
                <div className="field">
                  <input
                    id={`joker_${index}`}
                    type="checkbox"
                    className="switch"
                    value="true"
                    disabled={
                      jokersAssigned === 5 && !formData.answers[index].points
                    }
                    onClick={(event) => {
                      event.persist();
                      saveDraft(
                        question.id,
                        formData.answers[index].text,
                        event.target.checked ? 1 : 0
                      );
                      setFormData((prev) => {
                        const newFormData = { ...prev };
                        newFormData.answers[index].points = event.target.checked
                          ? 1
                          : 0;
                        return newFormData;
                      });
                    }}
                    defaultChecked={formData.answers[index].points}
                  />
                  <label htmlFor={`joker_${index}`}>
                    <Trans>Joker</Trans>
                  </label>
                </div>
              </div>
            ))}
            <div className="field">
              <div className="control">
                <button className="button is-primary">
                  <Trans>Submeter</Trans>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="column is-4">
          <div className="card">
            <div className="card-content">
              <h2 className="subtitle has-text-weight-bold">
                <Trans>Regras</Trans>
              </h2>
              <div className="content">
                <Trans>
                  <p>Cada pergunta certa num quiz especial vale 20 pontos.</p>
                  <p>Em cada quiz especial podes usar até 5 jokers.</p>
                  <p>
                    Ao usares um joker numa pergunta, caso acertes, ganhas
                    pontos adicionais consoante a percentagem de pessoas que
                    erraram essa pergunta.
                  </p>
                  <p>
                    <strong>Exemplo:</strong> Se acertares uma pergunta onde
                    usaste um joker e 60% dos jogadores falharem ganhas 80
                    pontos (20+60).
                  </p>
                  <p>
                    Caso uses um joker e falhes a pergunta, perdes 20 pontos!
                  </p>
                </Trans>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        type="info"
        open={submitModal}
        title={<Trans>Submeter quiz</Trans>}
        body={
          <>
            {blankAnsers > 0 && (
              <>
                {blankAnsers > 1 ? (
                  <Trans>Ainda tens {blankAnsers} perguntas em branco.</Trans>
                ) : (
                  <Trans>Ainda tens uma pergunta em branco.</Trans>
                )}
                <br />
              </>
            )}
            <Trans>Tens a certeza que queres submeter o quiz?</Trans>
          </>
        }
        action={() => {
          submitQuiz();
        }}
        doingAction={submitting}
        onClose={() => setSubmitModal(false)}
      />
    </>
  );
};

export default SpecialQuizForm;
