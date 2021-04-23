import React from 'react';
import { auth } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    const signout = () => auth.signOut();

    const login = (email, password) => auth.signInWithEmailAndPassword(email, password);

    const signup = (email, password) => auth.createUserWithEmailAndPassword(email, password);

    const resetPass = (email) => auth.sendPasswordResetEmail(email);

    React.useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    });

    const value = { currentUser, login, signup, resetPass, signout };
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
