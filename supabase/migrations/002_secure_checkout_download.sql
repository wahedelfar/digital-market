create or replace function public.create_checkout_sale(p_product_id uuid, p_buyer_email text)
returns table(sale_id uuid, download_token text)
language plpgsql security definer set search_path = public, extensions
as $$
declare v_product public.products%rowtype; v_sale_id uuid; v_token text;
begin
  if p_buyer_email is null or length(trim(p_buyer_email)) < 5 or position('@' in p_buyer_email) < 2 then raise exception 'Valid buyer email required'; end if;
  select * into v_product from public.products where id=p_product_id and (is_published=true or published=true);
  if not found then raise exception 'Product not available'; end if;
  insert into public.sales(product_id,buyer_email,amount,currency,status,provider)
  values(v_product.id,lower(trim(p_buyer_email)),v_product.price,v_product.currency,'pending','paymob') returning id into v_sale_id;
  insert into public.downloads(sale_id,max_downloads,expires_at) values(v_sale_id,3,now()+interval '48 hours') returning token into v_token;
  return query select v_sale_id,v_token;
end $$;

create or replace function public.consume_download_token(p_token text)
returns table(file_path text, download_id uuid, download_count integer, max_downloads integer)
language plpgsql security definer set search_path = public, extensions
as $$
declare v_download public.downloads%rowtype; v_file_path text; v_status text;
begin
  select d.* into v_download from public.downloads d where d.token=p_token for update;
  if not found then raise exception using errcode='P0002', message='Download token not found'; end if;
  if v_download.expires_at<=now() then raise exception using errcode='P0001',message='Download token expired'; end if;
  if v_download.download_count>=v_download.max_downloads then raise exception using errcode='P0001',message='Download limit reached'; end if;
  select p.file_path,s.status into v_file_path,v_status from public.sales s join public.products p on p.id=s.product_id where s.id=v_download.sale_id;
  if v_status<>'paid' then raise exception using errcode='P0001',message='Payment not confirmed'; end if;
  update public.downloads d set download_count=d.download_count+1,last_downloaded_at=now() where d.id=v_download.id returning d.download_count into v_download.download_count;
  return query select v_file_path,v_download.id,v_download.download_count,v_download.max_downloads;
end $$;
revoke all on function public.create_checkout_sale(uuid,text) from public;
revoke all on function public.consume_download_token(text) from public;
grant execute on function public.create_checkout_sale(uuid,text) to anon,authenticated;
grant execute on function public.consume_download_token(text) to anon,authenticated;
