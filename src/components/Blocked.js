import React from 'react';
import { Trans } from '@lingui/macro';

import classes from './Blocked.module.scss';

export const Blocked = () => (
  <>
    <div className={classes.icon}>
      <i className="fa fa-ban" />
    </div>
    <div className={classes.content}>
      <Trans>Esta conta encontra-se bloqueada.</Trans>
    </div>
  </>
);

export default Blocked;
