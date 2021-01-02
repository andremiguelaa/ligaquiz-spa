import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import formatDate from 'utils/formatDate';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';

import Tier from './Tier';

const getDayDifference = (date, days) => {
  const dayAfter = new Date(date);
  dayAfter.setDate(dayAfter.getDate() + days);
  return dayAfter;
};

const League = ({ season, users, validUsers, setError }) => {
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [formData, setFormData] = useState({
    dates: [...Array(20)],
    leagues: [],
  });

  const editMode = Boolean(season);

  useEffect(() => {
    setMinDate();
    ApiRequest.get(`seasons`)
      .then(({ data }) => {
        let realMinDate = getDayDifference(new Date(), 1);
        if (editMode) {
          const currentSeasonIndex = data.findIndex(
            (item) => item.season === parseInt(season)
          );
          if (currentSeasonIndex > 0) {
            setMaxDate(new Date(data[currentSeasonIndex - 1].rounds[0].date));
          }
          if (data[currentSeasonIndex + 1]) {
            const lastDate = getDayDifference(
              new Date(
                data[currentSeasonIndex + 1].rounds[
                  data[0].rounds.length - 1
                ].date
              ),
              1
            );
            if (lastDate > realMinDate) {
              realMinDate = lastDate;
            }
          }
          const newFormData = {
            id: data[currentSeasonIndex].id,
            dates: data[currentSeasonIndex].rounds.map(
              (round) => new Date(round.date)
            ),
            leagues: data[currentSeasonIndex].leagues,
          };
          setFormData(newFormData);
        } else if (data.length) {
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
  }, [season, setError, editMode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    const normalizedDates = formData.dates.map(
      (date) => date && formatDate(date)
    );
    const newFormData = {
      ...formData,
      dates: normalizedDates,
    };
    if (editMode) {
      ApiRequest.patch('seasons', newFormData)
        .then(() => {
          setSubmitting(false);
          toast.success(<Trans>Temporada gravada com sucesso.</Trans>);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível gravar a temporada.</Trans>);
          setSubmitting(false);
        });
    } else {
      ApiRequest.post('seasons', newFormData)
        .then(({ data }) => {
          setSubmitting(false);
          toast.success(<Trans>Temporada criada com sucesso.</Trans>);
          history.push(`/admin/season/${data.season}/edit/`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível criar a temporada.</Trans>);
          setSubmitting(false);
        });
    }
  };

  if (!minDate) {
    return <Loading />;
  }

  const validTiers = !Boolean(
    formData.leagues.reduce((acc, { user_ids }) => {
      if (!user_ids.length || user_ids.length % 2) {
        return acc + 1;
      }
      return acc;
    }, 0)
  );

  const selectedUsers = formData.leagues.reduce(
    (acc, item) => acc.concat(item.user_ids),
    []
  );

  const remainingUsers = validUsers.reduce((acc, item) => {
    if (!selectedUsers.includes(item.id)) {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <div className="section">
      <form onSubmit={handleSubmit}>
        <h2 className="subtitle has-text-weight-bold">
          <Trans>Liga</Trans>
        </h2>
        <fieldset className="fieldset">
          <legend className="legend">
            <Trans>Datas</Trans>
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
                        : minDate
                    }
                    maxDate={
                      index < formData.dates.length - 1
                        ? getDayDifference(formData.dates[index + 1], -1)
                        : maxDate
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
                    disabled={
                      (index > 0 && !formData.dates[index - 1]) || submitting
                    }
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-calendar" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </fieldset>
        {formData.leagues.length > 0 && (
          <fieldset className="fieldset">
            <legend className="legend">
              <Trans>Divisões</Trans>
            </legend>
            {formData.leagues.map((league, index) => (
              <Tier
                key={league.tier}
                league={league}
                index={index}
                formData={formData}
                setFormData={setFormData}
                users={users}
                remainingUsers={remainingUsers}
                disabled={submitting}
              />
            ))}
          </fieldset>
        )}
        {remainingUsers.length > 0 && (
          <div className="field">
            <button
              disabled={submitting}
              type="button"
              className="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  leagues: [
                    ...prev.leagues,
                    {
                      tier: prev.leagues.length + 1,
                      user_ids: [],
                    },
                  ],
                }));
              }}
            >
              <span className="icon">
                <i className="fa fa-plus"></i>
              </span>
              <span>
                <Trans>Adicionar divisão</Trans>
              </span>
            </button>
          </div>
        )}
        <div className="field">
          <div className="control">
            <button
              className={`button is-primary ${submitting && 'is-loading'}`}
              disabled={
                !validTiers ||
                submitting ||
                !formData.dates[formData.dates.length - 1]
              }
            >
              <Trans>Gravar liga</Trans>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default League;
