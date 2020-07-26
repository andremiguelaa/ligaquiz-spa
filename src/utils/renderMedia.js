import React from 'react';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

const renderMedia = (type, url, index) => {
  switch (type) {
    case 'image':
      return (
        <I18n>
          {({ i18n }) => (
            <img alt={i18n._(t`Imagem da pergunta ${index}`)} src={url} />
          )}
        </I18n>
      );
    case 'audio':
      return <audio controls preload="none" src={url} />;
    case 'video':
      return <video controls preload="none" src={url} />;
    default:
      return '';
  }
};

export default renderMedia;
