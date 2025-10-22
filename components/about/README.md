# About Page Components

Bu folder "Haqqımızda" səhifəsi üçün komponentləri ehtiva edir.

## Komponentlər

### AboutHero.tsx
- Səhifənin əsas hero bölməsi
- Şirkət statistikaları ilə
- Animasiyalı dizayn

### AboutStory.tsx
- Şirkətin hekayəsi və tarixi
- Timeline formatında
- Missiya bəyanatı

### AboutStats.tsx
- Animasiyalı rəqəmlər
- Şirkət statistikaları
- Counter animasiyaları

### AboutValues.tsx
- Şirkət dəyərləri
- 6 əsas dəyər
- Hover effektləri

### AboutTeam.tsx
- Komanda üzvləri
- Əlaqə məlumatları
- Sosial media linkləri

### AboutCertificates.tsx
- Sertifikat və lisenziyalar
- Mükafatlar
- Güvən nişanları

## İstifadə

```tsx
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
// ... digər komponentlər

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutStats />
      <AboutValues />
      <AboutTeam />
      <AboutCertificates />
    </main>
  );
}
```

## Xüsusiyyətlər

- Tam responsive dizayn
- Dark mode dəstəyi
- Framer Motion animasiyaları
- Tailwind CSS stilləri
- TypeScript dəstəyi
- SEO optimizasiyası

## Qeydlər

- Şəkillər placeholder olaraq emoji ilə əvəz edilib
- Real şəkilləri `/public/images/` folderində yerləşdirin
- Komanda məlumatlarını real məlumatlarla əvəz edin
- Sertifikat məlumatlarını yeniləyin