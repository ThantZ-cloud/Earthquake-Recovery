-- Schedule the alert-dispatcher Edge Function every 30 seconds.
-- Run this in the Supabase SQL Editor AFTER deploying the function.
--
-- Prerequisites:
--   1. Function deployed:  supabase functions deploy alert-dispatcher
--   2. Secrets set in Dashboard -> Edge Functions -> alert-dispatcher -> Secrets:
--        FCM_SERVICE_ACCOUNT       (JSON of a Firebase service account key)
--        ALERT_DISPATCHER_TOKEN    (must equal the token in the query below)
--   3. pg_net + pg_cron extensions enabled.

select cron.schedule(
  'alert-dispatcher',
  '*/30 * * * * *',
  $$select net.http_post(
    url := 'https://acegkfljicuqsvvuqvow.supabase.co/functions/v1/alert-dispatcher',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization', 'Bearer d9ca447abad5db64269b401423a688b9ae42b9b978e1ac6a'
    )
  )$$
);
