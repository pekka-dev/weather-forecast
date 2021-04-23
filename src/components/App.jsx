import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from '../contexts/AuthContext';
import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';

function App() {
    return (
        <Router>
            <CssBaseline/>
            <AuthProvider>
                <PrivateRoute exact path="/" component={Home}/>
                <Route path="/login" component={LogIn}/>
                <Route path="/signup" component={SignUp}/>
                <Route path="/reset-pass" component={ResetPassword}/>
            </AuthProvider>
        </Router>);
}

export default App;
