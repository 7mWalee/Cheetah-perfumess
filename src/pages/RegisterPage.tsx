
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n';

const WHATSAPP_NUMBERS = ['01119929540', '01028430340'];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validatePhone = () => {
    const trimmed = phone.trim();
    if (!/^01\d{9}$/.test(trimmed)) {
      setError(language === 'ar' ? 'اكتب رقم هاتف مصري صحيح يبدأ بـ 01' : 'Enter a valid Egyptian phone number starting with 01');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) {
      toast.error(language === 'ar' ? 'اكتب رقم هاتف صحيح أولاً' : 'Please enter a valid phone number first');
      return;
    }

    setIsLoading(true);
    const success = await register({
      firstName: 'Customer',
      lastName: phone.trim().slice(-4),
      phone: phone.trim(),
      email: `${phone.trim()}@phone.local`,
      password: phone.trim(),
    });

    if (success) {
      toast.success(language === 'ar' ? 'تم حفظ رقمك بنجاح' : 'Your phone number has been saved');
      toast(language === 'ar'
        ? `راسل الرقمين 01119929540 و 01028430340 على واتساب لإكمال إنشاء الحساب`
        : 'Message both WhatsApp numbers to finish your signup: 01119929540 and 01028430340');
      navigate('/login');
    } else {
      toast.error(language === 'ar' ? 'هذا الرقم مسجل بالفعل' : 'This phone number is already registered');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20 flex items-center justify-center">
      <div className="w-full max-w-xl px-6">
        <div className="text-center mb-8">
          <h1 className="font-heading font-black text-3xl text-white mb-2">
            {language === 'ar' ? 'إنشاء حساب برقم الهاتف' : 'CREATE ACCOUNT WITH PHONE'}
          </h1>
          <p className="text-white/60">
            {language === 'ar' ? 'سجّل باستخدام رقم الهاتف فقط' : 'Sign up using your phone number only'}
          </p>
        </div>

        <div className="card-luxury p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-gold/10 p-3 text-gold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-sm leading-7 text-white/75">
              <p className="font-semibold text-white mb-2">
                {language === 'ar' ? 'بعد التسجيل:' : 'After signup:'}
              </p>
              <p>
                {language === 'ar'
                  ? 'سيظهر لك تنبيه يطلب منك مراسلة الرقمين التاليين على واتساب لإكمال التسجيل.'
                  : 'You will be asked to message both WhatsApp numbers below to finish signup.'}
              </p>
              <div className="mt-3 space-y-1 text-gold font-semibold">
                {WHATSAPP_NUMBERS.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className={`input-luxury w-full pl-12 ${error ? 'border-red-500' : ''}`}
                placeholder="01XXXXXXXXX"
                dir="ltr"
                required
              />
            </div>
            <p className="text-white/45 text-sm mt-2">
              {language === 'ar' ? 'استخدم 11 رقمًا يبدأ بـ 01' : 'Use 11 digits starting with 01'}
            </p>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full btn-primary py-6">
            <span className="flex items-center gap-2">
              {isLoading
                ? (language === 'ar' ? 'جارٍ إنشاء الحساب...' : 'Creating account...')
                : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </form>

        <div className="card-luxury p-6 mt-6">
          <p className="text-white font-semibold mb-2">
            {language === 'ar' ? 'راسل هذين الرقمين على واتساب:' : 'Message these numbers on WhatsApp:'}
          </p>
          <div className="space-y-2 text-gold">
            {WHATSAPP_NUMBERS.map((num) => (
              <a key={num} href={`https://wa.me/2${num}`} target="_blank" rel="noreferrer" className="block hover:underline" dir="ltr">
                {num}
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-white/60 mt-6">
          {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link to="/login" className="text-gold hover:underline">
            {language === 'ar' ? 'سجّل الدخول' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
}
