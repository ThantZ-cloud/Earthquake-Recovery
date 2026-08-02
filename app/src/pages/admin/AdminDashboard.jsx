import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Skeleton,
  Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StarIcon from '@mui/icons-material/Star';
import CampaignIcon from '@mui/icons-material/Campaign';
import PhoneIcon from '@mui/icons-material/Phone';
import QuizIcon from '@mui/icons-material/Quiz';
import { BarChart } from '@mui/x-charts/BarChart';
import supabase from '../../lib/supabase';
import { AdminPageHeader } from './components';

async function count(table, filters) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  for (const [k, v] of Object.entries(filters || {})) q = q.eq(k, v);
  const { count: c } = await q;
  return c || 0;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [users, feedback, locations, phones, quizQ] = await Promise.all([
        count('profiles'),
        count('feedback'),
        count('locations'),
        count('emergency_phones'),
        count('quiz_questions'),
      ]);

      const now = new Date().toISOString();
      const { count: activeAlerts } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
        .or('expires_at.is.null,expires_at.gt.' + now);

      const { data: ratingData } = await supabase.from('feedback').select('rating');
      const ratings = ratingData || [];
      const avgRating = ratings.length
        ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
        : '—';

      const distribution = [1, 2, 3, 4, 5].map(
        (r) => ratings.filter((x) => x.rating === r).length
      );

      return { users, feedback, locations, activeAlerts, phones, quizQ, avgRating, distribution };
    },
  });

  if (isLoading) return <Skeleton variant="rounded" height={300} />;

  const statCards = [
    { label: 'Users', value: stats.users, color: '#1976d2', icon: <PeopleIcon /> },
    { label: 'Feedback', value: stats.feedback, color: '#ed6c02', icon: <FeedbackIcon /> },
    { label: 'Avg Rating', value: stats.avgRating, color: '#f59e0b', icon: <StarIcon /> },
    { label: 'Active Alerts', value: stats.activeAlerts, color: '#d32f2f', icon: <CampaignIcon /> },
    { label: 'Phone Entries', value: stats.phones, color: '#0288d1', icon: <PhoneIcon /> },
    { label: 'Quiz Questions', value: stats.quizQ, color: '#7b1fa2', icon: <QuizIcon /> },
  ];

  const starLabels = ['★', '★★', '★★★', '★★★★', '★★★★★'];

  return (
    <Box>
      <AdminPageHeader title="Dashboard" />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.label}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {s.icon && (
                  <Avatar sx={{ bgcolor: s.color, width: 48, height: 48 }}>{s.icon}</Avatar>
                )}
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {s.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Feedback Rating Distribution
            </Typography>
            <Chip
              icon={<StarIcon sx={{ color: '#f59e0b !important' }} />}
              label={`${stats.avgRating} Average`}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <BarChart
            height={300}
            xAxis={[
              {
                data: starLabels,
                label: 'Star Rating',
                tickLabelStyle: { fontSize: 12 },
              },
            ]}
            yAxis={[
              {
                label: 'Number of Reviews',
                tickLabelStyle: { fontSize: 11 },
                min: 0,
              },
            ]}
            series={[
              {
                data: stats.distribution,
                label: 'Count',
                color: '#3b82f6',
                borderRadius: '4px',
              },
            ]}
            margin={{ top: 40, bottom: 30, left: 60, right: 20 }}
            slotProps={{
              bar: { rx: 4, ry: 4 },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
            {starLabels.map((label, i) => (
              <Typography key={i} variant="caption" color="text.secondary">
                {label}: {stats.distribution[i]}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
