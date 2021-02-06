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
import Question from './Question';

const QuizForm = () => {
  const { date } = useParams();
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  const history = useHistory();
  const [error, setError] = useState();
  const [quizDates, setQuizDates] = useState();
  const [quizDate, setQuizDate] = useState();
  const [quizData, setQuizData] = useState();
  const [genres, setGenres] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [genreStats, setGenreStats] = useState();
  const [formData, setFormData] = useState({
    date,
    questions: [{}, {}, {}, {}, {}, {}, {}, {}],
  });
  const editMode = Boolean(date);

  useEffect(() => {
    ApiRequest.get(`seasons`)
      .then(({ data: seasons }) => {
        if (seasons.length) {
          const lastSeason = seasons[0].season;
          ApiRequest.get(`seasons?season=${lastSeason}`)
            .then(({ data }) => {
              setGenreStats(data.genre_stats);
            })
            .catch(({ response }) => {
              setError(response?.status);
            });
        } else {
          setGenreStats({});
        }
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  useEffect(() => {
    ApiRequest.get(`quizzes`)
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
      ApiRequest.get(`quizzes?date=${date}`)
        .then(({ data }) => {
          setFormData(data.quiz);
          setQuizData(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
    ApiRequest.get(`genres`)
      .then(({ data }) => {
        setGenres(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [date, editMode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError();
    const newFormData = { ...formData };
    if (!quizData || (!quizData.quiz.past && !quizData.quiz.today)) {
      newFormData.date = formatDate(quizDate);
    }
    if (editMode) {
      ApiRequest.patch('quizzes', newFormData)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Quiz gravado com sucesso.</Trans>);
          history.push(`/admin/quiz/${newFormData.date}/edit/`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar o quiz.</Trans>);
          setSubmitting(false);
        });
    } else {
      ApiRequest.post('quizzes', newFormData)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Quiz criado com sucesso.</Trans>);
          history.push(`/admin/quiz/${newFormData.date}/edit/`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível criar o quiz.</Trans>);
          setSubmitting(false);
        });
    }
  };

  if (!user) {
    return <Error status={401} />;
  }

  if (!(user.valid_roles.admin || user.valid_roles.quiz_editor)) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!quizDates || (editMode && !quizData) || !genres || !genreStats) {
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
            <Trans>Criar quiz</Trans>
          ) : (
            <Trans>Editar quiz de {convertToLongDate(date, language)}</Trans>
          )
        }
      />
      <div className="section">
        <div className="message is-danger">
          <div className="message-body">
            <Trans>
              <strong>
                Não devem ser feitos quizzes com a seguinte combinação de temas:
              </strong>
              <ul>
                <li>Literatura / Banda Desenhada</li>
                <li>Literatura / Filosofia</li>
                <li>Óperas e Musicais / Música</li>
                <li>Belas Artes / Museus</li>
              </ul>
            </Trans>
          </div>
        </div>
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
          {genres.map((genre, index) => (
            <Question
              genre={genre}
              genreStats={genreStats}
              index={index}
              key={genre.id}
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

export default QuizForm;
