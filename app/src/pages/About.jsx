import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const TEAM = [
  {
    name: 'Thant Zin Htun',
    role: 'Leader',
    roleColor: '#d32f2f',
    photo: '/assets/team/thantzin.jpg',
    bio: 'Always hungry to learn, build projects, and turn ideas into reality. ☕️ Coffee: the only reason my projects exist.',
    skills: ['Leadership'],
    languages: ['Burmese'],
    email: 'thantzin@gmail.com',
    phone: '09-403834385',
    location: 'Nay Pyi Taw',
    education: 'UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Phyo Thiri Wai',
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
    role: 'Member',
    roleColor: '#7b1fa2',
    photo: '/assets/team/yulay.jpg',
    bio: "I'm an active and curious student who enjoys exploring new ideas and improving myself. Always energetic and motivated to achieve my goals.",
    skills: ['Communication', 'Teamwork', 'Problem-solving'],
    languages: ['Burmese', 'English'],
    email: 'aungyunandar1@gmail.com',
    phone: '09988602436',
    location: 'Chauk',
    education: 'B.E.H.S-1 Chauk → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Hay Mann Win',
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
    role: 'Member',
    roleColor: '#4a148c',
    photo: '/assets/team/zuenk.jpg',
    bio: "I'm a quiet and thoughtful student who enjoys reading. I may be quiet in class but I'm always attentive and eager to learn.",
    skills: ['Time Management', 'Patience', 'Discipline'],
    languages: ['Burmese', 'English'],
    email: 'zuenaychikyaw1@gmail.com',
    phone: '09-260967842',
    location: 'Taunggyi',
    education: 'B.E.H.S-1 Mahlaing → UTYCC (13th batch) — IST Major',
  },
  {
    name: 'Lynn Latt Nwe',
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

// Animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function About() {
  const [selected, setSelected] = useState(null);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GroupsIcon sx={{ fontSize: 56, mb: 2, color: 'secondary.main' }} />
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
            >
              Meet the Team
            </Typography>
            <Typography
              variant="h6"
              sx={{ opacity: 0.8, fontWeight: 400, maxWidth: 600, mx: 'auto' }}
            >
              Ten passionate students from UTYCC working together to build earthquake
              awareness through technology.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Team grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <Grid container spacing={3}>
            {TEAM.map((member) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={member.name}>
                <motion.div variants={cardVariants} style={{ height: '100%' }}>
                  <Card
                    onClick={() => setSelected(member)}
                    sx={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      py: 3,
                      px: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Avatar
                      src={member.photo}
                      alt={member.name}
                      sx={{
                        width: { xs: 100, sm: 120 },
                        height: { xs: 100, sm: 120 },
                        mb: 2,
                        border: '3px solid',
                        borderColor: member.roleColor,
                      }}
                    />
                    <Chip
                      label={member.role}
                      size="small"
                      sx={{
                        bgcolor: `${member.roleColor}18`,
                        color: member.roleColor,
                        fontWeight: 700,
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6" fontWeight={700} fontSize="1rem">
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, lineHeight: 1.5, flex: 1 }}
                    >
                      {member.bio.length > 80
                        ? member.bio.slice(0, 80) + '...'
                        : member.bio}
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {member.skills.slice(0, 3).map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Detail dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        {selected && (
          <>
            <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 0 }}>
              <IconButton
                onClick={() => setSelected(null)}
                sx={{ position: 'absolute', right: 12, top: 12 }}
              >
                <CloseIcon />
              </IconButton>
              <Avatar
                src={selected.photo}
                alt={selected.name}
                sx={{
                  width: 160,
                  height: 160,
                  mx: 'auto',
                  mb: 2,
                  border: '4px solid',
                  borderColor: selected.roleColor,
                }}
              />
              <Chip
                label={selected.role}
                size="small"
                sx={{
                  bgcolor: `${selected.roleColor}18`,
                  color: selected.roleColor,
                  fontWeight: 700,
                  mb: 1,
                }}
              />
              <Typography variant="h5">
                {selected.name}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 4, pb: 4 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 3, fontStyle: 'italic' }}
              >
                "{selected.bio}"
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon fontSize="small" color="primary" />
                  <Typography variant="body2">{selected.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneIcon fontSize="small" color="primary" />
                  <Typography variant="body2">{selected.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOnIcon fontSize="small" color="primary" />
                  <Typography variant="body2">{selected.location}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Education
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.education}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.skills.map((s) => (
                    <Chip key={s} label={s} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Languages
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.languages.map((l) => (
                    <Chip key={l} label={l} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Mission footer */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 8,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="sm">
          <RocketLaunchIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" color="text.secondary">
            To make earthquake education accessible, visual, and actionable —
            helping communities around the world prepare, respond, and recover.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
