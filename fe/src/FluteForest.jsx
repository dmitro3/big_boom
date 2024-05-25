import { TwaLoader } from '@altiore/twa';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/landing-page.jsx';
import EventSelection from './pages/event-selection.jsx';
import EventAbout from './pages/event-about.jsx';
import SlotSelection from './pages/appointment-booking.jsx';
import RegistrationConfirmation from './pages/successful-booking.jsx';

import { PATH } from './consts.js';
import TwaWrapper from './components/TwaWrapper.js';

const FluteForest = () => {
  return (
    <TwaLoader
      isTWApp={(
          <BrowserRouter>
              <TwaWrapper>
                  <Routes>
                      <Route exact path={PATH.Landing()} element={<LandingPage />} />
                      <Route path={PATH.EventList()} element={<EventSelection />} />
                      <Route path={PATH.Event()} element={<EventAbout />} />
                      <Route path={PATH.EventBookingConfirm()} element={<RegistrationConfirmation />} />
                      <Route
                          path={PATH.EventTimeSlots()}
                          element={<SlotSelection
                              storageKey="selectedEvent"
                              itemType="events"
                          />}
                      />
                  </Routes>
              </TwaWrapper>
          </BrowserRouter>
      )}
      noTWApp={(
          <BrowserRouter>
              <Routes>
                  <Route exact path={PATH.Landing()} element={<LandingPage />} />
                  <Route path={PATH.EventList()} element={<EventSelection />} />
                  <Route path={PATH.Event()} element={<EventAbout />} />
                  <Route path={PATH.EventBookingConfirm()} element={<RegistrationConfirmation />} />
                  <Route
                      path={PATH.EventTimeSlots()}
                      element={<SlotSelection
                          storageKey="selectedEvent"
                          itemType="events"
                      />}
                  />
              </Routes>
          </BrowserRouter>
      )}
      // noTWApp={(
      //   <div className="invalid-version">
      //     <div className="invalid-version__content">
      //       <h1>Это приложение только для Telegram</h1>
      //       <h1>Вы не должны были узнать прямой адрес на него, это был секрет...</h1>
      //     </div>
      //   </div>
      // )}
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

export default FluteForest;
