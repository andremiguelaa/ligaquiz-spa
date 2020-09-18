import React from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classnames from 'classnames';

import { useStateValue } from 'state/State';

import classes from './Table.module.scss';

const Table = ({ data, users, genre }) => {
  const [{ user }] = useStateValue();
  return (
    <table className="table is-fullwidth is-hoverable">
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
          <tr
            key={player.user}
            className={classnames({
              'has-background-success': player.user === user.id,
            })}
          >
            <td>
              {users[player.user].name} {users[player.user].surname}
            </td>
            <td className={classes.correct}>
              {(genre ? player.genres[genre]?.correct : player.correct) || 0}
            </td>
            <td className={classes.total}>
              {(genre ? player.genres[genre]?.total : player.total) || 0}
            </td>
            <td className={classes.percentage}>
              {Math.round(
                (genre
                  ? (player.genres[genre]?.correct || 0) /
                    (player.genres[genre]?.total || 1)
                  : player.correct / (player.total || 1)) * 100
              )}
              %
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
