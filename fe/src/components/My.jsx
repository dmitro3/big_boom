import {useCallback, useEffect, useState} from 'react';

const SCRIPT = 'https://telegram.org/js/telegram-web-app.js';

const My = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const subscribeScriptLoading = useCallback(
    (scriptEle) => {
      try {
        const successListener = () => {
          setIsLoaded(true);
          setIsLoading(false);
        };

        const errorListener = (ev) => {
          setIsLoaded(false);
          setIsLoading(false);
        };

        scriptEle.addEventListener('load', successListener);

        scriptEle.addEventListener('error', errorListener);

        return () => {
          scriptEle.removeEventListener('load', successListener);
          scriptEle.removeEventListener('error', errorListener);
        }
      } catch (err) {
        console.error(err);
      }

      return () => {};
    },
    [setIsLoaded, setIsLoading],
  );

  useEffect(() => {
    try {
      if (isLoaded || isLoading) {
        return;
      }
      setIsLoading(true);
      const existingScripts =
        window.document.querySelectorAll(`script[src='${SCRIPT}']`);

      if (existingScripts[0]) {
        return subscribeScriptLoading(existingScripts[0]);
      }

      const scriptEle = document.createElement('script');

      scriptEle.setAttribute('src', SCRIPT);
      scriptEle.setAttribute('type', 'text/javascript');
      scriptEle.setAttribute('async', 'true');

      document.body.appendChild(scriptEle);

      return subscribeScriptLoading(scriptEle);
    } catch (err) {
      console.error(err);
      setIsLoaded(false);
      setIsLoading(false);
    }

    return () => {};
  }, [subscribeScriptLoading, isLoading, isLoaded]);

  return null;
}

export default My;
