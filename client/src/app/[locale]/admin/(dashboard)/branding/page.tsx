'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Upload,
  GraduationCap,
  Palette,
  Type,
  Layout,
  Sparkles,
  Maximize,
  Minimize,
  CheckCircle2,
  Zap,
  Info,
  Loader2,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';
export default function TenantBrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [existingConfig, setExistingConfig] = useState<any>({});

  const [uploadingState, setUploadingState] = useState({
    primaryLogo: false,
    darkLogo: false,
    favicon: false,
  });

  const primaryLogoInputRef = useRef<HTMLInputElement>(null);
  const darkLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLElement>(null);

  // Form State
  const [primaryColor, setPrimaryColor] = useState('#0058BE');
  const [successColor, setSuccessColor] = useState('#009668');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [primaryLogo, setPrimaryLogo] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7L3Oo6TXBPrCslQ7Gf11_dkLjhtjAF0vifOKPjigbpOxVPTw--gGsdwLn-xr3yMh5SDgHpxwPorkfLwHUqWx4Lmx6YKcQ0CAyTmnQV9cp5v7tWMoimvDE1bBRFsBcwRfOH0pVzx4XzsPvodf_kLS4zyZ6nRgUiPTedC_dVafzmpumSw25mxzRRPdfsdJAeCB0pX2T1cujbUCCf9JxrsKDDcthZG_AJCuGGyC4CAM0y0BN0ZVEiDPVNiMpnseTCVqcqNDuHe51lrs'
  );
  const [darkLogo, setDarkLogo] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCeUVVv-hBlQHNfECaQ3xWcCUP_q-wYy634BI0UXBVb6td9wvxbhEzbfrtaSAcphPTvYwjWUkO87V5JQSsM3NoMKq531WJ_kv0smFxCzbxady4Rc0n9yRNBC3sKGevZPi7bRojMc8XyzkA_X0xLbWn5i53tjjkLq28lkekh2lNeljTOBD9Anqx7pONUt7uUNLwmcOrTiQmVh3lgKawu2fSTmnO_N9mGJmfXgcTj6-oU8b7k5XMrKxv3-N14TBEFtFEiWHe98LluUjs'
  );
  const [favicon, setFavicon] = useState('');

  const [headline, setHeadline] = useState(
    'Master the Art of Modern Development'
  );
  const [subheadline, setSubheadline] = useState(
    'An industry-leading platform for institutional grade online learning and professional certification.'
  );
  const [footerText, setFooterText] = useState(
    '© 2024 Modern Scholastic Academy. All rights reserved.'
  );

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await api.get('/tenants/current');
        if (res.data?.data) {
          const t = res.data.data;
          setTenantId(t.id);

          if (t.themeConfig) {
            setExistingConfig(t.themeConfig);
            setPrimaryColor(t.themeConfig.primaryColor || '#0058BE');
            setSuccessColor(t.themeConfig.successColor || '#009668');
            setFontFamily(t.themeConfig.fontFamily || 'Inter');
            setPrimaryLogo(t.themeConfig.primaryLogo || primaryLogo);
            setDarkLogo(t.themeConfig.darkLogo || darkLogo);
            setFavicon(t.themeConfig.favicon || '');
            setHeadline(t.themeConfig.headline || headline);
            setSubheadline(t.themeConfig.subheadline || subheadline);
            setFooterText(t.themeConfig.footerText || footerText);
          }
        }
      } catch (err) {
        console.error('Failed to fetch tenant details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleSave = async () => {
    if (!tenantId) {
      toast.error('Tenant ID not found');
      return;
    }

    setSaving(true);
    try {
      const themeConfig = {
        ...existingConfig,
        primaryColor,
        successColor,
        fontFamily,
        primaryLogo,
        darkLogo,
        favicon,
        headline,
        subheadline,
        footerText,
      };

      await api.put(`/tenants/${tenantId}/theme`, { themeConfig });
      toast.success(
        'Branding settings saved successfully! Refresh to see changes across the app.'
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to save branding settings'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    key: 'primaryLogo' | 'darkLogo' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState((prev) => ({ ...prev, [key]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.data?.url) {
        setter(res.data.data.url);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingState((prev) => ({ ...prev, [key]: false }));
      if (e.target) e.target.value = '';
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewContainerRef.current?.requestFullscreen().catch(() => {
        toast.error('Failed to enter fullscreen mode');
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-on-surface-variant font-medium text-center">
        Loading branding workspace...
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-primary">
            Branding Workspace
          </h2>
          <p className="text-on-surface-variant mt-1 text-sm md:text-base">
            Configure your institution's visual identity across the platform.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-border-subtle bg-white font-bold text-on-surface-variant hover:bg-surface-bg transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            Discard Changes
          </button>
          <button
            disabled={saving}
            onClick={handleSave}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Configuration Columns */}
        <div className="xl:col-span-8 space-y-8">
          {/* Assets Section */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="text-secondary w-6 h-6" />
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Visual Assets
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Logo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Primary Logo (Click to change)
                </label>
                <input
                  type="file"
                  className="hidden"
                  ref={primaryLogoInputRef}
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(e, setPrimaryLogo, 'primaryLogo')
                  }
                />
                <div
                  onClick={() => primaryLogoInputRef.current?.click()}
                  className="relative group border-2 border-dashed border-border-subtle rounded-2xl p-4 flex flex-col items-center justify-center hover:border-secondary transition-colors bg-surface-container-lowest h-48 cursor-pointer overflow-hidden"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={primaryLogo}
                      alt="Primary Logo"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    {uploadingState.primaryLogo ? (
                      <Loader2 className="text-secondary w-8 h-8 animate-spin" />
                    ) : (
                      <Upload className="text-secondary w-8 h-8" />
                    )}
                  </div>
                </div>
              </div>

              {/* Dark Logo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Dark Mode Logo (Click to change)
                </label>
                <input
                  type="file"
                  className="hidden"
                  ref={darkLogoInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setDarkLogo, 'darkLogo')}
                />
                <div
                  onClick={() => darkLogoInputRef.current?.click()}
                  className="relative group border-2 border-dashed border-border-subtle rounded-2xl p-4 flex flex-col items-center justify-center hover:border-secondary transition-colors bg-primary-container h-48 cursor-pointer overflow-hidden"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={darkLogo}
                      alt="Dark Mode Logo"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    {uploadingState.darkLogo ? (
                      <Loader2 className="text-white w-8 h-8 animate-spin" />
                    ) : (
                      <Upload className="text-white w-8 h-8" />
                    )}
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Favicon (Click to change)
                </label>
                <input
                  type="file"
                  className="hidden"
                  ref={faviconInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setFavicon, 'favicon')}
                />
                <div
                  onClick={() => faviconInputRef.current?.click()}
                  className="relative group border-2 border-dashed border-border-subtle rounded-2xl p-8 flex flex-col items-center justify-center hover:border-secondary transition-colors bg-surface-container-lowest h-48 cursor-pointer overflow-hidden"
                >
                  {favicon ? (
                    <div className="relative w-16 h-16">
                      <Image
                        src={favicon}
                        alt="Favicon"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center border border-border-subtle shadow-sm">
                      <GraduationCap className="text-secondary w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    {uploadingState.favicon ? (
                      <Loader2 className="text-secondary w-8 h-8 animate-spin" />
                    ) : (
                      <Upload className="text-secondary w-8 h-8" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Identity & Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Color Palette */}
            <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 h-full shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="text-secondary w-6 h-6" />
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Color Palette
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3 p-2 border border-border-subtle rounded-xl bg-surface-container-lowest">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Success Accent Color
                  </label>
                  <div className="flex items-center gap-3 p-2 border border-border-subtle rounded-xl bg-surface-container-lowest">
                    <input
                      type="color"
                      value={successColor}
                      onChange={(e) => setSuccessColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={successColor}
                      onChange={(e) => setSuccessColor(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Typography */}
            <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 h-full shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Type className="text-secondary w-6 h-6" />
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Typography
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary outline-none appearance-none cursor-pointer"
                  >
                    <option value="Inter">Inter (Sans-serif)</option>
                    <option value="Roboto">Roboto (Sans-serif)</option>
                    <option value="Outfit">Outfit (Display)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  </select>
                </div>

                <div className="p-4 bg-surface-container-lowest rounded-xl border border-border-subtle space-y-3">
                  <h1
                    className="text-2xl font-bold text-on-surface"
                    style={{ fontFamily: fontFamily }}
                  >
                    Headline Example
                  </h1>
                  <p
                    className="text-sm text-on-surface-variant"
                    style={{ fontFamily: fontFamily }}
                  >
                    The quick brown fox jumps over the lazy dog. This is how
                    your platform's body copy will appear to learners.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Institution Information */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Layout className="text-secondary w-6 h-6" />
              <h3 className="font-headline-md text-xl font-bold text-on-surface">
                Institution Information (Landing Page)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Enter main headline"
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Subheadline
                </label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="Enter subheadline/description"
                  rows={3}
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Footer Text
                </label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="© 2024 Your Institution"
                  className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Live Preview Panel */}
        <div className="xl:col-span-4 sticky top-6">
          <section
            ref={previewContainerRef}
            className="bg-surface-card rounded-2xl border border-border-subtle shadow-lg overflow-hidden flex flex-col h-full bg-white"
          >
            <div className="px-6 py-4 border-b border-border-subtle bg-surface-container-lowest flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout className="text-on-surface-variant w-5 h-5" />
                <h3 className="font-headline-sm font-bold text-on-surface">
                  Live Preview
                </h3>
              </div>
              <button
                onClick={toggleFullscreen}
                className="text-secondary hover:bg-secondary/10 p-1.5 rounded-lg transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            </div>

            <div
              className="p-4 bg-surface-bg flex-1"
              style={{ fontFamily: fontFamily }}
            >
              {/* Fake Landing Page */}
              <div className="bg-white rounded-xl shadow-sm border border-border-subtle overflow-hidden h-[600px] flex flex-col">
                {/* Navbar */}
                <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
                  <div className="relative h-6 w-24">
                    <Image
                      src={primaryLogo}
                      alt="Logo"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-12 h-3 bg-gray-100 rounded-full"></div>
                    <div className="w-12 h-3 bg-gray-100 rounded-full"></div>
                  </div>
                </div>

                {/* Hero */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-gray-50 to-white z-0"></div>

                  <div className="z-10 w-full space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm mx-auto mb-2 text-xs font-bold text-gray-600">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      New Courses Available
                    </div>

                    <h1
                      className="text-2xl font-bold leading-tight"
                      style={{ color: primaryColor }}
                    >
                      {headline}
                    </h1>

                    <p className="text-gray-500 text-xs px-4">{subheadline}</p>

                    <div className="pt-4 flex gap-2 justify-center">
                      <button
                        className="px-4 py-2 rounded-lg text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Start Learning
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-bold shadow-sm">
                        View Catalog
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Cards */}
                <div className="p-4 bg-gray-50 grid grid-cols-2 gap-3 shrink-0">
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm space-y-2">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                      style={{ backgroundColor: successColor }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                    <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm space-y-2">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center"
                      style={{
                        backgroundColor: primaryColor + '20',
                        color: primaryColor,
                      }}
                    >
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                    <div className="w-1/2 h-2 bg-gray-100 rounded-full"></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 p-4 shrink-0 text-center text-xs text-gray-500 border-t border-gray-200 mt-auto">
                  {footerText}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border-subtle bg-surface-container-lowest flex items-start gap-2">
              <Info className="w-4 h-4 text-on-surface-variant mt-0.5 shrink-0" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This is a simulated preview. Actual rendering may vary slightly
                depending on device size and content length.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
