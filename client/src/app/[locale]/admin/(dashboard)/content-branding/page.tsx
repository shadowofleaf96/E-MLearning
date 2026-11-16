'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Upload,
  GraduationCap,
  FileEdit,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  Compass,
  Info,
  Loader2,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function ContentBrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [existingConfig, setExistingConfig] = useState<any>({});

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const primaryLogoInputRef = useRef<HTMLInputElement>(null);
  const darkLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const facultyImageInputRef = useRef<HTMLInputElement>(null);

  // We need to know which faculty member is currently uploading an image
  const [uploadingFacultyId, setUploadingFacultyId] = useState<string | null>(
    null
  );

  const [uploadingState, setUploadingState] = useState({
    primaryLogo: false,
    darkLogo: false,
    favicon: false,
  });

  // State Variables
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

  const [missionStatement, setMissionStatement] = useState(
    'To demystify complex systems and empower the next generation of engineers, data scientists, and theorists through rigorous foundational knowledge.'
  );
  const [visionStatement, setVisionStatement] = useState(
    'Establishing a global standard for computational literacy, where abstract theory seamlessly translates into scalable, real-world solutions.'
  );
  const [history, setHistory] = useState(
    'Founded in 2009 by a collective of researchers, QSR has evolved from a boutique theoretical workshop into a leading provider of enterprise-grade technical education.'
  );

  const [campusAddress, setCampusAddress] = useState(
    '400 Innovation Drive, Tech Park, San Francisco, CA 94105'
  );
  const [admissionsEmail, setAdmissionsEmail] = useState(
    'admissions@modernscholastic.edu'
  );
  const [mapCoordinates, setMapCoordinates] = useState(
    '37.7749° N, 122.4194° W'
  );

  const [faculty, setFaculty] = useState<any[]>([
    {
      id: 'fac_1',
      name: 'Dr. Aris Thorne',
      role: 'Head of Distributed Systems',
      bio: 'Former lead architect specializing in high-throughput microservice architectures.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAgPlVqCMppgLvGycAjL8huAAsx3yvgYDT3b4IXaJIkmzw1lIYELW5XHhxcAyvP57qiApSAiyLalnEMtdOSUZYNHnPuF0jCNCxgRUvI2OCxPqoCil4xi8GeR_6e5sgwcW839wa_2DF7FpPAolnzZk_b-34voIvIViVjiAUhLutTg8sXx_vWSHOBI-tXSxxia__faiL6RosUhdG4AUEoQ30LHiW2n1Uu6NOY6cCdSElzZegpol1mGN4gK51wxESq54ecFmVDIweTI1Q',
    },
    {
      id: 'fac_2',
      name: 'Dr. Elena Rostova',
      role: 'Director of Machine Learning',
      bio: 'Published author on deep learning. Focuses on pragmatic AI implementation for enterprise.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAo-IQLPaVfp-5bp-Ha2kCTCt1IuLbjK_SEIbVAslVYqRGXRDd0mP9UhKheqEpQybzmveJDHW7gpBCliPNR2E11xL_PahA_22d-hpTA-45l6svBVYaXfXgfcM0W8w1TR7tGsbFB74GGYplnnVUreoldNoD-ewy-Vi4sBAPQUW8PpZoritdT-ygllSgMFYxYRn4K0AFeGG4xR24xi-nnfOohFQZOfq6zDphwC-Ixg7ru_bmcqdxZMENmSxXK6wo8z0pZJDmS4vXIJcI',
    },
  ]);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await api.get('/tenants/current');
        if (res.data?.data) {
          const t = res.data.data;
          setTenantId(t.id);

          if (t.themeConfig) {
            setExistingConfig(t.themeConfig);
            setPrimaryLogo(t.themeConfig.primaryLogo || primaryLogo);
            setDarkLogo(t.themeConfig.darkLogo || darkLogo);
            setFavicon(t.themeConfig.favicon || '');
            setHeadline(t.themeConfig.headline || headline);
            setSubheadline(t.themeConfig.subheadline || subheadline);
            setFooterText(t.themeConfig.footerText || footerText);

            setMissionStatement(
              t.themeConfig.missionStatement || missionStatement
            );
            setVisionStatement(
              t.themeConfig.visionStatement || visionStatement
            );
            setHistory(t.themeConfig.history || history);

            setCampusAddress(t.themeConfig.campusAddress || campusAddress);
            setAdmissionsEmail(
              t.themeConfig.admissionsEmail || admissionsEmail
            );
            setMapCoordinates(t.themeConfig.mapCoordinates || mapCoordinates);

            if (t.themeConfig.faculty && Array.isArray(t.themeConfig.faculty)) {
              setFaculty(t.themeConfig.faculty);
            }
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
    if (!tenantId) return;
    setSaving(true);
    try {
      const themeConfig = {
        ...existingConfig,
        primaryLogo,
        darkLogo,
        favicon,
        headline,
        subheadline,
        footerText,
        missionStatement,
        visionStatement,
        history,
        campusAddress,
        admissionsEmail,
        mapCoordinates,
        faculty,
      };

      await api.put(`/tenants/${tenantId}/theme`, { themeConfig });
      toast.success('Content Branding updated successfully');
    } catch (error) {
      toast.error('Failed to update branding');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
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

      if (res.data?.url) {
        const url = res.data.url;
        if (key === 'primaryLogo') setPrimaryLogo(url);
        if (key === 'darkLogo') setDarkLogo(url);
        if (key === 'favicon') setFavicon(url);
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingState((prev) => ({ ...prev, [key]: false }));
      if (e.target) e.target.value = '';
    }
  };

  const handleUploadFacultyImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFacultyId) return;

    const toastId = toast.loading('Uploading faculty image...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url) {
        const url = res.data.url;
        setFaculty((prev) =>
          prev.map((f) =>
            f.id === uploadingFacultyId ? { ...f, image: url } : f
          )
        );
        toast.dismiss(toastId);
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Failed to upload image');
    } finally {
      setUploadingFacultyId(null);
      if (e.target) e.target.value = '';
    }
  };

  const triggerFacultyUpload = (id: string) => {
    setUploadingFacultyId(id);
    facultyImageInputRef.current?.click();
  };

  const addFaculty = () => {
    setFaculty([
      ...faculty,
      {
        id: `fac_${Date.now()}`,
        name: '',
        role: '',
        bio: '',
        image: '',
      },
    ]);
  };

  const updateFaculty = (id: string, field: string, value: string) => {
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const removeFaculty = (id: string) => {
    setFaculty((prev) => prev.filter((f) => f.id !== id));
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
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
      {/* Hidden inputs for uploads */}
      <input
        type="file"
        ref={primaryLogoInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleUploadImage(e, 'primaryLogo')}
      />
      <input
        type="file"
        ref={darkLogoInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleUploadImage(e, 'darkLogo')}
      />
      <input
        type="file"
        ref={faviconInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleUploadImage(e, 'favicon')}
      />
      <input
        type="file"
        ref={facultyImageInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUploadFacultyImage}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
            Branding Workspace
          </h2>
          <p className="text-base font-medium text-on-surface-variant mt-1">
            Configure your institution's visual identity and core content.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-2.5 rounded-xl border border-border-subtle bg-white font-bold text-sm text-on-surface-variant hover:bg-surface-container-lowest transition-all shadow-sm focus:outline-none">
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-secondary text-white font-bold text-sm hover:bg-secondary/90 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Configuration Columns */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Assets Section */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-6 h-6 text-secondary" />
              <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                Visual Assets
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Logo */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Primary Logo
                </label>
                <div
                  onClick={() => primaryLogoInputRef.current?.click()}
                  className="relative group border-2 border-dashed border-border-subtle rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center hover:border-secondary transition-colors bg-surface-container-lowest h-48 cursor-pointer overflow-hidden"
                >
                  {uploadingState.primaryLogo ? (
                    <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                  ) : (
                    <>
                      <div className="relative w-full h-full">
                        <Image
                          src={primaryLogo}
                          alt="Primary Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <Upload className="w-8 h-8 text-secondary" />
                      </div>
                    </>
                  )}
                </div>
                <p className="text-[11px] font-medium text-on-surface-variant text-center">
                  Recommended: 400x120px, PNG or SVG
                </p>
              </div>

              {/* Dark Logo */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Dark Mode Logo
                </label>
                <div
                  onClick={() => darkLogoInputRef.current?.click()}
                  className="relative group border-2 border-dashed border-border-subtle rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center hover:border-secondary transition-colors bg-primary-container h-48 cursor-pointer overflow-hidden"
                >
                  {uploadingState.darkLogo ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <>
                      <div className="relative w-full h-full">
                        <Image
                          src={darkLogo}
                          alt="Dark Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </>
                  )}
                </div>
                <p className="text-[11px] font-medium text-on-surface-variant text-center">
                  For headers with dark backgrounds
                </p>
              </div>

              {/* Favicon */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Favicon
                </label>
                <div
                  onClick={() => faviconInputRef.current?.click()}
                  className="relative group border-2 border-dashed border-border-subtle rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center hover:border-secondary transition-colors bg-surface-container-lowest h-48 cursor-pointer overflow-hidden"
                >
                  {uploadingState.favicon ? (
                    <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                  ) : favicon ? (
                    <>
                      <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center border border-border-subtle relative overflow-hidden">
                        <Image
                          src={favicon}
                          alt="Favicon"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <Upload className="w-8 h-8 text-secondary" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center border border-border-subtle">
                        <GraduationCap className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <Upload className="w-8 h-8 text-secondary" />
                      </div>
                    </>
                  )}
                </div>
                <p className="text-[11px] font-medium text-on-surface-variant text-center">
                  Recommended: 32x32px, ICO or PNG
                </p>
              </div>
            </div>
          </section>

          {/* Content Management */}
          <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 sm:p-8 space-y-10 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FileEdit className="w-6 h-6 text-secondary" />
              <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                Content Management
              </h3>
            </div>

            {/* Landing Page Fields */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">
                Hero Section
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Footer Legal Text
                  </label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Hero Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* About Page Details */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">
                About Page Details
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Mission Statement
                  </label>
                  <textarea
                    rows={3}
                    value={missionStatement}
                    onChange={(e) => setMissionStatement(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Vision Statement
                  </label>
                  <textarea
                    rows={3}
                    value={visionStatement}
                    onChange={(e) => setVisionStatement(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    History
                  </label>
                  <textarea
                    rows={3}
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Faculty Directory */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                <h4 className="text-sm font-bold text-secondary uppercase tracking-widest">
                  Faculty Directory
                </h4>
                <button
                  onClick={addFaculty}
                  className="text-secondary text-sm font-bold flex items-center gap-1.5 hover:underline focus:outline-none"
                >
                  <Plus className="w-4 h-4" /> Add Faculty
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faculty.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 sm:p-5 border border-border-subtle rounded-2xl bg-surface-container-low space-y-4 shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex justify-between">
                      <div
                        onClick={() => triggerFacultyUpload(member.id)}
                        className="w-14 h-14 rounded-full bg-surface-dim overflow-hidden relative border border-border-subtle group cursor-pointer"
                      >
                        {member.image ? (
                          <Image
                            className="object-cover"
                            src={member.image}
                            alt={member.name}
                            fill
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">
                            Img
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <button
                        onClick={() => removeFaculty(member.id)}
                        className="text-on-surface-variant hover:text-error focus:outline-none p-2 rounded-full hover:bg-surface-container-highest transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        className="w-full bg-white border border-border-subtle rounded-xl py-2 px-3 text-sm font-bold focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
                        placeholder="Name"
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          updateFaculty(member.id, 'name', e.target.value)
                        }
                      />
                      <input
                        className="w-full bg-white border border-border-subtle rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
                        placeholder="Title/Role"
                        type="text"
                        value={member.role}
                        onChange={(e) =>
                          updateFaculty(member.id, 'role', e.target.value)
                        }
                      />
                      <textarea
                        className="w-full bg-white border border-border-subtle rounded-xl py-2 px-3 text-xs font-medium resize-none focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
                        placeholder="Bio Summary"
                        rows={3}
                        value={member.bio}
                        onChange={(e) =>
                          updateFaculty(member.id, 'bio', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Institutional Info */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">
                Contact &amp; Institutional Info
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Campus Headquarters Address
                  </label>
                  <input
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
                    type="text"
                    value={campusAddress}
                    onChange={(e) => setCampusAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Admissions/Inquiry Email
                  </label>
                  <input
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
                    type="email"
                    value={admissionsEmail}
                    onChange={(e) => setAdmissionsEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                    Location/Map Coordinates
                  </label>
                  <input
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
                    type="text"
                    value={mapCoordinates}
                    onChange={(e) => setMapCoordinates(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Live Preview Sidebar (Sticky) */}
        <div className="col-span-12 lg:col-span-4 sticky top-[88px]">
          <div
            ref={previewContainerRef}
            className="bg-primary-container rounded-2xl shadow-xl overflow-hidden border border-outline-variant flex flex-col h-full bg-white"
          >
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-on-primary-fixed-variant flex items-center justify-between bg-[#131b2e]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-xp-gold"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#009668]"></div>
                <span className="text-[10px] text-on-primary-container font-mono ml-2 uppercase tracking-widest font-bold">
                  Live Preview: About
                </span>
              </div>
              <button
                onClick={toggleFullscreen}
                className="text-on-primary-container hover:text-white transition-colors focus:outline-none"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Preview Body */}
            <div className="bg-surface p-6 space-y-6 overflow-y-auto flex-1">
              {/* About Hero Snippet */}
              <div className="text-center space-y-3 pb-6 border-b border-border-subtle">
                <div className="flex justify-center mb-4 relative h-8 w-full">
                  <Image
                    src={primaryLogo}
                    alt="Live Preview Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="font-headline-md text-2xl font-bold text-primary leading-tight px-2">
                  {headline}
                </h4>
                <p className="text-on-surface-variant text-sm italic font-medium px-4">
                  {subheadline}
                </p>
              </div>

              {/* Mission Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <Compass className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Mission
                  </span>
                </div>
                <p className="text-on-surface text-sm leading-relaxed border-l-2 border-secondary/30 pl-4 italic font-medium bg-surface-container-lowest p-3 rounded-r-xl">
                  "{missionStatement}"
                </p>
              </div>

              {/* Faculty Preview */}
              {faculty.length > 0 && (
                <div className="space-y-4 pt-4">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest text-center">
                    Faculty Showcase
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {faculty.slice(0, 4).map((member) => (
                      <div
                        key={member.id}
                        className="p-4 bg-surface-container-lowest rounded-xl border border-border-subtle shadow-sm flex flex-col items-center text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-surface-dim mb-3 overflow-hidden relative">
                          {member.image ? (
                            <Image
                              className="object-cover"
                              src={member.image}
                              alt={member.name}
                              fill
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">
                              Img
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-on-surface truncate w-full">
                          {member.name || 'Name'}
                        </p>
                        <p className="text-[9px] font-medium text-on-surface-variant mt-0.5 truncate w-full">
                          {member.role || 'Role'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info Preview */}
              <div className="pt-6 border-t border-border-subtle space-y-2">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest text-center mb-4">
                  Contact
                </p>
                <p className="text-xs text-on-surface-variant text-center">
                  {campusAddress}
                </p>
                <p className="text-xs text-secondary text-center">
                  {admissionsEmail}
                </p>
              </div>

              {/* Footer Preview */}
              <div className="pt-6 text-center">
                <p className="text-[10px] text-on-surface-variant opacity-70 italic font-medium px-4">
                  {footerText}
                </p>
              </div>
            </div>
          </div>

          {/* Tips / Info */}
          <div className="mt-6 p-5 bg-surface-container border border-border-subtle rounded-2xl flex items-start gap-4 shadow-sm">
            <Info className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-on-surface-variant leading-snug">
              <strong className="text-on-surface">Note:</strong> Changes are
              cached locally until you hit "Save Changes". Institutional content
              is global across all branch sites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
