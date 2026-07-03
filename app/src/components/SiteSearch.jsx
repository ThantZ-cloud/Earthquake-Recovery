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
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import siteSearchData from '../data/siteSearchData';

export default function SiteSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const anchorRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
    setOpen(query.trim().length >= 2);
  }, [query]);

  const handleSelect = (item) => {
    setQuery('');
    setOpen(false);
    setExpanded(false);
    navigate(item.path);
  };

  const handleClickAway = () => {
    setOpen(false);
    if (isSmall) {
      setExpanded(false);
      setQuery('');
    }
  };

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // On small screens: show icon button until expanded
  if (isSmall && !expanded) {
    return (
      <IconButton onClick={handleExpand} size="small" sx={{ color: 'text.primary' }}>
        <SearchIcon fontSize="small" />
      </IconButton>
    );
  }

  return (
    <Box ref={anchorRef}>
      <TextField
        inputRef={inputRef}
        size="small"
        placeholder="Search earthquake info..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim().length >= 2) setOpen(true);
        }}
        sx={{
          minWidth: { xs: 160, sm: 220, md: 280 },
          maxWidth: { xs: 200, sm: 'none' },
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
                <SearchIcon fontSize="small" sx={{ color: 'text.primary' }} />
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
            {results.length > 0 ? (
              <List dense>
                {results.map((item) => (
                  <ListItemButton
                    key={item.title}
                    onClick={() => handleSelect(item)}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    />
                    <Chip
                      label={item.section}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1, fontSize: '0.7rem' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No results found for "{query}"
                </Typography>
              </Box>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
