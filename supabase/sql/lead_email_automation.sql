create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

create or replace function public.enqueue_lead_email_automation()
returns trigger
language plpgsql
security definer
as $$
begin
  perform
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/lead-email-automation',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', to_jsonb(new)
      )
    );

  return new;
end;
$$;

drop trigger if exists lead_email_automation_after_insert on public.leads;
create trigger lead_email_automation_after_insert
after insert on public.leads
for each row
execute function public.enqueue_lead_email_automation();

select cron.unschedule('lead-email-reminders')
where exists (
  select 1
  from cron.job
  where jobname = 'lead-email-reminders'
);

select cron.schedule(
  'lead-email-reminders',
  '15 * * * *',
  $$
    select net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/lead-email-automation',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := '{"action":"scan-reminders"}'::jsonb
    );
  $$
);
