import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import NoMatch from 'views/NoMatch';
import formatDate from 'utils/formatDate';

const getDayDifference = (date, days) => {
  const dayAfter = new Date(date);
  dayAfter.setDate(dayAfter.getDate() + days);
  return dayAfter;
};

const SeasonForm = () => {
  const { season } = useParams();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState();
  const [formData, setFormData] = useState({
    dates: [...Array(20)],
    leagues: [],
  });
  const editMode = Boolean(season);

  useEffect(() => {
    ApiRequest.get(`seasons?rounds=true`)
      .then(({ data }) => {
        const realMinDate = getDayDifference(new Date(), 1);
        if (data.length) {
          const lastDate = getDayDifference(
            new Date(data[0].rounds[data[0].rounds.length - 1].date),
            1
          );
          if (lastDate > realMinDate) {
            realMinDate = lastDate;
          }
        }
        setMinDate(realMinDate);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError();
    /*
    if (editMode) {
      ApiRequest.patch('quizzes', formData)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Temporada gravada com sucesso.</Trans>);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar a temporada.</Trans>);
          setSubmitting(false);
        });
    } else {
      ApiRequest.post('quizzes', formData)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Temporada criado com sucesso.</Trans>);
          history.push(`/admin/season/xxx/edit/`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível criar a temporada.</Trans>);
          setSubmitting(false);
        });
    }
    */
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

  if (!minDate) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={
          !editMode ? (
            <Trans>Criar temporada</Trans>
          ) : (
            <Trans>Editar temporada x</Trans>
          )
        }
      />
      <div className="section content">
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="legend">
              <Trans>Datas das jornadas</Trans>
            </legend>
            {formData.dates.map((_, index) => (
              <div className="field" key={index}>
                <div className="control">
                  <label className="label">
                    <Trans>Jornada {index + 1}</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <DatePicker
                      minDate={
                        index > 0
                          ? getDayDifference(formData.dates[index - 1], 1)
                          : getDayDifference(new Date(), 1)
                      }
                      maxDate={
                        index < formData.dates.length - 1
                          ? getDayDifference(formData.dates[index + 1], -1)
                          : undefined
                      }
                      selected={formData.dates[index]}
                      onChange={(date) => {
                        setFormData((prev) => {
                          const newFormData = { ...prev };
                          newFormData.dates[index] = date;
                          return newFormData;
                        });
                      }}
                      dateFormat="yyyy-MM-dd"
                      disabled={index > 0 && !formData.dates[index - 1]}
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-calendar" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </fieldset>
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
      </div>
    </>
  );
};

export default SeasonForm;
