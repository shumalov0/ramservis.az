export interface Translation {
  // Navigation
  home: string;
  cars: string;
  services?: string;
  about: string;
  contact: string;
  carCategories: string;
  viewAllCars: string;
  
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
  
  // Services Page
  servicesTitle: string;
  airportDelivery: string;
  airportDeliveryDesc: string;
  driverRental: string;
  driverRentalDesc: string;
  fullInsuranceService: string;
  fullInsuranceServiceDesc: string;
  corporatePackages: string;
  corporatePackagesDesc: string;
  addressDelivery: string;
  addressDeliveryDesc: string;
  flexibleRentalPeriod: string;
  flexibleRentalPeriodDesc: string;
  onlinePaymentService: string;
  onlinePaymentServiceDesc: string;
  wideCarFleet: string;
  wideCarFleetDesc: string;
  pricePackages: string;
  daily: string;
  weekly: string;
  monthly: string;
  affordablePricesAndBonusServices: string;
  applyNow: string;
  frequentlyAskedQuestions: string;
  howDoesDepositWork: string;
  howDoesDepositWorkAnswer: string;
  minimumRentalPeriodQuestion: string;
  minimumRentalPeriodAnswer: string;
  isDriverRentalPossible: string;
  isDriverRentalPossibleAnswer: string;
  
  // Contact Page
  contactTitle: string;
  contactSubtitle: string;
  getInTouch: string;
  sendMessage: string;
  name: string;
  subject: string;
  message: string;
  send: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  quickContact: string;
  callNow: string;
  whatsappNow: string;
  emailNow: string;
  workingHours24: string;
  
  // About Page
  aboutTitle: string;
  aboutSubtitle: string;
  mission: string;
  missionText: string;
  vision: string;
  visionText: string;
  values: string;
  valuesText: string;
  experience: string;
  experienceText: string;
  fleet: string;
  fleetText: string;
  service: string;
  serviceText: string;
  certificatesTitle: string;
  certificatesDesc: string;
  
  // Footer
  footerCallUs: string;
  footerWriteToUs: string;
  footerAddress: string;
  quickLinks: string;
  aboutLink: string;
  carsLink: string;
  carTypesLink: string;
  faqLink: string;
  contactLink: string;
  subscribe: string;
  subscribeDesc: string;
  emailPlaceholderFooter: string;
  allRightsReservedFooter: string;
}

export const translations: Record<string, Translation> = {
  az: {
    // Navigation
    home: 'Ev',
    cars: 'Maşınlar',
    services: 'Xidmətlər',
    about: 'Haqqımızda',
    contact: 'Əlaqə',
    carCategories: 'Maşın Kateqoriyaları',
    viewAllCars: 'Bütün Maşınları Gör',
    
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
    
    // Services Page
    servicesTitle: 'Xidmətlər',
    airportDelivery: 'Hava limanına çatdırılma',
    airportDeliveryDesc: 'Heydər Əliyev Hava Limanına 7/24 çatdırılma və təhvil.',
    driverRental: 'Sürücü ilə icarə',
    driverRentalDesc: 'Peşəkar sürücü ilə rahat və təhlükəsiz səyahət.',
    fullInsuranceService: 'Tam sığorta',
    fullInsuranceServiceDesc: 'Genişləndirilmiş sığorta ilə əlavə rahatlıq.',
    corporatePackages: 'Korporativ paketlər',
    corporatePackagesDesc: 'Şirkətlər üçün xüsusi qiymətlər və uzunmüddətli icarə.',
    addressDelivery: 'Ünvana çatdırılma',
    addressDeliveryDesc: 'Şəhər daxili istənilən ünvana sürətli çatdırılma.',
    flexibleRentalPeriod: 'Çevik icarə müddəti',
    flexibleRentalPeriodDesc: 'Günlük, həftəlik, aylıq sərfəli seçimlər.',
    onlinePaymentService: 'Onlayn ödəniş',
    onlinePaymentServiceDesc: 'Kartla onlayn ödəniş və rezervasiya təsdiqi.',
    wideCarFleet: 'Geniş maşın parkı',
    wideCarFleetDesc: 'Ekonomdan premiuma qədər müxtəlif seçimlər.',
    pricePackages: 'Qiymət paketləri',
    daily: 'Günlük',
    weekly: 'Həftəlik',
    monthly: 'Aylıq',
    affordablePricesAndBonusServices: 'Sərfəli qiymətlər və bonus xidmətlər.',
    applyNow: 'Müraciət et',
    frequentlyAskedQuestions: 'Tez-tez verilən suallar',
    howDoesDepositWork: 'Depozit necə işləyir?',
    howDoesDepositWorkAnswer: 'Maşından asılı olaraq 200-500$ depozit tələb olunur və qaytarılır.',
    minimumRentalPeriodQuestion: 'Minimum icarə müddəti?',
    minimumRentalPeriodAnswer: 'Minimum 2 gün.',
    isDriverRentalPossible: 'Sürücü ilə icarə mümkündür?',
    isDriverRentalPossibleAnswer: 'Bəli, təcrübəli sürücülərimiz var.',
    
    // Contact Page
    contactTitle: 'Bizimlə Əlaqə',
    contactSubtitle: 'Suallarınız var? Bizimlə əlaqə saxlayın!',
    getInTouch: 'Əlaqə saxlayın',
    sendMessage: 'Mesaj göndər',
    name: 'Ad Soyad',
    subject: 'Mövzu',
    message: 'Mesaj',
    send: 'Göndər',
    namePlaceholder: 'Adınızı daxil edin',
    emailPlaceholder: 'Email ünvanınızı daxil edin',
    subjectPlaceholder: 'Mesajın mövzusunu daxil edin',
    messagePlaceholder: 'Mesajınızı buraya yazın...',
    quickContact: 'Sürətli əlaqə',
    callNow: 'İndi zəng edin',
    whatsappNow: 'WhatsApp yazın',
    emailNow: 'Email göndərin',
    workingHours24: '24/7 Açıq - Həftənin hər günü',
    
    // About Page
    aboutTitle: 'Haqqımızda',
    aboutSubtitle: 'Peşəkar avtomobil icarəsi xidməti ilə sizin səyahətinizi rahat və təhlükəsiz edirik.',
    mission: 'Missiyamız',
    missionText: 'Müştərilərimizə yüksək keyfiyyətli avtomobillər və xüsusi dəstək təqdim etməklə, hər səyahəti unudulmaz bir təcrübəyə çevirməkdir.',
    vision: 'Vizyonumuz',
    visionText: 'Avtomobil icarəsi sahəsində ən yaxşı şirkət olmaq və müştərilərimizə ən yaxşı xidməti təqdim etmək.',
    values: 'Dəyərlərimiz',
    valuesText: 'Müştəri məmnuniyyəti, etibarlılıq, keyfiyyət və innovasiya bizim əsas dəyərlərimizdir.',
    experience: 'Təcrübə',
    experienceText: '10+ il ərzində minlərlə müştəriyə xidmət etdik və onların etibarını qazandıq.',
    fleet: 'Avtomobil Parkı',
    fleetText: 'Ən müasir avtomobillərdən ibarət geniş flotumuzla hər zaman xidmətinizdəyik.',
    service: 'Xidmət',
    serviceText: '7/24 dəstək və çatdırılma xidməti ilə sizin rahatlığınızı təmin edirik.',
    certificatesTitle: 'Sertifikatlarımız və Lisenziyalarımız',
    certificatesDesc: 'Peşəkarlığımızı və keyfiyyətimizi təsdiq edən rəsmi sənədlər',
    
    // Footer
    footerCallUs: 'Bizə zəng edin',
    footerWriteToUs: 'Bizə yazın',
    footerAddress: 'Ünvan',
    quickLinks: 'Sürətli Keçidlər',
    aboutLink: 'Haqqımızda',
    carsLink: 'Maşınlar',
    carTypesLink: 'Maşın Növləri',
    faqLink: 'Tez-tez Verilən Suallar',
    contactLink: 'Əlaqə',
    subscribe: 'Abunə Olun',
    subscribeDesc: 'Xidmətlərimiz haqqında məlumat almaq istəyirsiniz? Qeydiyyatdan keçin və biz sizə email vasitəsilə bildiriş göndərəcəyik.',
    emailPlaceholderFooter: 'Email ünvanınız',
    allRightsReservedFooter: 'Bütün hüquqlar qorunur.',
  },
  
  en: {
    // Navigation
    home: 'Home',
    cars: 'Cars',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    carCategories: 'Car Categories',
    viewAllCars: 'View All Cars',
    
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
    
    // Services Page
    servicesTitle: 'Services',
    airportDelivery: 'Airport delivery',
    airportDeliveryDesc: '24/7 delivery and pickup to Heydar Aliyev Airport.',
    driverRental: 'Rental with driver',
    driverRentalDesc: 'Comfortable and safe travel with professional driver.',
    fullInsuranceService: 'Full insurance',
    fullInsuranceServiceDesc: 'Additional peace of mind with extended insurance.',
    corporatePackages: 'Corporate packages',
    corporatePackagesDesc: 'Special prices and long-term rental for companies.',
    addressDelivery: 'Address delivery',
    addressDeliveryDesc: 'Fast delivery to any address within the city.',
    flexibleRentalPeriod: 'Flexible rental period',
    flexibleRentalPeriodDesc: 'Daily, weekly, monthly affordable options.',
    onlinePaymentService: 'Online payment',
    onlinePaymentServiceDesc: 'Online card payment and reservation confirmation.',
    wideCarFleet: 'Wide car fleet',
    wideCarFleetDesc: 'Various options from economy to premium.',
    pricePackages: 'Price packages',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    affordablePricesAndBonusServices: 'Affordable prices and bonus services.',
    applyNow: 'Apply now',
    frequentlyAskedQuestions: 'Frequently asked questions',
    howDoesDepositWork: 'How does the deposit work?',
    howDoesDepositWorkAnswer: 'A deposit of $200-500 is required depending on the car and is refunded.',
    minimumRentalPeriodQuestion: 'Minimum rental period?',
    minimumRentalPeriodAnswer: 'Minimum 2 days.',
    isDriverRentalPossible: 'Is rental with driver possible?',
    isDriverRentalPossibleAnswer: 'Yes, we have experienced drivers.',
    
    // Contact Page
    contactTitle: 'Contact Us',
    contactSubtitle: 'Have questions? Get in touch with us!',
    getInTouch: 'Get in Touch',
    sendMessage: 'Send Message',
    name: 'Full Name',
    subject: 'Subject',
    message: 'Message',
    send: 'Send',
    namePlaceholder: 'Enter your name',
    emailPlaceholder: 'Enter your email address',
    subjectPlaceholder: 'Enter message subject',
    messagePlaceholder: 'Write your message here...',
    quickContact: 'Quick Contact',
    callNow: 'Call Now',
    whatsappNow: 'WhatsApp Now',
    emailNow: 'Send Email',
    workingHours24: '24/7 Open - Every day of the week',
    
    // About Page
    aboutTitle: 'About Us',
    aboutSubtitle: 'We make your travel comfortable and safe with professional car rental service.',
    mission: 'Our Mission',
    missionText: 'To make every journey an unforgettable experience by providing our customers with high-quality vehicles and special support.',
    vision: 'Our Vision',
    visionText: 'To be the best company in the car rental industry and provide the best service to our customers.',
    values: 'Our Values',
    valuesText: 'Customer satisfaction, reliability, quality and innovation are our core values.',
    experience: 'Experience',
    experienceText: 'We have served thousands of customers and gained their trust over 10+ years.',
    fleet: 'Car Fleet',
    fleetText: 'With our extensive fleet of modern vehicles, we are always at your service.',
    service: 'Service',
    serviceText: 'We ensure your comfort with 24/7 support and delivery service.',
    certificatesTitle: 'Our Certificates and Licenses',
    certificatesDesc: 'Official documents confirming our professionalism and quality',
    
    // Footer
    footerCallUs: 'Call us',
    footerWriteToUs: 'Write to us',
    footerAddress: 'Address',
    quickLinks: 'Quick Links',
    aboutLink: 'About',
    carsLink: 'Cars',
    carTypesLink: 'Car Types',
    faqLink: 'FAQ',
    contactLink: 'Contact',
    subscribe: 'Subscribe',
    subscribeDesc: 'Want to be notified about our services. Just sign up and we\'ll send you a notification by email.',
    emailPlaceholderFooter: 'Your email address',
    allRightsReservedFooter: 'All rights reserved.',
  },
  
  ru: {
    // Navigation
    home: 'Главная',
    cars: 'Автомобили',
    services: 'Услуги',
    about: 'О нас',
    contact: 'Контакты',
    carCategories: 'Категории Автомобилей',
    viewAllCars: 'Посмотреть Все Автомобили',
    
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
    
    // Services Page
    servicesTitle: 'Услуги',
    airportDelivery: 'Доставка в аэропорт',
    airportDeliveryDesc: 'Доставка и получение в аэропорту Гейдара Алиева 24/7.',
    driverRental: 'Аренда с водителем',
    driverRentalDesc: 'Комфортное и безопасное путешествие с профессиональным водителем.',
    fullInsuranceService: 'Полная страховка',
    fullInsuranceServiceDesc: 'Дополнительное спокойствие с расширенной страховкой.',
    corporatePackages: 'Корпоративные пакеты',
    corporatePackagesDesc: 'Специальные цены и долгосрочная аренда для компаний.',
    addressDelivery: 'Доставка по адресу',
    addressDeliveryDesc: 'Быстрая доставка по любому адресу в городе.',
    flexibleRentalPeriod: 'Гибкий период аренды',
    flexibleRentalPeriodDesc: 'Ежедневные, еженедельные, ежемесячные доступные варианты.',
    onlinePaymentService: 'Онлайн оплата',
    onlinePaymentServiceDesc: 'Онлайн оплата картой и подтверждение бронирования.',
    wideCarFleet: 'Широкий автопарк',
    wideCarFleetDesc: 'Различные варианты от эконом до премиум.',
    pricePackages: 'Ценовые пакеты',
    daily: 'Ежедневно',
    weekly: 'Еженедельно',
    monthly: 'Ежемесячно',
    affordablePricesAndBonusServices: 'Доступные цены и бонусные услуги.',
    applyNow: 'Подать заявку',
    frequentlyAskedQuestions: 'Часто задаваемые вопросы',
    howDoesDepositWork: 'Как работает депозит?',
    howDoesDepositWorkAnswer: 'В зависимости от автомобиля требуется депозит $200-500, который возвращается.',
    minimumRentalPeriodQuestion: 'Минимальный период аренды?',
    minimumRentalPeriodAnswer: 'Минимум 2 дня.',
    isDriverRentalPossible: 'Возможна ли аренда с водителем?',
    isDriverRentalPossibleAnswer: 'Да, у нас есть опытные водители.',
    
    // Contact Page
    contactTitle: 'Свяжитесь с нами',
    contactSubtitle: 'Есть вопросы? Свяжитесь с нами!',
    getInTouch: 'Связаться',
    sendMessage: 'Отправить сообщение',
    name: 'Полное имя',
    subject: 'Тема',
    message: 'Сообщение',
    send: 'Отправить',
    namePlaceholder: 'Введите ваше имя',
    emailPlaceholder: 'Введите ваш email',
    subjectPlaceholder: 'Введите тему сообщения',
    messagePlaceholder: 'Напишите ваше сообщение здесь...',
    quickContact: 'Быстрая связь',
    callNow: 'Позвонить сейчас',
    whatsappNow: 'WhatsApp сейчас',
    emailNow: 'Отправить Email',
    workingHours24: '24/7 Открыто - Каждый день недели',
    
    // About Page
    aboutTitle: 'О нас',
    aboutSubtitle: 'Делаем ваше путешествие комфортным и безопасным с профессиональным сервисом аренды автомобилей.',
    mission: 'Наша миссия',
    missionText: 'Сделать каждое путешествие незабываемым опытом, предоставляя нашим клиентам высококачественные автомобили и специальную поддержку.',
    vision: 'Наше видение',
    visionText: 'Стать лучшей компанией в индустрии проката автомобилей и предоставлять лучший сервис нашим клиентам.',
    values: 'Наши ценности',
    valuesText: 'Удовлетворенность клиентов, надежность, качество и инновации - это наши основные ценности.',
    experience: 'Опыт',
    experienceText: 'За 10+ лет мы обслужили тысячи клиентов и заслужили их доверие.',
    fleet: 'Автопарк',
    fleetText: 'С нашим обширным парком современных автомобилей мы всегда к вашим услугам.',
    service: 'Сервис',
    serviceText: 'Обеспечиваем ваш комфорт с круглосуточной поддержкой и службой доставки.',
    certificatesTitle: 'Наши сертификаты и лицензии',
    certificatesDesc: 'Официальные документы, подтверждающие наш профессионализм и качество',
    
    // Footer
    footerCallUs: 'Позвоните нам',
    footerWriteToUs: 'Напишите нам',
    footerAddress: 'Адрес',
    quickLinks: 'Быстрые ссылки',
    aboutLink: 'О нас',
    carsLink: 'Автомобили',
    carTypesLink: 'Типы автомобилей',
    faqLink: 'Часто задаваемые вопросы',
    contactLink: 'Контакты',
    subscribe: 'Подписаться',
    subscribeDesc: 'Хотите получать уведомления о наших услугах? Просто зарегистрируйтесь, и мы будем присылать вам уведомления по электронной почте.',
    emailPlaceholderFooter: 'Ваш адрес электронной почты',
    allRightsReservedFooter: 'Все права защищены.',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    cars: 'السيارات',
    services: 'الخدمات',
    about: 'حولنا',
    contact: 'اتصل بنا',
    carCategories: 'فئات السيارات',
    viewAllCars: 'عرض جميع السيارات',
    
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
    
    // Services Page
    servicesTitle: 'الخدمات',
    airportDelivery: 'التوصيل للمطار',
    airportDeliveryDesc: 'التوصيل والاستلام من مطار حيدر علييف على مدار 24/7.',
    driverRental: 'الإيجار مع سائق',
    driverRentalDesc: 'سفر مريح وآمن مع سائق محترف.',
    fullInsuranceService: 'تأمين شامل',
    fullInsuranceServiceDesc: 'راحة بال إضافية مع تأمين موسع.',
    corporatePackages: 'الحزم المؤسسية',
    corporatePackagesDesc: 'أسعار خاصة وإيجار طويل الأمد للشركات.',
    addressDelivery: 'التوصيل للعنوان',
    addressDeliveryDesc: 'توصيل سريع لأي عنوان داخل المدينة.',
    flexibleRentalPeriod: 'فترة إيجار مرنة',
    flexibleRentalPeriodDesc: 'خيارات يومية وأسبوعية وشهرية بأسعار معقولة.',
    onlinePaymentService: 'الدفع عبر الإنترنت',
    onlinePaymentServiceDesc: 'الدفع عبر الإنترنت بالبطاقة وتأكيد الحجز.',
    wideCarFleet: 'أسطول سيارات واسع',
    wideCarFleetDesc: 'خيارات متنوعة من الاقتصادي إلى المميز.',
    pricePackages: 'حزم الأسعار',
    daily: 'يومي',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    affordablePricesAndBonusServices: 'أسعار معقولة وخدمات إضافية.',
    applyNow: 'تقدم الآن',
    frequentlyAskedQuestions: 'الأسئلة الشائعة',
    howDoesDepositWork: 'كيف يعمل العربون؟',
    howDoesDepositWorkAnswer: 'يتطلب عربون 200-500$ حسب السيارة ويتم إرجاعه.',
    minimumRentalPeriodQuestion: 'الحد الأدنى لفترة الإيجار؟',
    minimumRentalPeriodAnswer: 'الحد الأدنى يومان.',
    isDriverRentalPossible: 'هل الإيجار مع سائق ممكن؟',
    isDriverRentalPossibleAnswer: 'نعم، لدينا سائقون ذوو خبرة.',
    
    // Contact Page
    contactTitle: 'اتصل بنا',
    contactSubtitle: 'لديك أسئلة؟ تواصل معنا!',
    getInTouch: 'تواصل معنا',
    sendMessage: 'إرسال رسالة',
    name: 'الاسم الكامل',
    subject: 'الموضوع',
    message: 'الرسالة',
    send: 'إرسال',
    namePlaceholder: 'أدخل اسمك',
    emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
    subjectPlaceholder: 'أدخل موضوع الرسالة',
    messagePlaceholder: 'اكتب رسالتك هنا...',
    quickContact: 'اتصال سريع',
    callNow: 'اتصل الآن',
    whatsappNow: 'واتساب الآن',
    emailNow: 'إرسال بريد إلكتروني',
    workingHours24: '24/7 مفتوح - كل يوم من أيام الأسبوع',
    
    // About Page
    aboutTitle: 'حولنا',
    aboutSubtitle: 'نجعل سفرك مريحًا وآمنًا مع خدمة تأجير السيارات المهنية.',
    mission: 'مهمتنا',
    missionText: 'تحويل كل رحلة إلى تجربة لا تُنسى من خلال توفير مركبات عالية الجودة ودعم خاص لعملائنا.',
    vision: 'رؤيتنا',
    visionText: 'أن نكون أفضل شركة في مجال تأجير السيارات وتقديم أفضل خدمة لعملائنا.',
    values: 'قيمنا',
    valuesText: 'رضا العملاء والموثوقية والجودة والابتكار هي قيمنا الأساسية.',
    experience: 'الخبرة',
    experienceText: 'لقد خدمنا آلاف العملاء وكسبنا ثقتهم على مدى 10+ سنوات.',
    fleet: 'أسطول السيارات',
    fleetText: 'مع أسطولنا الواسع من المركبات الحديثة، نكون دائمًا في خدمتكم.',
    service: 'الخدمة',
    serviceText: 'نضمن راحتك مع دعم 24/7 وخدمة التوصيل.',
    certificatesTitle: 'شهاداتنا وتراخيصنا',
    certificatesDesc: 'الوثائق الرسمية التي تؤكد احترافيتنا وجودتنا',
    
    // Footer
    footerCallUs: 'اتصل بنا',
    footerWriteToUs: 'اكتب لنا',
    footerAddress: 'العنوان',
    quickLinks: 'روابط سريعة',
    aboutLink: 'حولنا',
    carsLink: 'السيارات',
    carTypesLink: 'أنواع السيارات',
    faqLink: 'الأسئلة الشائعة',
    contactLink: 'اتصل بنا',
    subscribe: 'اشترك',
    subscribeDesc: 'تريد أن تكون على علم بخدماتنا؟ فقط سجل وسنرسل لك إشعارًا عبر البريد الإلكتروني.',
    emailPlaceholderFooter: 'عنوان بريدك الإلكتروني',
    allRightsReservedFooter: 'جميع الحقوق محفوظة.',
  },
};

export function useTranslation(lang: string): Translation {
  return translations[lang] || translations.az;
}