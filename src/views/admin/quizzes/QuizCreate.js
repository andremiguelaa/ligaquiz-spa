import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import DatePicker from 'react-datepicker';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import Markdown from 'components/Markdown';

import classes from './Quizzes.module.scss';

const Quizzes = () => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [quizDates, setQuizDates] = useState();
  const [quizDate, setQuizDate] = useState();

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
  }, []);

  if (error) {
    return (
      <Error>
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      </Error>
    );
  }

  if (!quizDates) {
    return <Loading />;
  }

  console.log(quizDates[0]);

  return (
    <>
      <PageHeader title={<Trans>Criar quiz</Trans>} />
      <div className="section">
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
                onChange={setQuizDate}
                dateFormat="yyyy-MM-dd"
              />
              <span className="icon is-small is-left">
                <i className="fa fa-calendar" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quizzes;
