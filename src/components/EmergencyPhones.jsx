import { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton as DialogCloseBtn,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { cities, getPhonesByCity } from '../data/emergencyPhones';

export default function EmergencyPhones() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const anchorRef = useRef(null);

  const phones = getPhonesByCity(selectedCity);

  return (
    <>
      {/* Trigger button */}
      <IconButton
        ref={anchorRef}
        onClick={() => setDialogOpen(true)}
        color="inherit"
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

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalPhoneIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              Emergency Numbers
            </Typography>
            <Box sx={{ flex: 1 }} />
            <DialogCloseBtn onClick={() => setDialogOpen(false)} size="small">
              <CloseIcon />
            </DialogCloseBtn>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3, pb: 3 }}>
          {/* City dropdown */}
          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel>Select City</InputLabel>
            <Select
              value={selectedCity}
              label="Select City"
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Results */}
          {selectedCity && phones.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOnIcon fontSize="small" color="primary" />
                <Typography fontWeight={600}>{selectedCity}</Typography>
                <Chip label={`${phones.length} contacts`} size="small" variant="outlined" />
              </Box>

              <List dense disablePadding>
                {phones.map((p, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      mb: 0.5,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ListItemText
                      primary={p.name}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
                    />
                    <Chip
                      label={p.phone}
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ fontFamily: 'monospace', fontWeight: 600, minWidth: 100 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {selectedCity && phones.length === 0 && (
            <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
              No emergency contacts available for this city yet.
            </Typography>
          )}

          {!selectedCity && (
            <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
              Choose a city to see emergency phone numbers.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
