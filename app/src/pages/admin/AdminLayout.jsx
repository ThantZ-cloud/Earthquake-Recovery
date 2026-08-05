import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeedbackIcon from '@mui/icons-material/Feedback';
import PhoneIcon from '@mui/icons-material/Phone';
import QuizIcon from '@mui/icons-material/Quiz';
import CampaignIcon from '@mui/icons-material/Campaign';
import MapIcon from '@mui/icons-material/Map';
import NavigationIcon from '@mui/icons-material/Navigation';
import ShieldIcon from '@mui/icons-material/Shield';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RequireAdmin from '../../components/RequireAdmin';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
  { label: 'Feedback', path: '/admin/feedback', icon: <FeedbackIcon /> },
  { label: 'Emergency Phones', path: '/admin/phones', icon: <PhoneIcon /> },
  { label: 'Quiz Questions', path: '/admin/quiz', icon: <QuizIcon /> },
  { label: 'Announcements', path: '/admin/announcements', icon: <CampaignIcon /> },
  { label: 'Monitoring', path: '/admin/monitoring', icon: <MapIcon /> },
  { label: 'Navigation Tabs', path: '/admin/navigation', icon: <NavigationIcon /> },
];

function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const { isSuperAdmin } = useAuth();
  const isActive = (path) => location.pathname === path;

  const allNavItems = isSuperAdmin
    ? [...NAV_ITEMS, { label: 'Super Admin', path: '/admin/super-admin', icon: <ShieldIcon /> }]
    : NAV_ITEMS;

  const content = (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
          Admin Panel
        </Typography>
      </Box>
      <List>
        {allNavItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)}
            onClick={onClose}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'primary.contrastText' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive(item.path) ? 700 : 400 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider' },
        }}
      >
        {content}
      </Drawer>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAdmin>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <AppBar
            position="sticky"
            elevation={0}
            sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <IconButton component={Link} to="/" sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={700} fontSize="1rem">
                Admin Dashboard
              </Typography>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </RequireAdmin>
  );
}
