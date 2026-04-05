
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'ar';

const translations: Record<string, string> = {
  'Shop': 'المتجر',
  'Men': 'رجالي',
  'Women': 'نسائي',
  'Luxury': 'فاخر',
  'Search fragrances...': 'ابحث عن العطور...',
  'Press Enter to search': 'اضغط Enter للبحث',
  'Profile': 'الملف الشخصي',
  'Orders': 'الطلبات',
  'Admin Dashboard': 'لوحة الإدارة',
  'Logout': 'تسجيل الخروج',
  'Login': 'تسجيل الدخول',
  'Sign Up': 'إنشاء حساب',
  'Your Cart': 'سلة التسوق',
  'Your cart is empty': 'سلة التسوق فارغة',
  'Discover our collection of luxury fragrances': 'اكتشف مجموعتنا من العطور الفاخرة',
  'Start Shopping': 'ابدأ التسوق',
  'View Details': 'عرض التفاصيل',
  'NEW': 'جديد',
  'BESTSELLER': 'الأكثر مبيعًا',
  'OUT OF STOCK': 'نفد من المخزون',
  'Only ': 'متوفر فقط ',
  ' items available': ' قطعة',
  'Size': 'الحجم',
  'Added to cart': 'تمت الإضافة إلى السلة',
  'Unable to add to cart. Item may be out of stock.': 'تعذر الإضافة إلى السلة. قد يكون المنتج غير متوفر.',
  'Continue Shopping': 'متابعة التسوق',
  'CHECKOUT': 'إتمام الطلب',
  'Delivery Options': 'خيارات التوصيل',
  'Delivery': 'توصيل',
  'Pickup': 'استلام',
  'Address Information': 'معلومات العنوان',
  'Payment Method': 'طريقة الدفع',
  'Cash on Delivery': 'الدفع عند الاستلام',
  'InstaPay': 'إنستاباي',
  
  'Order Summary': 'ملخص الطلب',
  'Place Order': 'تأكيد الطلب',
  'Processing...': 'جارٍ المعالجة...',
  'Failed to place order': 'فشل في إتمام الطلب',
  'Code copied to clipboard': 'تم نسخ الكود',
  'ORDER CONFIRMED!': 'تم تأكيد الطلب!',
  'Thank you for your purchase. Your order has been placed successfully.': 'شكرًا لشرائك. تم تنفيذ طلبك بنجاح.',
  'Order Number': 'رقم الطلب',
  'Order Date': 'تاريخ الطلب',
  'Total': 'الإجمالي',
  'Order Placed': 'تم إنشاء الطلب',
  'Confirmed': 'مؤكد',
  'Processing': 'قيد التجهيز',
  'In queue': 'في الانتظار',
  'Pending': 'قيد الانتظار',
  'View My Orders': 'عرض طلباتي',
  'Back to Home': 'العودة للرئيسية',
  'ACCOUNT': 'الحساب',
  'MY': 'حسابي',
  'ORDERS': 'الطلبات',
  'No orders yet': 'لا توجد طلبات بعد',
  'Start shopping to see your orders here': 'ابدأ التسوق لترى طلباتك هنا',
  'Order Details': 'تفاصيل الطلب',
  'MY PROFILE': 'ملفي الشخصي',
  'Saved Addresses': 'العناوين المحفوظة',
  'Add Address': 'إضافة عنوان',
  'No saved addresses yet': 'لا توجد عناوين محفوظة بعد',
  'Default': 'افتراضي',
  'Address added successfully': 'تمت إضافة العنوان بنجاح',
  'Address deleted': 'تم حذف العنوان',
  'Please fill in all required fields': 'يرجى ملء كل الحقول المطلوبة',
  'Member since': 'عضو منذ',
  'Phone': 'الهاتف',
  'Name': 'الاسم',
  'Description': 'الوصف',
  'Category': 'الفئة',
  'Type': 'النوع',
  'Base Price': 'السعر الأساسي',
  'Stock': 'المخزون',
  'Cancel': 'إلغاء',
  'Update': 'تحديث',
  'Add Product': 'إضافة عطر',
  'Update Product': 'تحديث العطر',
  'Edit Product': 'تعديل العطر',
  'Search products...': 'ابحث عن العطور...',
  'Product deleted': 'تم حذف العطر',
  'Product updated': 'تم تحديث العطر',
  'Product added': 'تمت إضافة العطر',
  'Image URL': 'رابط الصورة',
  'Upload Image': 'رفع صورة',
  'Selected image preview': 'معاينة الصورة المختارة',
  'Or paste an image URL': 'أو الصق رابط صورة',
  'Dashboard': 'لوحة التحكم',
  'Products': 'العطور',
  'Users': 'المستخدمون',
  'ADMIN PANEL': 'لوحة الإدارة',
  'Welcome,': 'أهلاً،',
  'Total Orders': 'إجمالي الطلبات',
  'Total Revenue': 'إجمالي الإيرادات',
  'Low Stock Alert': 'تنبيه انخفاض المخزون',
  'Pending Orders': 'الطلبات المعلقة',
  'Low Stock Products': 'عطور منخفضة المخزون',
  'No pending orders': 'لا توجد طلبات معلقة',
  'All products are well stocked': 'كل العطور متوفرة جيدًا',
  'Product': 'العطر',
  'Price': 'السعر',
  'Status': 'الحالة',
  'Actions': 'الإجراءات',
  'Out of Stock': 'نفد من المخزون',
  'Low Stock': 'مخزون منخفض',
  'In Stock': 'متوفر',
  'All Orders': 'كل الطلبات',
  'Customer': 'العميل',
  'Items': 'المنتجات',
  'Joined': 'تاريخ الانضمام',
  'Bold fragrances crafted for predators who move fast and leave a trail.': 'عطور جريئة صُممت لمن يتحركون بسرعة ويتركون أثرًا.',
  'Help': 'المساعدة',
  'Shipping': 'الشحن',
  'Returns': 'الاسترجاع',
  'Care': 'العناية',
  'Contact': 'اتصل بنا',
  'Add to Cart': 'أضف إلى السلة',
  'Added': 'تمت الإضافة',
  'Description & Story': 'الوصف والقصة',
  'Fragrance Notes': 'النوتات العطرية',
  'Top Notes': 'المقدمة',
  'Heart Notes': 'القلب',
  'Base Notes': 'القاعدة',
  'You may also like': 'قد يعجبك أيضًا',
  'Sign in': 'تسجيل الدخول',
  'Create account': 'إنشاء حساب',
  'Email Address': 'البريد الإلكتروني',
  'Password': 'كلمة المرور',
  'First Name': 'الاسم الأول',
  'Last Name': 'اسم العائلة',
  'Phone Number': 'رقم الهاتف',
  'Already have an account?': 'لديك حساب بالفعل؟',
  'Don’t have an account?': 'ليس لديك حساب؟',
  'Create your account': 'أنشئ حسابك',
  'Welcome back': 'أهلاً بعودتك',
  'Shop now': 'تسوق الآن',
  'Explore Collection': 'استكشف المجموعة',
  'Featured Fragrances': 'العطور المميزة',
  'Shop By Category': 'تسوق حسب الفئة',
  'Shop All': 'عرض الكل',
  'Why Choose Cheetah': 'لماذا CHEETAH',
  'Fast Delivery': 'توصيل سريع',
  'Premium Quality': 'جودة ممتازة',
  'Easy Returns': 'إرجاع سهل',
  'Arabic': 'العربية',
  'English': 'English',
  'Search': 'بحث',
  'Empty': 'فارغ',
  'Address Type': 'نوع العنوان',
  'City': 'المدينة',
  'Area': 'المنطقة',
  'Street': 'الشارع',
  'Building': 'المبنى',
  'Apartment': 'الشقة',
  'Save Address': 'حفظ العنوان',
  'Admin': 'الإدارة',
  'Image': 'الصورة',
  'Choose image file': 'اختر ملف صورة',
  'No image selected': 'لم يتم اختيار صورة',
  'or': 'أو',
  'Remove': 'حذف',
  'Continue': 'متابعة'
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
} | null>(null);

export function translate(key: string) {
  return translations[key] || key;
}

export function formatDate(date: string | number | Date, language: Language) {
  return new Date(date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function translateCategory(value: string, language: Language) {
  if (language === 'en') return value;
  return ({
    men: 'رجالي',
    women: 'نسائي',
    unisex: 'للجنسين',
    luxury: 'فاخر',
  } as Record<string, string>)[value] || value;
}

export function translateType(value: string, language: Language) {
  if (language === 'en') return value;
  return ({
    woody: 'خشبي',
    floral: 'زهري',
    amber: 'عنبر',
    citrus: 'حمضي',
    oriental: 'شرقي',
    fresh: 'منعش',
  } as Record<string, string>)[value] || value;
}

export function translateOrderStatus(value: string, language: Language) {
  if (language === 'en') return value.charAt(0).toUpperCase() + value.slice(1);
  return ({
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    processing: 'قيد التجهيز',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
  } as Record<string, string>)[value] || value;
}

export function translateDeliveryType(value: string, language: Language) {
  if (language === 'en') return value === 'pickup' ? 'Pickup' : 'Delivery';
  return value === 'pickup' ? 'استلام' : 'توصيل';
}

export function translatePaymentMethod(value: string, language: Language) {
  if (language === 'en') {
    return ({ instapay: 'InstaPay', cod: 'Cash on Delivery' } as Record<string, string>)[value] || value;
  }
  return ({ instapay: 'إنستاباي', cod: 'الدفع عند الاستلام' } as Record<string, string>)[value] || value;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('cheetah-language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('cheetah-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    t: (key: string) => language === 'ar' ? translate(key) : key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
