import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { sub, getYear } from 'date-fns';
import { range } from 'lodash';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import PageHeader from 'components/PageHeader';
import Loading from 'components/Loading';
import { useStateValue } from 'state/State';
import { getRegionTranslations } from 'utils/getRegionTranslation';
import ApiRequest from 'utils/ApiRequest';
import { formatDate, convertToLongMonth } from 'utils/formatDate';
import Error from 'components/Error';

const Register = () => {
  const [regions, setRegions] = useState();
  const [birthday, setBirthday] = useState();
  const [loadingError, setLoadingError] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();

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
        setLoadingError(response?.status);
      });
  }, [language]);

  if (user) {
    return <Error status={403} />;
  }

  if (loadingError) {
    return <Error status={loadingError} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!regions) {
    return <Loading />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.target);
    if (formData.get('password') !== formData.get('password2')) {
      setError({ message: 'password_mismatch' });
      return;
    }
    if (birthday) {
      formData.set('birthday', formatDate(birthday));
    }
    formData.set('language', language);
    setSubmitting(true);
    ApiRequest.post('users', formData)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        try {
          setError(error.response.data);
        } catch (error) {
          setError({ message: 'server_error' });
        }
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
      <PageHeader title={<Trans>Registo</Trans>} />
      <div className="section content">
        <div className="columns">
          <div className="column is-4-widescreen is-6-tablet">
            {!success ? (
              <form
                onSubmit={(event) => {
                  event.persist();
                  handleSubmit(event);
                }}
              >
                <div className="field">
                  <label className="label">
                    <Trans>Nome</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      name="name"
                      required
                      maxLength={255}
                      className="input"
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
                      name="surname"
                      required
                      maxLength={255}
                      className="input"
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-user" />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <label className="label">
                      <Trans>Data de nascimento</Trans> (<Trans>Opcional</Trans>
                      )
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
                        selected={birthday}
                        dateFormat="yyyy-MM-dd"
                        onChange={(date) => setBirthday(date)}
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-calendar" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">
                    <Trans>Distrito/Região</Trans> (<Trans>Opcional</Trans>)
                  </label>
                  <div className="control has-icons-left">
                    <div className="select">
                      <select name="region">
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
                      name="email"
                      required
                      className={classnames('input', {
                        'is-danger': error && error.data && error.data.email,
                      })}
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
                    <Trans>Palavra-passe</Trans>
                  </label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      maxLength={255}
                      className="input"
                      autoComplete="new-password"
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
                      name="password2"
                      required
                      minLength={6}
                      maxLength={255}
                      className="input"
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-key" />
                    </span>
                  </div>
                  {error && error.message === 'password_mismatch' && (
                    <div className="field">
                      <p className="help is-danger">
                        <Trans>As palavras-passes não coincidem.</Trans>
                      </p>
                    </div>
                  )}
                </div>
                {error &&
                  error.message !== 'validation_error' &&
                  error.message !== 'password_mismatch' && (
                    <div className="field">
                      <p className="help is-danger">
                        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
                      </p>
                    </div>
                  )}
                <div className="field">
                  <div className="control">
                    <button
                      className={`button is-primary ${
                        submitting && 'is-loading'
                      }`}
                      disabled={submitting}
                    >
                      <Trans>Registar</Trans>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <Trans>
                Utilizador registado com sucesso.
                <br />
                Clica <Link to="/login/">aqui</Link> e usa as tuas credenciais.
              </Trans>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
