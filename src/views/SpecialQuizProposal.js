import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import Question from 'views/admin/specialQuizzes/Question';

const SpecialQuizForm = () => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    subject,
    description,
    questions: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError();
    const newFormData = { ...formData };
    newFormData.subject = subject || '';
    newFormData.description = description || '';
    newFormData.language = language;
    ApiRequest.post('special-quiz-proposals', newFormData)
      .then(() => {
        setSubmitting(false);
        toast.success(
          <Trans>
            Quiz especial criado com sucesso.
            <br />
            Obrigado pela contribuição!
          </Trans>
        );
        history.push(`/`);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível criar o quiz especial.</Trans>);
        setSubmitting(false);
      });
  };

  if (!user) {
    return <Error status={401} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  const canSubmit =
    subject &&
    !formData.questions.some(
      (question) => !question.content || !question.answer
    );

  return (
    <>
      <PageHeader
        title={<Trans>Propor quiz especial</Trans>}
        subtitle={
          <Trans>
            Após a submissão de uma proposta de quiz especial, o quiz será
            revisto e publicado assim que possível
          </Trans>
        }
      />
      <div className="section content">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">
              <Trans>Título</Trans>
            </label>
            <input
              disabled={submitting}
              defaultValue={subject}
              className="input"
              onChange={(event) => {
                setSubject(event.target.value);
              }}
            />
          </div>
          <div className="field">
            <label className="label">
              <Trans>Descrição</Trans>
            </label>
            <textarea
              disabled={submitting}
              defaultValue={description}
              className="textarea"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            ></textarea>
          </div>
          {[...Array(12)].map((_, index) => (
            <Question
              index={index}
              key={index}
              setFormData={setFormData}
              uploading={uploading}
              setUploading={setUploading}
              disabled={submitting}
              hidePreview
            />
          ))}
          <div className="field">
            <div className="control">
              <button
                className={`button is-primary ${submitting && 'is-loading'}`}
                disabled={!canSubmit || uploading || submitting}
              >
                <Trans>Enviar</Trans>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SpecialQuizForm;
