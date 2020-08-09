import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';
import Markdown from 'components/Markdown';

import classes from './Quiz.module.scss';

const QuizForm = ({ data, userAnswers }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    answers: data.quiz.questions.map((question) => ({
      question_id: question.id,
      text: userAnswers[question.id]?.[0].text,
      points: userAnswers[question.id]?.[0].points,
    })),
  });

  const saveDraft = (id, text, points) => {
    ApiRequest.post(`answers`, {
      question_id: id,
      text,
      points,
    });
  };

  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit}>
      {data.quiz.questions.map((question, index) => (
        <div key={question.id} className={classes.question}>
          <div className={classes.questionText}>
            <Markdown content={question.content} />
          </div>
          {question.media_id && (
            <div className={classes.media}>
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
              disabled={submitting}
              defaultValue={formData.answers[index].text}
              className="input"
              onChange={(event) => {
                event.persist();
                setFormData((prev) => {
                  const newFormData = { ...prev };
                  newFormData.answers[index].text = event.target.value;
                  return newFormData;
                });
              }}
              onBlur={(event) => {
                saveDraft(
                  question.id,
                  event.target.value,
                  formData.answers[index].points
                );
              }}
            />
          </div>
          {!data.quiz.solo && (
            <>
              <label className="label">
                <Trans>Pontos a atribuir ao adversário</Trans>
              </label>
              <div className="field has-addons">
                <div className="control">
                  <button
                    type="button"
                    className={classnames('button', {
                      'is-success': formData.answers[index].points === 0,
                    })}
                    onClick={() => {
                      setFormData((prev) => {
                        const newFormData = { ...prev };
                        newFormData.answers[index].points = 0;
                        return newFormData;
                      });
                      saveDraft(question.id, formData.answers[index].text, 0);
                    }}
                  >
                    0
                  </button>
                </div>
                <div className="control">
                  <button
                    type="button"
                    className={classnames('button', {
                      'is-warning': formData.answers[index].points === 1,
                    })}
                    onClick={() => {
                      setFormData((prev) => {
                        const newFormData = { ...prev };
                        newFormData.answers[index].points = 1;
                        return newFormData;
                      });
                      saveDraft(question.id, formData.answers[index].text, 1);
                    }}
                  >
                    1
                  </button>
                </div>
                <div className="control">
                  <button
                    type="button"
                    className={classnames('button', {
                      'is-warning': formData.answers[index].points === 2,
                    })}
                    onClick={() => {
                      setFormData((prev) => {
                        const newFormData = { ...prev };
                        newFormData.answers[index].points = 2;
                        return newFormData;
                      });
                      saveDraft(question.id, formData.answers[index].text, 2);
                    }}
                  >
                    2
                  </button>
                </div>
                <div className="control">
                  <button
                    type="button"
                    className={classnames('button', {
                      'is-danger': formData.answers[index].points === 3,
                    })}
                    onClick={() => {
                      setFormData((prev) => {
                        const newFormData = { ...prev };
                        newFormData.answers[index].points = 3;
                        return newFormData;
                      });
                      saveDraft(question.id, formData.answers[index].text, 3);
                    }}
                  >
                    3
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      <div className="field">
        <div className="control">
          <button
            className={`button is-primary ${submitting && 'is-loading'}`}
            disabled={submitting}
          >
            <Trans>Gravar</Trans>
          </button>
        </div>
      </div>
    </form>
  );
};

export default QuizForm;
