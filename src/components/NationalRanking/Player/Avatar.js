import React from 'react';
import classes from '../NationalRanking.module.scss';

const Avatar = ({ player }) => (
  <div className={classes.avatar}>
    {player.info && player.info.avatar ? (
      <img alt={`${player.name} ${player.surname}`} src={player.info.avatar} />
    ) : (
      <i className="fa fa-user" />
    )}
  </div>
);

export default Avatar;
