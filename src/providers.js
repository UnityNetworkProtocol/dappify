/* --------------------------- Interface Globals ---------------------------- */
import 'theme/inject/index.js'
import 'theme/stylesheet/app.global.css'
/* ------------------------- External Dependencies -------------------------- */
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { ThemeProvider} from 'styled-components'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
/* ------------------------- Internal Dependencies -------------------------- */
import themeSettings from 'theme/settings'
import { ScrollToTop } from 'atomic'
import MeetupEvent from 'features/MeetupEvent'
/* ---------------------------- Initialization ------------------------------ */
injectTapEventPlugin();
export default ({ store, history, smartContract, children }) =>
<Provider store={store}>
    <ConnectedRouter history={history}>
        <ThemeProvider theme={themeSettings}>
            <ScrollToTop>
            <MeetupEvent
              contractAddress={smartContract}
              contractName="MeetupEvent"
            />
            </ScrollToTop>
        </ThemeProvider>
    </ConnectedRouter>
</Provider>