import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import HealingIcon from '@mui/icons-material/Healing';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── TAB 1: Assess & Secure ───

const ASSESS_SECTIONS = [
  {
    emoji: '🔍',
    title: 'Exterior Inspection',
    intro: 'Walk around the outside of your building before entering. Look for these signs from a safe distance:',
    items: [
      'Check the foundation for new cracks, shifting, or separation from the walls',
      'Look for tilting or leaning walls, chimney damage, or a shifted roof',
      'Inspect porches, decks, and balconies for sagging or detachment',
      'Check for downed power lines, broken gas lines, or water main leaks',
      'Look for cracks in the ground near the building (may indicate soil movement)',
      'If the building looks structurally unsafe — DO NOT ENTER. Call a professional.',
    ],
  },
  {
    emoji: '🏠',
    title: 'Interior Inspection',
    intro: 'If the exterior looks safe, enter carefully. Bring a flashlight and wear sturdy shoes. Watch for:',
    items: [
      'Check for cracks in walls, especially around door frames and windows',
      'Look for sagging ceilings, warped floors, or doors/windows that no longer close properly',
      'Inspect for broken glass, fallen objects, and spilled hazardous materials',
      'Check if the floor feels soft or spongy (may indicate water damage or structural compromise)',
      'Smell for gas — if detected, leave immediately and call the gas company from outside',
      'Test light switches and outlets cautiously — if sparking or burning smell, turn off electricity at the breaker',
    ],
  },
  {
    emoji: '🔧',
    title: 'Utility Safety',
    intro: 'Damaged utilities are one of the biggest post-earthquake hazards. Know how to check and shut them off:',
    items: [
      'GAS: If you smell gas or hear hissing, open windows, leave the building, and call the gas company. Do NOT use any electrical switches or open flames.',
      'WATER: Check for leaks around water heater, pipes, and toilets. If pipes are damaged, shut off the main water valve.',
      'ELECTRICITY: If you see frayed wires, sparks, or smell burning, turn off the main breaker. Do not touch wet electrical panels.',
      'SEWAGE: If sewage lines are damaged, do not use toilets or drains until repaired.',
      'Keep a wrench near your gas shut-off valve so you can turn it off quickly in emergencies.',
      'Do NOT turn utilities back on yourself — wait for a professional inspection.',
    ],
  },
  {
    emoji: '🚦',
    title: 'Re-Entry Decision: Tag System',
    intro: 'After major earthquakes, building inspectors assign colored tags to indicate safety:',
    items: [
      'GREEN TAG — The building is safe to enter. Minor damage only. You can continue living there.',
      'YELLOW TAG — Limited access. Some areas are unsafe. Enter briefly to retrieve belongings, but do not stay.',
      'RED TAG — Do not enter. The building is structurally unsafe and may collapse. You need professional help.',
      'If no inspector has visited, use your own judgment: when in doubt, stay out.',
      'Contact your local building department to request an inspection if one hasn\'t been done.',
    ],
  },
  {
    emoji: '📸',
    title: 'Documenting Damage',
    intro: 'Thorough documentation is essential for insurance claims and disaster aid applications:',
    items: [
      'Take photos and videos of ALL damage — wide shots and close-ups',
      'Document each room from multiple angles, including ceilings and floors',
      'Photograph damaged personal belongings (electronics, furniture, clothing)',
      'Write a detailed description of each damaged item with estimated value',
      'Keep all receipts for emergency repairs, temporary housing, and other expenses',
      'Save damaged items if possible — your insurance company may want to inspect them',
      'Make a home inventory list if you don\'t have one already',
    ],
  },
  {
    emoji: '🩹',
    title: 'Temporary Repairs',
    intro: 'You can make temporary fixes to prevent further damage, but know your limits:',
    items: [
      'Cover broken windows with plywood or heavy plastic sheeting',
      'Place tarps over roof damage to prevent water damage',
      'Remove fallen debris that blocks exits or creates hazards',
      'Board up holes in walls to prevent weather and animal damage',
      'Do NOT attempt structural repairs (cracked foundation, leaning walls) — hire a professional',
      'Do NOT use damaged electrical, gas, or plumbing systems until inspected',
      'Keep receipts for all temporary repair materials — these are usually reimbursable',
    ],
  },
];

// ─── TAB 2: Insurance & Financial Aid ───

const INSURANCE_SECTIONS = [
  {
    emoji: '📞',
    title: 'Contact Your Insurance Company',
    intro: 'File your claim as soon as possible — ideally within 24-48 hours of the earthquake:',
    items: [
      'Call your insurance company\'s claims hotline (check your policy documents or their website)',
      'Have your policy number ready when you call',
      'Describe the damage clearly and honestly — don\'t exaggerate or minimize',
      'Ask about your coverage: what\'s covered, your deductible, and the claims process timeline',
      'Request a claim number and the name of your assigned adjuster',
      'Ask if they cover temporary living expenses if your home is uninhabitable',
      'Follow up in writing (email or letter) to create a paper trail',
    ],
  },
  {
    emoji: '📋',
    title: 'Documentation Checklist',
    intro: 'The more documentation you provide, the faster and smoother your claim will be:',
    items: [
      'Photos and videos of all damage (before any cleanup or repairs)',
      'Written inventory of damaged/destroyed items with estimated values',
      'Receipts for emergency repairs, temporary housing, food, and other expenses',
      'Police or fire department reports if available',
      'Building inspection reports (green/yellow/red tag)',
      'Contractor estimates for repairs (get at least 2-3 quotes)',
      'Medical bills if anyone was injured',
      'Keep a log of all communications with your insurance company (dates, names, what was discussed)',
    ],
  },
  {
    emoji: '🏛️',
    title: 'Government Disaster Aid',
    intro: 'If a disaster is officially declared, government assistance programs become available:',
    items: [
      'FEMA (or your country\'s equivalent) — apply online, by phone, or at a disaster recovery center',
      'SBA Disaster Loans — low-interest loans for homeowners, renters, and businesses to repair/replace property',
      'Individual Assistance — grants for temporary housing, home repairs, and other disaster-related needs',
      'Public Assistance — funds for community infrastructure repair (roads, bridges, public buildings)',
      'Apply as soon as possible — there are usually deadlines (60-90 days after the disaster declaration)',
      'You don\'t have to wait for your insurance claim to settle before applying for government aid',
      'Keep all denial letters — you can appeal decisions',
    ],
  },
  {
    emoji: '🆘',
    title: 'Emergency Financial Assistance',
    intro: 'While waiting for insurance or government aid, these organizations can help with immediate needs:',
    items: [
      'Red Cross / Red Crescent — emergency shelter, food, and supplies',
      'Local community foundations — emergency grants for disaster victims',
      'Religious organizations — food banks, clothing, temporary housing',
      'Employer emergency assistance programs — check with your HR department',
      'Crowdfunding platforms — GoFundMe, local equivalents (be transparent about needs)',
      'Utility company assistance programs — some offer bill forgiveness or payment plans after disasters',
      'Non-profit disaster relief organizations — Team Rubicon, All Hands and Hearts, local equivalents',
    ],
  },
  {
    emoji: '💰',
    title: 'Tax Relief',
    intro: 'Disaster losses may qualify for tax benefits:',
    items: [
      'You can claim casualty losses on your tax return for uninsured/underinsured damage',
      'You may choose to claim the loss on the current year or the previous year\'s return (amended)',
      'Keep all documentation of losses and insurance payments received',
      'Filing deadlines may be extended for disaster-affected areas',
      'Property tax reassessment — if your home\'s value decreased, request a reassessment to lower your taxes',
      'Consult a tax professional for your specific situation',
    ],
  },
  {
    emoji: '⚠️',
    title: 'Avoiding Scams',
    intro: 'Unfortunately, disasters attract scammers. Protect yourself:',
    items: [
      'Be wary of unsolicited contractors who show up at your door offering repairs',
      'Always verify contractor licenses and insurance before hiring',
      'Get multiple written quotes before agreeing to any work',
      'Never pay the full amount upfront — a deposit of 10-30% is standard',
      'Be suspicious of anyone asking for cash payments or pressuring you to decide immediately',
      'Watch for fake charity scams — donate only to established organizations',
      'Report suspected fraud to your local consumer protection office or attorney general',
    ],
  },
];

// ─── TAB 3: Rebuild & Recover ───

const REBUILD_SECTIONS = [
  {
    emoji: '👷',
    title: 'Hiring Contractors',
    intro: 'Finding the right contractor is critical for safe, quality rebuilding:',
    items: [
      'Verify the contractor\'s license with your local licensing board',
      'Check for insurance (general liability and workers\' compensation)',
      'Ask for references from previous earthquake repair jobs',
      'Get at least 3 written, itemized quotes before choosing',
      'Check online reviews and Better Business Bureau ratings',
      'Get a written contract with scope of work, timeline, payment schedule, and warranty',
      'Never pay more than 10-30% upfront — pay in installments as work is completed',
      'Avoid contractors who pressure you to sign immediately or demand cash-only payment',
    ],
  },
  {
    emoji: '🏗️',
    title: 'Earthquake-Resistant Rebuilding',
    intro: 'When rebuilding, incorporate earthquake-resistant features to protect against future quakes:',
    items: [
      'Follow current local building codes — they include seismic requirements',
      'Hire a structural engineer for major repairs or rebuilding',
      'Retrofitting older buildings: bolt the foundation, brace cripple walls, reinforce chimneys',
      'Use flexible connections for gas and water lines to prevent breaks',
      'Secure heavy items to walls (bookcases, water heaters, TVs) during rebuild',
      'Consider base isolation or damping systems for larger structures',
      'Use lighter roofing materials to reduce the load on the structure',
      'Ensure proper drainage around the foundation to prevent soil weakening',
    ],
  },
  {
    emoji: '📄',
    title: 'Permits & Inspections',
    intro: 'Most structural repairs require permits and inspections. Don\'t skip this step:',
    items: [
      'Contact your local building department before starting any structural work',
      'Permits are typically required for: foundation repair, wall framing, electrical, plumbing, roofing',
      'Minor cosmetic repairs (painting, flooring) usually don\'t need permits',
      'Schedule inspections at each stage — foundation, framing, electrical, plumbing, final',
      'Keep all permit records and inspection reports — you\'ll need them for insurance and resale',
      'Unpermitted work can void your insurance and create problems when selling your home',
    ],
  },
  {
    emoji: '📊',
    title: 'Phased Rebuilding Approach',
    intro: 'Prioritize repairs in the right order to maximize safety and minimize costs:',
    items: [
      'PHASE 1 — Structural: Foundation, load-bearing walls, roof structure. This is the most critical.',
      'PHASE 2 — Building envelope: Roof covering, windows, doors, exterior walls. Prevents weather damage.',
      'PHASE 3 — Utilities: Electrical wiring, plumbing, gas lines, HVAC. Get professional inspections.',
      'PHASE 4 — Interior: Walls, flooring, ceilings. This is the most visible but least urgent.',
      'PHASE 5 — Cosmetic: Paint, trim, fixtures, landscaping. The finishing touches.',
      'Don\'t rush to make things look nice before the structure is sound — safety first.',
    ],
  },
  {
    emoji: '🤝',
    title: 'Community Recovery',
    intro: 'Recovery is faster and more effective when communities work together:',
    items: [
      'Join or form a neighborhood recovery committee to coordinate efforts',
      'Share resources — tools, equipment, skills, and labor with neighbors',
      'Attend community meetings about rebuilding plans and zoning changes',
      'Advocate for better building codes and infrastructure improvements',
      'Support local businesses by shopping locally during recovery',
      'Check on elderly, disabled, and isolated neighbors regularly',
      'Document community needs and advocate for fair distribution of aid',
    ],
  },
  {
    emoji: '💚',
    title: 'Mental Health During Rebuild',
    intro: 'Rebuilding is stressful. Taking care of your mental health is just as important as fixing your home:',
    items: [
      'Acknowledge that it\'s normal to feel overwhelmed, anxious, or grieving',
      'Set realistic expectations — rebuilding takes months or years, not weeks',
      'Take breaks and don\'t try to do everything yourself',
      'Maintain routines as much as possible — sleep, meals, exercise',
      'Talk to friends, family, or a counselor about your feelings',
      'Limit media exposure to earthquake coverage if it increases your anxiety',
      'Seek professional help if you experience persistent nightmares, flashbacks, or inability to function',
      'Celebrate small wins — every step forward is progress',
    ],
  },
];

const TAB_DATA = [
  {
    label: 'Assess & Secure',
    icon: <HomeWorkIcon />,
    emoji: '🏚️',
    sections: ASSESS_SECTIONS,
  },
  {
    label: 'Insurance & Aid',
    icon: <HealingIcon />,
    emoji: '📝',
    sections: INSURANCE_SECTIONS,
  },
  {
    label: 'Rebuild Stronger',
    icon: <BuildIcon />,
    emoji: '🔨',
    sections: REBUILD_SECTIONS,
  },
];

export default function Recovery() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();

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
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Recovery Resources
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              Practical step-by-step guides for every phase of earthquake recovery —
              from assessing damage to rebuilding stronger.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          variant="fullWidth"
          TabIndicatorProps={{ sx: { height: 3, borderRadius: 2 } }}
        >
          {TAB_DATA.map((t, i) => (
            <Tab
              key={t.label}
              icon={t.icon}
              label={t.label}
              sx={{ fontWeight: tab === i ? 700 : 400, py: 2 }}
            />
          ))}
        </Tabs>
      </Container>

      {/* ── Content ── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          key={tab}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid container spacing={3}>
            {TAB_DATA[tab].sections.map((section, i) => (
              <Grid size={{ xs: 12, md: 6 }} key={section.title}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 4 },
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 8px 30px rgba(0,0,0,0.3)'
                          : '0 8px 30px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ fontSize: '2.2rem', mb: 1 }}>
                      {section.emoji}
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                      {section.intro}
                    </Typography>
                    <List dense>
                      {section.items.map((item) => (
                        <ListItem key={item} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.secondary',
                              sx: { lineHeight: 1.6 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
