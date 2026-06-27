import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import SiteSearch from './SiteSearch';
import EmergencyPhones from './EmergencyPhones';
import AuthDialog from './AuthDialog';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Recovery', path: '/recovery' },
  { label: 'Donate', path: '/donate' },
  { label: 'Quiz', path: '/quiz' },
  { label: 'History', path: '/history' },
  { label: 'About Us', path: '/about' },
];

export default function Navbar({ mode, toggleTheme }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const openAuth = (tab) => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, lg: 4 }, gap: 1 }}>
          {/* Left side: hamburger (mobile) + logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} size="small" sx={{ color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Earthquake & Recovery
              </Typography>
            </Box>
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0, mx: 1 }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  size="small"
                  sx={{
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 700 : 500,
                    fontSize: '0.8rem',
                    px: 1,
                    position: 'relative',
                    '&::after': isActive(item.path)
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 2,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 16,
                          height: 3,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                        }
                      : {},
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <SiteSearch />
            <EmergencyPhones />

            {/* Theme toggle */}
            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>

            {/* Auth: desktop */}
            {!isMobile && !user && (
              <Box sx={{ display: 'flex', gap: 0.5, ml: 0.5 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  onClick={() => openAuth(0)}
                  sx={{ fontSize: '0.75rem', px: 1.5 }}
                >
                  Login
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => openAuth(1)}
                  sx={{ fontSize: '0.75rem', px: 1.5 }}
                >
                  Register
                </Button>
              </Box>
            )}

            {/* Auth: desktop — logged in */}
            {!isMobile && user && (
              <>
                <Chip
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{user.name?.[0]}</Avatar>}
                  label={user.name?.split(' ')[0]}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  size="small"
                  sx={{ fontWeight: 600, cursor: 'pointer', ml: 0.5 }}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <MenuItem disabled>
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    {user.email}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* User section */}
          {user ? (
            <Box sx={{ px: 2, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{user.name?.[0]}</Avatar>
                <Box>
                  <Typography fontWeight={700} fontSize="0.9rem">{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => { handleLogout(); setDrawerOpen(false); }}
              >
                Logout
              </Button>
              <Divider sx={{ mt: 1.5 }} />
            </Box>
          ) : (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography fontWeight={700} gutterBottom>Account</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  onClick={() => { openAuth(0); setDrawerOpen(false); }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => { openAuth(1); setDrawerOpen(false); }}
                >
                  Register
                </Button>
              </Box>
              <Divider sx={{ mt: 1.5 }} />
            </Box>
          )}

          {/* Nav links */}
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={isActive(item.path)}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 700 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Auth dialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} />
    </>
  );
}
