import React from 'react';
import { Trans } from '@lingui/macro';

export const getRegionsTranslations = (type, render) =>
  ({
    'PT.AC': (
      <Trans key={type} render={render}>
        Açores
      </Trans>
    ),
    'PT.AV': (
      <Trans key={type} render={render}>
        Aveiro
      </Trans>
    ),
    'PT.BE': (
      <Trans key={type} render={render}>
        Beja
      </Trans>
    ),
    'PT.BR': (
      <Trans key={type} render={render}>
        Braga
      </Trans>
    ),
    'PT.BA': (
      <Trans key={type} render={render}>
        Bragança
      </Trans>
    ),
    'PT.CB': (
      <Trans key={type} render={render}>
        Castelo Branco
      </Trans>
    ),
    'PT.CO': (
      <Trans key={type} render={render}>
        Coimbra
      </Trans>
    ),
    'PT.EV': (
      <Trans key={type} render={render}>
        Évora
      </Trans>
    ),
    'PT.FA': (
      <Trans key={type} render={render}>
        Faro
      </Trans>
    ),
    'PT.GU': (
      <Trans key={type} render={render}>
        Guarda
      </Trans>
    ),
    'PT.LE': (
      <Trans key={type} render={render}>
        Leiria
      </Trans>
    ),
    'PT.LI': (
      <Trans key={type} render={render}>
        Lisboa
      </Trans>
    ),
    'PT.MA': (
      <Trans key={type} render={render}>
        Madeira
      </Trans>
    ),
    'PT.PA': (
      <Trans key={type} render={render}>
        Portalegre
      </Trans>
    ),
    'PT.PO': (
      <Trans key={type} render={render}>
        Porto
      </Trans>
    ),
    'PT.SA': (
      <Trans key={type} render={render}>
        Santarém
      </Trans>
    ),
    'PT.SE': (
      <Trans key={type} render={render}>
        Setúbal
      </Trans>
    ),
    'PT.VC': (
      <Trans key={type} render={render}>
        Viana do Castelo
      </Trans>
    ),
    'PT.VR': (
      <Trans key={type} render={render}>
        Vila Real
      </Trans>
    ),
    'PT.VI': (
      <Trans key={type} render={render}>
        Viseu
      </Trans>
    ),
  }[type]);
