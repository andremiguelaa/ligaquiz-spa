import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import {
  getGenreTranslationAbbr,
  getGenreTranslation,
} from 'utils/getGenreTranslation';
import PageHeader from 'components/PageHeader';
import Loading from 'components/Loading';
import Error from 'components/Error';
import EmptyState from 'components/EmptyState';

import Table from './GenreRanking/Table';

const GenreRanking = () => {
  const { season, genre } = useParams();
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
  const [statistics, setStatistics] = useState();
  const [error, setError] = useState();
  const [users, setUsers] = useState();
  const [genres, setGenres] = useState();
  const [seasonNumber, setSeasonNumber] = useState();

  const getStatistics = (season) => {
    setStatistics();
    ApiRequest.get(`answers?season=${season}&submitted=1`)
      .then(({ data: answers }) => {
        const params = Object.keys(answers).reduce((acc, item) => {
          if (acc) {
            return `${acc}&id[]=${item}`;
          } else {
            return `?id[]=${item}`;
          }
        }, '');
        if (params) {
          ApiRequest.get(`questions${params}`)
            .then(({ data: questions }) => {
              ApiRequest.get(`genres`)
                .then(({ data: genres }) => {
                  setGenres(genres);
                  const mappedGenres = genres.reduce((acc, genre) => {
                    const subgenresMap = genre.subgenres.reduce(
                      (innerAcc, subgenre) => {
                        innerAcc[subgenre.id] = genre.id;
                        return innerAcc;
                      },
                      {}
                    );
                    return {
                      ...acc,
                      ...subgenresMap,
                    };
                  }, {});
                  const mapppedQuestionsGenres = questions.reduce(
                    (acc, question) => {
                      acc[question.id] = question.genre_id;
                      return acc;
                    },
                    {}
                  );
                  const computedStatistics = []
                    .concat(...Object.values(answers))
                    .reduce((acc, answer) => {
                      if (!acc[answer.user_id]) {
                        acc[answer.user_id] = {
                          user: answer.user_id,
                          total: 0,
                          correct: 0,
                          genres: {},
                        };
                      }
                      const genre =
                        mappedGenres[
                          mapppedQuestionsGenres[answer.question_id]
                        ];
                      if (!acc[answer.user_id].genres[genre]) {
                        acc[answer.user_id].genres[genre] = {
                          total: 0,
                          correct: 0,
                        };
                      }
                      acc[answer.user_id].total++;
                      acc[answer.user_id].genres[genre].total++;
                      if (answer.correct) {
                        acc[answer.user_id].correct++;
                        acc[answer.user_id].genres[genre].correct++;
                      }
                      return acc;
                    }, {});
                  setStatistics(computedStatistics);
                })
                .catch(({ response }) => {
                  setError(response?.status);
                });
            })
            .catch(({ response }) => {
              setError(response?.status);
            });
        } else {
          setStatistics({});
        }
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  };

  useEffect(() => {
    if (season) {
      if (parseInt(season) !== seasonNumber) {
        getStatistics(season);
        setSeasonNumber(parseInt(season));
      }
    } else {
      ApiRequest.get(`seasons`)
        .then(({ data }) => {
          if (data.length) {
            let lastSeason = data.find((season) => season.past);
            if (!lastSeason) {
              lastSeason = data[data.length - 1];
            }
            setSeasonNumber(lastSeason.season);
            getStatistics(lastSeason.season);
          }
        })
        .catch(({ response }) => {
          setError(response?.status);
        });
    }
  }, [season, seasonNumber]);

  useEffect(() => {
    ApiRequest.get(`users`)
      .then(({ data }) => {
        setUsers(
          data.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {})
        );
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, []);

  if (error) {
    return <Error status={error} />;
  }

  if (!statistics || !users) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader
        title={<Trans>Rankings temáticos</Trans>}
        subtitle={<Trans>Temporada {seasonNumber}</Trans>}
      />
      {Object.keys(statistics).length > 0 ? (
        <>
          <div className="section">
            <div className="tabs is-fullwidth">
              <ul>
                <li
                  className={classnames({
                    'is-active': !genre,
                  })}
                >
                  <Link to={`/genre-rankings/${seasonNumber}`}>
                    <Trans>Global</Trans>
                  </Link>
                </li>
                {genres.map((item) => (
                  <li
                    key={item.id}
                    className={classnames({
                      'is-active': item.id === parseInt(genre),
                    })}
                  >
                    <Link to={`/genre-rankings/${seasonNumber}/${item.id}`}>
                      <span className="is-hidden-touch">
                        {getGenreTranslation(item.slug, language)}
                      </span>
                      <abbr
                        className="is-hidden-desktop has-tooltip-left"
                        data-tooltip={getGenreTranslation(item.slug, language)}
                      >
                        {getGenreTranslationAbbr(item.slug, language)}
                      </abbr>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="section content">
            {!genre ? (
              <Table
                data={Object.values(statistics).sort(
                  (a, b) =>
                    b.correct * 10 + b.total - (a.correct * 10 + a.total)
                )}
                users={users}
              />
            ) : (
              <Table
                data={Object.values(statistics).sort(
                  (a, b) =>
                    (b.genres[genre]?.correct || 0) * 10 +
                    (b.genres[genre]?.total || 0) -
                    ((a.genres[genre]?.correct || 0) * 10 +
                      (a.genres[genre]?.total || 0))
                )}
                genre={genre}
                users={users}
              />
            )}
          </div>
        </>
      ) : (
        <EmptyState>
          <Trans>Sem registos</Trans>
        </EmptyState>
      )}
    </>
  );
};

export default GenreRanking;
