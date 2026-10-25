# Backend — Cosmo School Banasree (WordPress ✅ running)

## WordPress (primary)
- Containers: `docker compose up -d` → WP `http://localhost:8080`, MySQL healthy
- Admin: `http://localhost:8080/wp-admin` (user `admin` — পাসওয়ার্ড চ্যাটে দেওয়া, লগইন করে বদলে নিন; API/seed-এর app password `.env.local`-এ)
- REST: `http://localhost:8080/wp-json/wp/v2/posts` (category `notice` = নোটিশ)
- GraphQL: `http://localhost:8080/graphql` (WPGraphQL active)
- Seed/re-seed demo content: `$env:WP_APP_PASSWORD="..."; node backend/seed.mjs`
- Custom types (`backend/cosmo-cms.php` mu-plugin, auto-active):
  - Teachers, Testimonials, Events, Site Options (+ `wp-graphql` exposed)
  - পেজ-ইনফো JSON ডক: `hero`, `fees`, `stats`, `daycarePlans`, `media`
- ছবি: সব সাইট-ছবি WP Media Library-তে আপলোড করা (`media` ডকে URL ম্যাপ);
  ফ্রন্টএন্ড `resolveImg()` দিয়ে WP ছবি নেয়, না পেলে origin fallback
- WP-তে বদলালে ৬০ সেকেন্ডে সাইটে প্রতিফলিত হয় (ISR + `wp-cms` tag)

## Elementor (visual page editor)
- Elementor **Free** installed + active. Pro **লাইসেন্স কী ছাড়া ইনস্টল করা যায় না**
  (my.elementor.com থেকে কিনে ZIP ডাউনলোড → WP Admin → Plugins → Add New → Upload)।
- ব্যবহার: WP Admin → Pages → "About Extended" → **Edit with Elementor** →
  drag-drop এডিট → Update। `/about` পেজের নিচে "Elementor দিয়ে এডিটেবল"
  সেকশনে সাথে সাথে দেখাবে (prose-styled)।
- Headless নোট: Elementor-এর লেআউট/স্টাইল WP-থিমের CSS চায়; তাই Elementor
  দিয়ে **কনটেন্ট** (টেক্সট/ছবি/ভিডিও) সাজান, সাইটের ডিজাইন Next.js-এই থাকবে।
- Pro কী পেলে জানান — Pro ইনস্টল + Form/Theme-Builder ওয়্যার করে দেবো।
- Plugin management: `docker run --rm --network cosmo_web_default -v cosmo_web_wp_data:/var/www/html wordpress:cli ...`
  (DB env: `WORDPRESS_DB_HOST=db:3306`, user/pass/db `wordpress`)
- Frontend reads WP first: `src/lib/cms.ts` (`WORDPRESS_REST_URL`), WP বন্ধ থাকলে `data/cms.json` fallback
- Publish webhook → `POST /api/revalidate?secret=...` body `{"tag":"wp-notices"}`

## Local file CMS (fallback, WP-REST shaped)
- Seed data: `data/cms.json` (নোটিশ + ইনকোয়ারি ইনবক্স), `data/site.json` (হিরো, ইভেন্ট, ফি, মতামত, ডে-কেয়ার প্ল্যান)
- Public API: `GET /api/cms/notices`, `GET /api/cms/site`
- Inquiry inbox: `POST /api/inquiry` → `data/cms.json`-এ সংরক্ষণ

## /admin — সাইট ম্যানেজার (কোড ছাড়াই সব বদলান)

- URL: `http://localhost:3000/admin`, কী: `ADMIN_KEY` (ডিফল্ট `cosmo123`, একবার দিলে মনে রাখে)
- /admin-এ সেভ করলে **WordPress-এও লেখা হয়** (write-through) — WP-ই মাস্টার কপি থাকে

## 🗺️ WP মেনু → সাইট ম্যাপ (সবকিছু WP থেকে বদলান)

| WP Admin মেনু | সাইটে কোথায় দেখায় |
|---|---|
| Posts (category: Notice) | /notices, হোম টিকার + নোটিশ বোর্ড |
| Pages → About Extended (Elementor) | /about-এর নিচের এডিটেবল সেকশন |
| Teachers | /teachers, /leadership |
| Testimonials | হোম মার্কি |
| Events | হোম ইভেন্ট |
| Programs | হোম প্রোগ্রাম কার্ড |
| Clubs | হোম ক্লাব রেইল |
| Gallery | /gallery, হোম + ডে-কেয়ার স্ট্রিপ |
| Media Library | সব ছবি (featured image বদলালেই সাইটে) |
| Site Options → hero/fees/stats/daycarePlans | হিরো, ফি টেবিল, কাউন্টার, প্ল্যান |
| Site Options → heroSlides | হোম হিরো স্লাইড (/admin → 🎞️ স্লাইড) |
| Site Options → daycareFull | ডে-কেয়ার রুটিন/নিরাপত্তা/মেনু/FAQ (/admin → 🧰) |
| Site Options → academics/results | একাডেমিক রুটিন, ফলাফলের সংখ্যা (/admin → 🧰) |
| Site Options → faqs/trustees/principal/contact | /admission FAQ, /leadership, /contact |
- 📢 নোটিশ: নতুন প্রকাশ + এডিট + মুছুন (সাথে সাথে /notices-এ)
- 📅 ইভেন্ট: যোগ/এডিট/মুছুন (হোমপেজে দেখায়)
- 🖼️ হিরো: ছবি স্লাইডার ↔ ভিডিও সুইচ + YouTube ID
- 💰 ফি: ভর্তি ফি ও মাসিক বেতন টেবিল এডিট (/admission-এ দেখায়)
- ⭐ মতামত: অভিভাবক উক্তি যোগ/মুছুন (হোম মার্কিতে দেখায়)
- 📥 ইনকোয়ারি: ভর্তি + ট্যুর ফর্মের সব আবেদন
- WP-এর নোটিশ বদলাতে: `http://localhost:8080/wp-admin` (Posts → edit)

## ⚠️ ডেভেলপার নিয়ম: JSON কখনো PowerShell দিয়ে এডিট নয়
- `data/*.json` শুধু node স্ক্রিপ্ট (`backend/*.mjs`) বা এডিটর দিয়ে বদলান।
  PowerShell 5.1-এর Get-Content BOM-ছাড়া UTF-8 বাংলাকে নষ্ট করে দেয়
  (এই কারণে একবার পুরো নোটিশ বোর্ড ভেঙেছিল — `backend/rebuild-cms.mjs` দিয়ে সারানো)।
- ইনবক্স খালি করতে: node এক-লাইনার ব্যবহার করুন, PowerShell ConvertTo-Json নয়।
