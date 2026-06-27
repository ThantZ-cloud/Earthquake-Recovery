import { Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShieldIcon from '@mui/icons-material/Shield';
import PanToolIcon from '@mui/icons-material/PanTool';

/**
 * SafetyCharacter — displays MUI icons for Drop, Cover, Hold On.
 */

const SAFETY_ICONS = {
  drop: {
    icon: <ArrowDownwardIcon sx={{ fontSize: { xs: 56, sm: 68, md: 80 } }} />,
    bg: '#FFEBEE',
    color: '#D32F2F',
  },
  cover: {
    icon: <ShieldIcon sx={{ fontSize: { xs: 56, sm: 68, md: 80 } }} />,
    bg: '#FFF3E0',
    color: '#E65100',
  },
  holdOn: {
    icon: <PanToolIcon sx={{ fontSize: { xs: 56, sm: 68, md: 80 } }} />,
    bg: '#E8F5E9',
    color: '#2E7D32',
  },
};

export default function SafetyCharacter({ type, color }) {
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
        bgcolor: config.bg,
        color: config.color,
      }}
    >
      {config.icon}
    </Box>
  );
}
