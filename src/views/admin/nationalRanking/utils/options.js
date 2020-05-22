import React from 'react';
import { Trans } from '@lingui/macro';

export const individualQuizTypeOptions = (type, render) =>
  ({
    cnq: (
      <Trans key="cnq" render={render}>
        Campeonato Nacional de Quiz
      </Trans>
    ),
    eqc: (
      <Trans key="eqc" render={render}>
        Campeonato Europeu de Quiz
      </Trans>
    ),
    inquizicao: (
      <Trans key="inquizicao" render={render}>
        Inquizição
      </Trans>
    ),
    squizzed: (
      <Trans key="squizzed" render={render}>
        Squizzed
      </Trans>
    ),
    wqc: (
      <Trans key="wqc" render={render}>
        Campeonato Mundial de Quiz
      </Trans>
    ),
    hot_100: (
      <Trans key="hot_100" render={render}>
        HOT 100
      </Trans>
    ),
  }[type]);

export const monthListOptions = (monthList) => {
  let monthListOptions = [];
  let currentMonth = new Date().getMonth() + 1;
  let currentYear = new Date().getFullYear();
  while (!(currentYear === 2016 && currentMonth === 10)) {
    monthListOptions.push(
      `${currentYear}-${`${currentMonth}`.padStart(2, '0')}`
    );
    currentMonth--;
    if (!currentMonth) {
      currentMonth = 12;
      currentYear--;
    }
  }
  return monthListOptions.filter((month) => !monthList.includes(month));
};
