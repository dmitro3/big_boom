import {TwaLoader} from '@altiore/twa';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import LandingPage from './pages/landing-page.jsx';
import EventSelection from './pages/event-selection.jsx';
import EventAbout from './pages/event-about.jsx';
import SlotSelection from './pages/appointment-booking.jsx';
import RegistrationConfirmation from './pages/successful-booking.jsx';

import {PATH} from './consts.js';
// import TwaWrapper from './components/TwaWrapper.js';

const BigBoom = () => {
    const body = <BrowserRouter>
        <Routes>
            <Route exact path={PATH.Landing()} element={<LandingPage/>}/>
            <Route path={PATH.EventList()} element={<EventSelection/>}/>
            <Route path={PATH.Event()} element={<EventAbout/>}/>
            <Route path={PATH.EventBookingConfirm()} element={<RegistrationConfirmation/>}/>
            <Route
                path={PATH.EventTimeSlots()}
                element={<SlotSelection
                    storageKey="selectedEvent"
                    itemType="events"
                />}
            />
        </Routes>
    </BrowserRouter>;

    return (
        <TwaLoader
            isTWApp={body}
            noTWApp={body}
            oldTWApp={(
                <div className="invalid-version">
                    <div className="invalid-version__content">
                        <h1>Эта версия Telegram устарела!</h1>
                        <h1>Обновите Telegram, чтоб использовать приложение</h1>
                    </div>
                </div>
            )}
            versionAtLeast={6.9}
        />
    );
};

export default BigBoom;
