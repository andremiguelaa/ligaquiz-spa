import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import ApiRequest from 'utils/ApiRequest';
import packageJson from 'package.json';

const Logger = () => {
  const location = useLocation();
  const load = useRef();

  useEffect(() => {
    // Get selected text
    const getSelectionText = () => {
      var text = '';
      var activeEl = document.activeElement;
      var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
      if (
        activeElTagName === 'textarea' ||
        (activeElTagName === 'input' &&
          /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
          typeof activeEl.selectionStart === 'number')
      ) {
        text = activeEl.value.slice(
          activeEl.selectionStart,
          activeEl.selectionEnd
        );
      } else if (window.getSelection) {
        text = window.getSelection().toString();
      }
      return text;
    };

    // Detect copy
    const keyPress = (e) => {
      var text = getSelectionText();
      if (e.ctrlKey || e.metaKey) {
        if (e.keyCode === 67) {
          ApiRequest.post(`logs`, {
            action: `Text copied${text && `: ${text}`}`,
          });
        }
        if (e.keyCode === 88) {
          ApiRequest.post(`logs`, {
            action: `Text cut${text && `: ${text}`}`,
          });
        }
      }
    };
    document.onkeydown = keyPress;

    // Detect right click
    window.oncontextmenu = function (e) {
      var text = getSelectionText();
      ApiRequest.post(`logs`, {
        action: `Right click on ${e.target.nodeName} element${
          text && `: ${text}`
        }`,
      });
    };

    // Detect page unloaded
    window.addEventListener('beforeunload', function () {
      ApiRequest.post(`logs`, {
        action: `Page unloaded: ${window.location.href}`,
      });
    });

    // Detect focus in/out
    let hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    const handleVisibilityChange = () => {
      if (document[hidden]) {
        ApiRequest.post(`logs`, {
          action: `Page focus out: ${window.location.pathname}`,
        });
      } else {
        ApiRequest.post(`logs`, {
          action: `Page focus in: ${window.location.pathname}`,
        });
      }
    };
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }, []);

  useEffect(() => {
    if (!load.current) {
      ApiRequest.post(`logs`, {
        action: `Page load: ${location.pathname} (${packageJson.version})`,
      });
      load.current = true;
      return;
    }
    ApiRequest.post(`logs`, {
      action: `Page change: ${location.pathname}`,
    });
  }, [location]);
  return null;
};

export default Logger;
