import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';
import formatDate from 'utils/formatDate';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import NoMatch from 'views/NoMatch';

import Tier from './Tier';

const getDayDifference = (date, days) => {
  const dayAfter = new Date(date);
  dayAfter.setDate(dayAfter.getDate() + days);
  return dayAfter;
};

const SeasonForm = () => {
  const { season } = useParams();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState();
  const [formData, setFormData] = useState({
    dates: [...Array(20)],
    leagues: [],
  });
  const [users, setUsers] = useState();
  const [validUsers, setValidUsers] = useState();
  const editMode = Boolean(season);

  useEffect(() => {
    ApiRequest.get(`users`)
      .then(({ data }) => {
        const usersObject = data.reduce(
          (acc, user) => {
            acc.users[user.id] = user;
            if (new Date(user.roles.regular_player) > new Date()) {
              acc.validUsers.push(user);
            }
            return acc;
          },
          {
            users: [],
            validUsers: [],
          }
        );
        setUsers(usersObject.users);
        setValidUsers(
          usersObject.validUsers.sort((a, b) =>
            `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
          )
        );
      })
      .catch(() => {
        setError(true);
      });
    ApiRequest.get(`seasons?rounds=true`)
      .then(({ data }) => {
        let realMinDate = getDayDifference(new Date(), 1);
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
    const normalizedDates = formData.dates.map(
      (date) => date && formatDate(date)
    );
    const newFormData = {
      ...formData,
      dates: normalizedDates,
    };
    console.log(newFormData);
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
          toast.success(<Trans>Temporada criado com sucesso.</Trans>);
          history.push(`/admin/season/${data.season}/edit/`);
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível criar a temporada.</Trans>);
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

  if (!minDate || !users) {
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
                  validUsers={validUsers}
                  disabled={submitting}
                />
              ))}
            </fieldset>
          )}
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
