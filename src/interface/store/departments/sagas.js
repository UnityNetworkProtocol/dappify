import { all } from 'redux-saga/effects';

import authentication from './authentication/sagas'
import database from './database/sagas'
import firestore from './firestore/sagas'
import notifications from './notifications/sagas'
import storage from './storage/sagas'
import sagas from 'assimilation/store/sagas'


export default function* rootSaga() {
  yield all([
    authentication(),
    database(),
    firestore(),
    notifications(),
    storage(),
    ...sagas
  ]);
}