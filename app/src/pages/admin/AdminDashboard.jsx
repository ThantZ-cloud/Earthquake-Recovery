import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Grid, Avatar, Skeleton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StarIcon from '@mui/icons-material/Star';
import CampaignIcon from '@mui/icons-material/Campaign';
import { BarChart } from '@mui/x-charts/BarChart';
import supabase from '../../lib/supabase';

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
      const [users, feedback, locations, announcements, phones, quizQ] = await Promise.all([
        count('profiles'),
        count('feedback'),
        count('locations'),
        count('announcements', { active: true }),
        count('emergency_phones'),
        count('quiz_questions'),
      ]);

      const { data: ratingData } = await supabase.from('feedback').select('rating');
      const ratings = ratingData || [];
      const avgRating = ratings.length ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1) : '—';

      const distribution = [1, 2, 3, 4, 5].map((r) => ratings.filter((x) => x.rating === r).length);

      return { users, feedback, locations, announcements, phones, quizQ, avgRating, distribution };
    },
  });

  if (isLoading) return <Skeleton variant="rounded" height={300} />;

  const statCards = [
    { label: 'Users', value: stats.users, color: '#1976d2', icon: <PeopleIcon /> },
    { label: 'Feedback', value: stats.feedback, color: '#ed6c02', icon: <FeedbackIcon /> },
    { label: 'Avg Rating', value: stats.avgRating, color: '#f59e0b', icon: <StarIcon /> },
    { label: 'Active Alerts', value: stats.announcements, color: '#d32f2f', icon: <CampaignIcon /> },
    { label: 'Phone Entries', value: stats.phones, color: '#0288d1', icon: null },
    { label: 'Quiz Questions', value: stats.quizQ, color: '#7b1fa2', icon: null },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Dashboard</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.label}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {s.icon && <Avatar sx={{ bgcolor: s.color, width: 48, height: 48 }}>{s.icon}</Avatar>}
                <Box>
                  <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Feedback Rating Distribution</Typography>
          <BarChart
            height={250}
            xAxis={[{ data: ['1', '2', '3', '4', '5'], label: 'Stars' }]}
            series={[{ data: stats.distribution, label: 'Count', color: '#d32f2f' }]}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
