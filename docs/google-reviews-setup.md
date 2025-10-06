# Google Reviews API Setup

Bu sənəd Google Places API-dən gerçək müştəri yorumlarını çəkmək üçün lazım olan konfiqurasiya addımlarını izah edir.

## 1. Google Cloud Console Setup

### Addım 1: Google Cloud Project yaradın
1. [Google Cloud Console](https://console.cloud.google.com/)-a daxil olun
2. Yeni project yaradın və ya mövcud project seçin
3. Project ID-ni qeyd edin

### Addım 2: Places API-ni aktiv edin
1. Google Cloud Console-da "APIs & Services" > "Library" bölməsinə gedin
2. "Places API" axtarın və aktiv edin
3. "Places API (New)" də aktiv edin (daha yaxşı performans üçün)

### Addım 3: API Key yaradın
1. "APIs & Services" > "Credentials" bölməsinə gedin
2. "Create Credentials" > "API Key" seçin
3. API Key-i kopyalayın və təhlükəsiz yerdə saxlayın

### Addım 4: API Key-i məhdudlaşdırın (Təhlükəsizlik üçün)
1. Yaradılmış API Key-ə klikləyin
2. "Application restrictions" bölməsində:
   - "HTTP referrers (web sites)" seçin
   - Domain-inizi əlavə edin (məs: `https://ramservis.az/*`)
3. "API restrictions" bölməsində:
   - "Restrict key" seçin
   - "Places API" seçin

## 2. Google My Business API Setup (Əsas - Bütün Yorumlar)

### Addım 1: Google My Business API-ni aktiv edin
1. Google Cloud Console-da "APIs & Services" > "Library" bölməsinə gedin
2. "Google My Business API" axtarın və aktiv edin
3. OAuth 2.0 credentials yaradın (API Key kifayət etmir)

### Addım 2: Account ID və Location ID tapın
1. [Google My Business](https://business.google.com/) hesabınıza daxil olun
2. Biznesinizi seçin
3. URL-də Account ID və Location ID-ni tapın:
   - URL formatı: `https://business.google.com/dashboard/l/{LOCATION_ID}`
4. Və ya Google My Business API-dən çəkin:
   ```
   GET https://mybusiness.googleapis.com/v4/accounts
   GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations
   ```

## 3. Google Places API Setup (Fallback - Maksimum 5 Yorumlar)

### Place ID tapın
1. [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) açın
2. Biznesinizin adını və ünvanını daxil edin
3. Place ID-ni kopyalayın

## 4. Environment Variables konfiqurasiyası

`.env.local` faylınızda aşağıdakı dəyişənləri əlavə edin:

```env
# Google Places API (Fallback - maksimum 5 yorumlar)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_GOOGLE_PLACE_ID=your_actual_place_id_here

# Google My Business API (Əsas - bütün yorumlar)
NEXT_PUBLIC_GOOGLE_ACCOUNT_ID=your_google_account_id_here
NEXT_PUBLIC_GOOGLE_LOCATION_ID=your_google_location_id_here
```

**Diqqət:** 
- Gerçək dəyərləri əlavə etməyi unutmayın!
- My Business API üçün OAuth 2.0 token lazımdır
- Places API sadə API Key ilə işləyir

## 5. Test edin

1. Saytınızı yenidən başladın: `npm run dev`
2. Ana səhifəyə gedin və "Müştəri Rəyləri" bölməsini yoxlayın
3. "Yenilə" düyməsi ilə yorumları yeniləyə bilərsiniz
4. Browser Developer Tools-da console-u yoxlayın

## 6. Troubleshooting

### API Key işləmir
- API Key-in düzgün kopyalandığını yoxlayın
- Domain məhdudiyyətlərini yoxlayın
- Places API-nin aktiv olduğunu təsdiq edin

### Place ID tapılmır
- Place ID-nin düzgün olduğunu yoxlayın
- Google My Business hesabınızın aktiv olduğunu təsdiq edin

### Yorumlar göstərilmir
- Browser console-da xəta mesajlarını yoxlayın
- Network tab-da API sorğularını yoxlayın
- Cache-i təmizləyin (localStorage)

## 7. Xüsusiyyətlər

### Avtomatik Cache
- Yorumlar 1 saat müddətində cache-də saxlanır
- Manuel yeniləmə ilə cache-i yeniləyə bilərsiniz

### Fallback Sistemi
- Google API xətası olduqda lokal məlumatlar göstərilir
- İstifadəçi təcrübəsi kəsilmir

### Filtrlər
- Minimum rating filtri (default: 4+ ulduz)
- Dil filtri (Azərbaycan dili prioritet)
- Maksimum yorumlar sayı

### Responsive Tasarım
- Mobile və desktop üçün optimize
- Modern carousel dizaynı
- Smooth animasiyalar

## 8. Məhdudiyyətlər

### Google Places API Limits
- Günlük: 100,000 sorğu (pulsuz)
- Dəqiqəlik: 100 sorğu
- Daha çox lazım olarsa, ödənişli plana keçin

### Yorumlar Sayı
- Google API maksimum 5 yorumu qaytarır
- Daha çox yorumlar üçün Google My Business API istifadə edin

## 9. Qiymətləndirmə

### Pulsuz Tier
- Ayda 100,000 sorğu pulsuz
- Kiçik və orta bizneslər üçün kifayətdir

### Ödənişli Tier
- $17 per 1000 sorğu (100,000-dən sonra)
- Böyük saytlar üçün

## 10. Təhlükəsizlik

### API Key Təhlükəsizliyi
- API Key-i heç vaxt public repository-də paylaşmayın
- Domain məhdudiyyətləri qoyun
- Müntəzəm olaraq API Key-i yeniləyin

### Rate Limiting
- Çox tez-tez sorğu göndərməyin
- Cache sistemindən istifadə edin
- Error handling əlavə edin

## 11. Monitoring

### Google Cloud Console
- API istifadəsini izləyin
- Xəta statistikalarını yoxlayın
- Billing-i nəzarət edin

### Application Logs
- Browser console-da xətaları izləyin
- Network requests-i monitor edin
- Performance metrics-i yoxlayın