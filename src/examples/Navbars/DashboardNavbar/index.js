import { useState, useEffect } from 'react';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ShieldIcon from '@mui/icons-material/Shield';
// react-router components
import { useLocation } from 'react-router-dom';

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

// @material-ui core components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';

// Material Dashboard 2 React example components
import Breadcrumbs from 'examples/Breadcrumbs';
import NotificationItem from 'examples/Items/NotificationItem';

// Custom styles for DashboardNavbar
import {
    navbar,
    navbarContainer,
    navbarRow,
    navbarIconButton,
    navbarMobileMenu
} from 'examples/Navbars/DashboardNavbar/styles';

// Material Dashboard 2 React context
import {
    useMaterialUIController,
    setTransparentNavbar,
    setMiniSidenav,
    setOpenConfigurator
} from 'context';
import { useAuth } from 'context/AuthContext';
import MDAvatar from 'components/MDAvatar';
import UpdateVersion from 'layouts/updateVersion';
import UpdateCard from 'layouts/updateCard';

function DashboardNavbar({ absolute, light, isMini }) {
    const { user, logout } = useAuth();

    const [navbarType, setNavbarType] = useState();
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        transparentNavbar,
        fixedNavbar,
        openConfigurator,
        darkMode
    } = controller;
    const [openMenu, setOpenMenu] = useState(false);
    const [openUpdateVersion, setOpenUpdateVersion] = useState(false);
    const [openUpdateCard, setOpenUpdateCard] = useState(false);
    const route = useLocation().pathname.split('/').slice(1);

    useEffect(() => {
        // Setting the navbar type
        if (fixedNavbar) {
            setNavbarType('sticky');
        } else {
            setNavbarType('static');
        }

        // A function that sets the transparent state of the navbar.
        function handleTransparentNavbar() {
            setTransparentNavbar(
                dispatch,
                (fixedNavbar && window.scrollY === 0) || !fixedNavbar
            );
        }

        /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
        window.addEventListener('scroll', handleTransparentNavbar);

        // Call the handleTransparentNavbar function to set the state with the initial value.
        handleTransparentNavbar();

        // Remove event listener on cleanup
        return () =>
            window.removeEventListener('scroll', handleTransparentNavbar);
    }, [dispatch, fixedNavbar]);

    const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
    const handleConfiguratorOpen = () =>
        setOpenConfigurator(dispatch, !openConfigurator);
    const handleOpenMenu = event => setOpenMenu(event.currentTarget);
    const handleCloseMenu = () => setOpenMenu(false);

    const handleLogout = async () => {
        await logout();
        handleCloseMenu();
    };

    const handelOpenUpdateVersion = () => setOpenUpdateVersion(true);
    const handleOpenUpdateCard = () => setOpenUpdateCard(true);
    // Render the notifications menu
    const renderMenu = () => (
        <Menu
            anchorEl={openMenu}
            anchorReference={null}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            open={Boolean(openMenu)}
            onClose={handleCloseMenu}
            sx={{ mt: 2 }}
        >
            <NotificationItem
                disable
                icon={<ShieldIcon />}
                title={user.role.toUpperCase()}
            />
            <NotificationItem
                icon={<PermContactCalendarIcon />}
                title="My Profile"
            />
            <NotificationItem
                onClick={handleLogout}
                icon={<PowerSettingsNewIcon />}
                title="Logout"
            />
        </Menu>
    );

    // Styles for the navbar icons
    const iconsStyle = ({
        palette: { dark, white, text },
        functions: { rgba }
    }) => ({
        color: () => {
            let colorValue = light || darkMode ? white.main : dark.main;

            if (transparentNavbar && !light) {
                colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
            }

            return colorValue;
        }
    });

    return (
        <AppBar
            position={absolute ? 'absolute' : navbarType}
            color="inherit"
            sx={theme =>
                navbar(theme, { transparentNavbar, absolute, light, darkMode })
            }>
            <Toolbar sx={theme => navbarContainer(theme)}>
                <MDBox
                    color="inherit"
                    mb={{ xs: 1, md: 0 }}
                    sx={theme => navbarRow(theme, { isMini })}>
                    <Breadcrumbs
                        icon="home"
                        title={route[route.length - 1]}
                        route={route}
                        light={light}
                    />
                </MDBox>
                {isMini ? null : (
                    <MDBox sx={theme => navbarRow(theme, { isMini })}>
                        <MDBox pr={1} sx={{ flexGrow: 1 }}>
                            <MDInput
                                label="Search here"
                                sx={{
                                    width: { xs: "100%", md: "auto" } // full width trên màn nhỏ, auto trên màn lớn
                                }}
                            />
                        </MDBox>
                        <MDBox color={light ? 'white' : 'inherit'}>

                            <IconButton
                                size="large"
                                disableRipple
                                color="inherit"
                                sx={navbarMobileMenu}
                                onClick={handleMiniSidenav}>
                                <Icon fontSize="medium" size="large">
                                    {miniSidenav ? 'menu_open' : 'menu'}
                                </Icon>
                            </IconButton>
                            <IconButton
                                size="large"
                                disableRipple
                                color="inherit"
                                sx={navbarIconButton}
                                onClick={handelOpenUpdateVersion}
                            >
                                <Icon sx={iconsStyle}>update</Icon>
                            </IconButton>
                            {user?.role === "admin" &&
                                <IconButton
                                    size="large"
                                    disableRipple
                                    color="inherit"
                                    sx={navbarIconButton}
                                    onClick={handleOpenUpdateCard}
                                >
                                    <Icon sx={iconsStyle}>style</Icon>
                                </IconButton>
                            }
                            <IconButton
                                size="large"
                                disableRipple
                                color="inherit"
                                sx={navbarIconButton}
                                onClick={handleConfiguratorOpen}
                            >
                                <Icon sx={iconsStyle}>settings</Icon>
                            </IconButton>
                            <IconButton
                                size="large"
                                disableRipple
                                color="inherit"
                                sx={navbarIconButton}
                                aria-controls="notification-menu"
                                aria-haspopup="true"
                                variant="contained"
                            >
                                <Icon sx={iconsStyle}>notifications</Icon>
                            </IconButton>
                            <IconButton
                                sx={navbarIconButton}
                                size="large"
                                disableRipple
                            >
                                <MDAvatar
                                    src={user?.avatar || ""}
                                    alt="Avatar"
                                    size="xs"
                                    sx={{
                                        bgcolor: !user?.avatar ? "primary.main" : undefined,
                                        pt: 0.3
                                    }}
                                    onClick={handleOpenMenu}
                                >
                                    {!user?.avatar && user?.username?.charAt(0).toUpperCase()}
                                </MDAvatar>

                            </IconButton>
                            {renderMenu()}
                            <UpdateCard open={openUpdateCard} handleClose={() => setOpenUpdateCard(false)} />
                            <UpdateVersion open={openUpdateVersion} handleClose={() => setOpenUpdateVersion(false)} />
                        </MDBox>
                    </MDBox>
                )}
            </Toolbar>
        </AppBar>
    );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
    absolute: false,
    light: false,
    isMini: false
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
    absolute: PropTypes.bool,
    light: PropTypes.bool,
    isMini: PropTypes.bool
};

export default DashboardNavbar;
