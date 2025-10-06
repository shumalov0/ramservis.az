export interface Translation {
  // Navigation
  cars: string;
  services?: string;
  about: string;
  contact: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  flexibleBooking: string;
  flexibleBookingDesc: string;
  varietyChoice: string;
  varietyChoiceDesc: string;
  deliveryService: string;
  deliveryServiceDesc: string;
  
  // Cars Section
  ourFleet: string;
  perDay: string;
  viewDetails: string;
  year: string;
  seats: string;
  fuel: string;
  transmission: string;
  
  // Footer
  footerDesc: string;
  contactInfo: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  mondayFriday: string;
  saturday: string;
  sunday: string;
  allRightsReserved: string;
  
  // Car Details
  carNotFound: string;
  backToHome: string;
  features: string;
  priceInfo: string;
  dailyPrice: string;
  weeklyPrice: string;
  monthlyPrice: string;
  deposit: string;
  rentalRules: string;
  minimumAge: string;
  drivingExperience: string;
  passportRequired: string;
  licenseRequired: string;
  yes: string;
  no: string;
  required: string;
  notRequired: string;
  contactOptions: string;
  whatsappContact: string;
  phoneCall: string;
  onlineBooking: string;
  
  // Booking Modal
  onlineReservation: string;
  personalInfo: string;
  firstName: string;
  lastName: string;
  rentalDetails: string;
  pickupDate: string;
  dropoffDate: string;
  minimumRentalPeriod: string;
  selectedPeriod: string;
  days: string;
  pickupLocation: string;
  dropoffLocation: string;
  selectLocation: string;
  additionalServices: string;
  personalDriver: string;
  personalDriverDesc: string;
  childSeat: string;
  childSeatDesc: string;
  gpsNavigation: string;
  gpsNavigationDesc: string;
  fullInsurance: string;
  fullInsuranceDesc: string;
  paymentMethod: string;
  cashPayment: string;
  onlinePayment: string;
  cardCommission: string;
  cardCommissionWarning: string;
  priceSummary: string;
  rentalPeriod: string;
  basePrice: string;
  locationChanges: string;
  additionalServicesPrice: string;
  totalAmount: string;
  cancel: string;
  makeReservation: string;
  
  // Locations
  officePickup: string;
  airport: string;
  cityCenter: string;
  hotel: string;
  railwayStation: string;
  
  // Car Classes
  economy: string;
  business: string;
  premium: string;
  luxury: string;
  comfort: string;
  suv: string;
  
  // Fuel Types
  gasoline: string;
  diesel: string;
  hybrid: string;
  
  // Transmission
  automatic: string;
  manual: string;
  
  // Common
  person: string;
  people: string;
  
  // Enhanced Car Detail Page
  availability: string;
  available: string;
  unavailable: string;
  specifications: string;
  overview: string;
  specs: string;
  rules: string;
  similarCars: string;
  customerReviews: string;
  shareThisCar: string;
  addToFavorites: string;
  removeFromFavorites: string;
  viewFullscreen: string;
  previousImage: string;
  nextImage: string;
  imageGallery: string;
  loading: string;
  errorLoadingImage: string;
  retryLoading: string;
}

export const translations: Record<string, Translation> = {
  az: {
    // Navigation
    cars: 'Maşınlar',
    services: 'Xidmətlər',
    about: 'Haqqımızda',
    contact: 'Əlaqə',
    
    // Hero Section
    heroTitle: 'Keyfiyyətli Maşın İcarəsi',
    heroSubtitle: 'Geniş maşın parkımızdan istədiyiniz nəqliyyat vasitəsini seçin və rahat səyahət edin. Peşəkar xidmət və əlverişli qiymətlərlə sizə xidmət edirik.',
    flexibleBooking: 'Çevik Rezervasiya',
    flexibleBookingDesc: 'Online və ya telefon vasitəsilə asan rezervasiya',
    varietyChoice: 'Müxtəlif Seçim',
    varietyChoiceDesc: 'Ekonom sinifdən biznes sinifə qədər',
    deliveryService: 'Çatdırılma Xidməti',
    deliveryServiceDesc: 'İstədiyiniz yerə maşını çatdırırıq',
    
    // Cars Section
    ourFleet: 'Bizim Maşın Parkı',
    perDay: '/gün',
    viewDetails: 'Ətraflı Bax',
    year: '',
    seats: 'nəfər',
    fuel: '',
    transmission: '',
    
    // Footer
    footerDesc: 'Peşəkar maşın icarəsi xidməti ilə sizin səyahətinizi rahat və təhlükəsiz edirik.',
    contactInfo: 'Əlaqə',
    phone: 'Telefon',
    email: 'Email',
    address: 'Ünvan',
    workingHours: 'İş Saatları',
    mondayFriday: 'Bazar ertəsi - Cümə: 09:00 - 18:00',
    saturday: 'Şənbə: 09:00 - 16:00',
    sunday: 'Bazar: Bağlı',
    allRightsReserved: 'Bütün hüquqlar qorunur.',
    
    // Car Details
    carNotFound: 'Maşın tapılmadı',
    backToHome: 'Ana səhifəyə qayıt',
    features: 'Xüsusiyyətlər',
    priceInfo: 'Qiymət Məlumatları',
    dailyPrice: 'Günlük qiymət',
    weeklyPrice: 'Həftəlik qiymət',
    monthlyPrice: 'Aylıq qiymət',
    deposit: 'Depozit',
    rentalRules: 'Kirayə Qaydaları',
    minimumAge: 'Minimum yaş',
    drivingExperience: 'Sürücülük təcrübəsi',
    passportRequired: 'Pasport tələbi',
    licenseRequired: 'Sürücülük vəsiqəsi',
    yes: 'Bəli',
    no: 'Xeyr',
    required: 'Tələb olunur',
    notRequired: 'Tələb olunmur',
    contactOptions: 'Əlaqə Vasitələri',
    whatsappContact: 'WhatsApp ilə Əlaqə',
    phoneCall: 'Telefon Zəngi',
    onlineBooking: 'Online Rezervasiya',
    
    // Booking Modal
    onlineReservation: 'Online Rezervasiya',
    personalInfo: 'Şəxsi Məlumatlar',
    firstName: 'Ad',
    lastName: 'Soyad',
    rentalDetails: 'Kirayə Detalları',
    pickupDate: 'Götürülmə Tarixi',
    dropoffDate: 'Qaytarılma Tarixi',
    minimumRentalPeriod: 'Minimum kirayə müddəti 2 gündür. Seçdiyiniz müddət',
    selectedPeriod: 'gün',
    days: 'gün',
    pickupLocation: 'Götürülmə Yeri',
    dropoffLocation: 'Qaytarılma Yeri',
    selectLocation: 'Yer seçin',
    additionalServices: 'Əlavə Xidmətlər',
    personalDriver: 'Şəxsi Sürücü',
    personalDriverDesc: 'Təcrübəli sürücü ilə rahat səyahət',
    childSeat: 'Uşaq Oturacağı',
    childSeatDesc: '0-12 yaş arası uşaqlar üçün təhlükəsiz oturacaq',
    gpsNavigation: 'GPS Naviqasiya',
    gpsNavigationDesc: 'Peşəkar GPS cihazı',
    fullInsurance: 'Tam Sığorta',
    fullInsuranceDesc: 'Genişləndirilmiş sığorta təminatı',
    paymentMethod: 'Ödəniş Üsulu',
    cashPayment: 'Nağd Ödəniş',
    onlinePayment: 'Online Ödəniş (Kart)',
    cardCommission: 'Kart komissiyası',
    cardCommissionWarning: 'Kartla ödənişdə 18% ƏDV + 18% kart komissiyası tətbiq olunur',
    priceSummary: 'Qiymət Xülasəsi',
    rentalPeriod: 'Kirayə müddəti',
    basePrice: 'Əsas qiymət',
    locationChanges: 'Yer dəyişikliyi',
    additionalServicesPrice: 'Əlavə xidmətlər',
    totalAmount: 'Ümumi məbləğ',
    cancel: 'Ləğv Et',
    makeReservation: 'Rezervasiya Et',
    
    // Locations
    officePickup: 'Ofisimizdən götürülmə',
    airport: 'Heydər Əliyev Hava Limanı',
    cityCenter: 'Şəhər Mərkəzi',
    hotel: 'Otel/Yaşayış yeri',
    railwayStation: 'Dəmir yolu vağzalı',
    
    // Car Classes
    economy: 'Ekonom',
    business: 'Biznes',
    premium: 'Premium',
    luxury: 'Lüks',
    comfort: 'Komfort',
    suv: 'SUV',
    
    // Fuel Types
    gasoline: 'Benzin',
    diesel: 'Dizel',
    hybrid: 'Hibrid',
    
    // Transmission
    automatic: 'Avtomat',
    manual: 'Mexanika',
    
    // Common
    person: 'nəfər',
    people: 'nəfər',
    
    // Enhanced Car Detail Page
    availability: 'Mövcudluq',
    available: 'Mövcuddur',
    unavailable: 'Mövcud deyil',
    specifications: 'Texniki xüsusiyyətlər',
    overview: 'Ümumi məlumat',
    specs: 'Texniki',
    rules: 'Qaydalar',
    similarCars: 'Oxşar maşınlar',
    customerReviews: 'Müştəri rəyləri',
    shareThisCar: 'Bu maşını paylaş',
    addToFavorites: 'Sevimlilərə əlavə et',
    removeFromFavorites: 'Sevimlilərdən sil',
    viewFullscreen: 'Tam ekranda bax',
    previousImage: 'Əvvəlki şəkil',
    nextImage: 'Növbəti şəkil',
    imageGallery: 'Şəkil qalereyası',
    loading: 'Yüklənir...',
    errorLoadingImage: 'Şəkil yüklənmədi',
    retryLoading: 'Yenidən cəhd et',
  },
  
  en: {
    // Navigation
    cars: 'Cars',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Quality Car Rental',
    heroSubtitle: 'Choose your preferred vehicle from our extensive fleet and travel comfortably. We serve you with professional service and affordable prices.',
    flexibleBooking: 'Flexible Booking',
    flexibleBookingDesc: 'Easy reservation online or by phone',
    varietyChoice: 'Variety of Choice',
    varietyChoiceDesc: 'From economy class to business class',
    deliveryService: 'Delivery Service',
    deliveryServiceDesc: 'We deliver the car to your desired location',
    
    // Cars Section
    ourFleet: 'Our Car Fleet',
    perDay: '/day',
    viewDetails: 'View Details',
    year: '',
    seats: 'seats',
    fuel: '',
    transmission: '',
    
    // Footer
    footerDesc: 'We make your travel comfortable and safe with professional car rental service.',
    contactInfo: 'Contact',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    workingHours: 'Working Hours',
    mondayFriday: 'Monday - Friday: 09:00 - 18:00',
    saturday: 'Saturday: 09:00 - 16:00',
    sunday: 'Sunday: Closed',
    allRightsReserved: 'All rights reserved.',
    
    // Car Details
    carNotFound: 'Car not found',
    backToHome: 'Back to Home',
    features: 'Features',
    priceInfo: 'Price Information',
    dailyPrice: 'Daily price',
    weeklyPrice: 'Weekly price',
    monthlyPrice: 'Monthly price',
    deposit: 'Deposit',
    rentalRules: 'Rental Rules',
    minimumAge: 'Minimum age',
    drivingExperience: 'Driving experience',
    passportRequired: 'Passport required',
    licenseRequired: 'Driving license',
    yes: 'Yes',
    no: 'No',
    required: 'Required',
    notRequired: 'Not required',
    contactOptions: 'Contact Options',
    whatsappContact: 'WhatsApp Contact',
    phoneCall: 'Phone Call',
    onlineBooking: 'Online Booking',
    
    // Booking Modal
    onlineReservation: 'Online Reservation',
    personalInfo: 'Personal Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    rentalDetails: 'Rental Details',
    pickupDate: 'Pickup Date',
    dropoffDate: 'Drop-off Date',
    minimumRentalPeriod: 'Minimum rental period is 2 days. Selected period',
    selectedPeriod: 'days',
    days: 'days',
    pickupLocation: 'Pickup Location',
    dropoffLocation: 'Drop-off Location',
    selectLocation: 'Select location',
    additionalServices: 'Additional Services',
    personalDriver: 'Personal Driver',
    personalDriverDesc: 'Comfortable travel with experienced driver',
    childSeat: 'Child Seat',
    childSeatDesc: 'Safe seat for children aged 0-12',
    gpsNavigation: 'GPS Navigation',
    gpsNavigationDesc: 'Professional GPS device',
    fullInsurance: 'Full Insurance',
    fullInsuranceDesc: 'Extended insurance coverage',
    paymentMethod: 'Payment Method',
    cashPayment: 'Cash Payment',
    onlinePayment: 'Online Payment (Card)',
    cardCommission: 'Card commission',
    cardCommissionWarning: '18% VAT + 18% card commission applies for card payments',
    priceSummary: 'Price Summary',
    rentalPeriod: 'Rental period',
    basePrice: 'Base price',
    locationChanges: 'Location changes',
    additionalServicesPrice: 'Additional services',
    totalAmount: 'Total amount',
    cancel: 'Cancel',
    makeReservation: 'Make Reservation',
    
    // Locations
    officePickup: 'Office pickup',
    airport: 'Heydar Aliyev Airport',
    cityCenter: 'City Center',
    hotel: 'Hotel/Residence',
    railwayStation: 'Railway Station',
    
    // Car Classes
    economy: 'Economy',
    business: 'Business',
    premium: 'Premium',
    luxury: 'Luxury',
    comfort: 'Comfort',
    suv: 'SUV',
    
    // Fuel Types
    gasoline: 'Gasoline',
    diesel: 'Diesel',
    hybrid: 'Hybrid',
    
    // Transmission
    automatic: 'Automatic',
    manual: 'Manual',
    
    // Common
    person: 'person',
    people: 'people',
    
    // Enhanced Car Detail Page
    availability: 'Availability',
    available: 'Available',
    unavailable: 'Unavailable',
    specifications: 'Specifications',
    overview: 'Overview',
    specs: 'Specs',
    rules: 'Rules',
    similarCars: 'Similar Cars',
    customerReviews: 'Customer Reviews',
    shareThisCar: 'Share this car',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    viewFullscreen: 'View fullscreen',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    imageGallery: 'Image gallery',
    loading: 'Loading...',
    errorLoadingImage: 'Failed to load image',
    retryLoading: 'Retry loading',
  },
  
  ru: {
    // Navigation
    cars: 'Автомобили',
    services: 'Услуги',
    about: 'О нас',
    contact: 'Контакты',
    
    // Hero Section
    heroTitle: 'Качественная Аренда Автомобилей',
    heroSubtitle: 'Выберите подходящий автомобиль из нашего обширного парка и путешествуйте с комфортом. Мы обслуживаем вас профессиональным сервисом и доступными ценами.',
    flexibleBooking: 'Гибкое Бронирование',
    flexibleBookingDesc: 'Легкое бронирование онлайн или по телефону',
    varietyChoice: 'Разнообразный Выбор',
    varietyChoiceDesc: 'От эконом класса до бизнес класса',
    deliveryService: 'Служба Доставки',
    deliveryServiceDesc: 'Доставляем автомобиль в нужное место',
    
    // Cars Section
    ourFleet: 'Наш Автопарк',
    perDay: '/день',
    viewDetails: 'Подробнее',
    year: '',
    seats: 'мест',
    fuel: '',
    transmission: '',
    
    // Footer
    footerDesc: 'Делаем ваше путешествие комфортным и безопасным с профессиональным сервисом аренды автомобилей.',
    contactInfo: 'Контакты',
    phone: 'Телефон',
    email: 'Email',
    address: 'Адрес',
    workingHours: 'Рабочие Часы',
    mondayFriday: 'Понедельник - Пятница: 09:00 - 18:00',
    saturday: 'Суббота: 09:00 - 16:00',
    sunday: 'Воскресенье: Закрыто',
    allRightsReserved: 'Все права защищены.',
    
    // Car Details
    carNotFound: 'Автомобиль не найден',
    backToHome: 'На главную',
    features: 'Особенности',
    priceInfo: 'Информация о Ценах',
    dailyPrice: 'Дневная цена',
    weeklyPrice: 'Недельная цена',
    monthlyPrice: 'Месячная цена',
    deposit: 'Депозит',
    rentalRules: 'Правила Аренды',
    minimumAge: 'Минимальный возраст',
    drivingExperience: 'Водительский стаж',
    passportRequired: 'Требуется паспорт',
    licenseRequired: 'Водительские права',
    yes: 'Да',
    no: 'Нет',
    required: 'Требуется',
    notRequired: 'Не требуется',
    contactOptions: 'Варианты Связи',
    whatsappContact: 'Связь через WhatsApp',
    phoneCall: 'Телефонный Звонок',
    onlineBooking: 'Онлайн Бронирование',
    
    // Booking Modal
    onlineReservation: 'Онлайн Бронирование',
    personalInfo: 'Личная Информация',
    firstName: 'Имя',
    lastName: 'Фамилия',
    rentalDetails: 'Детали Аренды',
    pickupDate: 'Дата Получения',
    dropoffDate: 'Дата Возврата',
    minimumRentalPeriod: 'Минимальный период аренды 2 дня. Выбранный период',
    selectedPeriod: 'дней',
    days: 'дней',
    pickupLocation: 'Место Получения',
    dropoffLocation: 'Место Возврата',
    selectLocation: 'Выберите место',
    additionalServices: 'Дополнительные Услуги',
    personalDriver: 'Личный Водитель',
    personalDriverDesc: 'Комфортное путешествие с опытным водителем',
    childSeat: 'Детское Кресло',
    childSeatDesc: 'Безопасное кресло для детей 0-12 лет',
    gpsNavigation: 'GPS Навигация',
    gpsNavigationDesc: 'Профессиональное GPS устройство',
    fullInsurance: 'Полная Страховка',
    fullInsuranceDesc: 'Расширенное страховое покрытие',
    paymentMethod: 'Способ Оплаты',
    cashPayment: 'Наличная Оплата',
    onlinePayment: 'Онлайн Оплата (Карта)',
    cardCommission: 'Комиссия за карту',
    cardCommissionWarning: 'При оплате картой применяется НДС 18% + комиссия за карту 18%',
    priceSummary: 'Сводка Цен',
    rentalPeriod: 'Период аренды',
    basePrice: 'Базовая цена',
    locationChanges: 'Изменения местоположения',
    additionalServicesPrice: 'Дополнительные услуги',
    totalAmount: 'Общая сумма',
    cancel: 'Отмена',
    makeReservation: 'Забронировать',
    
    // Locations
    officePickup: 'Получение из офиса',
    airport: 'Аэропорт Гейдара Алиева',
    cityCenter: 'Центр Города',
    hotel: 'Отель/Место проживания',
    railwayStation: 'Железнодорожный Вокзал',
    
    // Car Classes
    economy: 'Эконом',
    business: 'Бизнес',
    premium: 'Премиум',
    luxury: 'Люкс',
    comfort: 'Комфорт',
    suv: 'Внедорожник',
    
    // Fuel Types
    gasoline: 'Бензин',
    diesel: 'Дизель',
    hybrid: 'Гибрид',
    
    // Transmission
    automatic: 'Автомат',
    manual: 'Механика',
    
    // Common
    person: 'человек',
    people: 'человек',
    
    // Enhanced Car Detail Page
    availability: 'Доступность',
    available: 'Доступен',
    unavailable: 'Недоступен',
    specifications: 'Технические характеристики',
    overview: 'Обзор',
    specs: 'Характеристики',
    rules: 'Правила',
    similarCars: 'Похожие автомобили',
    customerReviews: 'Отзывы клиентов',
    shareThisCar: 'Поделиться этим автомобилем',
    addToFavorites: 'Добавить в избранное',
    removeFromFavorites: 'Удалить из избранного',
    viewFullscreen: 'Просмотр в полноэкранном режиме',
    previousImage: 'Предыдущее изображение',
    nextImage: 'Следующее изображение',
    imageGallery: 'Галерея изображений',
    loading: 'Загрузка...',
    errorLoadingImage: 'Не удалось загрузить изображение',
    retryLoading: 'Повторить загрузку',
  },
  
  ar: {
    // Navigation
    cars: 'السيارات',
    services: 'الخدمات',
    about: 'حولنا',
    contact: 'اتصل بنا',
    
    // Hero Section
    heroTitle: 'تأجير سيارات عالي الجودة',
    heroSubtitle: 'اختر المركبة المفضلة لديك من أسطولنا الواسع وسافر براحة. نخدمك بخدمة احترافية وأسعار معقولة.',
    flexibleBooking: 'حجز مرن',
    flexibleBookingDesc: 'حجز سهل عبر الإنترنت أو عبر الهاتف',
    varietyChoice: 'تنوع في الاختيار',
    varietyChoiceDesc: 'من الفئة الاقتصادية إلى فئة الأعمال',
    deliveryService: 'خدمة التوصيل',
    deliveryServiceDesc: 'نوصل السيارة إلى الموقع المطلوب',
    
    // Cars Section
    ourFleet: 'أسطول سياراتنا',
    perDay: '/يوم',
    viewDetails: 'عرض التفاصيل',
    year: '',
    seats: 'مقاعد',
    fuel: '',
    transmission: '',
    
    // Footer
    footerDesc: 'نجعل سفرك مريحًا وآمنًا مع خدمة تأجير السيارات المهنية.',
    contactInfo: 'معلومات الاتصال',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
    workingHours: 'ساعات العمل',
    mondayFriday: 'الاثنين - الجمعة: 09:00 - 18:00',
    saturday: 'السبت: 09:00 - 16:00',
    sunday: 'الأحد: مغلق',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    
    // Car Details
    carNotFound: 'السيارة غير موجودة',
    backToHome: 'العودة للرئيسية',
    features: 'المميزات',
    priceInfo: 'معلومات الأسعار',
    dailyPrice: 'السعر اليومي',
    weeklyPrice: 'السعر الأسبوعي',
    monthlyPrice: 'السعر الشهري',
    deposit: 'العربون',
    rentalRules: 'قواعد الإيجار',
    minimumAge: 'الحد الأدنى للعمر',
    drivingExperience: 'خبرة القيادة',
    passportRequired: 'جواز السفر مطلوب',
    licenseRequired: 'رخصة القيادة',
    yes: 'نعم',
    no: 'لا',
    required: 'مطلوب',
    notRequired: 'غير مطلوب',
    contactOptions: 'خيارات الاتصال',
    whatsappContact: 'التواصل عبر واتساب',
    phoneCall: 'مكالمة هاتفية',
    onlineBooking: 'الحجز عبر الإنترنت',
    
    // Booking Modal
    onlineReservation: 'الحجز عبر الإنترنت',
    personalInfo: 'المعلومات الشخصية',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    rentalDetails: 'تفاصيل الإيجار',
    pickupDate: 'تاريخ الاستلام',
    dropoffDate: 'تاريخ الإرجاع',
    minimumRentalPeriod: 'الحد الأدنى لفترة الإيجار يومان. الفترة المختارة',
    selectedPeriod: 'أيام',
    days: 'أيام',
    pickupLocation: 'مكان الاستلام',
    dropoffLocation: 'مكان الإرجاع',
    selectLocation: 'اختر الموقع',
    additionalServices: 'الخدمات الإضافية',
    personalDriver: 'سائق شخصي',
    personalDriverDesc: 'سفر مريح مع سائق ذو خبرة',
    childSeat: 'مقعد الأطفال',
    childSeatDesc: 'مقعد آمن للأطفال من عمر 0-12',
    gpsNavigation: 'نظام تحديد المواقع',
    gpsNavigationDesc: 'جهاز GPS احترافي',
    fullInsurance: 'تأمين شامل',
    fullInsuranceDesc: 'تغطية تأمينية موسعة',
    paymentMethod: 'طريقة الدفع',
    cashPayment: 'الدفع نقداً',
    onlinePayment: 'الدفع عبر الإنترنت (بطاقة)',
    cardCommission: 'عمولة البطاقة',
    cardCommissionWarning: 'يتم تطبيق ضريبة القيمة المضافة 18% + عمولة البطاقة 18% عند الدفع بالبطاقة',
    priceSummary: 'ملخص الأسعار',
    rentalPeriod: 'فترة الإيجار',
    basePrice: 'السعر الأساسي',
    locationChanges: 'تغييرات الموقع',
    additionalServicesPrice: 'الخدمات الإضافية',
    totalAmount: 'المبلغ الإجمالي',
    cancel: 'إلغاء',
    makeReservation: 'إجراء الحجز',
    
    // Locations
    officePickup: 'الاستلام من المكتب',
    airport: 'مطار حيدر علييف',
    cityCenter: 'وسط المدينة',
    hotel: 'الفندق/مكان الإقامة',
    railwayStation: 'محطة السكك الحديدية',
    
    // Car Classes
    economy: 'اقتصادي',
    business: 'أعمال',
    premium: 'مميز',
    luxury: 'فاخر',
    comfort: 'مريح',
    suv: 'دفع رباعي',
    
    // Fuel Types
    gasoline: 'بنزين',
    diesel: 'ديزل',
    hybrid: 'هجين',
    
    // Transmission
    automatic: 'أوتوماتيك',
    manual: 'يدوي',
    
    // Common
    person: 'شخص',
    people: 'أشخاص',
    
    // Enhanced Car Detail Page
    availability: 'التوفر',
    available: 'متوفر',
    unavailable: 'غير متوفر',
    specifications: 'المواصفات الفنية',
    overview: 'نظرة عامة',
    specs: 'المواصفات',
    rules: 'القواعد',
    similarCars: 'سيارات مماثلة',
    customerReviews: 'آراء العملاء',
    shareThisCar: 'شارك هذه السيارة',
    addToFavorites: 'أضف إلى المفضلة',
    removeFromFavorites: 'إزالة من المفضلة',
    viewFullscreen: 'عرض بملء الشاشة',
    previousImage: 'الصورة السابقة',
    nextImage: 'الصورة التالية',
    imageGallery: 'معرض الصور',
    loading: 'جاري التحميل...',
    errorLoadingImage: 'فشل في تحميل الصورة',
    retryLoading: 'إعادة المحاولة',
  },
};

export function useTranslation(lang: string): Translation {
  return translations[lang] || translations.az;
}