import { Box, useTheme } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShieldIcon from '@mui/icons-material/Shield';
import PanToolIcon from '@mui/icons-material/PanTool';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

/**
 * SafetyCharacter — displays MUI icons for Drop, Cover, Hold On, Stay Calm.
 */

const SAFETY_ICONS = {
  drop: {
    icon: <ArrowDownwardIcon sx={{ fontSize: { xs: 56, sm: 68, md: 80 } }} />,
    lightBg: '#FFEBEE',
    darkBg: 'rgba(211, 47, 47, 0.15)',
    color: '#D32F2F',
  },
  cover: {
    icon: <ShieldIcon sx={{ fontSize: { xs: 56, sm: 68, md: 80 } }} />,
    lightBg: '#FFF3E0',
    darkBg: 'rgba(230, 81, 0, 0.15)',
    color: '#E65100',
  },
  holdOn: {
    icon: <PanToolIcon sx={{ fontSize: { xs: 56, sm: 68, md: 80 } }} />,
    lightBg: '#E8F5E9',
    darkBg: 'rgba(46, 125, 50, 0.15)',
    color: '#2E7D32',
  },
  stayCalm: {
    icon: <SelfImprovementIcon sx={{ fontSize: { xs: 56, sm: 68, md: 80 } }} />,
    lightBg: '#E3F2FD',
    darkBg: 'rgba(25, 118, 210, 0.15)',
    color: '#1565C0',
  },
};

export default function SafetyCharacter({ type }) {
  const theme = useTheme();
  const config = SAFETY_ICONS[type];

  if (!config) return null;

  return (
    <Box
      sx={{
        width: { xs: 80, sm: 100, md: 120 },
        height: { xs: 80, sm: 100, md: 120 },
        mx: 'auto',
        mb: 2,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.mode === 'dark' ? config.darkBg : config.lightBg,
        color: config.color,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {config.icon}
    </Box>
  );
}
