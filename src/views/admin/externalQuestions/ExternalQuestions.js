import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';
import Loading from 'components/Loading';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';
import EmptyState from 'components/EmptyState';
import Markdown from 'components/Markdown';
import PaginatedTable from 'components/PaginatedTable';
import Modal from 'components/Modal';
import { getGenreTranslation } from 'utils/getGenreTranslation';

import classes from './ExternalQuestions.module.scss';

const genres = [
  'culture',
  'entertainment',
  'history',
  'lifestyle',
  'media',
  'sport',
  'science',
  'world',
];

const mimeTypes = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  mp4: 'video',
  mp3: 'audio',
};

const ExternalQuestions = () => {
  const history = useHistory();
  const location = useLocation();
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState();
  const [query, setQuery] = useState('');
  const [searchField, setSearchField] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSubgenre, setSelectedSubgenre] = useState('');
  const [page, setPage] = useState();
  const [historyParams, setHistoryParams] = useState({
    search: '',
    searchField: '',
    genre: undefined,
    page: undefined,
  });
  const [saving, setSaving] = useState();
  const [modal, setModal] = useState();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('genre')) {
      const paramGenre = genres.find((item) => item === params.get('genre'));
      if (paramGenre) {
        setSelectedGenre(paramGenre);
      }
      setHistoryParams((prev) => ({ ...prev, genre: params.get('genre') }));
    } else {
      setSelectedGenre('');
      setSelectedSubgenre('');
    }
    if (params.get('search')) {
      setQuery(params.get('search'));
      setHistoryParams((prev) => ({ ...prev, search: params.get('search') }));
    } else {
      setQuery('');
    }
    if (params.get('search_field')) {
      setSearchField(params.get('search_field'));
      setHistoryParams((prev) => ({
        ...prev,
        searchField: params.get('search_field'),
      }));
    } else {
      setSearchField('');
    }
    if (params.get('page')) {
      setPage(params.get('page'));
      setHistoryParams((prev) => ({ ...prev, page: params.get('page') }));
    } else {
      setPage(1);
    }
  }, [location.search]);

  useEffect(() => {
    if (location.search) {
      setQuestions();
      ApiRequest.get(`external-questions${location.search}`)
        .then(({ data }) => {
          setQuestions(data);
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [location.search]);

  useDeepCompareEffect(() => {
    history.push(
      `/admin/external-questions?search=${
        historyParams.search || ''
      }&search_field=${historyParams.searchField || ''}${
        historyParams.genre ? `&genre=${historyParams.genre}` : ''
      }${historyParams.page ? `&page=${historyParams.page}` : ''}`
    );
  }, [history, historyParams]);

  if (!user) {
    return <Error status={401} />;
  }

  if (!(user.valid_roles.admin || user.valid_roles.quiz_editor)) {
    return <Error status={403} />;
  }

  if (error) {
    return <Error status={error} />;
  }

  if (!questions) {
    return <Loading />;
  }

  const mimeType = modal
    ? mimeTypes[/(?:\.([^.]+))?$/.exec(modal.media)[1].toLowerCase()]
    : null;

  const updateItem = (data) => {
    setSaving(true);
    ApiRequest.patch(`external-questions`, data)
      .then(() => {
        setQuestions((prev) => {
          const newData = prev.data.map((item) => {
            if (item.id === data.id) {
              return {
                ...item,
                used: data.used,
              };
            }
            return item;
          });
          return {
            ...prev,
            data: newData,
          };
        });
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível alterar o estado.</Trans>);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <>
      <PageHeader title={<Trans>Pesquisa de perguntas externas</Trans>} />
      <section className={classnames('section', classes.questions)}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setHistoryParams((prev) => ({
              ...prev,
              search: query,
              searchField: searchField,
              genre: selectedSubgenre || selectedGenre,
              page: '1',
            }));
          }}
          className={classes.form}
        >
          <div className={classnames('field', 'is-grouped', classes.fields)}>
            <label className={classnames('label', classes.label)}>
              <Trans>Texto</Trans>
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                defaultValue={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className={classnames('control', classes.radios)}>
              <label className="radio">
                <input
                  type="radio"
                  name="searchBy"
                  value=""
                  checked={searchField === ''}
                  onChange={(event) => setSearchField(event.target.value)}
                />
                <Trans>Tudo</Trans>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="searchBy"
                  value="formulation"
                  checked={searchField === 'formulation'}
                  onChange={(event) => setSearchField(event.target.value)}
                />
                <Trans>Enunciado</Trans>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="searchBy"
                  value="answer"
                  checked={searchField === 'answer'}
                  onChange={(event) => setSearchField(event.target.value)}
                />
                <Trans>Resposta</Trans>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="searchBy"
                  value="origin"
                  checked={searchField === 'origin'}
                  onChange={(event) => setSearchField(event.target.value)}
                />
                <Trans>Origem</Trans>
              </label>
            </div>
          </div>
          <div className={classnames('field', 'is-grouped', classes.fields)}>
            <label className={classnames('label', classes.label)}>
              <Trans>Tema</Trans>
            </label>
            <div className="control has-icons-left">
              <div className="select">
                <select
                  value={selectedGenre}
                  onChange={(event) => {
                    setSelectedGenre(event.target.value);
                    setSelectedSubgenre('');
                  }}
                >
                  <option value="">
                    {getGenreTranslation('all', language)}
                  </option>
                  {genres.map((genre) => (
                    <option value={genre} key={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="icon is-small is-left">
                <i className="fa fa-book"></i>
              </div>
            </div>
            <div className={classnames('control', classes.control)}>
              <button className="button is-primary">
                <Trans>Pesquisar</Trans>
              </button>
            </div>
          </div>
        </form>
        {questions.data?.length > 0 && (
          <PaginatedTable
            array={questions.data}
            totalRows={questions.total}
            itemsPerPage={10}
            initialPage={page}
            columns={[
              {
                id: 'formulation',
                label: <Trans>Enunciado</Trans>,
                render: (item) => (
                  <div className="content">
                    <Markdown content={item.formulation} />
                  </div>
                ),
                className: `${classes.question} ${
                  user.valid_roles.admin ? classes.admin : ''
                }`,
              },
              {
                id: 'answer',
                label: <Trans>Resposta</Trans>,
                render: (item) => <Markdown content={item.answer} />,
                className: classes.answer,
              },
              {
                id: 'media',
                label: <Trans>Multimédia</Trans>,
                render: (item) => (
                  <>
                    {item.media && item.media !== '404' ? (
                      <button
                        className="button"
                        onClick={() => {
                          setModal(item);
                        }}
                      >
                        <span className="icon">
                          <i className="fa fa-eye"></i>
                        </span>
                      </button>
                    ) : (
                      '-'
                    )}
                  </>
                ),
                className: classes.media,
              },
              {
                id: 'origin',
                label: <Trans>Origem</Trans>,
                render: (item) => item.origin,
                className: classes.origin,
              },
              {
                id: 'used',
                label: <Trans>Usada</Trans>,
                className: classes.used,
                render: (item) => (
                  <>
                    {item.used ? (
                      <span className="icon has-text-success">
                        <i className="fa fa-lg fa-check-circle"></i>
                      </span>
                    ) : (
                      <span className="icon has-text-danger">
                        <i className="fa fa-lg fa-times-circle"></i>
                      </span>
                    )}
                  </>
                ),
              },
              {
                id: 'actions',
                label: <Trans>Alterar estado</Trans>,
                render: (item) => (
                  <div
                    className={classnames(
                      'buttons',
                      'has-addons',
                      classes.buttons
                    )}
                  >
                    <button
                      className={classnames('button', {
                        'is-success': !item.used,
                      })}
                      disabled={item.used || saving}
                      type="button"
                      onClick={() => {
                        updateItem({ id: item.id, used: true });
                      }}
                    >
                      <span className="icon">
                        <i className="fa fa-check"></i>
                      </span>
                    </button>
                    <button
                      className={classnames('button', {
                        'is-danger': item.used,
                      })}
                      disabled={!item.used || saving}
                      type="button"
                      onClick={() => {
                        updateItem({ id: item.id, used: false });
                      }}
                    >
                      <span className="icon">
                        <i className="fa fa-times"></i>
                      </span>
                    </button>
                  </div>
                ),
                className: classes.actions,
              },
            ].filter(Boolean)}
            onChange={(newPage) => {
              setHistoryParams((prev) => ({
                ...prev,
                page: newPage,
              }));
            }}
            onError={(code) => {
              setError(code);
            }}
          />
        )}
        {questions.data && !questions.data.length && (
          <EmptyState>
            <Trans>Sem registos</Trans>
          </EmptyState>
        )}
      </section>
      {modal && (
        <Modal
          type="info"
          open
          title={<Trans>Multimédia</Trans>}
          body={
            <div className={classes.mediaContainer}>
              {renderMedia(mimeType, modal.media, modal.id)}
            </div>
          }
          action={() => setModal()}
          onClose={() => setModal()}
          hideCancel
        />
      )}
    </>
  );
};

export default ExternalQuestions;
