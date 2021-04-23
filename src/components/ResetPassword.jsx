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
import { Alert } from '@material-ui/lab';
import { Link as RouterLink } from 'react-router-dom';
import Copyright from './Copyright';
import LoadingButton from './LoadingButton';
import { SrcMsgError } from '../model';
import { useAuth } from '../contexts/AuthContext';
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

export default function ResetPassword() {
    const classes = useStyles();
    const emailRef = useRef();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState(new SrcMsgError());
    const { resetPass } = useAuth();

    const handleResetPass = async (e) => {
        e.preventDefault();
        if (!emailRef.current.value) {
            setError(new SrcMsgError('email', Constants.ENTER_EMAIL));
            setAlert(true);
            return;
        }
        setLoading(true);
        try {
            setError(new SrcMsgError());
            setAlert(false);
            await resetPass(emailRef.current.value);
        } catch (e) {
            console.log(e);
            setError(new SrcMsgError('firebase', Constants.DEFAULT_ERROR));
        }
        setLoading(false);
        setAlert(true);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleResetPass}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        inputRef={emailRef}
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <LoadingButton loading={loading}>Send email</LoadingButton>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link variant="body2" component={RouterLink} to="/login">
                                Log in
                            </Link>
                        </Grid>
                    </Grid>
                    {alert && (
                        <Alert severity={error.msg ? 'error' : 'info'}>
                            {error.msg ? error.msg : Constants.EMAIL_SENT_ALERT}
                        </Alert>
                    )}
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
