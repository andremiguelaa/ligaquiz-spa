import React, { Fragment, useState, useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classnames from 'classnames';
import { differenceInYears } from 'date-fns';

import { useStateValue } from 'state/State';
import { getRegionTranslations } from 'utils/getRegionTranslation';

import classes from './Quiz.module.scss';

const points = {
  0: 0,
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 3,
};

const sortFunction = (order) => (a, b) => {
  if (typeof a[order.path] === 'string') {
    if (order.direction === 'desc') {
      return b[order.path].localeCompare(a[order.path]);
    }
    return a[order.path].localeCompare(b[order.path]);
  }
  if (order.direction === 'desc') {
    return b[order.path] - a[order.path];
  }
  return a[order.path] - b[order.path];
};

const OpponentStats = ({ opponent, setPoints }) => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();

  const [order, setOrder] = useState({
    genres: {
      path: 'percentage',
      direction: 'desc',
    },
    subgenres: {
      path: 'percentage',
      direction: 'desc',
    },
  });

  const sortDatasetByPath = (dataset, path) => {
    let newOrder;
    if (order[dataset].path === path) {
      newOrder = {
        path,
        direction: order[dataset].direction === 'asc' ? 'desc' : 'asc',
      };
    } else {
      newOrder = { path, direction: path === 'name' ? 'asc' : 'desc' };
    }
    setOrder((prev) => ({
      ...prev,
      [dataset]: newOrder,
    }));
  };

  const autoPoints = useMemo(() => {
    const stats = [...opponent.genreStats];
    const genreOrder = stats
      .sort((a, b) => a.id - b.id)
      .reduce((acc, item, index) => {
        acc[item.id] = index;
        return acc;
      }, {});
    return stats
      .sort((a, b) => b.percentage - a.percentage)
      .reduce((acc, item, index) => {
        acc[genreOrder[item.id]] = points[index];
        return acc;
      }, []);
  }, [opponent.genreStats]);

  const genreStats = useMemo(
    () => [...opponent.genreStats].sort(sortFunction(order.genres)),
    [opponent.genreStats, order.genres]
  );
  const subgenreStats = useMemo(
    () => [...opponent.subgenreStats].sort(sortFunction(order.subgenres)),
    [opponent.subgenreStats, order.subgenres]
  );

  return (
    <>
      <p className={classes.opponentName}>
        {opponent.name} {opponent.surname}
        {opponent.birthday && opponent.birthday !== 'hidden' && (
          <>
            {' '}
            <Trans>
              ({differenceInYears(new Date(), new Date(opponent.birthday))}{' '}
              anos)
            </Trans>
          </>
        )}
        {opponent.region && opponent.region !== 'hidden' && (
          <>
            <br />
            {getRegionTranslations(opponent.region, language)}
          </>
        )}
        {opponent.birthday === 'hidden' && (
          <small className={classes.missing}>
            <span className="icon has-text-warning">
              <i className="fa fa-exclamation-triangle"></i>
            </span>
            <Trans>
              Preenche a tua data de nascimento para veres a idade do teu
              adversário
            </Trans>
          </small>
        )}
        {opponent.region === 'hidden' && (
          <small className={classes.missing}>
            <span className="icon has-text-warning">
              <i className="fa fa-exclamation-triangle"></i>
            </span>
            <Trans>
              Preenche a tua região para veres a região do teu adversário
            </Trans>
          </small>
        )}
      </p>
      <div className={classes.assignPoints}>
        <button
          className="button is-primary"
          onClick={() => {
            autoPoints.forEach((element, index) => {
              setPoints(index, element);
            });
          }}
        >
          <Trans>Atribuir pontos automaticamente</Trans>
        </button>
      </div>
      <div className="table-container content">
        <table
          className={classnames(
            'table is-fullwidth is-hoverable',
            classes.genresTable
          )}
        >
          <thead>
            <tr>
              <th className="sortable">
                <button
                  type="button"
                  onClick={() => sortDatasetByPath('genres', 'name')}
                >
                  <Trans>Tema</Trans>
                  <span className="icon">
                    <i
                      className={classnames('fa', {
                        'fa-sort': order.genres.path !== 'name',
                        [`fa-sort-alpha-${order.genres.direction}`]:
                          order.genres.path === 'name',
                      })}
                    ></i>
                  </span>
                </button>
              </th>
              <th className={classnames('sortable', classes.total)}>
                <button
                  type="button"
                  onClick={() => sortDatasetByPath('genres', 'total')}
                >
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
                  <span className="icon">
                    <i
                      className={classnames('fa', {
                        'fa-sort': order.genres.path !== 'total',
                        [`fa-sort-numeric-${order.genres.direction}`]:
                          order.genres.path === 'total',
                      })}
                    ></i>
                  </span>
                </button>
              </th>
              <th className={classnames('sortable', classes.percentage)}>
                <button
                  type="button"
                  onClick={() => sortDatasetByPath('genres', 'percentage')}
                >
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
                  <span className="icon">
                    <i
                      className={classnames('fa', {
                        'fa-sort': order.genres.path !== 'percentage',
                        [`fa-sort-numeric-${order.genres.direction}`]:
                          order.genres.path === 'percentage',
                      })}
                    ></i>
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {genreStats.map((genre) => (
              <Fragment key={genre.id}>
                <tr>
                  <th>{genre.name}</th>
                  <td className={classes.total}>{genre.total}</td>
                  <td className={classes.percentage}>
                    {Math.round(genre.percentage)}%
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-container content">
        <table
          className={classnames(
            'table is-fullwidth is-hoverable',
            classes.genresTable
          )}
        >
          <thead>
            <tr>
              <th className="sortable">
                <button
                  type="button"
                  onClick={() => sortDatasetByPath('subgenres', 'name')}
                >
                  <Trans>Subtema</Trans>
                  <span className="icon">
                    <i
                      className={classnames('fa', {
                        'fa-sort': order.subgenres.path !== 'name',
                        [`fa-sort-alpha-${order.subgenres.direction}`]:
                          order.subgenres.path === 'name',
                      })}
                    ></i>
                  </span>
                </button>
              </th>
              <th className={classnames('sortable', classes.total)}>
                <button
                  type="button"
                  onClick={() => sortDatasetByPath('subgenres', 'total')}
                >
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
                  <span className="icon">
                    <i
                      className={classnames('fa', {
                        'fa-sort': order.subgenres.path !== 'total',
                        [`fa-sort-numeric-${order.subgenres.direction}`]:
                          order.subgenres.path === 'total',
                      })}
                    ></i>
                  </span>
                </button>
              </th>
              <th className={classnames('sortable', classes.percentage)}>
                <button
                  type="button"
                  onClick={() => sortDatasetByPath('subgenres', 'percentage')}
                >
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
                  <span className="icon">
                    <i
                      className={classnames('fa', {
                        'fa-sort': order.subgenres.path !== 'percentage',
                        [`fa-sort-numeric-${order.subgenres.direction}`]:
                          order.subgenres.path === 'percentage',
                      })}
                    ></i>
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {subgenreStats.map((genre) => (
              <Fragment key={genre.id}>
                <tr>
                  <th>{genre.name}</th>
                  <td className={classes.total}>{genre.total}</td>
                  <td className={classes.percentage}>
                    {Math.round(genre.percentage)}%
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OpponentStats;
