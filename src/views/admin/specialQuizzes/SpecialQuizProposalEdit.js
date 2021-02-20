import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import formatDate from 'utils/formatDate';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import Markdown from 'components/Markdown';
import Question from './Question';

const SpecialQuizProposalEdit = () => {
  const { id } = useParams();
  const [{ user }] = useStateValue();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [users, setUsers] = useState();
  const [quizDates, setQuizDates] = useState();
  const [quizDate, setQuizDate] = useState();
  const [quizData, setQuizData] = useState();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    date: undefined,
    subject,
    description,
    user_id: null,
    questions: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  });
  const [hideAnswers, setHideAnswers] = useState(true);

  useEffect(() => {
    ApiRequest.get(`special-quizzes`)
      .then(({ data }) => {
        setQuizDates(
          data.reduce((dates, quiz) => {
            if (!quiz.past) {
              dates.push(new Date(quiz.date));
            }
            return dates;
          }, [])
        );
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
    ApiRequest.get(`special-quiz-proposals?id=${id}`)
      .then(({ data }) => {
        setSubject(data.quiz.subject || '');
        setDescription(data.quiz.description || '');
        setAuthor(data.quiz.user_id);
        setQuizData(data);
        setFormData(data.quiz);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
    ApiRequest.get('users')
      .then(({ data }) => {
        setUsers(
          data.sort((a, b) =>
            `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
          )
        );
      })
      .catch((response) => {
        setError(response?.status);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError();
    const newFormData = { ...formData };
    newFormData.subject = subject || '';
    newFormData.description = description || '';
    newFormData.user_id = author || null;
    if (!quizData || (!quizData.quiz.past && !quizData.quiz.today)) {
      newFormData.date = formatDate(quizDate);
    }
    ApiRequest.post('special-quizzes', newFormData)
      .then(() => {
        ApiRequest.delete('special-quiz-proposals', { data: { id } })
          .then(() => {
            setSubmitting(false);
            toast.success(<Trans>Quiz especial criado com sucesso.</Trans>);
          })
          .catch(() => {
            toast.error(
              <Trans>
                Quiz especial criado mas a proposta não foi apagada da base de
                dados.
              </Trans>
            );
            setSubmitting(false);
          })
          .finally(() => {
            history.push(`/admin/special-quiz/${newFormData.date}/edit/`);
          });
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível criar o quiz especial.</Trans>);
        setSubmitting(false);
      });
  };

  if (!user) {
    return <Error status={401} />;
  }

  if (!(user.valid_roles.admin || user.valid_roles.special_quiz_editor)) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!quizDates || !quizData || !users) {
    return <Loading />;
  }

  const nonValidDates = quizDates.reduce((acc, item) => {
    if (
      !quizData ||
      item.getTime() !== new Date(quizData.quiz.date).getTime()
    ) {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <>
      <PageHeader title={<Trans>Editar proposta de quiz especial</Trans>} />
      <div className="section content">
        <div className="field">
          <input
            id="hide-answers"
            type="checkbox"
            className="switch"
            value={hideAnswers}
            onClick={(event) => setHideAnswers(event.target.checked)}
            defaultChecked={hideAnswers}
          />
          <label htmlFor="hide-answers">
            <Trans>Ocultar respostas</Trans>
          </label>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          {(!quizData || (!quizData.quiz.past && !quizData.quiz.today)) && (
            <div className="field">
              <div className="control">
                <label className="label">
                  <Trans>Data do quiz</Trans>
                </label>
                <div className="control has-icons-left">
                  <DatePicker
                    minDate={new Date()}
                    excludeDates={nonValidDates}
                    selected={quizDate}
                    onChange={(date) => {
                      setQuizDate(date);
                    }}
                    dateFormat="yyyy-MM-dd"
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-calendar" />
                  </span>
                </div>
              </div>
            </div>
          )}
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
          <div className="field">
            <Markdown content={description} />
          </div>
          <div className="field">
            <label className="label">
              <Trans>Autor</Trans>
            </label>
            <div className="control has-icons-left">
              <div className="select">
                <select
                  disabled={submitting}
                  defaultValue={author}
                  onChange={(event) => {
                    setAuthor(event.target.value);
                  }}
                >
                  <Trans render={<option value={0} />}>Nenhum</Trans>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} {user.surname} (
                      {user.email ? user.email : `ID: ${user.id}`})
                    </option>
                  ))}
                </select>
              </div>
              <div className="icon is-small is-left">
                <i className="fa fa-user"></i>
              </div>
            </div>
          </div>
          {[...Array(12)].map((_, index) => (
            <Question
              index={index}
              key={index}
              quizData={quizData}
              setFormData={setFormData}
              uploading={uploading}
              setUploading={setUploading}
              disabled={submitting}
              hideAnswer={hideAnswers}
            />
          ))}
          <div className="field">
            <div className="control">
              <button
                className={`button is-primary ${submitting && 'is-loading'}`}
                disabled={!quizDate || uploading || submitting || hideAnswers}
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

export default SpecialQuizProposalEdit;
