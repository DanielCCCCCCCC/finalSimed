import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../firebaseConfig";
import router from "../routers";
import { useDatabaseStore } from "./database";
import { setDoc, doc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSession: false,
  }),
  actions: {
    async registerUser(email, password) {
      this.loadingUser = true;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(auth.currentUser);
        router.push("/login");
      } catch (error) {
        // console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    //Guardar la imagen en firestore storage
    async updateImg(imagen) {
      try {
        // console.log("Imagen ", imagen);
        // console.log(url);
      } catch (error) {
        // console.log(error.code);
        return error.code;
      }
    },

    async updateUser(displayName, imagen) {
      this.loadingUser = true;

      try {
        if (imagen) {
          await updateProfile(auth.currentUser, {
            displayName: displayName,
          });
          const storageRef = ref(storage, `perfiles/${this.userData.uid}`);
          await uploadBytes(storageRef, imagen.originFileObj);
          const photoURL = await getDownloadURL(storageRef);
          await updateProfile(auth.currentUser, {
            photoURL: photoURL,
          });
        }
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        // console.log("Desde funcion updateProfile", displayName);
      } catch (error) {
        // console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },
    async setUser(user) {
      try {
        const docRef = doc(db, "users", user.uid);

        this.userData = {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        await setDoc(docRef, this.userData);
      } catch (error) {
        // console.log(error.message);
      }
    },

    async loginUser(email, password) {
      this.loadingUser = true;
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        await this.setUser(user);
        this.userData = { email: user.email, uid: user.uid };

        router.push("/");
      } catch (error) {
        // console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    async logoutUser() {
      const databaseStore = useDatabaseStore();
      databaseStore.$reset();
      try {
        router.push("/login");
        await signOut(auth);
        // this.userData = null;
      } catch (error) {
        // console.log(error);
      }
    },
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(
          auth,
          async (user) => {
            if (user) {
              // await this.setUser(user);
              //Capturamos los datos de firebase y los guardamos en userdata
              this.userData = {
                email: user.email,
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
              };
              // console.log("Info del usuario", this.userData);
              // console.log("Info del usuario USER", user);
            } else {
              this.userData = null;
              const databaseStore = useDatabaseStore();
              databaseStore.$reset();
            }
            resolve(user);
          },
          (e) => reject(e)
        );
        // unsuscribe();
      });
    },
  },
});
