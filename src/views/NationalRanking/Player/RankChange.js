import React from 'react';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

const RankChange = ({ change }) => (
  <>
    {change === 0 && <strong>=</strong>}
    {change === undefined && (
      <I18n>
        {({ i18n }) => (
          <span
            className="icon has-tooltip-right"
            data-tooltip={i18n._(t`Nova entrada para o ranking`)}
          >
            <i className="fa fa-star has-text-warning"></i>
          </span>
        )}
      </I18n>
    )}
    {change > 0 && (
      <I18n>
        {({ i18n }) => (
          <span
            className="icon has-tooltip-right"
            data-tooltip={`${i18n._(t`Subiu`)} ${Math.abs(change)} ${
              Math.abs(change) > 1 ? i18n._(t`posições`) : i18n._(t`posição`)
            }`}
          >
            <i className="fa fa-arrow-up has-text-success"></i>
          </span>
        )}
      </I18n>
    )}
    {change < 0 && (
      <I18n>
        {({ i18n }) => (
          <span
            className="icon has-tooltip-right"
            data-tooltip={`${i18n._(t`Desceu`)} ${Math.abs(change)} ${
              Math.abs(change) > 1 ? i18n._(t`posições`) : i18n._(t`posição`)
            }`}
          >
            <i className="fa fa-arrow-down has-text-danger"></i>
          </span>
        )}
      </I18n>
    )}
  </>
);

export default RankChange;
