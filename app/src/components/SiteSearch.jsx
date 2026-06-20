import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  Popper,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import siteSearchData from '../data/siteSearchData';

export default function SiteSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const found = siteSearchData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
          item.section.toLowerCase().includes(q)
      )
      .slice(0, 8); // max 8 results

    setResults(found);
    setOpen(found.length > 0);
  }, [query]);

  const handleSelect = (item) => {
    setQuery('');
    setOpen(false);
    navigate(item.path);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Box ref={anchorRef}>
      <TextField
        size="small"
        placeholder="Search earthquake info..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        sx={{
          minWidth: { xs: 140, sm: 220, md: 280 },
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: 'action.hover',
            fontSize: '0.875rem',
            '&:hover': { bgcolor: 'action.selected' },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            elevation={8}
            sx={{
              mt: 1,
              maxHeight: 360,
              overflow: 'auto',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <List dense>
              {results.map((item) => (
                <ListItemButton
                  key={item.title}
                  onClick={() => handleSelect(item)}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={item.title}
                    secondary={item.section}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                  <Chip
                    label={item.section}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1, fontSize: '0.65rem' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
