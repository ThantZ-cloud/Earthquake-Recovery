import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useLang } from '../i18n';

const socialLinks = [
  { icon: <TelegramIcon />, href: 'https://t.me/ThantZ44', label: 'Telegram' },
];

const credits = [
  { label: 'USGS', href: 'https://www.usgs.gov' },
  { label: 'OpenStreetMap', href: 'https://www.openstreetmap.org' },
  { label: 'MapTiler Cloud', href: 'https://www.maptiler.com' },
  { label: 'mmeqopendata', href: 'https://github.com/akzedevops/mmeqopendata' },
  { label: 'EMSC', href: 'https://www.seismicportal.eu' },
];

export default function Footer() {
  const { t } = useLang();

  const columns = [
    {
      title: t('footer.help'),
      links: ['FAQ', 'Web Tools', 'Programs', 'Content'],
    },
    {
      title: t('footer.legal'),
      links: ['Accessibility', 'Privacy Policy', 'Site Policies', 'Copyright'],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {columns.map((col) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={col.title}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {col.title}
              </Typography>
              {col.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  underline="hover"
                  color="text.secondary"
                  display="block"
                  sx={{ fontSize: '0.875rem', py: 0.3 }}
                >
                  {link}
                </Link>
              ))}
            </Grid>
          ))}

          {/* Credits column */}
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {t('footer.credits')}
            </Typography>
            {credits.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="text.secondary"
                display="block"
                sx={{ fontSize: '0.875rem', py: 0.3 }}
              >
                {c.label}
              </Link>
            ))}
          </Grid>

          {/* Social column */}
          <Grid size={{ xs: 12, sm: 12, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {t('footer.followUs')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {socialLinks.map((s) => (
                <IconButton
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label={s.label}
                  sx={{
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          {t('footer.copyright').replace('{year}', new Date().getFullYear())}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          display="block"
          sx={{ mt: 1 }}
        >
          {t('footer.damsCredit')}
        </Typography>
      </Container>
    </Box>
  );
}
