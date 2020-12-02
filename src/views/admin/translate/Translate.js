import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import Markdown from 'components/Markdown';

import classes from './Translate.module.scss';

const Translate = () => {
  const { id } = useParams();
  const [error, setError] = useState();
  const [question, setQuestion] = useState();
  const [translation, setTranslation] = useState({
    question_id: id,
    content: '',
    answer: '',
  });
  const [loadingTranslation, setLoadingTranslation] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ApiRequest.get(`questions?id[]=${id}`)
      .then(({ data }) => {
        setQuestion(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
    ApiRequest.get(`questions-translations?question_id=${id}`)
      .then(({ data }) => {
        setTranslation((prev) => ({
          ...prev,
          id: data.id,
          content: data.content,
          answer: data.answer,
        }));
        setLoadingTranslation(false);
      })
      .catch(({ response }) => {
        if (response?.status === 404) {
          setLoadingTranslation(false);
        } else {
          setError(response?.status);
        }
      });
  }, [id]);

  if (error) {
    return <Error status={error} />;
  }

  if (!question || loadingTranslation) {
    return <Loading />;
  }

  const saveTranslation = () => {
    setSubmitting(true);
    if (translation.id) {
      ApiRequest.patch('questions-translations', translation)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Tradução gravada com sucesso.</Trans>);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar a tradução.</Trans>);
          setSubmitting(false);
        });
    } else {
      ApiRequest.post('questions-translations', { ...translation, id })
        .then(({data}) => {
          setTranslation((prev) => ({
            ...prev,
            id: data.id,
          }));
          setSubmitting(false);
          toast.success(<Trans>Tradução criada com sucesso.</Trans>);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível criar a tradução.</Trans>);
          setSubmitting(false);
        });
    }
  };

  return (
    <>
      <PageHeader title={<Trans>Tradução de Pergunta</Trans>} />
      <div className="section content">
        <div>
          <strong>
            <Trans>Enunciado</Trans>:
          </strong>{' '}
          <Markdown content={question.content} />
        </div>
        <div>
          <strong>
            <Trans>Resposta</Trans>:<br />
          </strong>{' '}
          {question.answer}
        </div>
        <form
          className={classes.form}
          onSubmit={(event) => {
            event.preventDefault();
            saveTranslation();
          }}
        >
          <div className="field">
            <label className="label">
              <Trans>Enunciado</Trans>
            </label>
            <textarea
              disabled={submitting}
              defaultValue={translation.content}
              className="textarea"
              onChange={(event) => {
                event.persist();
                setTranslation((prev) => ({
                  ...prev,
                  content: event.target.value,
                }));
              }}
            ></textarea>
          </div>
          <div className="field">
            <Markdown content={translation.content} />
          </div>
          <div className="field">
            <label className="label">
              <Trans>Resposta</Trans>
            </label>
            <input
              disabled={submitting}
              defaultValue={translation.answer}
              className="input"
              onChange={(event) => {
                event.persist();
                setTranslation((prev) => ({
                  ...prev,
                  answer: event.target.value,
                }));
              }}
            />
          </div>
          <div className="field">
            <div className="control">
              <button
                className={`button is-primary ${submitting && 'is-loading'}`}
                disabled={
                  !translation.content || !translation.answer || submitting
                }
              >
                <Trans>Gravar</Trans>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Translate;
