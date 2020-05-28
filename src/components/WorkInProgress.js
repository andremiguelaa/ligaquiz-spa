import React from 'react';

import classes from './WorkInProgress.module.scss';

const WorkInProgress = ({ children }) => (
  <>
    <div className={classes.icon}>
      <i className="fa fa-exclamation-triangle" />
    </div>
    {children && <div className={classes.content}>{children}</div>}
  </>
);

WorkInProgress.defaultProps = {
  children: null,
};

export default WorkInProgress;
