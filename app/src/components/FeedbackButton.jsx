import { useState, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Typography,
  Snackbar,
  Alert,
  Box,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import supabase from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';

export default function FeedbackButton() {
  const { user } = useAuth();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checkFeedback = async () => {
      const { data } = await supabase
        .from('feedback')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      if (data && data.length > 0) {
        setAlreadySubmitted(true);
      }
    };
    checkFeedback();
  }, [user]);

  // Don't show button for non-logged-in users
  if (!user) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id || null,
        rating,
        comment: comment.trim(),
      });
      if (error) throw error;
      setSnack('success');
      setAlreadySubmitted(true);
      setOpen(false);
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Feedback error:', err);
      setSnack('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadySubmitted && user) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
      >
        <Fab
          color="success"
          aria-label="feedback submitted"
          disabled
          sx={{
            boxShadow: '0 4px 20px rgba(46,125,50,0.3)',
          }}
        >
          <CheckCircleIcon />
        </Fab>
      </motion.div>
    );
  }

  return (
    <>
      {/* Floating button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
      >
        <Fab
          color="primary"
          aria-label="feedback"
          onClick={() => setOpen(true)}
          sx={{
            boxShadow: '0 4px 20px rgba(211,47,47,0.3)',
            '&:hover': { boxShadow: '0 6px 28px rgba(211,47,47,0.4)' },
          }}
        >
          <RateReviewIcon />
        </Fab>
      </motion.div>

      {/* Feedback dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <RateReviewIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            {t('feedback.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('feedback.subtitle')}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 1, textAlign: 'center' }}>
          {/* Star rating */}
          <Box sx={{ my: 2 }}>
            <Rating
              name="feedback-rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              onChangeActive={(_, newHover) => setHover(newHover)}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': { color: 'primary.main' },
                '& .MuiRating-iconHover': { color: 'primary.dark' },
              }}
            />
            {rating !== null && (
              <Typography variant="body2" sx={{ mt: 1, minHeight: 24 }}>
                {hover !== -1 ? t(`feedback.ratings.${hover}`) : rating !== 0 ? t(`feedback.ratings.${rating}`) : ''}
              </Typography>
            )}
          </Box>

          {/* Comment */}
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder={t('feedback.placeholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            {t('nav.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={rating === 0 || submitting}
            startIcon={<CheckCircleIcon />}
          >
            {submitting ? t('feedback.submitting') : t('feedback.submit')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error snackbar */}
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack === 'success' ? 'success' : 'error'}
          variant="filled"
          onClose={() => setSnack(null)}
        >
          {snack === 'success'
            ? t('feedback.success')
            : t('feedback.error')}
        </Alert>
      </Snackbar>
    </>
  );
}
