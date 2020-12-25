import React, { Fragment } from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classnames from 'classnames';
import { differenceInYears } from 'date-fns';

import { useStateValue } from 'state/State';
import { getRegionTranslations } from 'utils/getRegionTranslation';
import { getGenreTranslation } from 'utils/getGenreTranslation';

import classes from './Quiz.module.scss';

const OpponentsStats = ({ opponent }) => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();
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
      <div className="table-container">
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
              <th className={classes.total}>
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
              <th className={classes.percentage}>
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
            {opponent.genreStats.map((genre) => (
              <Fragment key={genre.id}>
                <tr>
                  <th>{getGenreTranslation(genre.slug, language)}</th>
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
      <div className="table-container">
        <table
          className={classnames(
            'table is-fullwidth is-hoverable',
            classes.genresTable
          )}
        >
          <thead>
            <tr>
              <th>
                <Trans>Subtema</Trans>
              </th>
              <th className={classes.total}>
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
              <th className={classes.percentage}>
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
            {opponent.subgenreStats.map((genre) => (
              <Fragment key={genre.id}>
                <tr>
                  <th>{getGenreTranslation(genre.slug, language)}</th>
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

export default OpponentsStats;
