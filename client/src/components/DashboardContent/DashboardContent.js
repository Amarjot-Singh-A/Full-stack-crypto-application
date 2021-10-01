import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItems from "../ListItems/ListItems";
import Trending from "../Trending/Trending";
import Coins from "../Coins/Coins";
import Coin from "../Coin/Coin";
import Favourite from "../Favourite/Favourite";
import Settings from "../Settings/Settings";
import Swal from "sweetalert2";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

export default function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  let { path } = useRouteMatch();
  const history = useHistory();
  const isLogged = history.location.state?.isLogged
    ? JSON.parse(history.location.state.isLogged)
    : false;
  console.log("islogged ", isLogged);

  const handleLogOut = async (event) => {
    event.preventDefault();
    console.log("logout clicked");
    await fetch("http://localhost:5000/logout", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("logoutdata", data);
        if (data.isLogged) {
          Swal.fire({
            title: "Logout Attempt Failed",
            icon: "error",
            html: "Please try to logout again",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        } else {
          if (!data.isLogged && Boolean(data.error)) {
            Swal.fire({
              title: "Logout Attempt Failed",
              icon: "error",
              html: "User session doesnt exist",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            }).then((result) => {
              history.push("/");
            });
          } else if (!data.isLogged) {
            Swal.fire({
              title: "Logout Successful",
              icon: "success",
              html: "Redirecting to Sign In ",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            }).then((result) => {
              history.push("/");
            });
          }
        }
      })
      .catch((err) => {
        console.log("error fetching logout component", err);
      });
  };

  const dashBoardRender = () => {
    if (isLogged) {
      return (
        <Router>
          <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <AppBar position="absolute" open={open}>
                <Toolbar
                  sx={{
                    pr: "24px", // keep right padding when drawer closed
                  }}
                >
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                      marginRight: "36px",
                      ...(open && { display: "none" }),
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                  >
                    Dashboard
                  </Typography>
                  <IconButton color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton color="inherit" onClick={handleLogOut}>
                    <LogoutIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Drawer variant="permanent" open={open}>
                <Toolbar
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    px: [1],
                  }}
                >
                  <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                  </IconButton>
                </Toolbar>
                <Divider />
                <List>
                  <ListItems />
                </List>
                <Divider />
              </Drawer>
              <Box
                component="main"
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  height: "100vh",
                  overflow: "auto",
                }}
              >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                  <Grid container spacing={3}>
                    <Switch>
                      <Route path={path} exact>
                        {/* Favvourite Coins */}

                        <Favourite />

                        {/* Trending */}

                        <Trending />
                      </Route>

                      <Route path={`${path}/coins`} exact>
                        {/* List of Coins */}

                        <Coins />
                      </Route>

                      <Route path={`${path}/coin/:id`} exact>
                        {/* Individual Coin */}

                        <Coin />
                      </Route>
                      <Route path={`${path}/settings`} exact>
                        {/* Settings page*/}

                        <Settings />
                      </Route>
                    </Switch>
                  </Grid>
                </Container>
              </Box>
            </Box>
          </ThemeProvider>
        </Router>
      );
    }else{
      return (
        <Redirect to = '/' />
      )
    }
  };

  return <>{dashBoardRender()}</>;
}
