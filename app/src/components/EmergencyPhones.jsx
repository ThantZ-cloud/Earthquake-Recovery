import { useState, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  IconButton as CloseBtn,
  InputAdornment,
  TextField,
} from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';
import { cities as staticCities, getPhonesByCity } from '../data/emergencyPhones';
import { useLang } from '../i18n';

export default function EmergencyPhones({ text = false, redButton = false }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [search, setSearch] = useState('');
  const triggerRef = useRef(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch('');
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  // Fetch from Supabase, fallback to static data if DB is empty
  const { data: dbPhones } = useQuery({
    queryKey: ['emergency-phones'],
    queryFn: async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const { data } = await supabase
          .from('emergency_phones')
          .select('*')
          .order('city')
          .order('sort_order')
          .abortSignal(controller.signal);
        return data;
      } finally {
        clearTimeout(timer);
      }
    },
    refetchInterval: 300_000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  });

  const useDb = dbPhones && dbPhones.length > 0;

  const cities = useMemo(() => {
    if (useDb) return [...new Set(dbPhones.map((p) => p.city))].sort();
    return staticCities;
  }, [useDb, dbPhones]);

  const getPhones = (city) => {
    if (useDb) return dbPhones.filter((p) => p.city === city);
    return getPhonesByCity(city);
  };

  const phones = getPhones(selectedCity);
  const filtered = search
    ? phones.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.phone.toLowerCase().includes(search.toLowerCase())
      )
    : phones;

  return (
    <>
      {/* Trigger button */}
      {text ? (
        <Button
          fullWidth
          variant="contained"
          startIcon={<LocalPhoneIcon />}
          onClick={() => setOpen(true)}
          ref={triggerRef}
          sx={{
            justifyContent: 'flex-start',
            bgcolor: redButton ? 'error.main' : 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: redButton ? 'error.dark' : 'primary.dark' },
          }}
        >
          {t('emergency.title')}
        </Button>
      ) : (
        <IconButton
          onClick={() => setOpen(true)}
          aria-label={t('emergency.ariaLabel')}
          ref={triggerRef}
          sx={{
            color: 'text.primary',
            width: 38,
            height: 38,
          }}
        >
          <LocalPhoneIcon fontSize="small" />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            width: { xs: 320, sm: 380 },
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2.5, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'error.main', mr: 1.5 }}>
                <LocalPhoneIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700} fontSize="1.1rem">
                  {t('emergency.title')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('emergency.selectCity')}
                </Typography>
              </Box>
              <CloseBtn onClick={handleClose} size="small">
                <CloseIcon fontSize="small" />
              </CloseBtn>
            </Box>
            <Chip
              size="small"
              color="success"
              icon={<CheckCircleIcon />}
              label={t('emergency.availableMyanmar')}
              sx={{ mb: 1.5 }}
            />

            {/* City Selector */}
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <InputLabel>{t('emergency.cityLabel')}</InputLabel>
              <Select
                value={selectedCity}
                label={t('emergency.cityLabel')}
                onChange={(e) => { setSelectedCity(e.target.value); setSearch(''); }}
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon fontSize="small" color="action" />
                      {city}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider />

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
            {selectedCity && (
              <>
                {/* City header + search */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <LocationOnIcon fontSize="small" color="primary" />
                    <Typography fontWeight={700} fontSize="1rem">
                      {selectedCity}
                    </Typography>
                    <Chip
                      label={`${filtered.length} ${t('emergency.contacts')}`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>

                  {/* Search within contacts */}
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={t('emergency.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ mb: 1 }} />

                {/* Phone list */}
                {filtered.length > 0 ? (
                  <List disablePadding dense>
                    {filtered.map((p, i) => (
                        <ListItem
                          key={p.id || i}
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderRadius: 2,
                            mb: 0.5,
                            bgcolor: i % 2 === 0 ? 'action.hover' : 'transparent',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                            flexWrap: 'wrap',
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: 'action.selected' },
                          }}
                        >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                          <PhoneIcon fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                          <ListItemText
                            primary={p.name}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              fontSize: '0.85rem',
                              noWrap: false,
                            }}
                          />
                        </Box>
                        <Chip
                          label={p.phone}
                          color="error"
                          variant="outlined"
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            flexShrink: 0,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : search ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    {t('emergency.noResults')}
                  </Typography>
                ) : null}
              </>
            )}

            {!selectedCity && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <LocalPhoneIcon sx={{ fontSize: 56, color: 'grey.300', mb: 2 }} />
                <Typography color="text.secondary">
                  {t('emergency.chooseCity')}
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                  {t('emergency.stats')}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Divider />
          <Box sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.disabled">
              {t('emergency.warning')}
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
