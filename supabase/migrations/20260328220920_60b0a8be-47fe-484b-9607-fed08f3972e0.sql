-- Fix overly permissive INSERT policies
-- Orders: require email to be provided
drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders
  for insert with check (customer_email is not null and customer_email != '');

-- Sleep assessments: require session_id
drop policy if exists "assessments_insert" on public.sleep_assessments;
create policy "assessments_insert" on public.sleep_assessments
  for insert with check (session_id is not null);