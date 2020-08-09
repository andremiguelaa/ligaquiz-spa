import React from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

import classes from './Table.module.scss';

const Table = ({ data, users, genre }) => (
  <table className="table is-fullwidth is-hoverable is-stripped">
    <thead>
      <tr>
        <th>
          <Trans>Nome</Trans>
        </th>
        <th className={classes.correct}>
          <I18n>
            {({ i18n }) => (
              <span
                className="icon has-tooltip-bottom"
                data-tooltip={i18n._(t`Respostas correctas`)}
              >
                <Trans>RC</Trans>
              </span>
            )}
          </I18n>
        </th>
        <th className={classes.total}>
          <I18n>
            {({ i18n }) => (
              <span
                className="icon has-tooltip-bottom"
                data-tooltip={i18n._(t`Perguntas respondidas`)}
              >
                <Trans>PR</Trans>
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
      {data.map((player) => (
        <tr key={player.user}>
          <td>
            {users[player.user].name} {users[player.user].surname}
          </td>
          <td className={classes.correct}>
            {genre ? player.genres[genre].correct : player.correct}
          </td>
          <td className={classes.total}>
            {genre ? player.genres[genre].total : player.total}
          </td>
          <td className={classes.percentage}>
            {Math.round(
              (genre
                ? player.genres[genre].correct / player.genres[genre].total
                : player.correct / player.total) * 100
            )}
            %
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
