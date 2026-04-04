import React, { useMemo, useState } from 'react';
import { BriefcaseBusiness, Building2, LayoutTemplate, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import { toast } from 'sonner';
import { getVendorDashboardPath, getVendorTypeConfig, vendorTypeOptions } from './vendorTypes';

const VendorOnboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [selectedType, setSelectedType] = useState(user?.vendor_type || vendorTypeOptions[0].id);
  const [form, setForm] = useState({
    companyName: user?.company_name || '',
    contactPerson: user?.name || '',
    serviceAreas: '',
    inventorySummary: '',
    website: user?.website || '',
    phone: user?.mobile || '',
  });

  const selectedVendorType = useMemo(
    () => getVendorTypeConfig(selectedType),
    [selectedType]
  );

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    const onboardingKey = `vendor_onboarding_${user?.id || 'default'}`;
    const payload = {
      ...form,
      vendorType: selectedVendorType.title,
      completedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(onboardingKey, JSON.stringify(payload));
    }

    updateUser({
      company_name: form.companyName,
      name: form.contactPerson,
      mobile: form.phone,
      website: form.website,
      vendor_type: selectedVendorType.title,
      vendor_type_label: selectedVendorType.title,
      vendor_type: selectedVendorType.id,
      onboarding_completed: true,
    });
    toast.success('Vendor onboarding completed.');
    navigate(getVendorDashboardPath(selectedVendorType.id));
  };

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-[32px] bg-[linear-gradient(135deg,#0b1437_0%,#1d3fbf_60%,#8cb4ff_100%)] p-8 lg:p-10 text-white shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                <BriefcaseBusiness className="h-4 w-4" />
                Vendor Onboarding
              </div>
              <h1 className="mt-4 text-4xl font-heading font-bold">Set up your vendor profile by service type.</h1>
              <p className="mt-3 text-base font-body text-white/80">
                Choose what you offer, define your service footprint, and complete your partner profile before reviewing requests.
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr,0.95fr]">
            <div className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a94a6]">Vendor Type</p>
              <h2 className="mt-2 text-3xl font-heading font-bold text-[#101828]">Choose your primary service</h2>
              <div className="mt-6">
                <label className="text-sm font-semibold text-[#101828]">Vendor type</label>
                <select
                  value={selectedType}
                  onChange={(event) => setSelectedType(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-4 text-base font-medium text-[#101828] outline-none focus:border-[#0028aa]"
                >
                  {vendorTypeOptions.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                    <LayoutTemplate className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a94a6]">Setup Form</p>
                    <h2 className="mt-1 text-2xl font-heading font-bold text-[#101828]">{selectedVendorType.title} profile</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Company name</span>
                    <input
                      value={form.companyName}
                      onChange={(event) => updateField('companyName', event.target.value)}
                      className="w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Contact person</span>
                    <input
                      value={form.contactPerson}
                      onChange={(event) => updateField('contactPerson', event.target.value)}
                      className="w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Service areas</span>
                    <input
                      value={form.serviceAreas}
                      onChange={(event) => updateField('serviceAreas', event.target.value)}
                      placeholder="Example: Kochi, Kozhikode, Trivandrum"
                      className="w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Inventory or coverage summary</span>
                    <textarea
                      value={form.inventorySummary}
                      onChange={(event) => updateField('inventorySummary', event.target.value)}
                      rows={4}
                      placeholder="Add the formats, slots, placements, or field execution capacity you offer."
                      className="w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Website</span>
                    <input
                      value={form.website}
                      onChange={(event) => updateField('website', event.target.value)}
                      className="w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#101828]">Phone</span>
                    <input
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      className="w-full rounded-2xl border border-[#d7dded] bg-[#f8faff] px-4 py-3 outline-none focus:border-[#0028aa]"
                    />
                  </label>
                </div>

                <Button className="mt-6 w-full bg-[#0028aa] text-white hover:bg-[#001f85]" onClick={handleSubmit}>
                  Complete Onboarding
                </Button>
              </section>

              <section className="rounded-[28px] border border-[#dbe3f3] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef1ff] text-[#0028aa]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a94a6]">Selected Service</p>
                    <h2 className="mt-1 text-2xl font-heading font-bold text-[#101828]">{selectedVendorType.title}</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#667085]">{selectedVendorType.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#eef1ff] px-4 py-2 text-sm font-semibold text-[#0028aa]">
                  <Users className="h-4 w-4" />
                  Partner profile setup in progress
                </div>
              </section>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default VendorOnboarding;
