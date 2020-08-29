import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import formatDate, { convertToLongDate } from 'utils/formatDate';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import NoMatch from 'views/NoMatch';
import Markdown from 'components/Markdown';
import Question from './Question';

const SpecialQuizForm = () => {
  const { date } = useParams();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
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
    date,
    subject,
    description,
    user_id: null,
    questions: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  });
  const editMode = Boolean(date);

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
    if (editMode) {
      setQuizDate(new Date(date));
      ApiRequest.get(`special-quizzes?date=${date}`)
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
    }
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
  }, [date, editMode]);

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
    if (editMode) {
      ApiRequest.patch('special-quizzes', newFormData)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Quiz especial gravado com sucesso.</Trans>);
          history.push(`/admin/special-quiz/${newFormData.date}/edit/`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar o quiz especial.</Trans>);
          setSubmitting(false);
        });
    } else {
      ApiRequest.post('special-quizzes', newFormData)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Quiz especial criado com sucesso.</Trans>);
          history.push(`/admin/special-quiz/${newFormData.date}/edit/`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível criar o quiz especial.</Trans>);
          setSubmitting(false);
        });
    }
  };

  if (error) {
    if (error === 404) {
      return <NoMatch />;
    }
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!quizDates || (editMode && !quizData) || !users) {
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
      <PageHeader
        title={
          !editMode ? (
            <Trans>Criar quiz especial</Trans>
          ) : (
            <Trans>
              Editar quiz especial de {convertToLongDate(date, language)}
            </Trans>
          )
        }
      />
      <div className="section content">
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
              <Trans>Tema</Trans>
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
            />
          ))}
          <div className="field">
            <div className="control">
              <button
                className={`button is-primary ${submitting && 'is-loading'}`}
                disabled={(!editMode && !quizDate) || uploading || submitting}
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

export default SpecialQuizForm;
