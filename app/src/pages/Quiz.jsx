import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  LinearProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import { useLang } from '../i18n';

const QUESTIONS = [
  {
    q: 'What should you do FIRST during an earthquake if you are indoors?',
    options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Call emergency services'],
    answer: 1,
    category: 'Safety',
  },
  {
    q: 'Which scale is used to measure earthquake magnitude?',
    options: ['Fahrenheit scale', 'Richter scale / Moment Magnitude Scale', 'Beaufort scale', 'pH scale'],
    answer: 1,
    category: 'Science',
  },
  {
    q: "What is the Earth's outermost layer called?",
    options: ['Mantle', 'Core', 'Crust', 'Atmosphere'],
    answer: 2,
    category: 'Science',
  },
  {
    q: 'Which region experiences the most earthquakes?',
    options: ['Sahara Desert', 'Pacific Ring of Fire', 'Siberian Plains', 'Amazon Rainforest'],
    answer: 1,
    category: 'Geography',
  },
  {
    q: 'What is an aftershock?',
    options: ['A warning before an earthquake', 'A smaller earthquake following the main shock', 'A volcanic eruption', 'A type of tsunami'],
    answer: 1,
    category: 'Science',
  },
  {
    q: 'What should you avoid during an earthquake?',
    options: ['Staying under a table', 'Using elevators', 'Covering your head', 'Staying away from windows'],
    answer: 1,
    category: 'Safety',
  },
  // --- new questions (7–12) ---
  {
    q: 'How fast do seismic waves travel through the Earth?',
    options: ['1–10 km/h', '100–200 km/h', '3–14 km/s', '300,000 km/s'],
    answer: 2,
    category: 'Science',
  },
  {
    q: 'What causes most earthquake-related deaths?',
    options: ['The shaking itself', 'Building collapse', 'Tsunamis', 'Fires'],
    answer: 1,
    category: 'Safety',
  },
  {
    q: 'What is a tsunami?',
    options: ['A type of earthquake', 'A giant ocean wave often triggered by underwater earthquakes', 'A volcanic eruption', 'A weather phenomenon'],
    answer: 1,
    category: 'Science',
  },
  {
    q: 'Which Myanmar city sits near the Sagaing Fault?',
    options: ['Yangon', 'Mandalay', 'Pathein', 'Sittwe'],
    answer: 1,
    category: 'Geography',
  },
  {
    q: 'What should your emergency kit include?',
    options: ['Only food', 'Water, food, first-aid kit, flashlight, batteries', 'A phone charger only', 'Just a blanket'],
    answer: 1,
    category: 'Safety',
  },
  {
    q: 'What is the Modified Mercalli Intensity (MMI) scale based on?',
    options: ['Energy released at the source', 'Observed effects and damage at a location', 'Depth of the earthquake', 'Distance from the epicenter'],
    answer: 1,
    category: 'Science',
  },
  // --- questions 13–30 ---
  {
    q: 'What is the "epicenter" of an earthquake?',
    options: ['The deepest point inside the Earth', 'The point on the surface directly above the focus', 'The loudest part of the quake', 'The last area to stop shaking'],
    answer: 1,
    category: 'Science',
  },
  {
    q: 'What should you do if you are driving during an earthquake?',
    options: ['Speed up to escape the area', 'Pull over, stop, and stay inside the car', 'Get out of the car immediately', 'Keep driving slowly'],
    answer: 1,
    category: 'Safety',
  },
  {
    q: 'What is a fault line?',
    options: ['A type of earthquake', 'A crack in the Earth\'s crust where movement occurs', 'A man-made structure', 'A type of building damage'],
    answer: 1,
    category: 'Science',
  },
  {
    q: 'Which country has the most earthquakes per year?',
    options: ['United States', 'Japan', 'Indonesia', 'Chile'],
    answer: 2,
    category: 'Geography',
  },
  {
    q: 'What is "liquefaction" during an earthquake?',
    options: ['Water flowing from pipes', 'Solid ground temporarily behaving like a liquid', 'Buildings melting from heat', 'Gas leaking from the ground'],
    answer: 1,
    category: 'Science',
  },
  {
    q: 'How should you protect yourself from falling objects during an earthquake?',
    options: ['Run to the nearest wall', 'Get under a sturdy table or desk', 'Stand in the middle of the room', 'Lie flat on the ground'],
    answer: 1,
    category: 'Safety',
  },
  {
    q: 'What is the "focus" (hypocenter) of an earthquake?',
    options: ['The loudest point of the quake', 'The point inside the Earth where the quake originates', 'The surface point above the quake', 'The area of worst damage'],
    answer: 1,
    category: 'Science',
  },
  {
    q: 'What year did the devastating earthquake hit Bago, Myanmar?',
    options: ['1975', '1930', '2016', '2004'],
    answer: 1,
    category: 'Geography',
  },
  {
    q: 'What is the primary danger after an earthquake?',
    options: ['Aftershocks', 'Heavy rain', 'Cold weather', 'Strong winds'],
    answer: 0,
    category: 'Safety',
  },
  {
    q: 'What magnitude is considered a "major" earthquake?',
    options: ['4.0–4.9', '5.0–5.9', '7.0 and above', '3.0 and below'],
    answer: 2,
    category: 'Science',
  },
  {
    q: 'What should you do after an earthquake if you are in a damaged building?',
    options: ['Stay inside and wait', 'Evacuate carefully and move to open ground', 'Go to the roof', 'Use the elevator to leave'],
    answer: 1,
    category: 'Safety',
  },
  {
    q: 'What is P-waves stands for?',
    options: ['Primary waves', 'Power waves', 'Pressure waves', 'Passive waves'],
    answer: 0,
    category: 'Science',
  },
  {
    q: 'Which organization provides earthquake early warnings in many countries?',
    options: ['WHO', 'USGS', 'UNESCO', 'IMF'],
    answer: 1,
    category: 'Geography',
  },
  {
    q: 'What is the "Ring of Fire"?',
    options: ['A volcanic mountain range', 'A zone of frequent earthquakes and volcanoes around the Pacific Ocean', 'A type of earthquake measurement', 'A fire caused by earthquakes'],
    answer: 1,
    category: 'Geography',
  },
  {
    q: 'What is the best way to secure heavy furniture at home?',
    options: ['Leave it as is', 'Anchor it to the wall with brackets or straps', 'Place it near windows', 'Put heavy items on top shelves'],
    answer: 1,
    category: 'Safety',
  },
  {
    q: 'How much of the Earth\'s surface is affected by the Ring of Fire?',
    options: ['About 10%', 'About 25%', 'About 40%', 'About 75%'],
    answer: 2,
    category: 'Geography',
  },
  {
    q: 'What is a seismograph used for?',
    options: ['Measuring wind speed', 'Recording earthquake waves', 'Predicting weather', 'Measuring temperature'],
    answer: 1,
    category: 'Science',
  },
  {
    q: 'What should you do if you smell gas after an earthquake?',
    options: ['Light a match to check', 'Turn on lights to inspect', 'Open windows, leave the building, and call from outside', 'Ignore it if the smell is mild'],
    answer: 2,
    category: 'Safety',
  },
];

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

// Show 5 steps at a time in stepper, scroll when active step goes past the window
function visibleSteps(questions, current) {
  const total = questions.length;
  const maxVisible = 5;
  if (total <= maxVisible) return questions;
  let start;
  if (current < maxVisible) {
    start = 0;
  } else if (current >= total - maxVisible) {
    start = total - maxVisible;
  } else {
    start = current - maxVisible + 1;
  }
  return questions.slice(start, start + maxVisible);
}

export default function Quiz() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleSelect = (qIdx, val) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: parseInt(val, 10) }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = () => {
    let correct = 0;
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setStep(QUESTIONS.length);
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setScore(null);
  };

  const stepperSteps = visibleSteps(QUESTIONS, step);
  const maxVisible = 5;
  let stepperStart;
  if (step < maxVisible) {
    stepperStart = 0;
  } else if (step >= QUESTIONS.length - maxVisible) {
    stepperStart = QUESTIONS.length - maxVisible;
  } else {
    stepperStart = step - maxVisible + 1;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
          color: '#fff',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {score === null ? (
              <QuizIcon sx={{ fontSize: 52, mb: 2 }} />
            ) : (
              <EmojiEventsIcon sx={{ fontSize: 52, mb: 2, color: 'secondary.main' }} />
            )}
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 2 }}>
              {score === null ? t('quiz.title') : t('quiz.complete')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              {score === null
                ? t('quiz.subtitle').replace('{count}', QUESTIONS.length)
                : t('quiz.score').replace('{score}', score).replace('{total}', QUESTIONS.length)}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: { xs: 2, md: 3 } }}>
        {score === null ? (
          <>
            {/* Progress */}
            <LinearProgress
              variant="determinate"
              value={((step + 1) / QUESTIONS.length) * 100}
              sx={{ mb: { xs: 1, sm: 2 }, height: 8, borderRadius: 4 }}
            />

            {/* Stepper — scrolls as user advances */}
            <Box sx={{ overflow: 'auto', '& .MuiStepLabel-label': { fontSize: { xs: '0.7rem', sm: '0.8rem' } } }}>
              <Stepper activeStep={step - stepperStart} alternativeLabel sx={{ mb: { xs: 0.5, sm: 1 }, minWidth: 0 }}>
                {stepperSteps.map((_, i) => {
                  const realIdx = QUESTIONS.indexOf(stepperSteps[i]);
                  return (
                    <Step key={realIdx} completed={answers[realIdx] !== undefined}>
                      <StepLabel>{`Q${realIdx + 1}`}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>

            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mb: { xs: 1, sm: 1.5 } }}>
              {t('quiz.questionOf').replace('{current}', step + 1).replace('{total}', QUESTIONS.length)}
            </Typography>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card elevation={2} sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <CardContent>
                    <Typography variant="caption" color="primary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                      {QUESTIONS[step].category}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      {QUESTIONS[step].q}
                    </Typography>
                    <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                      <RadioGroup
                        value={answers[step] !== undefined ? String(answers[step]) : ''}
                        onChange={(e) => handleSelect(step, e.target.value)}
                      >
                        {QUESTIONS[step].options.map((opt, oIdx) => (
                          <FormControlLabel
                            key={oIdx}
                            value={String(oIdx)}
                            control={<Radio />}
                            label={opt}
                            sx={{
                              py: 0.75,
                              px: 2,
                              my: 0.4,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: answers[step] === oIdx ? 'primary.main' : 'divider',
                              bgcolor: answers[step] === oIdx ? 'primary.main' : 'transparent',
                              color: answers[step] === oIdx ? '#fff' : 'text.primary',
                              '& .MuiRadio-root': {
                                color: answers[step] === oIdx ? '#fff' : undefined,
                              },
                              '&:hover': answers[step] !== oIdx ? {
                                bgcolor: 'action.hover',
                                borderColor: 'primary.light',
                              } : {},
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={handleBack} disabled={step === 0} variant="outlined">
                {t('quiz.back')}
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[step] === undefined}
                variant="contained"
                size="large"
              >
                {step === QUESTIONS.length - 1 ? t('quiz.submit') : t('quiz.next')}
              </Button>
            </Box>
          </>
        ) : (
          /* Result card */
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card elevation={4} sx={{ textAlign: 'center', py: { xs: 4, md: 6 }, px: { xs: 2, sm: 4 } }}>
              <EmojiEventsIcon
                sx={{
                  fontSize: 80,
                  color: score >= 8 ? 'secondary.main' : 'grey.400',
                  mb: 2,
                }}
              />
              <Typography variant="h3" gutterBottom>
                {score >= 25 ? t('quiz.amazing') : score >= 15 ? t('quiz.goodJob') : t('quiz.keepLearning')}
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                {score} / {QUESTIONS.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {score >= 25
                  ? t('quiz.msgAmazing')
                  : score >= 15
                  ? t('quiz.msgGood')
                  : t('quiz.msgKeep')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<ReplayIcon />}
                onClick={handleRestart}
                sx={{ px: 5 }}
              >
                {t('quiz.tryAgain')}
              </Button>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
