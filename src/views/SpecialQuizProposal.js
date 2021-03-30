import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Error from 'components/Error';
import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import Question from 'views/admin/specialQuizzes/Question';

const saveDraft = debounce((formData, draft, setDraft) => {
  const newFormData = { ...formData };
  newFormData.draft = 1;
  if (draft) {
    ApiRequest.patch('special-quiz-proposals', newFormData);
  } else {
    ApiRequest.post('special-quiz-proposals', newFormData);
    setDraft(true);
  }
}, 1000);

const SpecialQuizProposal = () => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState(false);
  const [draftMedia, setDraftMedia] = useState();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    questions: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    const newFormData = { ...formData };
    newFormData.draft = 0;
    newFormData.language = language;
    ApiRequest.patch('special-quiz-proposals', newFormData)
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

  useEffect(() => {
    ApiRequest.get('special-quiz-proposals?draft')
      .then(({ data }) => {
        setFormData({
          subject: data.quiz.subject || '',
          description: data.quiz.description || '',
          questions: data.quiz.questions,
        });
        setDraftMedia(data.media);
        setDraft(true);
      })
      .catch(({ response }) => {
        if (response?.status !== 404) {
          setError(response?.status);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      saveDraft(formData, Boolean(draft), setDraft);
    }
  }, [loading, draft, formData]);

  if (!user) {
    return <Error status={401} />;
  }

  if (
    !(
      user.valid_roles.admin ||
      user.valid_roles.regular_player ||
      user.valid_roles.special_quiz_player
    )
  ) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (loading) {
    return <Loading />;
  }

  const canSubmit =
    formData.subject &&
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
              defaultValue={formData.subject}
              className="input"
              onChange={(event) => {
                const newSubject = event.target.value;
                setFormData((prev) => ({
                  ...prev,
                  subject: newSubject,
                }));
              }}
            />
          </div>
          <div className="field">
            <label className="label">
              <Trans>Descrição</Trans>
            </label>
            <textarea
              disabled={submitting}
              defaultValue={formData.description}
              className="textarea"
              onChange={(event) => {
                const newDescription = event.target.value;
                setFormData((prev) => ({
                  ...prev,
                  description: newDescription,
                }));
              }}
            ></textarea>
          </div>
          {[...Array(12)].map((_, index) => (
            <Question
              index={index}
              quizData={{
                quiz: {
                  questions: formData.questions,
                },
                media: draftMedia,
              }}
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

export default SpecialQuizProposal;
