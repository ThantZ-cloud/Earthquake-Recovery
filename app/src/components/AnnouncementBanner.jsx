import { useState } from 'react';
import { Box, Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase';
import { useLang } from '../i18n';

export default function AnnouncementBanner() {
  const { lang } = useLang();
  const [dismissed, setDismissed] = useState([]);

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await supabase
        .from('announcements')
        .select('id, title, title_my, body, body_my, severity')
        .eq('active', true)
        .order('created_at', { ascending: false });
      return data || [];
    },
    refetchInterval: 30_000,
  });

  if (!announcements?.length) return null;

  const visible = announcements.filter((a) => !dismissed.includes(a.id));
  if (!visible.length) return null;

  return (
    <Box sx={{ px: { xs: 1, md: 2 }, pt: 1 }}>
      {visible.map((a) => (
        <Collapse key={a.id} in={!dismissed.includes(a.id)}>
          <Alert
            severity={a.severity}
            sx={{
              mb: 1,
              borderRadius: 2,
              ...(a.severity === 'danger' && {
                bgcolor: '#b71c1c',
                color: '#fff',
                '& .MuiAlert-icon': { color: '#fff' },
                animation: 'dangerPulse 2s infinite',
                '@keyframes dangerPulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(211,47,47,0.7)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(211,47,47,0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(211,47,47,0)' },
                },
              }),
              ...(a.severity === 'warning' && {
                bgcolor: '#e65100',
                color: '#fff',
                '& .MuiAlert-icon': { color: '#fff' },
              }),
            }}
            action={
              <IconButton size="small" onClick={() => setDismissed((d) => [...d, a.id])}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <AlertTitle>{lang === 'my' && a.title_my ? a.title_my : a.title}</AlertTitle>
            {lang === 'my' && a.body_my ? a.body_my : a.body}
          </Alert>
        </Collapse>
      ))}
    </Box>
  );
}
