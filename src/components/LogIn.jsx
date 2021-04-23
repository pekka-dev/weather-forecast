import React, { useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import Copyright from './Copyright';
import { useAuth } from '../contexts/AuthContext';
import LoadingButton from './LoadingButton';
import { SrcMsgError } from '../model';
import * as Constants from '../utils/constants';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function LogIn() {
    const classes = useStyles();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(new SrcMsgError());
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!emailRef.current.value) {
            setError(new SrcMsgError('email', Constants.ENTER_EMAIL));

            return;
        }
        if (!passwordRef.current.value) {
            setError(new SrcMsgError('password', Constants.ENTER_PASSWORD));
            return;
        }
        setLoading(true);
        try {
            setError(new SrcMsgError());
            await login(emailRef.current.value, passwordRef.current.value);
            history.push('/');
        } catch (e) {
            console.log(e);
            if (e.code === 'auth/user-not-found') {
                setError(new SrcMsgError('firebase', Constants.EMAIL_PASS_INCORRECT));
            } else if (e.code === 'auth/wrong-password') {
                setError(new SrcMsgError('firebase', Constants.PASS_INVALID));
            } else {
                setError(new SrcMsgError('firebase', Constants.DEFAULT_ERROR));
            }
        }
        setLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleLogin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        inputRef={emailRef}
                        fullWidth
                        id="email"
                        type="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        inputRef={passwordRef}
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <LoadingButton loading={loading}>Sign In</LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link variant="body2" component={RouterLink} to="/reset-pass">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body2" component={RouterLink} to="signup">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                    {error.msg && (
                        <Box mt={1}>
                            <Alert severity="error">{error.msg}</Alert>
                        </Box>
                    )}
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
