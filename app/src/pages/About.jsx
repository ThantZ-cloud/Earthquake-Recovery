import { useState, useRef, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Drawer,
  IconButton,
  Divider,
  alpha,
  useTheme,
  Snackbar,
  Alert,
  Button,
  Tooltip,
} from '@mui/material';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import AnimatedHero from '../components/AnimatedHero';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import LaunchIcon from '@mui/icons-material/Launch';
import PublicIcon from '@mui/icons-material/Public';
import { useLang } from '../i18n';

const TEAM = [
  {
    name: 'Thant Zin Htun',
    rollNo: '2IST-5',
    role: 'Leader',
    roleColor: '#d32f2f',
    photo: '/assets/team/thantzinhtun.jpg',
    bio: 'Always hungry to learn, build projects, and turn ideas into reality. Coffee: the only reason my projects exist.',
    skills: ['Leadership'],
    languages: ['Burmese'],
    email: 'thantzin@gmail.com',
    phone: '09-420000000',
    location: 'Budalin, Sagaing',
    education: 'UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Phyo Thiri Wai',
    rollNo: '2IST-13',
    role: 'Co-Leader',
    roleColor: '#ed6c02',
    photo: '/assets/team/phyothiri.jpg',
    bio: "I'm a young guy who is interested in the field of AI technology.",
    skills: ['Self-aware', 'Empathetic'],
    languages: ['Burmese', 'English', 'Japanese'],
    email: 'pthiriwai@gmail.com',
    phone: '09442225133',
    location: 'Mandalay, Amarapura',
    education: 'San Hein Private High School → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Phuu Ngon Ko Ko',
    rollNo: '2IST-75',
    role: 'Member',
    roleColor: '#2e7d32',
    photo: '/assets/team/phu.jpg',
    bio: 'I am a dedicated and open-minded person who always strives to do my best.',
    skills: ['Active Listening', 'Communication'],
    languages: ['Burmese', 'English'],
    email: 'phuengon75@gmail.com',
    phone: '09882051967',
    location: 'Bago State, Naung Chi Dauk',
    education: 'C.A.E Private High School, Mandalay → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Yu Nandar Aung',
    rollNo: '2IST-47',
    role: 'Member',
    roleColor: '#7b1fa2',
    photo: '/assets/team/yulay.jpg',
    bio: "I'm an active and curious student who enjoys exploring new ideas and improving myself. Always energetic and motivated to achieve my goals.",
    skills: ['Communication', 'Teamwork'],
    languages: ['Burmese', 'English'],
    email: 'aungyunandar1@gmail.com',
    phone: '09988602436',
    location: 'Chauk',
    education: 'B.E.H.S-1 Chauk → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Hay Mann Win',
    rollNo: '2IST-41',
    role: 'Member',
    roleColor: '#1565c0',
    photo: '/assets/team/haymann.jpg',
    bio: 'I love technology and programming. I enjoy learning new things and creating projects. Also love watching anime.',
    skills: ['HTML/CSS/JS', 'Java', 'C'],
    languages: ['Burmese', 'Hindi'],
    email: 'haymann478@gmail.com',
    phone: '09661680194',
    location: 'Bago State, Naung Chi Dauk',
    education: 'B.E.H.S-1 Oaktwin → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Lin Bone Htut',
    rollNo: '2IST-73',
    role: 'Member',
    roleColor: '#00838f',
    photo: '/assets/team/linbone.jpg',
    bio: 'Ever active whatever, ever smile never cry because clever boy never die.',
    skills: ['Automator'],
    languages: ['Burmese', 'Yaw', 'Koekant'],
    email: 'htetlinbone@gmail.com',
    phone: '09450144866',
    location: 'Gangaw, YawNaKa',
    education: 'ARRMAN Private School → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Ei Thiri Mon',
    rollNo: '2IST-3',
    role: 'Member',
    roleColor: '#c62828',
    photo: '/assets/team/eithiri.jpg',
    bio: "I'm a creative girl who loves painting, crochet, singing, and dancing. Art is my favorite way to express myself.",
    skills: ['Sketching', 'Crocheting'],
    languages: ['Burmese'],
    email: 'eithirimon16@gmail.com',
    phone: '09961806950',
    location: 'Sagaing, Kalaymyo',
    education: 'B.E.H.S-1 Kalaymyo → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Zue Naychi Kyaw',
    rollNo: '2IST-50',
    role: 'Member',
    roleColor: '#4a148c',
    photo: '/assets/team/zuenk.jpg',
    bio: "I'm a quiet and thoughtful student who enjoys reading. I may be quiet in class but I'm always attentive and eager to learn.",
    skills: ['Time Management', 'Patience'],
    languages: ['Burmese', 'English'],
    email: 'zuenaychikyaw1@gmail.com',
    phone: '09-260967842',
    location: 'Taunggyi',
    education: 'B.E.H.S-1 Mahlaing → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Lynn Latt Nwe',
    rollNo: '2IST-2',
    role: 'Member',
    roleColor: '#e65100',
    photo: '/assets/team/lynnlatnwe.jpg',
    bio: "I'm an enthusiastic learner passionate about programming. My goal is to become a software developer.",
    skills: ['HTML', 'CSS', 'Java', 'C'],
    languages: ['Burmese', 'English'],
    email: 'yinthetnwe23@gmail.com',
    phone: '09697661757',
    location: 'Kyaukse, Mandalay',
    education: 'B.E.H.S-1 Thanywa → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Yan Naing Htoo',
    rollNo: '2IST-37',
    role: 'Member',
    roleColor: '#1b5e20',
    photo: '/assets/team/yannaing.jpg',
    bio: 'I like programming and going to the gym. Learning about programming is fun. When I\'m bored, I watch anime.',
    skills: ['HTML', 'CSS', 'Java', 'Drawing'],
    languages: ['Burmese', 'English', 'Japanese (learning)'],
    email: 'yannainghtoo05@gmail.com',
    phone: '09754276793',
    location: 'Shan State, Pyi Thaw Thar',
    education: 'The Golden School → UTYCC (13th batch) — IST Major',
  },
];

const TECH_STACK = [
  { name: 'Vite', color: '#646cff', key: 'vite' },
  { name: 'React', color: '#61dafb', key: 'react' },
  { name: 'MUI', color: '#007fff', key: 'mui' },
  { name: 'TanStack Query', color: '#ff4154', key: 'query' },
  { name: 'Leaflet', color: '#199900', key: 'leaflet' },
  { name: 'Supabase', color: '#3ecf8e', key: 'supabase' },
];

const TIMELINE_STEPS = [
  { key: 'idea', icon: <LightbulbIcon />, color: '#f9a825' },
  { key: 'research', icon: <SearchIcon />, color: '#1976d2' },
  { key: 'build', icon: <CodeIcon />, color: '#7b1fa2' },
  { key: 'launch', icon: <LaunchIcon />, color: '#ed6c02' },
  { key: 'impact', icon: <PublicIcon />, color: '#2e7d32' },
];

const STATS = [
  { value: 10, key: 'members' },
  { value: 13, key: 'quakes' },
  { value: 254, key: 'dams' },
  { value: 30, key: 'questions' },
];

function useCountUp(target, duration = 2) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      const startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, target, duration, hasStarted]);

  return { count, ref };
}

function StatCard({ value, label }) {
  const { count, ref } = useCountUp(value);
  return (
    <Box
      ref={ref}
      sx={{
        textAlign: 'center',
        p: 3,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: 'primary.main',
        },
      }}
    >
      <Typography variant="h3" fontWeight={900} color="primary.main">
        {count}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
    </Box>
  );
}

function TechBadge({ tech, index, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Tooltip title={t(`about.tech.${tech.key}`)} arrow placement="top">
        <Chip
          label={tech.name}
          sx={{
            bgcolor: alpha(tech.color, 0.1),
            color: tech.color,
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '1px solid',
            borderColor: alpha(tech.color, 0.3),
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: alpha(tech.color, 0.2),
              transform: 'scale(1.05)',
            },
          }}
        />
      </Tooltip>
    </motion.div>
  );
}

function TimelineNode({ step, index, t, isLast }) {
  const stepData = t(`about.timeline.steps.${step.key}`, { returnObjects: true });
  const isLeft = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 3,
        position: 'relative',
        mb: isLast ? 0 : 6,
      }}
    >
      {isLeft && (
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
          {isInView && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" fontWeight={700} color={step.color}>
                {stepData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stepData.desc}
              </Typography>
            </motion.div>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {!isLast && (
          <Box
            sx={{
              position: 'absolute',
              top: 48,
              width: 2,
              height: 52,
              bgcolor: 'divider',
              display: { xs: 'none', md: 'block' },
            }}
          />
        )}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(step.color, 0.15),
              color: step.color,
              border: '2px solid',
              borderColor: step.color,
              zIndex: 1,
            }}
          >
            {step.icon}
          </Box>
        </motion.div>
      </Box>

      {!isLeft && (
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
          {isInView && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" fontWeight={700} color={step.color}>
                {stepData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stepData.desc}
              </Typography>
            </motion.div>
          )}
        </Box>
      )}

      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} color={step.color}>
          {stepData.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {stepData.desc}
        </Typography>
      </Box>
    </Box>
  );
}

function MemberCard({ member, onClick }) {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.6 : 0.9),
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
            transform: 'translateY(-8px)',
            borderColor: member.roleColor,
            boxShadow: `0 20px 40px ${alpha(member.roleColor, 0.2)}`,
            '& .member-avatar': {
              transform: 'scale(1.05)',
            },
            '& .member-overlay': {
              opacity: 1,
            },
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 3, position: 'relative' }}>
          <Box
            className="member-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: alpha(member.roleColor, 0.05),
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
          />
          
          <Avatar
            className="member-avatar"
            src={member.photo}
            alt={member.name}
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 2,
              border: '3px solid',
              borderColor: member.roleColor,
              transition: 'all 0.3s',
            }}
          />
          
          <Chip
            label={member.role}
            size="small"
            sx={{
              bgcolor: alpha(member.roleColor, 0.15),
              color: member.roleColor,
              fontWeight: 700,
              mb: 1,
            }}
          />
          
          <Typography variant="subtitle1" fontWeight={700}>
            {member.name}
          </Typography>

          <Typography variant="body2" color="primary" fontWeight={600}>
            {member.rollNo}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, lineHeight: 1.6 }}
          >
            {member.bio.length > 80 ? member.bio.slice(0, 80) + '...' : member.bio}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            {member.skills.slice(0, 3).map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MemberDrawer({ member, open, onClose, t }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: t('about.detail.copied') });
    }).catch(() => {});
  }, [t]);

  if (!member) return null;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: 'background.default',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              height: 220,
              background: `linear-gradient(135deg, ${alpha(member.roleColor, 0.8)} 0%, ${member.roleColor} 100%)`,
              position: 'relative',
            }}
          />
          
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: '#fff' },
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Avatar
            src={member.photo}
            alt={member.name}
            sx={{
              width: 240,
              height: 240,
              position: 'absolute',
              left: '50%',
              top: 120,
              transform: 'translateX(-50%)',
              border: '5px solid',
              borderColor: 'background.default',
              boxShadow: 3,
            }}
          />
        </Box>
        
        <Box sx={{ pt: 19, px: 3, pb: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Chip
              label={member.role}
              size="small"
              sx={{
                bgcolor: alpha(member.roleColor, 0.15),
                color: member.roleColor,
                fontWeight: 700,
                mb: 1,
              }}
            />
            <Typography variant="h5" fontWeight={800}>
              {member.name}
            </Typography>
            <Typography variant="body1" color="primary" fontWeight={600}>
              {member.rollNo}
            </Typography>
          </Box>
          
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ fontStyle: 'italic', mb: 3 }}
          >
            "{member.bio}"
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => copyToClipboard(member.email)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              <EmailIcon fontSize="small" color="primary" />
              <Typography variant="body2">{member.email}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => copyToClipboard(member.phone)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              <PhoneIcon fontSize="small" color="primary" />
              <Typography variant="body2">{member.phone}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon fontSize="small" color="primary" />
              <Typography variant="body2">{member.location}</Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {t('about.detail.education')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {member.education}
          </Typography>
          
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {t('about.detail.skills')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {member.skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {t('about.detail.languages')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {member.languages.map((lang) => (
              <Chip key={lang} label={lang} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      </Drawer>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function About() {
  const { t } = useLang();
  const theme = useTheme();
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section with Animated Blobs */}
      <AnimatedHero
        icon={<GroupsIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />}
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        bg={['#1a1a2e', '#16213e', '#0f0f23']}
        accent="#ff6b6b"
        blobs={[
          { top: '10%', left: '5%', width: 400, height: 400, color: 'rgba(211,47,47,0.25)', blur: 60, duration: 20, dx: 50, dy: -40 },
          { top: '30%', right: '10%', width: 350, height: 350, color: 'rgba(237,108,2,0.2)', blur: 50, duration: 25, dx: -60, dy: 50 },
          { bottom: '-10%', left: '30%', width: 300, height: 300, color: 'rgba(123,31,162,0.2)', blur: 50, duration: 18, dx: 40, dy: -30 },
        ]}
      />

      {/* Project Context */}
      <Container maxWidth="md" sx={{ pt: 4, pb: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.12),
            }}
          >
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {t('about.context.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.8 }}>
              {t('about.context.desc')}
            </Typography>
          </Box>
        </motion.div>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Typography variant="h4" fontWeight={800} textAlign="center" gutterBottom>
            {t('about.stats.title')}
          </Typography>
        </motion.div>
        
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {STATS.map((stat) => (
            <Grid size={{ xs: 6, md: 3 }} key={stat.key}>
              <StatCard value={stat.value} label={t(`about.stats.${stat.key}`)} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Tech Stack Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight={800} textAlign="center" gutterBottom>
              {t('about.tech.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              {t('about.tech.desc')}
            </Typography>
          </motion.div>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {TECH_STACK.map((tech, i) => (
              <TechBadge key={tech.name} tech={tech} index={i} t={t} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Typography variant="h4" fontWeight={800} textAlign="center" gutterBottom>
            {t('about.team.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            {t('about.team.clickToLearn')}
          </Typography>
        </motion.div>
        
        <Grid container spacing={3}>
          {TEAM.map((member) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={member.name}>
              <MemberCard
                member={member}
                onClick={() => setSelectedMember(member)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Timeline Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.03), py: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" fontWeight={800} textAlign="center" gutterBottom>
              {t('about.timeline.title')}
            </Typography>
          </motion.div>
          
          <Box sx={{ mt: 6 }}>
            {TIMELINE_STEPS.map((step, i) => (
              <TimelineNode
                key={step.key}
                step={step}
                index={i}
                t={t}
                isLast={i === TIMELINE_STEPS.length - 1}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          }}
        />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(211,47,47,0.1) 0%, transparent 60%)',
            filter: 'blur(80px)',
            top: '-50%',
            left: '-20%',
          }}
        />
        
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RocketLaunchIcon sx={{ fontSize: 48, color: '#ff6b6b', mb: 2 }} />
            
            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #fff 0%, #ff6b6b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('about.mission.title')}
            </Typography>
            
            <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ mb: 4, lineHeight: 1.8 }}>
              {t('about.mission.desc')}
            </Typography>
            
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              endIcon={<OpenInNewIcon />}
              sx={{
                bgcolor: '#ff6b6b',
                '&:hover': { bgcolor: '#e53935' },
                px: 4,
                py: 1.5,
                fontWeight: 700,
              }}
            >
              {t('about.mission.cta')}
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Member Drawer */}
      <MemberDrawer
        member={selectedMember}
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        t={t}
      />
    </Box>
  );
}
