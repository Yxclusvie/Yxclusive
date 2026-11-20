-- A single checkout session can now buy several pieces (cart), so the
-- session id is no longer unique on its own — one order row per piece.
alter table public.orders drop constraint orders_stripe_checkout_session_id_key;
alter table public.orders
  add constraint orders_session_product_key unique (stripe_checkout_session_id, product_id);
