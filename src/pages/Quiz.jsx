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
  },
  {
    q: 'Which scale is used to measure earthquake magnitude?',
    options: ['Fahrenheit scale', 'Richter scale / Moment Magnitude Scale', 'Beaufort scale', 'pH scale'],
    answer: 1,
  },
  {
    q: "What is the Earth's outermost layer called?",
    options: ['Mantle', 'Core', 'Crust', 'Atmosphere'],
    answer: 2,
  },
  {
    q: 'Which region experiences the most earthquakes?',
    options: ['Sahara Desert', 'Pacific Ring of Fire', 'Siberian Plains', 'Amazon Rainforest'],
    answer: 1,
  },
  {
    q: 'What is an aftershock?',
    options: ['A warning before an earthquake', 'A smaller earthquake following the main shock', 'A volcanic eruption', 'A type of tsunami'],
    answer: 1,
  },
  {
    q: 'What should you avoid during an earthquake?',
    options: ['Staying under a table', 'Using elevators', 'Covering your head', 'Staying away from windows'],
    answer: 1,
  },
];

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export default function Quiz() {
  const [step, setStep] = useState(0); // 0..questions.length = active question, questions.length = done
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

  const progress = ((Object.keys(answers).length + (score !== null ? QUESTIONS.length : 0)) / 2 / QUESTIONS.length) * 100;

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
                ? 'Test your knowledge about earthquake safety and science.'
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

            <Stepper activeStep={step} alternativeLabel sx={{ mb: 5 }}>
              {QUESTIONS.map((_, i) => (
                <Step key={i} completed={answers[i] !== undefined}>
                  <StepLabel>{`Q${i + 1}`}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card elevation={2} sx={{ p: 4 }}>
                  <CardContent>
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
            <Card elevation={4} sx={{ textAlign: 'center', py: 6, px: 4 }}>
              <EmojiEventsIcon
                sx={{
                  fontSize: 80,
                  color: score >= 4 ? 'secondary.main' : 'grey.400',
                  mb: 2,
                }}
              />
              <Typography variant="h3" fontWeight={800} gutterBottom>
                {score >= 5 ? '🏆 Amazing!' : score >= 3 ? '👍 Good Job!' : '📚 Keep Learning!'}
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                {score} / {QUESTIONS.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {score >= 5
                  ? "You're an earthquake safety expert!"
                  : score >= 3
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
