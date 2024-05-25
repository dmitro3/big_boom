import { useWebApp } from '@altiore/twa';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/images/landing-page/event.png';
import { PATH } from '../consts.js';

function RegistrationConfirmation() {
  const webApp = useWebApp();
  const onClose = useCallback(() => {
    webApp?.disableClosingConfirmation();
    webApp?.close();
  }, [webApp]);

  return (
    <div className="registration-confirmation">
      <img
        className="logo"
        src={logo}
        alt="Big Boom (Chain Reaction) logo"
      />
      <h1 className="registration-confirmation__title">Успех!</h1>
      <p className="registration-confirmation__text">
        Вы успешно зарегистрировались!
        <br /><br />
        Можете зарегистрироваться куда-нибудь ещё...
      </p>
      <div
        className="button arrow-button"
        onClick={onClose}
      >
        Выйти
      </div>
      <Link to={PATH.EventList()} className="button button-second">Найти ещё события</Link>
    </div>
  );
}

export default RegistrationConfirmation;
