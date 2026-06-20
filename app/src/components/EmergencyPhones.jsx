import { useState } from 'react';
import {
  Box,
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
import { cities, getPhonesByCity } from '../data/emergencyPhones';

export default function EmergencyPhones() {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [search, setSearch] = useState('');

  const phones = getPhonesByCity(selectedCity);
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
      <IconButton
        onClick={() => setOpen(true)}
        title="Emergency Phone Numbers"
        sx={{
          bgcolor: 'error.main',
          color: '#fff',
          width: 38,
          height: 38,
          '&:hover': { bgcolor: 'error.dark' },
        }}
      >
        <LocalPhoneIcon fontSize="small" />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => { setOpen(false); setSearch(''); }}
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
                  Emergency Numbers
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Select a city to view contacts
                </Typography>
              </Box>
              <CloseBtn onClick={() => { setOpen(false); setSearch(''); }} size="small">
                <CloseIcon fontSize="small" />
              </CloseBtn>
            </Box>

            {/* City Selector */}
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <InputLabel>Select City</InputLabel>
              <Select
                value={selectedCity}
                label="Select City"
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
                      label={`${filtered.length} contacts`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>

                  {/* Search within contacts */}
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by name or number..."
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
                        key={i}
                        sx={{
                          px: 2,
                          py: 1.2,
                          borderRadius: 2,
                          mb: 0.5,
                          bgcolor: i % 2 === 0 ? 'action.hover' : 'transparent',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 1,
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
                    No matching contacts found.
                  </Typography>
                ) : null}
              </>
            )}

            {!selectedCity && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <LocalPhoneIcon sx={{ fontSize: 56, color: 'grey.300', mb: 2 }} />
                <Typography color="text.secondary">
                  Choose a city from the dropdown above
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
                  13 cities · 20+ emergency contacts each
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Divider />
          <Box sx={{ p: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" color="text.disabled">
              📞 In life-threatening situations, always call <strong>191 / 192 / 199</strong> first.
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
