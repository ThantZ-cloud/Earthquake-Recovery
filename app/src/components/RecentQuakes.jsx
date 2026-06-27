import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Drawer,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeightIcon from '@mui/icons-material/Height';
import PublicIcon from '@mui/icons-material/Public';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

// Country name → emoji flag
function countryFlag(country) {
  const FLAGS = {
    Myanmar: '\u{1F1F2}\u{1F1F2}',
    Japan: '\u{1F1EF}\u{1F1F5}',
    Indonesia: '\u{1F1EE}\u{1F1E9}',
    Philippines: '\u{1F1F5}\u{1F1ED}',
    'New Zealand': '\u{1F1F3}\u{1F1FF}',
    Chile: '\u{1F1E8}\u{1F1F1}',
    Mexico: '\u{1F1F2}\u{1F1FD}',
    Peru: '\u{1F1F5}\u{1F1EA}',
    China: '\u{1F1E8}\u{1F1F3}',
    Taiwan: '\u{1F1F9}\u{1F1FC}',
    India: '\u{1F1EE}\u{1F1F3}',
    Iran: '\u{1F1EE}\u{1F1F7}',
    Turkey: '\u{1F1F9}\u{1F1F7}',
    Greece: '\u{1F1EC}\u{1F1F7}',
    Italy: '\u{1F1EE}\u{1F1F9}',
    USA: '\u{1F1FA}\u{1F1F8}',
    Alaska: '\u{1F1FA}\u{1F1F8}',
    'United States': '\u{1F1FA}\u{1F1F8}',
    Russia: '\u{1F1F7}\u{1F1FA}',
    Tonga: '\u{1F1F9}\u{1F1F4}',
    Fiji: '\u{1F1EB}\u{1F1EF}',
    Papua: '\u{1F1F5}\u{1F1EC}',
    Ecuador: '\u{1F1EA}\u{1F1E8}',
    Colombia: '\u{1F1E8}\u{1F1F4}',
    Argentina: '\u{1F1E6}\u{1F1F7}',
    Afghanistan: '\u{1F1E6}\u{1F1EB}',
    Pakistan: '\u{1F1F5}\u{1F1F0}',
    Nepal: '\u{1F1F3}\u{1F1F5}',
    Bangladesh: '\u{1F1E7}\u{1F1E9}',
    Thailand: '\u{1F1F9}\u{1F1ED}',
    Vietnam: '\u{1F1FB}\u{1F1F3}',
    Malaysia: '\u{1F1F2}\u{1F1FE}',
    Korea: '\u{1F1F0}\u{1F1F7}',
    Australia: '\u{1F1E6}\u{1F1FA}',
    'Costa Rica': '\u{1F1E8}\u{1F1F7}',
    Guatemala: '\u{1F1EC}\u{1F1F1}',
    Honduras: '\u{1F1ED}\u{1F1F3}',
    'El Salvador': '\u{1F1F8}\u{1F1FB}',
    Nicaragua: '\u{1F1F3}\u{1F1EE}',
    Panama: '\u{1F1F5}\u{1F1E6}',
    Haiti: '\u{1F1ED}\u{1F1F9}',
    'Dominican Republic': '\u{1F1E9}\u{1F1F4}',
    Jamaica: '\u{1F1EF}\u{1F1F2}',
    Cuba: '\u{1F1E8}\u{1F1FA}',
    Venezuela: '\u{1F1FB}\u{1F1EA}',
    Bolivia: '\u{1F1E7}\u{1F1F4}',
    Paraguay: '\u{1F1F5}\u{1F1FE}',
    Uruguay: '\u{1F1FA}\u{1F1FE}',
    Brazil: '\u{1F1E7}\u{1F1F7}',
    Morocco: '\u{1F1F2}\u{1F1E6}',
    Algeria: '\u{1F1E9}\u{1F1FF}',
    Tunisia: '\u{1F1F9}\u{1F1F3}',
    Croatia: '\u{1F1ED}\u{1F1F7}',
    Albania: '\u{1F1E6}\u{1F1F1}',
    Romania: '\u{1F1F7}\u{1F1F4}',
    Bulgaria: '\u{1F1E7}\u{1F1EC}',
    Serbia: '\u{1F1F7}\u{1F1F8}',
    Iceland: '\u{1F1EE}\u{1F1F8}',
    Norway: '\u{1F1F3}\u{1F1F4}',
    Sweden: '\u{1F1F8}\u{1F1EA}',
    Greenland: '\u{1F1EC}\u{1F1F1}',
    Canada: '\u{1F1E8}\u{1F1E6}',
    Spain: '\u{1F1EA}\u{1F1F8}',
    Portugal: '\u{1F1F5}\u{1F1F9}',
    France: '\u{1F1EB}\u{1F1F7}',
    Germany: '\u{1F1E9}\u{1F1EA}',
    Singapore: '\u{1F1F8}\u{1F1EC}',
    Cambodia: '\u{1F1F0}\u{1F1ED}',
    Laos: '\u{1F1F1}\u{1F1E6}',
  };
  return FLAGS[country] || '\u{1F30D}'; // globe emoji as fallback
}

// Extract country from place string like "10km NE of Mandalay, Myanmar"
function extractCountry(place) {
  if (!place) return null;
  const parts = place.split(',');
  const last = parts[parts.length - 1]?.trim();
  return last || null;
}

// Format time ago
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Magnitude color
function magColor(mag) {
  if (mag >= 6) return '#d32f2f';
  if (mag >= 4) return '#ed6c02';
  if (mag >= 2) return '#f9a825';
  return '#2e7d32';
}

// Fetcher
const fetchRecent = async () => {
  const { data } = await api.get('/api/recent');
  const features = data?.data?.features || [];
  return features
    .map((f) => {
      const [lon, lat, depth] = f.geometry?.coordinates || [];
      const mag = f.properties?.mag;
      if (!lon || !lat || mag == null) return null;
      return {
        id: f.properties?.event_id || Math.random(),
        lat,
        lon,
        depth: depth?.toFixed(1) || '?',
        mag: +mag.toFixed(1),
        place: f.properties?.flynn_region || f.properties?.place || 'Unknown',
        time: f.properties?.time,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.time) - new Date(a.time));
};

export default function RecentQuakes() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: quakes = [], isLoading } = useQuery({
    queryKey: ['recent-quakes'],
    queryFn: fetchRecent,
    refetchInterval: 5 * 60 * 1000,
  });

  // Filter to 3 days
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const recent3d = quakes.filter((q) => new Date(q.time).getTime() >= threeDaysAgo);
  const top4 = recent3d.slice(0, 4);
  const rest = recent3d.slice(4);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Section header */}
      <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
        🕐 Recent Earthquakes
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
        Latest seismic activity from the past 3 days worldwide.
      </Typography>

      {/* Top 4 cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        {top4.map((q) => {
          const country = extractCountry(q.place);
          return (
            <Grid item xs={12} sm={6} md={3} key={q.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${magColor(q.mag)}20`,
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Magnitude badge + country */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      label={`M ${q.mag}`}
                      size="small"
                      sx={{
                        bgcolor: magColor(q.mag),
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    />
                    <Typography variant="h6" component="span">
                      {countryFlag(country)}
                    </Typography>
                  </Box>

                  {/* Location */}
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, lineHeight: 1.3 }}>
                    {q.place}
                  </Typography>

                  {/* Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <AccessTimeIcon sx={{ fontSize: 14 }} />
                      <Typography variant="caption">{timeAgo(q.time)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <HeightIcon sx={{ fontSize: 14 }} />
                      <Typography variant="caption">{q.depth} km depth</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* View More button */}
      {rest.length > 0 && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setDrawerOpen(true)}
            sx={{ borderRadius: 3, px: 3 }}
          >
            View {rest.length} more earthquakes
          </Button>
        </Box>
      )}

      {/* Drawer with full list */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: { xs: 300, sm: 380 }, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Past 3 Days
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            {recent3d.length} earthquakes recorded
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Scrollable list */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {recent3d.map((q) => {
              const country = extractCountry(q.place);
              return (
                <Box
                  key={q.id}
                  sx={{
                    py: 1.5,
                    px: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Chip
                      label={`M ${q.mag}`}
                      size="small"
                      sx={{
                        bgcolor: magColor(q.mag),
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {timeAgo(q.time)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {countryFlag(country)} {q.place}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Depth: {q.depth} km
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
