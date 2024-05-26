import {useHapticFeedback} from '@altiore/twa';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {TonConnectButton, useTonWallet} from '@tonconnect/ui-react';

import arrowRight from '../assets/images/landing-page/arrow-right.svg';
import logoSvg from '../assets/images/256x256.png';
import {Page} from '../components/Page';
import {PATH} from '../consts.js';

const Btn = ({children, onClick}) => {
    return (
        <button onClick={onClick} className="arrow-button button">
            {children}
            <span className="arrow">
                <img src={arrowRight} alt="Arrow Right"/>
            </span>
        </button>
    );
}

const LandingPage = () => {
    const navigate = useNavigate();
    const {impactOccurred} = useHapticFeedback();

    const generateGroup = useCallback(() => {
        impactOccurred('soft');
        // navigate(PATH.EventList());
    }, [impactOccurred]);

    const wallet = useTonWallet();

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

            {wallet ? (
                <div>
                    <Btn onClick={generateGroup}>Добавить группу</Btn>
                </div>
            ) : <span />}

            <p className="landing-page__bottom">
                Принимай приглашения через <b>Telegram</b>
            </p>
        </Page>
    );
};

export default LandingPage;
