import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';

const socialLinks = [
  { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
  { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
  { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
  { icon: <GitHubIcon />, href: '#', label: 'GitHub' },
  { icon: <YouTubeIcon />, href: '#', label: 'YouTube' },
  { icon: <TelegramIcon />, href: 'https://t.me/+vN0xEVxCWkw0ZWE1', label: 'Telegram' },
];

const columns = [
  {
    title: 'Get Help',
    links: ['FAQ', 'Web Tools', 'Programs', 'Content'],
  },
  {
    title: 'Legal',
    links: ['Accessibility', 'Privacy Policy', 'Site Policies', 'Copyright'],
  },
  {
    title: 'Credits',
    links: ['USGS', 'OpenStreetMap', 'MapTiler Cloud', 'Other Sources'],
  },
];

export default function Footer() {
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

          {/* Social column */}
          <Grid size={{ xs: 12, sm: 12, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Follow Us
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
          © {new Date().getFullYear()} Earthquake & Recovery. Built with care for earthquake awareness.
        </Typography>
      </Container>
    </Box>
  );
}
