import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Tab,
  Tabs,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import HealingIcon from '@mui/icons-material/Healing';
import BuildIcon from '@mui/icons-material/Build';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

const TABS = [
  {
    label: 'Short-term',
    icon: <HealingIcon />,
    content: [
      {
        title: 'Search & Rescue',
        desc: 'Immediate search and rescue operations to save lives trapped under debris. First 72 hours are critical.',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjWe42TZo0T_waPRJSrxuIW0bKKJNEsP23u_VzC7uZhg&s=10',
      },
      {
        title: 'Emergency Medical Aid',
        desc: 'Setting up field hospitals, treating injuries, and preventing disease outbreaks in affected areas.',
        img: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop',
      },
      {
        title: 'Shelter & Food',
        desc: 'Providing temporary shelters, clean water, and food supplies to displaced families.',
        img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop',
      },
    ],
  },
  {
    label: 'Mid-term',
    icon: <HomeWorkIcon />,
    content: [
      {
        title: 'Debris Removal',
        desc: 'Clearing rubble and hazardous materials to make areas safe for rebuilding.',
        img: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?w=600&h=400&fit=crop',
      },
      {
        title: 'Temporary Housing',
        desc: 'Constructing transitional shelters while permanent homes are being rebuilt.',
        img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
      },
      {
        title: 'Psychosocial Support',
        desc: 'Counseling and mental health services for trauma recovery and community healing.',
        img: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&h=400&fit=crop',
      },
    ],
  },
  {
    label: 'Long-term',
    icon: <BuildIcon />,
    content: [
      {
        title: 'Rebuilding Infrastructure',
        desc: 'Reconstructing roads, bridges, schools, and hospitals with earthquake-resistant design.',
        img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop',
      },
      {
        title: 'Economic Recovery',
        desc: 'Restoring livelihoods, businesses, and local economies through grants and training programs.',
        img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
      },
      {
        title: 'Community Preparedness',
        desc: 'Establishing early warning systems, evacuation plans, and regular safety drills for the future.',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbNqTdaVMq9p5MY7Os740euFYE-c0YrTf4Onwk-O2Q8Q&s=10',
      },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Recovery() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <HealingIcon sx={{ fontSize: 52, mb: 2 }} />
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Recovery Resources
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              From immediate response to long-term rebuilding — every phase matters.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          variant="fullWidth"
          sx={{ mb: 5 }}
          TabIndicatorProps={{ sx: { height: 3, borderRadius: 2 } }}
        >
          {TABS.map((t, i) => (
            <Tab
              key={t.label}
              icon={t.icon}
              label={t.label}
              sx={{ fontWeight: tab === i ? 700 : 400, py: 2 }}
            />
          ))}
        </Tabs>

        <motion.div
          key={tab}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid container spacing={3}>
            {TABS[tab].content.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <motion.div variants={itemVariants}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.img}
                      alt={item.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
