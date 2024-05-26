import {useHapticFeedback} from '@altiore/twa';
import {useCallback} from 'react';
// import {useNavigate} from 'react-router-dom';
import {TonConnectButton, useTonWallet} from '@tonconnect/ui-react';

import arrowRight from '../assets/images/landing-page/arrow-right.svg';
import logoSvg from '../assets/images/256x256.png';
import {Page} from '../components/Page';
import {useJettonMasterContract} from "../hooks/useJettonMasterContract.js";

const Btn = ({children, disabled, onClick}) => {
    return (
        <button onClick={onClick} className="button" disabled={disabled}>
            {children}
            <span className="arrow">
                <img src={arrowRight} alt="Arrow Right"/>
            </span>
        </button>
    );
}

const LandingPage = () => {
    // const navigate = useNavigate();
    const {impactOccurred} = useHapticFeedback();

    const {addGroup, value} = useJettonMasterContract();

    const generateGroup = useCallback(async () => {
        impactOccurred('soft');
        await addGroup();
    }, [addGroup, impactOccurred]);

    const sendInvite = useCallback(() => {
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
                <h1>Big Boom (Цепная реакция)</h1>
            </div>

            <div className="landing-page__tg_btn">
                <TonConnectButton/>
            </div>

            {wallet ? (
                <div className="landing-page__acts">
                    <span>Создано групп: {value ? value?.groups_count.toString() : '...'}</span>
                    <Btn onClick={generateGroup}>Создать группу</Btn>
                    <Btn onClick={sendInvite} disabled>Отправить приглашение</Btn>
                    <p className="landing-page__bottom">
                        Принимай приглашения через <b>Telegram</b>
                    </p>
                </div>
            ) : <span/>}


        </Page>
    );
};

export default LandingPage;
