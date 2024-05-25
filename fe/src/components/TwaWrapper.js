import { useInitData, useWebApp } from '@altiore/twa';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

// import { DATA_PATH } from '../consts.js';
// import { getExpiredTime, isExpired } from '../utils/moment.js';
import { fluteForestContext } from '../store/index.jsx';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../consts.js';

const TwaWrapper = ({ children }) => {
  const { init, initUnsafe } = useInitData();

  const webApp = useWebApp();

  const { data, setAuthId, setUserId } = useContext(fluteForestContext);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const tgWebAppStartParam = useMemo(() => new URLSearchParams(
    window?.location?.search?.slice(1),
  ).get('tgWebAppStartParam'), []);

  const authUser = useCallback(async () => {
    try {
      const authId = data.authId;
      const userId = data.userId;

      let isShouldUpdate = false;
      if (init && initUnsafe?.user?.id && authId !== initUnsafe.user.id) {
        isShouldUpdate = true;
      }
      // else if (!expiredAt || isExpired(expiredAt)) {
      //   isShouldUpdate = true;
      // }

      if (isShouldUpdate) {
        setAuthId(initUnsafe.user.id);
        const res = await fetch(`/api/users/auth`, {
          body: JSON.stringify({ user_data: init }),
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        const data = await res.json();
        if (data.ok) {
          if (data.data.user_id !== userId) {
            setUserId(data.data.user_id);
          }
        } else {
          console.error(data);
        }

      }

      if (tgWebAppStartParam) {
        const [routeType, routeId] = tgWebAppStartParam.split('_');
        if (routeType === 'event') {
          navigate(PATH.Event(routeId));
        }
        if (routeType === 'list') {
          navigate(PATH.EventList());
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [init, initUnsafe, data, setAuthId, setUserId, setIsLoading, navigate, tgWebAppStartParam]);

  useEffect(() => {
    try {
      if (webApp && initUnsafe?.user) {
        authUser().then().catch(console.error);
        if (!initUnsafe.user.allows_write_to_pm) {
          webApp.requestWriteAccess();
        }
        webApp.enableClosingConfirmation();
        webApp.expand();
      }
    } catch (e) {
      console.error(e);
    }
  }, [initUnsafe, webApp]);

  return isLoading ? null : children;
};

export default TwaWrapper;
