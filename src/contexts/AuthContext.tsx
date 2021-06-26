import firebase from "firebase";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: User | undefined;
    SignInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}
  
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [ user, setUser ] = useState<User>();

    useEffect(() => {
      const unsubiscribe = auth.onAuthStateChanged(userChanged => {
        if (userChanged) {
          const { displayName, photoURL, uid } = userChanged;
    
          if (!displayName || !photoURL) {
            throw new Error(' Missing information from Google account')
          }
    
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
      })
  
      return () => {
        unsubiscribe();
      }
    }, []);
  
    async function SignInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider)
  
      if (result.user) {
        const { displayName, photoURL, uid } = result.user;
  
        if (!displayName || !photoURL) {
          throw new Error(' Missing information from Google account')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
  
        console.log(result);
  
    }

    return (
        <AuthContext.Provider value={{ user, SignInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}