import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Slider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogContent,
  Tooltip,
  Link,
  Divider,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import HistoryIcon from '@mui/icons-material/History';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LayersIcon from '@mui/icons-material/Layers';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import DeathIcon from '@mui/icons-material/People';
import InjuredIcon from '@mui/icons-material/LocalHospital';
import TsunamiIcon from '@mui/icons-material/Water';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AnimatedHero from '../components/AnimatedHero';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLang } from '../i18n';

/* ──────────────────────────── DATA ──────────────────────────── */

const INTERNATIONAL_QUAKES = [
  { year: 1960, location: 'Valdivia (Biobío), Chile', magnitude: 9.5, depth: 33, tKey: 'intl_1960' },
  { year: 1964, location: 'Good Friday, Alaska, USA', magnitude: 9.2, depth: 25, tKey: 'intl_1964' },
  { year: 2004, location: 'Indian Ocean (Sumatra)', magnitude: 9.2, depth: 30, tKey: 'intl_2004' },
  { year: 2011, location: 'Tōhoku, Japan', magnitude: 9.1, depth: 29, tKey: 'intl_2011' },
  { year: 1952, location: 'Severo-Kurilsk, Russia', magnitude: 9.0, depth: 30, tKey: 'intl_1952' },
  { year: 2010, location: 'Maule, Chile', magnitude: 8.8, depth: 35, tKey: 'intl_2010' },
];

const MYANMAR_QUAKES = [
  { year: 2025, location: 'Sagaing, Myanmar', magnitude: 7.7, depth: 10, tKey: 'mmr_2025' },
  { year: 1839, location: 'Ava (Innwa), Myanmar', magnitude: 8.3, depth: 12, tKey: 'mmr_1839' },
  { year: 1946, location: 'Sagaing-Mandalay, Myanmar', magnitude: 7.8, depth: 15, tKey: 'mmr_1946' },
  { year: 2016, location: 'Chauk, Myanmar', magnitude: 6.8, depth: 84, tKey: 'mmr_2016' },
  { year: 2012, location: 'Shwebo, Myanmar', magnitude: 6.8, depth: 10, tKey: 'mmr_2012' },
  { year: 1930, location: 'Bago (Pegu), Myanmar', magnitude: 7.3, depth: 10, tKey: 'mmr_1930' },
  { year: 1975, location: 'Bagan, Myanmar', magnitude: 6.5, depth: 30, tKey: 'mmr_1975' },
];

/* ──────────────────────── HELPERS ───────────────────────── */

function magColor(mag) {
  if (mag >= 9) return '#b71c1c';
  if (mag >= 8) return '#d32f2f';
  if (mag >= 7) return '#ed6c02';
  return '#f9a825';
}

function magGradient(mag) {
  if (mag >= 9) return 'linear-gradient(90deg, #b71c1c 0%, #e53935 100%)';
  if (mag >= 8) return 'linear-gradient(90deg, #d32f2f 0%, #ff5252 100%)';
  if (mag >= 7) return 'linear-gradient(90deg, #ed6c02 0%, #ff9800 100%)';
  return 'linear-gradient(90deg, #f9a825 0%, #fdd835 100%)';
}

function formatNumber(n) {
  if (n === 'Unknown' || n == null) return '—';
  if (typeof n === 'string') return n;
  return n.toLocaleString();
}

function openInGmaps(coords) {
  const [lat, lng] = coords;
  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank', 'noopener,noreferrer');
}

/* ──────────────────── MINI MAP ──────────────────────── */

function MiniEpicenterMap({ coords, color }) {
  const [mapReady, setMapReady] = useState(false);
  const canvasRenderer = useRef(null);
  if (!canvasRenderer.current) canvasRenderer.current = L.canvas({ padding: 0.2 });

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!coords) return null;

  return (
    <Box
      sx={{
        height: 180,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        '& .leaflet-container': { height: '100%', width: '100%' },
      }}
    >
      {mapReady && (
        <MapContainer
          center={coords}
          zoom={5}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          doubleClickZoom={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          <CircleMarker
            center={coords}
            radius={12}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.8,
              color: '#fff',
              weight: 2,
            }}
            renderer={canvasRenderer.current}
          />
          <CircleMarker
            center={coords}
            radius={24}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.25,
              color,
              weight: 1,
              dashArray: '4 4',
            }}
            renderer={canvasRenderer.current}
          />
        </MapContainer>
      )}
    </Box>
  );
}

/* ──────────────────── IMAGE LIGHTBOX ──────────────────────── */

function ImageLightbox({ open, onClose, image, caption }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { bgcolor: 'black', boxShadow: 24 } }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Box
            component="img"
            src={image}
            alt={caption}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            sx={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }}
          />
        </Box>

        {caption && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              {caption}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────── STAT BOX ──────────────────────── */

function StatBox({ icon, label, value, color }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        minWidth: 70,
        p: 1,
        borderRadius: 2,
        bgcolor: alpha(color || '#1976d2', 0.06),
        border: '1px solid',
        borderColor: alpha(color || '#1976d2', 0.15),
      }}
    >
      <Box sx={{ color: color || 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {icon}
      </Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1, color }}>
        {value}
      </Typography>
    </Box>
  );
}

/* ──────────────────── STORY CARD ──────────────────────── */

function StoryCard({ q, index, quakeData, onImageClick, tKeyPrefix }) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const color = magColor(q.magnitude);
  const barPercent = Math.round((q.magnitude / 10) * 100);
  const isMajor = q.magnitude >= 8;
  const data = quakeData?.[q.tKey];

  const handleImageClick = useCallback(() => {
    if (data?.image) {
      onImageClick(data.image, data.imageCaption || '');
    }
  }, [data, onImageClick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.12 }}
      style={{ breakInside: 'avoid', marginBottom: 24 }}
    >
      <Card
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 32px ${color}22`,
            borderColor: color,
          },
        }}
      >
        {/* ── Accent bar ── */}
        <Box sx={{ height: 5, background: magGradient(q.magnitude) }} />

        {/* ── Hero Image ── */}
        {data?.image && (
          <Box
            sx={{ position: 'relative', cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label={data.imageCaption || q.location}
            onClick={handleImageClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick();
              }
            }}
          >
            <CardMedia
              component="img"
              height="220"
              image={data.image}
              alt={data.imageCaption || q.location}
              onError={(e) => { e.target.style.display = 'none'; }}
              sx={{ objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                p: 2,
                opacity: 0,
                transition: 'opacity 0.3s',
                '&:hover': { opacity: 1 },
              }}
            >
              <Typography variant="caption" color="#fff" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {t('history.photoCaption')}: {data.imageCaption}
              </Typography>
              <ZoomInIcon sx={{ color: '#fff' }} />
            </Box>
          </Box>
        )}

        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          {/* ── Location ── */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, lineHeight: 1.25, mb: 1.5, fontSize: { xs: '1.05rem', sm: '1.15rem' } }}
          >
            {q.location}
          </Typography>

          {/* ── Magnitude row ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <motion.div
              animate={isMajor ? { scale: [1, 1.06, 1] } : {}}
              transition={isMajor ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
              <Box
                sx={{
                  width: 60, height: 60, borderRadius: '50%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  bgcolor: `${color}15`, border: `2.5px solid ${color}`, flexShrink: 0,
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color, lineHeight: 1 }}>
                  {q.magnitude}
                </Typography>
                <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1, mt: 0.25 }}>
                  {t('history.mag')}
                </Typography>
              </Box>
            </motion.div>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ height: 10, borderRadius: 5, bgcolor: `${color}18`, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${barPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  style={{ height: '100%', background: magGradient(q.magnitude), borderRadius: 99 }}
                />
              </Box>
            </Box>
          </Box>

          {/* ── Chips ── */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />} label={q.year} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            <Chip icon={<LayersIcon sx={{ fontSize: 14 }} />} label={t('history.depth').replace('{depth}', q.depth)} size="small" variant="outlined" />
            {data?.tsunami && (
              <Chip icon={<TsunamiIcon sx={{ fontSize: 14 }} />} label={t('history.tsunami')} size="small" color="info" variant="outlined" sx={{ fontWeight: 600 }} />
            )}
          </Box>

          {/* ── Impact Stats ── */}
          {data && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <StatBox
                icon={<DeathIcon sx={{ fontSize: 18 }} />}
                label={t('history.deaths')}
                value={formatNumber(data.deaths)}
                color="#c62828"
              />
              <StatBox
                icon={<InjuredIcon sx={{ fontSize: 18 }} />}
                label={t('history.injuries')}
                value={formatNumber(data.injuries)}
                color="#ed6c02"
              />
              <StatBox
                icon={<MoneyIcon sx={{ fontSize: 18 }} />}
                label={t('history.economicLoss')}
                value={data.economicLoss || '—'}
                color="#6a1b9a"
              />
            </Box>
          )}

          {/* ── Mini Map (clickable to Google Maps) ── */}
          {data?.coords && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MapIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                    {t('history.viewOnMap')}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  role="button"
                  tabIndex={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                    color: 'primary.main',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => openInGmaps(data.coords)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openInGmaps(data.coords);
                    }
                  }}
                >
                  {t('history.openInGmaps')}
                  <OpenInNewIcon sx={{ fontSize: 12 }} />
                </Typography>
              </Box>
              <Box
                role="button"
                tabIndex={0}
                aria-label={t('history.openInGmaps')}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover .map-overlay': { opacity: 1 },
                  '&:focus-visible .map-overlay': { opacity: 1 },
                }}
                onClick={() => openInGmaps(data.coords)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openInGmaps(data.coords);
                  }
                }}
              >
                <MiniEpicenterMap coords={data.coords} color={color} />
                <Box
                  className="map-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <Box sx={{ textAlign: 'center', color: '#fff' }}>
                    <MapIcon sx={{ fontSize: 32, mb: 0.5 }} />
                    <Typography variant="caption" fontWeight={600}>
                      {t('history.openInGmaps')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* ── Impact text ── */}
          <Box sx={{ position: 'relative' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
                maxHeight: expanded ? 600 : 68,
              }}
            >
              {t(`history.quakes.${q.tKey}`)}
            </Typography>

            {!expanded && (
              <Box
                sx={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 32,
                  background: (theme) => `linear-gradient(transparent, ${theme.palette.background.paper})`,
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>

          {/* ── Expand toggle ── */}
          <Box
            role="button"
            tabIndex={0}
            onClick={() => setExpanded((e) => !e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setExpanded((exp) => !exp);
              }
            }}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
              mt: 1, py: 0.5, cursor: 'pointer', borderRadius: 1,
              color, fontWeight: 600, fontSize: '0.8rem',
              '&:hover': { bgcolor: `${color}10` }, transition: 'background 0.2s',
            }}
          >
            {expanded ? (
              <>{t('history.showLess')} <ExpandLessIcon sx={{ fontSize: 18 }} /></>
            ) : (
              <>{t('history.readMore')} <ExpandMoreIcon sx={{ fontSize: 18 }} /></>
            )}
          </Box>

          {/* ── Expanded Details ── */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Divider sx={{ my: 2 }} />

                {/* ── Sources ── */}
                {data?.sources && data.sources.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                      {t('history.sources')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {data.sources.map((src, i) => (
                        <Link
                          key={i}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            fontSize: '0.8rem', fontWeight: 500,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          <OpenInNewIcon sx={{ fontSize: 14 }} />
                          {t('history.wikipediaPrefix')}
                          {src.replace('https://en.wikipedia.org/wiki/', '').replace(/_/g, ' ')}
                        </Link>
                      ))}
                    </Box>
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ──────────────────── PAGE ──────────────────────────── */

export default function History() {
  const { t } = useLang();
  const [tab, setTab] = useState(0);
  const [minMag, setMinMag] = useState(6);
  const [lightbox, setLightbox] = useState({ open: false, image: '', caption: '' });

  const currentQuakes = tab === 0 ? INTERNATIONAL_QUAKES : MYANMAR_QUAKES;
  const quakeData = t('history.quakeData');
  const filtered = currentQuakes.filter((q) => q.magnitude >= minMag);

  const handleTabChange = (_, v) => {
    setTab(v);
    setMinMag(6);
  };

  const handleImageClick = useCallback((image, caption) => {
    setLightbox({ open: true, image, caption });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* ── Hero ── */}
      <AnimatedHero
        icon={<HistoryIcon sx={{ fontSize: 40, color: '#ffa726' }} />}
        title={t('history.title')}
        subtitle={t('history.subtitle')}
        bg={['#263238', '#37474f', '#1c262b']}
        accent="#ffa726"
        blobs={[
          { top: '10%', left: '5%', width: 400, height: 400, color: 'rgba(96,125,139,0.25)', blur: 60, duration: 20, dx: 50, dy: -40 },
          { top: '30%', right: '10%', width: 350, height: 350, color: 'rgba(255,167,38,0.2)', blur: 50, duration: 25, dx: -60, dy: 50 },
          { bottom: '-10%', left: '30%', width: 300, height: 300, color: 'rgba(0,131,143,0.2)', blur: 50, duration: 18, dx: 40, dy: -30 },
        ]}
      />

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label={t('history.tabInternational')} />
          <Tab label={t('history.tabMyanmar')} />
        </Tabs>
      </Container>

      {/* Filter */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              {t('history.minMag')}
            </Typography>
            <Chip label={`≥ M${minMag}`} color="primary" variant="outlined" size="small" />
          </Box>
          <Slider
            value={minMag}
            onChange={(_, v) => setMinMag(v)}
            min={6}
            max={tab === 0 ? 9.5 : 9}
            step={0.1}
            marks={
              tab === 0
                ? [{ value: 6, label: '6' }, { value: 7, label: '7' }, { value: 8, label: '8' }, { value: 9, label: '9' }, { value: 9.5, label: '9.5' }]
                : [{ value: 6, label: '6' }, { value: 7, label: '7' }, { value: 8, label: '8' }]
            }
            sx={{ width: { xs: '100%', sm: 'auto' }, flex: 1 }}
          />
        </Box>
      </Container>

      {/* ── Masonry Story Cards ── */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FilterListOffIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('history.noResults')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('history.noResultsDesc')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, columnGap: 3 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((q, i) => (
                <StoryCard
                  key={q.location}
                  q={q}
                  index={i}
                  quakeData={quakeData}
                  onImageClick={handleImageClick}
                  tKeyPrefix={tab === 0 ? 'intl' : 'mmr'}
                />
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Container>

      {/* ── Image Lightbox ── */}
      <ImageLightbox
        open={lightbox.open}
        onClose={handleCloseLightbox}
        image={lightbox.image}
        caption={lightbox.caption}
      />
    </Box>
  );
}
