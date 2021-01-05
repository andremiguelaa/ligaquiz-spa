import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { omit, range } from 'lodash';
import classames from 'classnames';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { sub, getYear } from 'date-fns';

import { convertToLongDate } from 'utils/formatDate';
import { getRegionTranslations } from 'utils/getRegionTranslation';
import { useStateValue } from 'state/State';
import PageHeader from 'components/PageHeader';
import Loading from 'components/Loading';
import Error from 'components/Error';
import ApiRequest from 'utils/ApiRequest';
import { formatDate, convertToLongMonth } from 'utils/formatDate';
import Avatar from './Account/Avatar';
import PayPal from './Account/PayPal';

const Account = () => {
  const [
    {
      user,
      settings: { language },
    },
    dispatch,
  ] = useStateValue();
  const history = useHistory();
  const location = useLocation();
  const [regions, setRegions] = useState();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: user?.id,
    name: user?.name,
    surname: user?.surname,
    email: user?.email,
    birthday: user?.birthday ? new Date(user?.birthday) : null,
    region: user?.region,
    password: '',
    password2: '',
    reminders: user?.reminders,
  });
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    ApiRequest.get(`regions`)
      .then(({ data }) => {
        const mappedRegions = data.map((item) => ({
          code: item,
          name: getRegionTranslations(item, language),
        }));
        setRegions(mappedRegions.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [language]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('token')) {
      setRenewing(true);
      ApiRequest.post(`payment/check`, { token: params.get('token') })
        .then(({ data }) => {
          if (data.status === 'COMPLETED') {
            toast.success(<Trans>Subscrição renovada com sucesso.</Trans>);
            dispatch({
              type: 'user.patch',
              payload: data.user,
            });
          }
          if (data.status === 'CREATED') {
            toast.warning(<Trans>O pagamento não foi bem sucedido.</Trans>);
          }
          history.push('/account');
        })
        .catch(() => {
          toast.error(<Trans>Não foi possível renovar a subscrição.</Trans>);
        })
        .finally(() => {
          setRenewing(false);
        });
    }
  }, [history, dispatch, location.search]);

  if (!user) {
    return <Error status={401} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!regions || renewing) {
    return <Loading />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    let newFormData = formData;
    if (!formData.password.length) {
      newFormData = omit(formData, ['password', 'password2']);
    }
    newFormData = omit(newFormData, ['birthday']);
    if (formData.birthday) {
      newFormData.birthday = formatDate(formData.birthday);
    }
    ApiRequest.patch('users', newFormData)
      .then(({ data: { user } }) => {
        setSubmitting(false);
        toast.success(<Trans>Perfil actualizado com sucesso.</Trans>);
        dispatch({
          type: 'user.patch',
          payload: user,
        });
      })
      .catch((error) => {
        try {
          setError(error.response.data);
        } catch (error) {
          setError({ message: 'server_error' });
        }
        toast.error(<Trans>Não foi possível actualizar o perfil.</Trans>);
        setSubmitting(false);
      });
  };

  const years = range(
    getYear(sub(new Date(), { years: 18 })),
    getYear(sub(new Date(), { years: 100 })) - 1,
    -1
  );

  return (
    <>
      <PageHeader title={<Trans>Conta</Trans>} />
      <div className="section content">
        <div className="columns">
          <div className="column is-6">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">
                  <Trans>Nome</Trans>
                </label>
                <div className="control has-icons-left">
                  <input
                    type="name"
                    required
                    maxLength={255}
                    className="input"
                    defaultValue={user.name}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        name: event.target.value,
                      });
                    }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-user" />
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">
                  <Trans>Apelido</Trans>
                </label>
                <div className="control has-icons-left">
                  <input
                    type="text"
                    required
                    maxLength={255}
                    className="input"
                    defaultValue={user.surname}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        surname: event.target.value,
                      });
                    }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-user" />
                  </span>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <label className="label">
                    <Trans>Data de nascimento</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <DatePicker
                      renderCustomHeader={({
                        date,
                        changeYear,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => (
                        <>
                          <select
                            value={getYear(date)}
                            onChange={({ target: { value } }) =>
                              changeYear(value)
                            }
                            className="custom-year-select"
                          >
                            {years.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <div className="custom-month-container">
                            {!prevMonthButtonDisabled && (
                              <button
                                type="button"
                                className="react-datepicker__navigation react-datepicker__navigation--previous"
                                aria-label="Previous Month"
                                onClick={decreaseMonth}
                              >
                                Previous Month
                              </button>
                            )}
                            {!nextMonthButtonDisabled && (
                              <button
                                type="button"
                                className="react-datepicker__navigation react-datepicker__navigation--next"
                                aria-label="Next Month"
                                onClick={increaseMonth}
                              >
                                Next Month
                              </button>
                            )}
                            <div className="react-datepicker__current-month">
                              {convertToLongMonth(date, language, true)}
                            </div>
                          </div>
                        </>
                      )}
                      minDate={sub(new Date(), { years: 100 })}
                      maxDate={sub(new Date(), { years: 18 })}
                      onChange={(date) => {
                        setFormData({
                          ...formData,
                          birthday: date,
                        });
                      }}
                      selected={formData.birthday}
                      dateFormat="yyyy-MM-dd"
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-calendar" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">
                  <Trans>Distrito/Região</Trans>
                </label>
                <div className="control has-icons-left">
                  <div className="select">
                    <select
                      defaultValue={user.region}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          region: event.target.value,
                        });
                      }}
                    >
                      <option value="">-</option>
                      {regions.map((region) => (
                        <option value={region.code} key={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="icon is-small is-left">
                    <i className="fa fa-globe"></i>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">
                  <Trans>E-Mail</Trans>
                </label>
                <div className="control has-icons-left">
                  <input
                    type="email"
                    required
                    className={classames('input', {
                      'is-danger': error && error.data && error.data.email,
                    })}
                    defaultValue={user.email}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        email: event.target.value,
                      });
                    }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-envelope" />
                  </span>
                </div>
                {error &&
                  error.data &&
                  error.data.email &&
                  error.data.email.includes('validation.unique') && (
                    <p className="help is-danger">
                      <Trans>Já existe uma conta com este e-mail.</Trans>
                    </p>
                  )}
              </div>
              <div className="field">
                <label className="label">
                  <Trans>Palavra-passe</Trans> (
                  <Trans>deixa em branco para não alterar</Trans>)
                </label>
                <div className="control has-icons-left">
                  <input
                    type="password"
                    minLength={6}
                    maxLength={255}
                    className="input"
                    autoComplete="new-password"
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        password: event.target.value,
                      });
                    }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-key" />
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">
                  <Trans>Confirmação da palavra-passe</Trans>
                </label>
                <div className="control has-icons-left">
                  <input
                    type="password"
                    minLength={6}
                    maxLength={255}
                    className={`input ${
                      formData.password2.length &&
                      formData.password !== formData.password2 &&
                      'is-danger'
                    }`}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        password2: event.target.value,
                      });
                    }}
                  />
                  <span className="icon is-small is-left">
                    <i className="fa fa-key" />
                  </span>
                </div>
              </div>
              {(user.valid_roles.regular_player || user.valid_roles.admin) && (
                <>
                  <div className="field">
                    <input
                      id="quiz_daily"
                      type="checkbox"
                      className="switch"
                      value="true"
                      defaultChecked={formData.reminders.quiz.daily}
                      onChange={(event) => {
                        event.persist();
                        setFormData((prev) => {
                          let newFormData = { ...prev };
                          newFormData.reminders.quiz.daily =
                            event.target.checked;
                          return newFormData;
                        });
                      }}
                    />
                    <label htmlFor="quiz_daily">
                      <Trans>Notificação de quiz regular (00h00)</Trans>
                    </label>
                  </div>
                  <div className="field">
                    <input
                      id="quiz_deadline"
                      type="checkbox"
                      className="switch"
                      value="true"
                      defaultChecked={formData.reminders.quiz.deadline}
                      onChange={(event) => {
                        event.persist();
                        setFormData((prev) => {
                          let newFormData = { ...prev };
                          newFormData.reminders.quiz.deadline =
                            event.target.checked;
                          return newFormData;
                        });
                      }}
                    />
                    <label htmlFor="quiz_deadline">
                      <Trans>Notificação de quiz regular (22h00)</Trans>
                    </label>
                  </div>
                </>
              )}
              {(user.valid_roles.special_quiz_player ||
                user.valid_roles.regular_player ||
                user.valid_roles.admin) && (
                <>
                  <div className="field">
                    <input
                      id="special_quiz_daily"
                      type="checkbox"
                      className="switch"
                      value="true"
                      defaultChecked={formData.reminders.special_quiz.daily}
                      onChange={(event) => {
                        event.persist();
                        setFormData((prev) => {
                          let newFormData = { ...prev };
                          newFormData.reminders.special_quiz.daily =
                            event.target.checked;
                          return newFormData;
                        });
                      }}
                    />
                    <label htmlFor="special_quiz_daily">
                      <Trans>Notificação de quiz especial (00h00)</Trans>
                    </label>
                  </div>
                  <div className="field">
                    <input
                      id="special_quiz_deadline"
                      type="checkbox"
                      className="switch"
                      value="true"
                      defaultChecked={formData.reminders.special_quiz.deadline}
                      onChange={(event) => {
                        event.persist();
                        setFormData((prev) => {
                          let newFormData = { ...prev };
                          newFormData.reminders.special_quiz.deadline =
                            event.target.checked;
                          return newFormData;
                        });
                      }}
                    />
                    <label htmlFor="special_quiz_deadline">
                      <Trans>Notificação de quiz especial (22h00)</Trans>
                    </label>
                  </div>
                </>
              )}
              <div className="field">
                <div className="control">
                  <button
                    className={`button is-primary ${
                      submitting && 'is-loading'
                    }`}
                    disabled={
                      submitting || formData.password !== formData.password2
                    }
                  >
                    <Trans>Gravar</Trans>
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="column is-6">
            <Avatar />
            {(user.valid_roles.regular_player ||
              user.valid_roles.special_quiz_player) && (
              <>
                <hr />
                <div>
                  <div className="label">
                    <Trans>Validade da subscrição</Trans>
                  </div>
                  <div>
                    {convertToLongDate(
                      user.roles.regular_player ||
                        user.roles.special_quiz_player,
                      language
                    )}
                  </div>
                </div>
              </>
            )}
            {process.env.REACT_APP_PAYPAL === 'true' && (
              <>
                <hr />
                <div>
                  <div className="label">
                    <Trans>Renovação da subscrição via Paypal</Trans>
                  </div>
                  <PayPal />
                  {!(process.env.REACT_APP_ONLY_PAYPAL === 'true') && (
                    <p>
                      <Trans>
                        Se preferires fazer a renovação em mão, através de
                        transferência bancária ou por MB WAY, vê como{' '}
                        <Link to="/rules#subscription">aqui</Link>
                      </Trans>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
