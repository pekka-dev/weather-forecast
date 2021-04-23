import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom';
import OpenWeatherMapApi from '../api/OpenWeatherMapApi';
import { useAuth } from '../contexts/AuthContext';
import * as Constants from '../utils/constants';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }, menuButton: {
        marginRight: theme.spacing(2)
    }, title: {
        flexGrow: 1, display: 'none', [ theme.breakpoints.up('sm') ]: {
            display: 'block'
        }
    }, search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginLeft: 0,
        marginRight: theme.spacing(2),
        width: '100%',
        [ theme.breakpoints.up('sm') ]: {
            marginLeft: theme.spacing(1), width: 'auto'
        }
    }, searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }, inputRoot: {
        color: 'inherit'
    }, inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [ theme.breakpoints.up('sm') ]: {
            width: '30ch', '&:focus': {
                width: '50ch'
            }
        }
    }, boldFont: {
        fontWeight: 'bold'
    }, borderLeft: {
        borderLeft: '1px solid red'
    }, iconFront: {
        marginLeft: theme.spacing(1)
    }
}));

export default function Home() {
    const classes = useStyles();
    const searchRef = useRef();
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [weatherData, setWeatherData] = useState({});
    const [loading, setLoading] = useState(true);
    const open = Boolean(anchorEl);
    const { signout } = useAuth();
    const history = useHistory();

    useEffect(() => {
        weatherApi('Jaipur');
    }, []);

    const weatherApi = (s) => {
        if (typeof s !== 'string') throw new Error('Type of argument is invalid, should be ```string```');
        setError('');
        OpenWeatherMapApi({
            url: '/weather', params: {
                q: s
            }
        }).then(({ data: weatherData }) => {
            console.log(weatherData);
            setWeatherData(weatherData);
            setLoading(false);
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response);
                    if (err.response.status === 404) {
                        setError(`${searchRef.current.value} not found`);
                        setOpenDialog(true);
                    }
                } else {
                    setError(Constants.DEFAULT_ERROR);
                    setOpenDialog(true);
                }
            });
    };

    const toTextualDescription = (degree) => {
        if (degree > 337.5) return 'N';
        if (degree > 292.5) return 'NW';
        if (degree > 247.5) return 'W';
        if (degree > 202.5) return 'SW';
        if (degree > 157.5) return 'S';
        if (degree > 122.5) return 'SE';
        if (degree > 67.5) return 'E';
        if (degree > 22.5) return 'NE';
        return 'N';
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        setAnchorEl(null);
        await signout();
        history.push('/login');
    };

    const handleWeatherSearch = (e) => {
        e.preventDefault();
        let s = searchRef.current.value;
        if (s) weatherApi(s);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (<div className={classes.root}>
        <AppBar position="static">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    Weather forecast
                </Typography>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <form onSubmit={handleWeatherSearch}>
                        <InputBase
                            placeholder="Weather in your city…"
                            inputRef={searchRef}
                            classes={{
                                root: classes.inputRoot, input: classes.inputInput
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </form>
                </div>
                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top', horizontal: 'right'
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
        <Container maxWidth="md">
            {error ? <Grid container alignItems="center" justify="center">
                <svg id="b21613c9-2bf0-4d37-bef0-3b193d34fc5d" data-name="Layer 1"
                     xmlns="http://www.w3.org/2000/svg" width="647.63626" height="632.17383"
                     viewBox="0 0 647.63626 632.17383">
                    <path
                        d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z"
                        transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"/>
                    <path
                        d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z"
                        transform="translate(-276.18187 -133.91309)" fill="#3f3d56"/>
                    <path
                        d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z"
                        transform="translate(-276.18187 -133.91309)" fill="#6c63ff"/>
                    <circle cx="190.15351" cy="24.95465" r="20" fill="#6c63ff"/>
                    <circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"/>
                    <path
                        d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z"
                        transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"/>
                    <path
                        d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z"
                        transform="translate(-276.18187 -133.91309)" fill="#3f3d56"/>
                    <path
                        d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z"
                        transform="translate(-276.18187 -133.91309)" fill="#6c63ff"/>
                    <circle cx="433.63626" cy="105.17383" r="20" fill="#6c63ff"/>
                    <circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"/>
                </svg>
            </Grid> : (loading ? <LinearProgress/> : <Box mt={2}>
                <Grid container>
                    <Grid item xs>
                        <Typography variant="body2" color="primary"
                                    className={classes.boldFont}>
                            {moment.unix(weatherData.dt).format('H:mm, MMM D YYYY')}
                        </Typography>
                        <Typography variant="h4" color="textPrimary" gutterBottom>
                            {`${weatherData.name}, ${weatherData.sys.country}`}
                        </Typography>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid item>
                            <img
                                src={`http://openweathermap.org/img/wn/${weatherData.weather[ 0 ].icon}.png`}
                            />
                        </Grid>
                        <Grid container item alignItems="center" xs>
                            <Typography variant="h4" color="textPrimary">
                                {`${weatherData.main.temp} \u00B0C`}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Typography variant="body1" className={classes.boldFont} gutterBottom>
                            {`Feels like ${weatherData.main.feels_like} \u00B0C. ${weatherData.weather[ 0 ].main}. ${weatherData.weather[ 0 ].description}`}
                        </Typography>
                    </Grid>
                    <Grid container item component={Box} borderLeft={1} borderColor="primary"
                          pl={4}>
                        {/* Wind element */}
                        <Grid item container xs={6} sm={2} alignItems="center">
                            <svg data-v-47880d39="" viewBox="0 0 1000 1000"
                                 enableBackground="new 0 0 1000 1000"
                                 style={{ transform: 'rotate(450deg)' }}
                                 width="15"
                                 height="15"
                            >
                                <g data-v-47880d39="" fill="#48484a">
                                    <path data-v-47880d39=""
                                          d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"/>
                                    <path data-v-47880d39=""
                                          d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z"/>
                                </g>
                            </svg>
                            <Typography variant="body2" color="textSecondary"
                                        className={classes.iconFront}>
                                {`${weatherData.wind.speed}m/s ${toTextualDescription(weatherData.wind.deg)}`}
                            </Typography>
                        </Grid>
                        {/* Pressure element */}
                        <Grid item container xs={6} sm={2} alignItems="center">
                            <svg data-v-47880d39="" viewBox="0 0 96 96"
                                 enableBackground="new 0 0 1000 1000"
                                 style={{ transform: 'rotate(450deg)' }}
                                 width="15"
                                 height="15"
                            >
                                <g data-v-7bdd0738=""
                                   transform="translate(0,96) scale(0.100000,-0.100000)"
                                   fill="#48484a" stroke="none">
                                    <path data-v-7bdd0738=""
                                          d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0 -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0 118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176 -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259 -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135 -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135 0 130 66 234 185 291 82 40 184 41 265 3z"/>
                                    <path data-v-7bdd0738=""
                                          d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50 -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24 17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68 15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27 -59 -60z"/>
                                </g>
                            </svg>
                            <Typography variant="body2" color="textSecondary"
                                        className={classes.iconFront}>
                                {`${weatherData.main.pressure}hPa`}
                            </Typography>
                        </Grid>
                        <Grid item container>
                            {/* Humidity element */}
                            <Grid item container xs={6} sm={2} component={Box} mt={1}>
                                <Typography variant="body2" color="textSecondary">
                                    {`Humidity: ${weatherData.main.humidity}%`}
                                </Typography>
                            </Grid>
                            {/* Humidity element */}
                            <Grid item container xs={6} sm={2} component={Box} mt={1}>
                                <Typography variant="body2" color="textSecondary">
                                    {`Visibility: ${weatherData.visibility / 1000}km`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>)}</Container>
        {error && <Dialog
            open={openDialog}
            onClose={handleDialogClose}
        >
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText>{error}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>}
    </div>);
}
