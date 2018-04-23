/* ------------------------- External Dependencies -------------------------- */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

/* ------------------------- Internal Dependencies -------------------------- */
import Providers from './providers.js';
import { configureStore, history } from 'store/configuration';
/* ------------------------- Self-Locating Script -------------------------- */
// const targetStorageLocation = "http://uportable.surge.sh/embed.js" // TODO(@kamescg): Document how this works 
const targetProvider = "uport" // TODO(@kamescg): Document how this works 
var s = document.getElementsByTagName('script')
Object.keys(s).map(function(t, v){
  if (s[t].dataset.provider === targetProvider) {
    var smartContract = s[t].dataset.smartContractAddress
    var i = s[t];var sw = s[t].parentNode;var n = document.createElement('div');n.id = 'uportable';sw.insertBefore(n, i)
    /* ------------------------ Initialize Dependencies ------------------------- */
    const store = configureStore();

    /* ---------------------------- Module Package ------------------------------ */
    const rootElement = document.getElementById('uportable')
    ReactDOM.render(<Providers store={store} history={history} smartContract={smartContract} />, rootElement);
  }
})

