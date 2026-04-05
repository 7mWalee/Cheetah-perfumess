
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAdmin } = useApp();
  const { language } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    username: '',
    adminPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = isAdmin
      ? await loginAdmin(formData.username, formData.adminPassword)
      : await login(formData.phone, formData.phone);

    if (success) {
      toast.success(isAdmin ? (language === 'ar' ? 'مرحبًا بعودتك يا أدمن!' : 'Welcome back, Admin!') : (language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!'));
      navigate(isAdmin ? '/admin' : '/');
    } else {
      toast.error(isAdmin ? (language === 'ar' ? 'بيانات الأدمن غير صحيحة' : 'Invalid admin credentials') : (language === 'ar' ? 'رقم الهاتف غير مسجل' : 'Phone number not found'));
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20 flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="font-heading font-black text-3xl text-white mb-2">
            {isAdmin ? (language === 'ar' ? 'دخول الأدمن' : 'ADMIN LOGIN') : (language === 'ar' ? 'الدخول برقم الهاتف' : 'SIGN IN WITH PHONE')}
          </h1>
          <p className="text-white/60">
            {isAdmin ? (language === 'ar' ? 'ادخل إلى لوحة الإدارة' : 'Access the admin dashboard') : (language === 'ar' ? 'اكتب رقم هاتفك المسجل' : 'Enter your registered phone number')}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setIsAdmin(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !isAdmin ? 'bg-gold text-cheetah-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'عميل' : 'Customer'}
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isAdmin ? 'bg-gold text-cheetah-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'أدمن' : 'Admin'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isAdmin ? (
            <>
              <div>
                <label className="block text-white font-medium mb-2">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-luxury w-full pl-12"
                    placeholder={language === 'ar' ? 'اكتب اسم المستخدم' : 'Enter username'}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">{language === 'ar' ? 'كلمة مرور الأدمن' : 'Admin Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="input-luxury w-full pl-12 pr-12"
                    placeholder={language === 'ar' ? 'اكتب كلمة المرور' : 'Enter password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-white font-medium mb-2">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                  className="input-luxury w-full pl-12"
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                  required
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full btn-primary py-6">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {language === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Signing in...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {!isAdmin && (
          <p className="text-center text-white/60 mt-6">
            {language === 'ar' ? 'ليس لديك حساب؟' : 'Don’t have an account?'}{' '}
            <Link to="/register" className="text-gold hover:underline">
              {language === 'ar' ? 'إنشاء حساب' : 'Create account'}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
