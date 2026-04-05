import { useState } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, Home, Building } from 'lucide-react';
import { useApp } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Address } from '@/types';
import { useLanguage, formatDate, translateDeliveryType } from '@/i18n';

export function ProfilePage() {
  const { state, dispatch } = useApp();
  const { t, language } = useLanguage();
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'delivery',
    city: '',
    area: '',
    street: '',
    building: '',
    apartment: '',
    phone: ''
  });

  const handleAddAddress = () => {
    if (!newAddress.city || !newAddress.area || !newAddress.street || !newAddress.building || !newAddress.phone) {
      toast.error(t('Please fill in all required fields'));
      return;
    }

    const address: Address = {
      id: `addr-${Date.now()}`,
      type: newAddress.type as 'delivery' | 'pickup',
      city: newAddress.city,
      area: newAddress.area,
      street: newAddress.street,
      building: newAddress.building,
      apartment: newAddress.apartment,
      phone: newAddress.phone,
      isDefault: state.user?.addresses.length === 0
    };

    dispatch({ type: 'ADD_ADDRESS', payload: address });
    setIsAddingAddress(false);
    setNewAddress({
      type: 'delivery',
      city: '',
      area: '',
      street: '',
      building: '',
      apartment: '',
      phone: ''
    });
    toast.success(t('Address added successfully'));
  };

  const handleDeleteAddress = (addressId: string) => {
    if (!state.user) return;
    const updatedAddresses = state.user.addresses.filter(a => a.id !== addressId);
    dispatch({ type: 'UPDATE_USER', payload: { ...state.user, addresses: updatedAddresses } });
    toast.success(t('Address deleted'));
  };

  if (!state.user) return null;

  return (
    <div className="min-h-screen bg-cheetah-black pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <p className="micro-label mb-2">{t('ACCOUNT')}</p>
          <h1 className="heading-section text-white">
            {t('MY')} <span className="text-gradient-gold">{language === 'ar' ? 'الملف الشخصي' : 'PROFILE'}</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card-luxury p-6 sticky top-24">
              <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-gold" />
              </div>
              <h2 className="text-xl font-heading font-bold text-white text-center mb-1">
                {state.user.firstName} {state.user.lastName}
              </h2>
              <p className="text-white/60 text-center text-sm mb-6">
                {language === 'ar' ? 'عضو منذ' : 'Member since'} {formatDate(state.user.createdAt, language)}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/60">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{state.user.email}</span>
                </div>
                {state.user.phone && (
                  <div className="flex items-center gap-3 text-white/60">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{state.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading font-bold text-xl text-white">
                {t('Saved Addresses')}
              </h2>
              <Button onClick={() => setIsAddingAddress(true)} className="btn-primary text-sm">
                <Plus className="w-4 h-4 mr-2" />
                {t('Add Address')}
              </Button>
            </div>

            {state.user.addresses.length === 0 ? (
              <div className="card-luxury p-8 text-center">
                <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">{t('No saved addresses yet')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.user.addresses.map((address) => (
                  <div key={address.id} className="card-luxury p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        {address.type === 'delivery' ? (
                          <Home className="w-5 h-5 text-gold mt-1" />
                        ) : (
                          <Building className="w-5 h-5 text-gold mt-1" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">
                              {translateDeliveryType(address.type, language)}
                            </p>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded">
                                {t('Default')}
                              </span>
                            )}
                          </div>
                          <p className="text-white/60 text-sm mt-1">
                            {address.building}, {address.street}<br />
                            {address.area}, {address.city}<br />
                            {t('Phone')}: {address.phone}
                          </p>
                        </div>
                      </div>

                      <button onClick={() => handleDeleteAddress(address.id)} className="p-2 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddingAddress && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-xl card-luxury p-6">
            <h3 className="text-white font-heading font-bold text-xl mb-6">{t('Add Address')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label={language === 'ar' ? 'نوع العنوان' : 'Address Type'} value={newAddress.type || 'delivery'} onChange={(value) => setNewAddress({ ...newAddress, type: value as 'delivery' | 'pickup' })} options={[
                { value: 'delivery', label: language === 'ar' ? 'توصيل' : 'Delivery' },
                { value: 'pickup', label: language === 'ar' ? 'استلام' : 'Pickup' }
              ]} />
              <Field label={t('City')} value={newAddress.city || ''} onChange={(value) => setNewAddress({ ...newAddress, city: value })} />
              <Field label={t('Area')} value={newAddress.area || ''} onChange={(value) => setNewAddress({ ...newAddress, area: value })} />
              <Field label={t('Street')} value={newAddress.street || ''} onChange={(value) => setNewAddress({ ...newAddress, street: value })} />
              <Field label={t('Building')} value={newAddress.building || ''} onChange={(value) => setNewAddress({ ...newAddress, building: value })} />
              <Field label={t('Apartment')} value={newAddress.apartment || ''} onChange={(value) => setNewAddress({ ...newAddress, apartment: value })} />
              <Field label={t('Phone')} value={newAddress.phone || ''} onChange={(value) => setNewAddress({ ...newAddress, phone: value })} />
            </div>
            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)} className="flex-1 border-white/20 text-white hover:bg-white/10">{t('Cancel')}</Button>
              <Button type="button" onClick={handleAddAddress} className="flex-1 btn-primary">{language === 'ar' ? 'حفظ العنوان' : 'Save Address'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-white/60 text-sm mb-2">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input-luxury w-full" />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-white/60 text-sm mb-2">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-luxury w-full">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
