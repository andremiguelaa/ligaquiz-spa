import React from 'react';
import { Trans } from '@lingui/macro';

export const notificationTypes = ['info', 'warning'];

export const notificationTypesTranslations = (type, render) =>
  ({
    info: (
      <Trans key="info" render={render}>
        Informação
      </Trans>
    ),
    warning: (
      <Trans key="warning" render={render}>
        Aviso
      </Trans>
    ),
  }[type]);
