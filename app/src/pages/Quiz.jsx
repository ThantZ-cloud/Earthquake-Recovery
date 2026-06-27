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
];

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

// Show 5 steps at a time in stepper, scroll as user progresses
function visibleSteps(questions, current) {
  const total = questions.length;
  const maxVisible = 5;
  if (total <= maxVisible) return questions;
  const start = Math.min(current, total - maxVisible);
  return questions.slice(start, start + maxVisible);
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleSelect = (qIdx, val) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: parseInt(val) }));
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
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 2 }}>
              {score === null ? 'Earthquake Knowledge Quiz' : 'Quiz Complete!'}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              {score === null
                ? `Test your knowledge with ${QUESTIONS.length} questions about earthquake safety and science.`
                : `You scored ${score} out of ${QUESTIONS.length}`}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        {score === null ? (
          <>
            {/* Progress */}
            <LinearProgress
              variant="determinate"
              value={((step + 1) / QUESTIONS.length) * 100}
              sx={{ mb: 4, height: 8, borderRadius: 4 }}
            />

            {/* Stepper — scrolls as user advances */}
            <Box sx={{ overflow: 'auto', '& .MuiStepLabel-label': { fontSize: { xs: '0.7rem', sm: '0.8rem' } } }}>
              <Stepper activeStep={step % 5} alternativeLabel sx={{ mb: 2, minWidth: 0 }}>
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

            <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mb: 3 }}>
              Question {step + 1} of {QUESTIONS.length}
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
                <Card elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <CardContent>
                    <Typography variant="caption" color="primary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                      {QUESTIONS[step].category}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {QUESTIONS[step].q}
                    </Typography>
                    <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
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
                              py: 1,
                              px: 2,
                              my: 0.5,
                              borderRadius: 2,
                              bgcolor: answers[step] === oIdx ? 'primary.main' : 'transparent',
                              color: answers[step] === oIdx ? '#fff' : 'text.primary',
                              '& .MuiRadio-root': {
                                color: answers[step] === oIdx ? '#fff' : undefined,
                              },
                              transition: 'all 0.2s',
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
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[step] === undefined}
                variant="contained"
                size="large"
              >
                {step === QUESTIONS.length - 1 ? 'Submit' : 'Next'}
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
              <Typography variant="h3" fontWeight={800} gutterBottom>
                {score >= 10 ? '🏆 Amazing!' : score >= 7 ? '👍 Good Job!' : '📚 Keep Learning!'}
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                {score} / {QUESTIONS.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {score >= 10
                  ? "You're an earthquake safety expert!"
                  : score >= 7
                  ? 'You know the basics — keep building your knowledge!'
                  : 'Review the safety tips on our home page and try again!'}
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<ReplayIcon />}
                onClick={handleRestart}
                sx={{ px: 5 }}
              >
                Try Again
              </Button>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
