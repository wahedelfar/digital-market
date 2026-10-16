create or replace function public.get_checkout_status(p_sale_id uuid, p_token text)
returns table(sale_id uuid, status text, amount numeric, currency text, product_title text)
language sql security definer set search_path = public
as $$
  select s.id, s.status, s.amount, s.currency, p.title
  from public.sales s join public.products p on p.id=s.product_id
  join public.downloads d on d.sale_id=s.id
  where s.id=p_sale_id and d.token=p_token limit 1
$$;
revoke all on function public.get_checkout_status(uuid,text) from public;
grant execute on function public.get_checkout_status(uuid,text) to anon, authenticated;