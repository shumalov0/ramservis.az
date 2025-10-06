# SEO Setup Guide - Deploy Sonrası

## 1. Google Search Console Quraşdırılması

### Addımlar:
1. [Google Search Console](https://search.google.com/search-console/) saytına daxil olun
2. "Add Property" düyməsini basın
3. "URL prefix" seçin və `https://www.ramservis.az` daxil edin
4. Verification üçün HTML tag metodunu seçin
5. Verilən meta tag-ı layout.tsx faylına əlavə edin

### Verification Tag Əlavə Etmək:
```tsx
// app/layout.tsx faylında <head> hissəsinə əlavə edin:
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

## 2. Google Analytics Quraşdırılması

### Google Analytics 4 (GA4) Setup:
1. [Google Analytics](https://analytics.google.com/) saytına daxil olun
2. Yeni property yaradın
3. Measurement ID alın (G-XXXXXXXXXX formatında)
4. Next.js layotuna əlavə edin

### Kod Əlavə Etmək:
```tsx
// app/layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `}
</Script>
```

## 3. Sitemap Submit Etmək

### Google Search Console-da:
1. Sol menyudan "Sitemaps" seçin
2. "Add a new sitemap" düyməsini basın
3. `sitemap.xml` yazın və "Submit" edin

## 4. Bing Webmaster Tools

1. [Bing Webmaster Tools](https://www.bing.com/webmasters/) saytına daxil olun
2. Saytınızı əlavə edin
3. Verification edin
4. Sitemap submit edin

## 5. Performance Monitoring

### Core Web Vitals Yoxlamaq:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

## 6. Local SEO (Yerli SEO)

### Google My Business:
1. [Google My Business](https://business.google.com/) hesabı yaradın
2. Ram Servis məlumatlarını əlavə edin
3. Ünvan, telefon, iş saatları daxil edin
4. Şəkillər əlavə edin

## 7. Social Media Integration

### Open Graph Image Yaratmaq:
- 1200x630 piksel ölçüsündə
- Brend logosu və mətn
- `/public/og-image.jpg` kimi yerləşdirin

## 8. SSL Certificate Yoxlamaq

### SSL Test:
- [SSL Labs](https://www.ssllabs.com/ssltest/) istifadə edin
- A+ rating almalısınız

## 9. Mobile-Friendly Test

### Google Mobile Test:
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- Saytınızı test edin

## 10. Schema Markup Yoxlamaq

### Rich Results Test:
- [Rich Results Test](https://search.google.com/test/rich-results)
- JSON-LD strukturunuzu yoxlayın