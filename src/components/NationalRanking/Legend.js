import React from 'react';
import { Trans } from '@lingui/macro';
import classNames from 'classnames';

import classes from '../NationalRanking/NationalRanking.module.scss';

const Legend = () => (
  <>
    <h2 className="has-text-weight-bold is-size-5">
      <Trans>Legenda</Trans>
    </h2>
    <dl className="legend">
      <div>
        <dt className="has-text-weight-bold">WQC</dt>
        <dd>
          <Trans>Resultado no Campeonato Mundial</Trans>
        </dd>
      </div>
      <div>
        <dt className="has-text-weight-bold">EQC</dt>
        <dd>
          <Trans>Resultado no Campeonato Europeu</Trans>
        </dd>
      </div>
      <div>
        <dt className="has-text-weight-bold">CNQ</dt>
        <dd>
          <Trans>Resultado no Campeonato Nacional</Trans>
        </dd>
      </div>
      <div>
        <dt className="has-text-weight-bold">INQxx</dt>
        <dd>
          <Trans>Resultado da Inquizição do mês xx</Trans>
        </dd>
      </div>
      <div>
        <dt className="has-text-weight-bold">HOTxx</dt>
        <dd>
          <Trans>Resultado do Hot100 do mês xx</Trans>
        </dd>
      </div>
      <div>
        <dt className="has-text-weight-bold">SQxx</dt>
        <dd>
          <Trans>Resultado do Squizzed do mês xx</Trans>
        </dd>
      </div>
    </dl>
    <h2 className="has-text-weight-bold is-size-5">
      <Trans>Escala</Trans>
    </h2>
    <ul className={classes.scale}>
      {[...Array(10).keys()]
        .map((i) => i + 1)
        .map((_, index) => (
          <li key={index}>
            <div
              className={classNames(classes.square, classes[`top${index + 1}`])}
            ></div>
            {index ? `${index + 1}º melhor` : 'Melhor'} resultado a contar para
            o ranking
          </li>
        ))}
    </ul>
    <p>
      <Trans>
        Para mais pormenores de como o ranking é calculado deve ser consultado
        este artigo:
      </Trans>{' '}
      <a
        href="https://quizportugal.pt/blog/ranking-nacional-de-quiz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Ranking Nacional de Quiz</Trans>
      </a>
    </p>
  </>
);

export default Legend;
