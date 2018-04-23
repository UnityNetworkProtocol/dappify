/* ------------------------- External Dependencies -------------------------- */
import { call, put, fork, takeEvery, take } from 'redux-saga/effects';

import firebase from 'firebase'
/* ------------------------- Internal Dependencies -------------------------- */
import reduxSagaFirebase from 'services/Firebase';
import { loginWelcome } from 'static/notifications'

import {
  authSyncUser,
  notificationOpen,
  firestoreDocumentFilterGetRequest,
  databaseWriteRequest,
} from 'store/departments/actions'
/*--- Redux Actions ---*/ 
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAILURE,
  AUTH_LOGIN_WITH_IDENTITY_REQUEST,
  AUTH_LOGIN_WITH_IDENTITY_SUCCESS,
  AUTH_LOGIN_WITH_IDENTITY_FAILURE,
  AUTH_LOGIN_WITH_PHONE_REQUEST,
  AUTH_LOGIN_WITH_PHONE_SUCCESS,
  AUTH_LOGIN_WITH_PHONE_FAILURE,
  AUTH_LOGIN_WITH_AUTHORIZATION_REQUEST,
  AUTH_LOGIN_WITH_AUTHORIZATION_SUCCESS,
  AUTH_LOGIN_WITH_AUTHORIZATION_FAILURE,
  AUTH_LOGIN_WITH_EMAIL_PASSWORD_REQUEST,
  AUTH_LOGIN_WITH_EMAIL_PASSWORD_SUCCESS,
  AUTH_LOGIN_WITH_EMAIL_PASSWORD_FAILURE,
} from './actions'

import {
  authLoginSuccess
} from './actions'

/* ------------------------------ Saga Stories ------------------------------ */
/*--- Login ---*/
function* authLogin() {
  return yield put({type: AUTH_LOGIN_SUCCESS})
}

/*--- Logout ---*/
function* authLogout() {
  try {
    const data = yield call(reduxSagaFirebase.auth.signOut);
    yield put({type: AUTH_LOGOUT_SUCCESS, message: data })
  }
  catch(error) {
    yield put({type: AUTH_LOGOUT_FAILURE, error })
  }
}

/*--- Login With Authorization ---*/
function* loginWithAuthorization({payload, metadata}) {
  try {
    const { providerSelection } = metadata

    const authorizationProvider = {
      google: new firebase.auth.GoogleAuthProvider(),
      twitter: new firebase.auth.TwitterAuthProvider(),
      facebook: new firebase.auth.FacebookAuthProvider(),
      github: new firebase.auth.GithubAuthProvider(),
    }[providerSelection]

    if(!authorizationProvider) yield put({type: AUTH_LOGIN_FAILURE, payload: 'Provider Undefined' })

    const credentials = yield call(reduxSagaFirebase.auth.signInWithPopup, authorizationProvider);
    const data = yield call(reduxSagaFirebase.auth.signInWithCredential, credentials);
    yield put({type: AUTH_LOGIN_WITH_AUTHORIZATION_SUCCESS, payload: data })
    yield put(authLoginSuccess({payload: data }))

    yield put(notificationOpen({payload:{
      title: `Welcome ${data.displayName}.`, 
      message: loginWelcome
    }}))
  } catch(e) {
    yield put({type: AUTH_LOGIN_WITH_AUTHORIZATION_FAILURE, payload: e.message })
    yield put({type: AUTH_LOGIN_FAILURE, payload: e.message })
    yield put(notificationOpen({payload:{
      title: 'Login Error', 
      message: e.message 
    }}))
  }
}

/*--- Login With Email/Password ---*/
function* loginWithEmailPassword({payload, metadata}) {
  try {

    yield put({type: AUTH_LOGIN_WITH_EMAIL_PASSWORD_SUCCESS})
    yield put({type: AUTH_LOGIN_SUCCESS})
  } catch(e) {
    yield put({type: AUTH_LOGIN_WITH_EMAIL_PASSWORD_FAILURE, payload: e.message })
    yield put({type: AUTH_LOGIN_FAILURE, payload: e.message })
  }
}

/*--- Login With Phone ---*/
function* loginWithIdentity({payload, metadata}) {
  try {
    const tokenIdentity = yield fetch('https://us-central1-buidlbox-dev.cloudfunctions.net/identity',{
      mode: 'cors',
      headers: new Headers({'content-type': 'application/json'}),
      method: 'post',
      body: JSON.stringify({
        data: payload.questKey
      })
      ,
    }).then(token=> token.json())

    const loginSuccess = yield firebase.auth().signInWithCustomToken(tokenIdentity)

    const userCurrent = yield firebase.auth().currentUser;
    const profileUpdate = yield userCurrent.updateProfile({
      displayName: payload.name,
      photoURL: payload.avatar.uri
    })
    const metadata = {
      branch: ['users', `${payload.address}|${payload.questKey}` ],
      delta: 'database|write',
      writeType: 'patch'
    }
    const saveUserProfile = yield put(databaseWriteRequest({payload, metadata }))

    yield put({type: AUTH_LOGIN_WITH_IDENTITY_SUCCESS })
    yield put({type: AUTH_LOGIN_SUCCESS})
  } catch(err) {
    console.log(err)
  }
}
/*--- Login With Phone ---*/
function* loginWithPhone({payload, metadata}) {
  const { phoneNumber } = payload
  try {
    const applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    const confirmationResult = yield call(reduxSagaFirebase.auth.signInWithPhoneNumber, phoneNumber, applicationVerifier);
    yield put({type: AUTH_LOGIN_WITH_PHONE_SUCCESS })
    yield put({type: AUTH_LOGIN_SUCCESS})
  } catch(e) {

  }
}

function* syncUserSaga() {
  const channel = yield call(reduxSagaFirebase.auth.channel);
  while(true) {
    const { error, user } = yield take(channel);
    if (user) {
      yield put(authSyncUser(user));
      yield put(firestoreDocumentFilterGetRequest({
      payload: {},
      metadata: {
        branch: [
          'people'
        ],
        delta: 'AuthenticatedProfile',
        filters: {
          where: [
            ['eid', '==', user.uid]
          ]
        }
      }
    }))
    }
    else yield put(authSyncUser(null));
  }
}


/* ------------------------------ Export Sagas ------------------------------ */
export default function* rootSaga() {
  yield fork(syncUserSaga);
  yield [
    takeEvery(AUTH_LOGIN_REQUEST, authLogin),
    takeEvery(AUTH_LOGOUT_REQUEST, authLogout),
    takeEvery(AUTH_LOGIN_WITH_PHONE_REQUEST, loginWithPhone),
    takeEvery(AUTH_LOGIN_WITH_IDENTITY_REQUEST, loginWithIdentity),
    takeEvery(AUTH_LOGIN_WITH_AUTHORIZATION_REQUEST, loginWithAuthorization),
    takeEvery(AUTH_LOGIN_WITH_EMAIL_PASSWORD_REQUEST, loginWithEmailPassword),
  ];
}