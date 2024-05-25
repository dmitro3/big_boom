import {useHapticFeedback} from '@altiore/twa';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {TonConnectButton} from '@tonconnect/ui-react';

import arrowRight from '../assets/images/landing-page/arrow-right.svg';
import logoSvg from '../assets/images/256x256.png';
import {Page} from '../components/Page';
import {PATH} from '../consts.js';

const LandingPage = () => {
    const navigate = useNavigate();
    const {impactOccurred} = useHapticFeedback();

    const openListOfEvents = useCallback(() => {
        impactOccurred('soft');
        navigate(PATH.EventList());
    }, [navigate, impactOccurred]);

    return (
        <Page className="landing-page">
            <div className="landing-page__logo">
                <img
                    className="logo"
                    src={logoSvg}
                    alt="Big Boom logo"
                />
            </div>

            <div className="landing-page__icon">
                <h1>Big Boom (Chain Reaction)</h1>
            </div>

            <div className="landing-page__tg_btn">
                <TonConnectButton/>
            </div>

            <button onClick={openListOfEvents} className="arrow-button button">
                Chain
                <span className="arrow">
          <img src={arrowRight} alt="Arrow Right"/>
        </span>
            </button>

            <p className="landing-page__bottom">
                Принимай приглашения через <b>Telegram</b>
            </p>
        </Page>
    );
};

export default LandingPage;
