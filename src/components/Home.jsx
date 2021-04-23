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
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useHistory } from 'react-router-dom';
import OpenWeatherMapApi from '../api/OpenWeatherMapApi';
import { useAuth } from '../contexts/AuthContext';
import * as Constants from '../utils/constants';
import NotFoundIcon from './NotFoundIcon';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        marginRight: theme.spacing(2),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '30ch',
            '&:focus': {
                width: '50ch',
            },
        },
    },
    boldFont: {
        fontWeight: 'bold',
    },
    borderLeft: {
        borderLeft: '1px solid red',
    },
    iconFront: {
        marginLeft: theme.spacing(1),
    },
}));
let fiveDayData = [];

export default function Home() {
    const theme = useTheme();
    const classes = useStyles();
    const searchRef = useRef();
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [weatherData, setWeatherData] = useState({});
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const open = Boolean(anchorEl);
    const { signout } = useAuth();
    const history = useHistory();

    useEffect(() => {
        weatherApi('Jaipur');
    }, []);

    const weatherApi = (s) => {
        if (typeof s !== 'string')
            throw new Error('Type of argument is invalid, should be ```string```');
        setError('');
        OpenWeatherMapApi({
            url: '/weather',
            params: {
                q: s,
            },
        })
            .then(({ data: weatherData }) => {
                console.log(weatherData);
                setWeatherData(weatherData);
                fiveDayForecast(s);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    setError(`${searchRef.current.value} not found`);
                    setOpenDialog(true);
                } else {
                    console.log(err);
                    setError(Constants.DEFAULT_ERROR);
                    setOpenDialog(true);
                }
            });
    };

    const fiveDayForecast = (s) => {
        if (typeof s !== 'string')
            throw new Error('Type of argument is invalid, should be ```string```');
        setChartLoading(true);
        setError('');
        OpenWeatherMapApi({
            url: '/forecast',
            params: {
                q: s,
            },
        })
            .then(({ data }) => {
                console.log(data);
                fiveDayData = data.list.slice(0, 5).map((d) => ({
                    time: moment.unix(d.dt).format('h:mmA'),
                    temp: `${d.main.temp}`,
                }));
                console.log(fiveDayData);
                setChartLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    setError(`${searchRef.current.value} not found`);
                    setOpenDialog(true);
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

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Weather forecast
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <form onSubmit={handleWeatherSearch}>
                            <InputBase
                                placeholder="Weather in your city…"
                                inputRef={searchRef}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
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
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
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
                {error ? (
                    <Grid container alignItems="center" justify="center" component={Box} mt={4}>
                        <NotFoundIcon />
                    </Grid>
                ) : loading ? (
                    <LinearProgress />
                ) : (
                    <Box mt={2}>
                        <Grid container>
                            <Grid container item xs={12} sm={6} className={classes.weatherDetails}>
                                <Grid item xs id="time-stamp">
                                    <Typography
                                        variant="body2"
                                        color="primary"
                                        className={classes.boldFont}
                                    >
                                        {moment.unix(weatherData.dt).format('H:mm, MMM D YYYY')}
                                    </Typography>
                                    <Typography variant="h4" color="textPrimary" gutterBottom>
                                        {`${weatherData.name}, ${weatherData.sys.country}`}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={12} id="city-name">
                                    <Grid item>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                                            alt={weatherData.weather[0].id}
                                        />
                                    </Grid>
                                    <Grid container item alignItems="center" xs>
                                        <Typography variant="h4" color="textPrimary">
                                            {`${weatherData.main.temp} \u00B0C`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container id="feels-like-description">
                                    <Typography
                                        variant="body1"
                                        className={classes.boldFont}
                                        gutterBottom
                                    >
                                        {`Feels like ${weatherData.main.feels_like} \u00B0C. ${weatherData.weather[0].main}. ${weatherData.weather[0].description}`}
                                    </Typography>
                                </Grid>
                                <Grid
                                    id="wind-pressure-humidity-visibility"
                                    container
                                    item
                                    component={Box}
                                    borderLeft={1}
                                    borderColor="primary"
                                    pl={4}
                                >
                                    {/* Wind element */}
                                    <Grid item container xs={6} sm={2} alignItems="center">
                                        <svg
                                            data-v-47880d39=""
                                            viewBox="0 0 1000 1000"
                                            enableBackground="new 0 0 1000 1000"
                                            style={{ transform: 'rotate(450deg)' }}
                                            width="15"
                                            height="15"
                                        >
                                            <g data-v-47880d39="" fill="#48484a">
                                                <path
                                                    data-v-47880d39=""
                                                    d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"
                                                />
                                                <path
                                                    data-v-47880d39=""
                                                    d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z"
                                                />
                                            </g>
                                        </svg>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            className={classes.iconFront}
                                        >
                                            {`${weatherData.wind.speed}m/s ${toTextualDescription(
                                                weatherData.wind.deg,
                                            )}`}
                                        </Typography>
                                    </Grid>
                                    {/* Pressure element */}
                                    <Grid item container xs={6} sm={2} alignItems="center">
                                        <svg
                                            data-v-47880d39=""
                                            viewBox="0 0 96 96"
                                            enableBackground="new 0 0 1000 1000"
                                            style={{ transform: 'rotate(450deg)' }}
                                            width="15"
                                            height="15"
                                        >
                                            <g
                                                data-v-7bdd0738=""
                                                transform="translate(0,96) scale(0.100000,-0.100000)"
                                                fill="#48484a"
                                                stroke="none"
                                            >
                                                <path
                                                    data-v-7bdd0738=""
                                                    d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0 -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0 118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176 -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259 -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135 -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135 0 130 66 234 185 291 82 40 184 41 265 3z"
                                                />
                                                <path
                                                    data-v-7bdd0738=""
                                                    d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50 -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24 17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68 15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27 -59 -60z"
                                                />
                                            </g>
                                        </svg>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            className={classes.iconFront}
                                        >
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
                            {/*Chart*/}
                            {!chartLoading && (
                                <Grid
                                    item
                                    container
                                    xs={12}
                                    sm={6}
                                    className={classes.weatherChart}
                                >
                                    <>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart
                                                data={fiveDayData}
                                                margin={{
                                                    top: 32,
                                                }}
                                            >
                                                <XAxis
                                                    dataKey="time"
                                                    stroke={theme.palette.text.secondary}
                                                />
                                                <YAxis stroke={theme.palette.text.secondary} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="temp"
                                                    stroke={theme.palette.primary.main}
                                                    dot={true}
                                                />
                                                <Tooltip />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
            </Container>
            {error && (
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{error}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
}
