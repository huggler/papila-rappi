import fb from "firebase/app"
import 'firebase/database'
import 'firebase/messaging'

const firebaseConfig = {
	apiKey: "AIzaSyCE2-5AYNDcl5lC7iVEc6VAMbDg694GHg4",
	authDomain: "papila-deli.firebaseapp.com",
	databaseURL: "https://papila-deli-default-rtdb.firebaseio.com",
	projectId: "papila-deli",
	storageBucket: "papila-deli.appspot.com",
	messagingSenderId: "155912073549",
	appId: "1:155912073549:web:941cda99a7f0ec117b8704"
};
export const firebase = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app();