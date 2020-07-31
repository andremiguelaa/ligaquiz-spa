import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import formatDate from 'utils/formatDate';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import Question from './Question';

const Quizzes = () => {
  const history = useHistory();
  const [error, setError] = useState(false);
  const [quizDates, setQuizDates] = useState();
  const [quizDate, setQuizDate] = useState();
  const [genres, setGenres] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    date: undefined,
    questions: [{}, {}, {}, {}, {}, {}, {}, {}],
  });

  useEffect(() => {
    ApiRequest.get(`quizzes`)
      .then(({ data }) => {
        setQuizDates(
          data.reduce((dates, quiz) => {
            if (new Date(quiz.date) > new Date()) {
              dates.push(new Date(quiz.date));
            }
            return dates;
          }, [])
        );
      })
      .catch(() => {
        setError(true);
      });
    ApiRequest.get(`genres`)
      .then(({ data }) => {
        setGenres(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    ApiRequest.post('quizzes', formData)
      .then(() => {
        setSubmitting(false);
        toast.success(<Trans>Quiz criado com sucesso.</Trans>);
        history.push(`/admin/quizzes`);
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível criar o quiz.</Trans>);
        setSubmitting(false);
      });
  };

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!quizDates || !genres) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader title={<Trans>Criar quiz</Trans>} />
      <div className="section content">
        <div className="message is-danger">
          <div className="message-body">
            <Trans>
              <strong>
                Não devem ser feitos quizzes com a seguinte combinação de temas:
              </strong>
              <ul>
                <li>Literatura / Banda Desenhada</li>
                <li>Literatura / Filosofia</li>{' '}
                <li>Óperas e Musicais / Música</li>
                <li>Belas Artes / Museus</li>
              </ul>
            </Trans>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <div className="control">
              <label className="label">
                <Trans>Data do quiz</Trans>
              </label>
              <div className="control has-icons-left">
                <DatePicker
                  minDate={new Date()}
                  excludeDates={quizDates}
                  filterDate={(date) => {
                    const day = date.getDay();
                    return day !== 0 && day !== 6;
                  }}
                  selected={quizDate}
                  onChange={(date) => {
                    setQuizDate(date);
                    setFormData((prev) => ({
                      ...prev,
                      date: formatDate(date),
                    }));
                  }}
                  dateFormat="yyyy-MM-dd"
                />
                <span className="icon is-small is-left">
                  <i className="fa fa-calendar" />
                </span>
              </div>
            </div>
          </div>
          {genres.map((genre, index) => (
            <Question
              genre={genre}
              index={index}
              key={genre.id}
              setFormData={setFormData}
              uploading={uploading}
              setUploading={setUploading}
            />
          ))}
          <div className="field">
            <div className="control">
              <button
                className={`button is-primary ${submitting && 'is-loading'}`}
                disabled={!formData.date || uploading}
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

export default Quizzes;
