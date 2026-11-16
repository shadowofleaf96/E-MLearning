import '@/styles/index.css';
import { Inter, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ReduxProvider } from '@/store/provider';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { GoogleOAuthProvider } from '@react-oauth/google';
import initTranslations from '@/app/utils/i18n';
import i18nConfig from '@/app/utils/i18nConfig';
import TranslationProvider from '@/app/utils/TranslationProvider';
import ToastProvider from '@/components/ui/ToastProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const i18nNamespaces = ['translation'];

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata = {
  title: 'Lumina Learning',
  description: 'Quantum Systems Research Portal',
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .material-symbols-outlined.fill {
            font-variation-settings: 'FILL' 1;
          }
        `}</style>
      </head>
      <body
        className={`${inter.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} font-body-md antialiased`}
      >
        <ReduxProvider>
          <ReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
          >
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
            >
              <TenantProvider>
                <TranslationProvider
                  locale={locale}
                  resources={resources}
                  namespaces={i18nNamespaces}
                >
                  <ThemeProvider>
                    <ToastProvider>{children}</ToastProvider>
                  </ThemeProvider>
                </TranslationProvider>
              </TenantProvider>
            </GoogleOAuthProvider>
          </ReCaptchaProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
