import React from 'react';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

const TableHeader = () => (
  <thead>
    <tr>
      <th>#</th>
      <th>
        <Trans>Nome</Trans>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Pontos na liga`)}
            >
              <Trans>Pts</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Pontos a favor`)}
            >
              <Trans>PaF</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Pontos contra`)}
            >
              <Trans>PC</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Diferença de pontos`)}
            >
              <Trans>DdP</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Jogos`)}
            >
              <Trans>J</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Faltas`)}
            >
              <Trans>F</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Vitórias`)}
            >
              <Trans>V</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Empates`)}
            >
              <Trans>E</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom"
              data-tooltip={i18n._(t`Derrotas`)}
            >
              <Trans>D</Trans>
            </span>
          )}
        </I18n>
      </th>
      <th className="has-text-centered">
        <I18n>
          {({ i18n }) => (
            <span
              className="icon has-tooltip-bottom has-tooltip-left"
              data-tooltip={i18n._(t`Respostas correctas`)}
            >
              <Trans>RC</Trans>
            </span>
          )}
        </I18n>
      </th>
    </tr>
  </thead>
);

export default TableHeader;
