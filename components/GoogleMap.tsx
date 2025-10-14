'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react';

// Leaflet type declaration
declare global {
  interface Window {
    L: any;
  }
}

interface GoogleMapProps {
  currentLang: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ currentLang, className = '' }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Ram Servis məlumatları
  const companyInfo = useMemo(() => ({
    name: 'Ram Servis Car Rental',
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Bakı şəhəri, Nəsimi rayonu, Azadlıq prospekti 123',
    lat: parseFloat(process.env.NEXT_PUBLIC_COMPANY_LAT || '40.4093'),
    lng: parseFloat(process.env.NEXT_PUBLIC_COMPANY_LNG || '49.8671'),
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+994707004444',
    hours: {
      az: '24/7 Açıq',
      en: '24/7 Open',
      ru: '24/7 Открыто',
      ar: '24/7 مفتوح'
    }
  }), []);

  const translations = {
    az: {
      title: 'Bizim Ünvanımız',
      subtitle: 'Bizi ziyarət edin və ya əlaqə saxlayın',
      address: 'Ünvan',
      phone: 'Telefon',
      hours: 'İş saatları',
      getDirections: 'Yol tarifi al',
      openInMaps: 'Xəritədə aç',
      mapError: 'Xəritə yüklənərkən xəta baş verdi',
      loading: 'Xəritə yüklənir...'
    },
    en: {
      title: 'Our Location',
      subtitle: 'Visit us or get in touch',
      address: 'Address',
      phone: 'Phone',
      hours: 'Working Hours',
      getDirections: 'Get Directions',
      openInMaps: 'Open in Maps',
      mapError: 'Error loading map',
      loading: 'Loading map...'
    },
    ru: {
      title: 'Наш Адрес',
      subtitle: 'Посетите нас или свяжитесь с нами',
      address: 'Адрес',
      phone: 'Телефон',
      hours: 'Рабочие часы',
      getDirections: 'Построить маршрут',
      openInMaps: 'Открыть в картах',
      mapError: 'Ошибка загрузки карты',
      loading: 'Загрузка карты...'
    },
    ar: {
      title: 'موقعنا',
      subtitle: 'قم بزيارتنا أو تواصل معنا',
      address: 'العنوان',
      phone: 'الهاتف',
      hours: 'ساعات العمل',
      getDirections: 'احصل على الاتجاهات',
      openInMaps: 'افتح في الخرائط',
      mapError: 'خطأ في تحميل الخريطة',
      loading: 'جاري تحميل الخريطة...'
    }
  };

  const t = translations[currentLang as keyof typeof translations] || translations.az;

  useEffect(() => {
    const loadLeafletMap = () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;

      script.onload = () => {
        initializeMap();
      };

      script.onerror = () => {
        setError('Xəritə yüklənərkən xəta baş verdi');
      };

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) {
        console.warn('Map initialization failed: missing mapRef or Leaflet');
        return;
      }
      
      console.log('Initializing map with coordinates:', companyInfo.lat, companyInfo.lng);

      try {
        // Initialize map with better options
        const map = window.L.map(mapRef.current, {
          center: [companyInfo.lat, companyInfo.lng],
          zoom: 16,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true,
          tap: true,
          maxZoom: 19,
          minZoom: 10
        });

        // Try multiple tile providers for better reliability
        const tileProviders = [
          {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            name: 'OpenStreetMap'
          },
          {
            url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attribution">CARTO</a>',
            name: 'CartoDB Light'
          },
          {
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attribution">CARTO</a>',
            name: 'CartoDB Light Alt'
          }
        ];

        let tileLayerAdded = false;
        let currentProviderIndex = 0;

        const addTileLayer = () => {
          if (tileLayerAdded || currentProviderIndex >= tileProviders.length) return;
          
          const provider = tileProviders[currentProviderIndex];
          console.log(`Trying tile provider: ${provider.name}`);
          
          const tileLayer = window.L.tileLayer(provider.url, {
            attribution: provider.attribution,
            maxZoom: 19,
            timeout: 10000, // 10 second timeout
            errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5Ij5UaWxlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='
          });

          tileLayer.on('tileerror', () => {
            console.warn(`Tile provider ${provider.name} failed, trying next...`);
            currentProviderIndex++;
            map.removeLayer(tileLayer);
            setTimeout(addTileLayer, 1000);
          });

          tileLayer.on('tileload', () => {
            if (!tileLayerAdded) {
              console.log(`Successfully loaded tiles from: ${provider.name}`);
              tileLayerAdded = true;
              // Set loaded state after first successful tile load
              setTimeout(() => setIsLoaded(true), 500);
            }
          });

          tileLayer.addTo(map);
        };

        addTileLayer();

        // Create custom marker icon
        const customIcon = window.L.divIcon({
          html: `
            <div style="
              width: 40px; 
              height: 40px; 
              background: #DC2626; 
              border: 3px solid white; 
              border-radius: 50% 50% 50% 0; 
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            ">
              <div style="
                color: white; 
                font-size: 16px; 
                transform: rotate(45deg);
                font-weight: bold;
              ">📍</div>
            </div>
          `,
          className: 'custom-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        });

        // Add marker
        const marker = window.L.marker([companyInfo.lat, companyInfo.lng], { 
          icon: customIcon 
        }).addTo(map);

        // Create popup content
        const popupContent = `
          <div style="padding: 10px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">
              ${companyInfo.name}
            </h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px; display: flex; align-items: center; gap: 4px;">
              📍 ${companyInfo.address}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px; display: flex; align-items: center; gap: 4px;">
              📞 <a href="tel:${companyInfo.phone}" style="color: #DC2626; text-decoration: none;">${companyInfo.phone}</a>
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px; display: flex; align-items: center; gap: 4px;">
              🕒 ${companyInfo.hours[currentLang as keyof typeof companyInfo.hours]}
            </p>
          </div>
        `;

        // Bind popup to marker
        marker.bindPopup(popupContent);

        // Auto-open popup after a delay
        setTimeout(() => {
          marker.openPopup();
        }, 1500);

        // Add a circle around the location for better visibility
        window.L.circle([companyInfo.lat, companyInfo.lng], {
          color: '#DC2626',
          fillColor: '#DC2626',
          fillOpacity: 0.1,
          radius: 200
        }).addTo(map);

        // Ensure map is properly sized
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Xəritə başlatılarkən xəta baş verdi');
      }
    };

    loadLeafletMap();
  }, [currentLang, companyInfo]);

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${companyInfo.lat},${companyInfo.lng}`;
    window.open(url, '_blank');
  };

  const handleOpenInMaps = () => {
    const url = `https://www.openstreetmap.org/?mlat=${companyInfo.lat}&mlon=${companyInfo.lng}&zoom=16`;
    window.open(url, '_blank');
  };

  const handleCallPhone = () => {
    window.open(`tel:${companyInfo.phone}`, '_self');
  };

  if (error) {
    return (
      <section className={`py-16 bg-white/70 dark:bg-[#1a1a1a]/70 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.mapError}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleGetDirections}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                {t.getDirections}
              </button>
              
              <button
                onClick={handleOpenInMaps}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                OpenStreetMap
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-white/70 dark:bg-[#1a1a1a]/70 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg p-6 h-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {companyInfo.name}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {t.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {companyInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {t.phone}
                    </p>
                    <button
                      onClick={handleCallPhone}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {companyInfo.phone}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {t.hours}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {companyInfo.hours[currentLang as keyof typeof companyInfo.hours]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleGetDirections}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  {t.getDirections}
                </button>
                
                <button
                  onClick={handleOpenInMaps}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  OpenStreetMap-də aç
                </button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden h-96 lg:h-full min-h-[400px]">
              {!isLoaded && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a]">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
                  </div>
                </div>
              )}
              <div
                ref={mapRef}
                className={`w-full h-full ${!isLoaded ? 'hidden' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleMap;