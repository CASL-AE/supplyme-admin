import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import firebase from 'firebase/app';

let firebaseConfig;
if (process.env.NODE_ENV === 'production') {
    console.log('Firebase Production Settings');
    firebaseConfig = {
        apiKey: process.env.FIREBASE_BROWSER_KEY,
        authDomain: 'veridoc-e0f85.firebaseapp.com',
        databaseURL: 'https://veridoc-e0f85.firebaseio.com',
        projectId: 'veridoc-e0f85',
        storageBucket: 'veridoc-e0f85.appspot.com',
        messagingSenderId: '',
    };
} else if (process.env.NODE_ENV === 'development') {
    console.log('Firebase Development Settings');
    firebaseConfig = {
        apiKey: process.env.FIREBASE_BROWSER_KEY,
        authDomain: 'veridoc-e0f85.firebaseapp.com',
        databaseURL: 'https://veridoc-e0f85.firebaseio.com',
        projectId: 'veridoc-e0f85',
        storageBucket: 'veridoc-e0f85.appspot.com',
        messagingSenderId: '',
    };
} else if (process.env.NODE_ENV === 'stage') {
    console.log('Firebase Stage Settings');
    firebaseConfig = {
        apiKey: process.env.FIREBASE_BROWSER_KEY,
        authDomain: 'veridoc-e0f85.firebaseapp.com',
        databaseURL: 'https://veridoc-e0f85.firebaseio.com',
        projectId: 'veridoc-e0f85',
        storageBucket: 'veridoc-e0f85.appspot.com',
        messagingSenderId: '',
    };
}

firebase.initializeApp(firebaseConfig);

export function db() {
    const db = firebase.firestore();
    return db;
}

export function auth() {
    return firebase.auth()
}

export function storage() {
    return firebase.storage();
}
