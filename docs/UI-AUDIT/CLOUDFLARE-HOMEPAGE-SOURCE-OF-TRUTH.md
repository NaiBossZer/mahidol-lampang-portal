# Cloudflare Preview Homepage — Source of Truth

The approved public homepage for Cloudflare Preview is the homepage composition currently represented by `src/pages/HomePage.tsx`, `src/components/layout/PublicAppShell.tsx`, and `src/components/layout/PublicHeader.tsx` on the `preview/visual-qa-homepage` branch.

Approved visual baseline: the Mahidol Social Engagement homepage shown in the Cloudflare Preview reference screenshot, including:

- dark navy public header with the Mahidol / ENVI / Social Engagement logos
- navigation: หน้าแรก, กิจกรรม, ศูนย์, แผนที่, ร้านค้า
- TH / EN toggle, cart, and login
- hero label `MAHIDOL SOCIAL ENGAGEMENT`
- heading `งานพันธกิจเพื่อสังคม จากองค์ความรู้สู่พื้นที่จริง`
- hero introduction video card
- `COMMUNITY & EDUCATION` latest activities section

This marker exists only to make the approved preview baseline explicit and to trigger a fresh branch deployment without changing the homepage UI itself.

Do not replace the public homepage with the alternative Local Wisdom / Future Learning composition unless separately approved.
