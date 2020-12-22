import React, { useState, useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classnames from 'classnames';
import { Radar } from 'react-chartjs-2';

import ApiRequest from 'utils/ApiRequest';
import { useStateValue } from 'state/State';
import Loading from 'components/Loading';
import { getGenreTranslation } from 'utils/getGenreTranslation';

import classes from './Statistics.module.scss';

const isDarkMode =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const League = ({ user, setError }) => {
  const { id: userId } = useParams();
  const [
    {
      user: authUser,
      settings: { language },
    },
  ] = useStateValue();
  const [genres, setGenres] = useState();
  const [statistics, setStatistics] = useState();
  const [chartSeries, setChartSeries] = useState();

  useEffect(() => {
    ApiRequest.get(`genres`)
      .then(({ data }) => {
        setGenres(data);
      })
      .catch(({ response }) => {
        setError(response?.status);
      });
  }, [setError]);

  useEffect(() => {
    if (user && genres) {
      const computedStatistics = genres.map((genre) => {
        let genreStatistics = {
          id: genre.id,
          slug: genre.slug,
          total: 0,
          correct: 0,
          percentage: 0,
          subgenres: [],
        };
        genre.subgenres.forEach((subgenre) => {
          genreStatistics.total += user.statistics[subgenre.id]?.total || 0;
          genreStatistics.correct += user.statistics[subgenre.id]?.correct || 0;
          genreStatistics.subgenres.push({
            id: subgenre.id,
            slug: subgenre.slug,
            total: user.statistics[subgenre.id]?.total || 0,
            correct: user.statistics[subgenre.id]?.correct || 0,
            percentage:
              ((user.statistics[subgenre.id]?.correct || 0) /
                (user.statistics[subgenre.id]?.total || 1)) *
              100,
          });
        });
        genreStatistics.percentage =
          ((genreStatistics?.correct || 0) / (genreStatistics?.total || 1)) *
          100;
        return genreStatistics;
      });
      setStatistics(computedStatistics);
      setChartSeries(
        computedStatistics.map((genre) => Math.round(genre.percentage))
      );
    }
  }, [user, genres]);

  if (!genres || !statistics) {
    return <Loading />;
  }

  return (
    <>
      <section className="section content">
        <div className={classes.info}>
          {user.avatar ? (
            <div className={classes.avatarWrapper}>
              <img
                className={classes.avatar}
                src={user.avatar}
                alt={`${user.name} ${user.surname}`}
              />
            </div>
          ) : (
            <i className={classnames('fa', 'fa-user', classes.icon)} />
          )}
          {user.email && (
            <div className={classes.emailWrapper}>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
          )}
          {process.env.REACT_APP_NATIONAL_RANKING === 'true' &&
            user.national_rank && (
              <div>
                <Trans>
                  Número {user.national_rank} no{' '}
                  <Link to="/national-ranking">Ranking Nacional</Link>
                </Trans>
              </div>
            )}
        </div>
      </section>
      <section className="section content">
        <div className={classes.chart}>
          <Radar
            data={{
              labels: genres.map((genre) =>
                getGenreTranslation(genre.slug, language)
              ),
              datasets: [
                {
                  data: chartSeries,
                  backgroundColor: 'hsla(204, 86%, 53%, 0.3)',
                  borderColor: 'hsl(204, 86%, 53%)',
                  pointRadius: 0,
                  tension: 0.2,
                },
              ],
            }}
            options={{
              scale: {
                gridLines: {
                  color: isDarkMode
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.3)',
                },
                ticks: {
                  beginAtZero: true,
                  max: 100,
                  display: false,
                },
                angleLines: {
                  color: isDarkMode
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.3)',
                },
                pointLabels: {
                  fontSize: 14,
                  fontColor: isDarkMode ? 'white' : 'black',
                  fontFamily:
                    'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
                },
              },
              legend: {
                display: false,
              },
            }}
          />
        </div>
        {userId && authUser && userId !== authUser?.id && (
          <div className={classnames('has-text-centered', classes.compare)}>
            <Link to={`/statistics-comparison/${userId}/${authUser?.id}`}>
              <Trans>Comparar comigo</Trans>
            </Link>
          </div>
        )}
        <table
          className={classnames(
            'table is-fullwidth is-hoverable',
            classes.genresTable
          )}
        >
          <thead>
            <tr>
              <th>
                <Trans>Tema</Trans>
              </th>
              <th>
                <I18n>
                  {({ i18n }) => (
                    <span
                      className="icon has-tooltip-bottom"
                      data-tooltip={i18n._(t`Respostas correctas`)}
                    >
                      <Trans>C</Trans>
                    </span>
                  )}
                </I18n>
              </th>
              <th>
                <I18n>
                  {({ i18n }) => (
                    <span
                      className="icon has-tooltip-bottom"
                      data-tooltip={i18n._(t`Total de respostas`)}
                    >
                      <Trans>T</Trans>
                    </span>
                  )}
                </I18n>
              </th>
              <th>
                <I18n>
                  {({ i18n }) => (
                    <span
                      className="icon has-tooltip-bottom has-tooltip-left"
                      data-tooltip={i18n._(t`Percentagem de acerto`)}
                    >
                      %
                    </span>
                  )}
                </I18n>
              </th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((genre) => (
              <Fragment key={genre.id}>
                <tr>
                  <th>{getGenreTranslation(genre.slug, language)}</th>
                  <td>{genre.correct}</td>
                  <td>{genre.total}</td>
                  <td>{Math.round(genre.percentage)}%</td>
                </tr>
                {genre.subgenres.length > 1 && (
                  <>
                    {genre.subgenres.map((subgenre) => (
                      <tr key={subgenre.id} className={classes.subgenre}>
                        <th>{getGenreTranslation(subgenre.slug, language)}</th>
                        <td>{subgenre.correct}</td>
                        <td>{subgenre.total}</td>
                        <td>{Math.round(subgenre.percentage)}%</td>
                      </tr>
                    ))}
                  </>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default League;
