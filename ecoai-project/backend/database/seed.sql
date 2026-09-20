-- Sample zones (Sri Lanka tea-country + Amazon + Kenya highlands + Sumatra)
insert into public.zones (name, region, country, center_lat, center_lng, radius_meters, ndvi_baseline, ndvi_current, confidence_score, land_use, rainfall, radar_confirm)
values
  ('Nuwara Eliya Ridge',    'Central Province', 'LK', 6.9497,  80.7891, 800, 0.72, 0.61, 7, 'forest',   'normal', true),
  ('Amazon Basin Alpha',    'Pará',             'BR', -3.4653, -62.2159, 1500, 0.81, 0.68, 8, 'forest',   'normal', true),
  ('Mau Forest Edge',       'Rift Valley',      'KE', -0.2000,  35.5000, 1200, 0.66, 0.58, 6, 'forest',   'normal', false),
  ('Sumatra Peat Guard',    'Riau',             'ID', 0.5897,  101.3431, 1000, 0.74, 0.64, 7, 'forest',   'normal', true),
  ('Western Ghats Restore', 'Karnataka',        'IN', 13.3409,  74.7421,  900, 0.69, 0.60, 6, 'forest',   'normal', true);
