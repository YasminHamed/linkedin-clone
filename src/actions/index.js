import { auth, provider, storage } from "../firebase";
import db from "../firebase";
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType";
import {ref,uploadBytesResumable} from "@firebase/storage";
import { upload } from "@testing-library/user-event/dist/upload";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export const getArticles = (payload) =>({
  type: GET_ARTICLES,
  payload: payload,
})

export function signInAPI() {
  return (dispatch) => {
    auth
      .signInWithPopup(provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function postArticleAPI(payload){
  return(dispatch)=>{
    dispatch(setLoading(true));
    
    if(payload.image !== "") {
      const storageRef =
        ref(storage,`/images/${payload.image.name}`);
        // .put(payload.image);
      const uploadTask = uploadBytesResumable(storageRef,payload.image)
      uploadTask.on("state_changed",(snapshot)=>{
        const progress = 
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        console.log(`Progress: ${progress}%`);
        if (snapshot.state === 'RUNNING') {
          console.log(`Progress: ${progress}%`)
        }
      }, error => console.log(error.code),
      async ()=> {
        const downloadURL = await upload.snapshot.ref.getDownloadURL();
        db.collection("articles").add({
          actor: {
            description: payload.user.email,
            title: payload.user.displayName,
            date: payload.timeStamp,
            image: payload.user.photoURL,
          },
          video: payload.video,
          sharedImg: downloadURL,
          comments: 0,
          description: payload.description,
        });
        dispatch(setLoading(false));
      }
    );
  } else if (payload.video) {
    db.collection("articles").add({
      actor: {
        description: payload.user.email,
        title: payload.user.displayName,
        date: payload.timeStamp,
        image: payload.user.photoURL,
      },
      video: payload.video,
      sharedImg: "",
      comments: 0,
      description: payload.description,
    });
    dispatch(setLoading(false));
  }
};
}

export function getArticlesAPI() {
  return (dispatch) =>{
    let payload;

    db.collection('articles').orderBy("actor.date", "desc")
    .onSnapshot((snapshot) =>{
      payload = snapshot.docs.map((doc) => doc.data());
      dispatch(getArticles(payload))
    });

  };
}