insert into public.products (slug, lot, name, maker, category, era, condition, price, est_retail, likes, description, provenance) values
('slouch-hobo-noir', '0114', 'Slouch Hobo, Noir', 'Maison Vevette', 'Bags', 'Late 1990s', 'Excellent', 2850, 3475, 6, 'Unstructured black leather, soft enough to fold flat, holds its slouch by weight alone. No hardware to date it — this shape never really left.', 'Acquired from an estate collection, Zurich. Full authentication report on file.'),
('skeleton-automatic-steel', '0219', 'Skeleton Automatic, Steel', 'Rousset & Fils', 'Timepieces', '1988', 'Very Good', 7400, 9490, 4, 'Open-worked dial, movement visible under the crystal. Serviced eleven months ago; runs within four seconds a day.', 'Consigned by a private collector in Geneva. Original papers included.'),
('dress-watch-gold-bracelet', '0087', 'Dress Watch, Gold Bracelet', 'Hallworth', 'Timepieces', '1970s', 'Excellent', 5400, 6350, 24, '18k gold case and integrated bracelet, hand-wound. The kind of quiet piece that reads louder than it looks.', 'Sourced through a specialist dealer in London.'),
('woven-tote-cognac', '0302', 'Woven Tote, Cognac', 'Adler & Boon', 'Bags', 'Early 2010s', 'Brand New', 2650, 3010, 11, 'Hand-woven intrecciato leather in a cognac that only deepens with age. Interior is unmarked; weave shows no wear.', 'Single owner, smoke-free home. Dust bag and authentication card included.'),
('crocodile-embossed-bag-rouge', '0455', 'Crocodile-Embossed Bag, Rouge', 'Maison Vevette', 'Bags', '2016', 'Excellent', 3100, 3875, 18, 'Embossed leather in a rouge that has not faded, brass turn-lock closure. Carried soft, kept careful.', 'Purchased new, worn twice, consigned by the original buyer.'),
('leather-derby-oxblood', '0176', 'Leather Derby, Oxblood', 'Corwin Bootmakers', 'Footwear', '2019', 'Very Good', 480, 533, 3, 'Goodyear-welted, resoled once by the maker. Broken in, not broken down — the leather has the give of a shoe that fit its first owner well.', 'Consigned directly by original owner with receipt.'),
('weekend-satchel-espresso', '0398', 'Weekend Satchel, Espresso', 'Adler & Boon', 'Bags', '2015', 'Very Good', 1890, 2198, 9, 'Saddle leather with buckles gone soft at the edges. Honest wear on the base, nothing structural.', 'Estate consignment, documented chain of ownership.'),
('field-chronograph-two-tone', '0061', 'Field Chronograph, Two-Tone', 'Rousset & Fils', 'Timepieces', '1995', 'Excellent', 6700, 8272, 15, 'Steel and rose gold, navy sunburst dial, automatic movement. Bracelet has been sized once by a professional.', 'Purchased from Rousset & Fils boutique, original owner traceable.'),
('diamond-solitaire-pave-band', '0510', 'Diamond Solitaire, Pavé Band', 'Solenne', 'Jewelry', '2000s', 'Brand New', 6950, 7554, 27, 'Emerald-cut center stone, pavé shoulders, hallmarked. Recently cleaned and inspected by our jeweler — every stone accounted for.', 'Private consignment, gemological report available on request.'),
('drop-earrings-champagne-pave', '0443', 'Drop Earrings, Champagne Pavé', 'Solenne', 'Jewelry', '1960s', 'Excellent', 2200, 2619, 7, 'Champagne pavé drops in yellow gold settings, original clip backs converted to posts by a jeweler on request.', 'Sourced from a family estate, three generations of ownership documented.'),
('aviator-tortoise-acetate', '0027', 'Aviator, Tortoise Acetate', 'Lindqvist Opticians', 'Eyewear', '2018', 'Very Good', 310, 397, 5, 'Hand-polished tortoise acetate, minor wear at the temple tips. Lenses replaced with fresh glass.', 'Consigned with original case.'),
('round-sun-gold-wire', '0289', 'Round Sun, Gold Wire', 'Lindqvist Opticians', 'Eyewear', '1970s', 'Excellent', 265, 319, 2, 'Thin gold wire frame, a shape that has never really gone out of circulation.', 'Purchased from a specialist vintage optician in Paris.'),
('ankle-strap-heel-noir', '0333', 'Ankle-Strap Heel, Noir', 'Corwin Bootmakers', 'Footwear', '2020', 'Brand New', 540, 593, 8, 'Suede, worn once for an evening. Soles show only the faintest mark of the floor they touched.', 'Original owner, box and dust bag included.'),
('pearl-beaded-clutch', '0018', 'Pearl-Beaded Clutch', 'Maison Vevette', 'Bags', '1980s', 'Very Good', 1650, 2089, 13, 'Hand-strung pearl beading over a soft frame, clasp still snaps true. A piece built for a single evening at a time.', 'Estate sale, Milan. Restored clasp by our in-house atelier.'),
('dive-watch-black-bezel', '0472', 'Dive Watch, Black Bezel', 'Hallworth', 'Timepieces', '2005', 'Excellent', 3800, 4368, 19, 'Ceramic bezel, automatic movement, pressure-tested to spec by our watchmaker before listing.', 'Consigned by a private collector with full service history.'),
('signet-ring-carved', '0501', 'Signet Ring, Hand-Carved', 'Solenne', 'Jewelry', '1950s', 'Excellent', 1450, 1629, 10, 'Solid gold, hand-engraved crest, sized once. The kind of wear that only comes from being worn daily for decades.', 'Family estate, provenance letter included.'),
('trench-coat-camel', '0142', 'Trench Coat, Camel', 'Fenwick & Vale', 'Ready to Wear', '2018', 'Excellent', 890, 1150, 14, 'Double-breasted wool-blend trench in camel, belt intact. Collar shows the faint shape of a lifetime of upturns.', 'Consigned by original owner, dry-cleaned and pressed before listing.'),
('silk-wrap-dress-rouge', '0359', 'Silk Wrap Dress, Rouge', 'Fenwick & Vale', 'Ready to Wear', '2020', 'Very Good', 420, 610, 9, 'Pure silk wrap in a deep rouge, tie waist. Worn for an evening, stored flat since — no pulls or fading.', 'Single owner, smoke-free home. Garment bag included.');

insert into public.product_images (product_id, url, aspect, position)
select id, data.url, data.aspect, 0
from public.products
join (values
  ('slouch-hobo-noir', 'https://images.unsplash.com/photo-1758542988969-39a10168b2ce?q=80&w=1200&auto=format&fit=crop', 0.75),
  ('skeleton-automatic-steel', 'https://images.unsplash.com/photo-1729078946289-92397e8d0b58?q=80&w=1200&auto=format&fit=crop', 1.5),
  ('dress-watch-gold-bracelet', 'https://images.unsplash.com/photo-1541778480-fc1752bbc2a9?q=80&w=1200&auto=format&fit=crop', 1.72),
  ('woven-tote-cognac', 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1200&auto=format&fit=crop', 0.8),
  ('crocodile-embossed-bag-rouge', 'https://images.unsplash.com/photo-1575032617751-6ddec2089882?q=80&w=1200&auto=format&fit=crop', 0.8),
  ('leather-derby-oxblood', 'https://images.unsplash.com/photo-1641893843833-a006778dc00b?q=80&w=1200&auto=format&fit=crop', 1.46),
  ('weekend-satchel-espresso', 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?q=80&w=1200&auto=format&fit=crop', 1.68),
  ('field-chronograph-two-tone', 'https://images.unsplash.com/photo-1623998021661-dc7555b2213d?q=80&w=1200&auto=format&fit=crop', 1.51),
  ('diamond-solitaire-pave-band', 'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?q=80&w=1200&auto=format&fit=crop', 1.0),
  ('drop-earrings-champagne-pave', 'https://images.unsplash.com/photo-1705326454933-9685fc6888e1?q=80&w=1200&auto=format&fit=crop', 0.67),
  ('aviator-tortoise-acetate', 'https://images.unsplash.com/photo-1759227922040-0ca4d3cbe42e?q=80&w=1200&auto=format&fit=crop', 0.75),
  ('round-sun-gold-wire', 'https://images.unsplash.com/photo-1590564310418-66304f55a2c2?q=80&w=1200&auto=format&fit=crop', 1.5),
  ('ankle-strap-heel-noir', 'https://images.unsplash.com/photo-1659261448687-6d01466e06e4?q=80&w=1200&auto=format&fit=crop', 1.5),
  ('pearl-beaded-clutch', 'https://images.unsplash.com/photo-1722510825571-8cdd1fe98ba4?q=80&w=1200&auto=format&fit=crop', 0.75),
  ('dive-watch-black-bezel', 'https://images.unsplash.com/photo-1774299398828-8dc74e92e53c?q=80&w=1200&auto=format&fit=crop', 1.5),
  ('signet-ring-carved', 'https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?q=80&w=1200&auto=format&fit=crop', 1.5),
  ('trench-coat-camel', 'https://images.unsplash.com/photo-1601571218346-195a052bd80e?q=80&w=1200&auto=format&fit=crop', 0.67),
  ('silk-wrap-dress-rouge', 'https://images.unsplash.com/photo-1652445830470-9852667150b0?q=80&w=1200&auto=format&fit=crop', 0.67)
) as data(slug, url, aspect) on data.slug = products.slug;
