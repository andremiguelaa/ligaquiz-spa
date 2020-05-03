import React from 'react';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

const RankChange = ({ change }) => (
  <>
    {change === 0 && <strong>=</strong>}
    {change === undefined && <i className="fa fa-star has-text-warning"></i>}
    {change > 0 && (
      <I18n>
        {({ i18n }) => (
          <i
            title={i18n._(t`Subiu ${change} posições`)}
            className="fa fa-arrow-up has-text-success"
          ></i>
        )}
      </I18n>
    )}
    {change < 0 && (
      <I18n>
        {({ i18n }) => (
          <i
            title={i18n._(t`Desceu ${Math.abs(change)} posições`)}
            className="fa fa-arrow-down has-text-danger"
          ></i>
        )}
      </I18n>
    )}
  </>
);

export default RankChange;
