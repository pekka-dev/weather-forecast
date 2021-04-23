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
import { Link as RouterLink, useHistory } from 'react-router-dom';
import Copyright from './Copyright';
import LoadingButton from './LoadingButton';
import { SrcMsgError } from '../model';
import { useAuth } from '../contexts/AuthContext';
import Alert from '@material-ui/lab/Alert';
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const fNameRef = useRef();
    const lNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(new SrcMsgError());
    const [loading, setLoading] = useState();
    const { signup } = useAuth();
    const history = useHistory();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!fNameRef.current.value) {
            setError(new SrcMsgError('fName', Constants.ENTER_FIRST_NAME));
            return;
        }
        if (!lNameRef.current.value) {
            setError(new SrcMsgError('lName', Constants.ENTER_LAST_NAME));
            return;
        }
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
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push('/');
        } catch (e) {
            console.log(e);
            setError(new SrcMsgError('firebase', Constants.DEFAULT_ERROR));
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
                    Sign up
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSignUp}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                inputRef={fNameRef}
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                inputRef={lNameRef}
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                inputRef={emailRef}
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                inputRef={passwordRef}
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <LoadingButton loading={loading}>Sign Up</LoadingButton>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link variant="body2" component={RouterLink} to="/login">
                                Already have an account? Sign in
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
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}
