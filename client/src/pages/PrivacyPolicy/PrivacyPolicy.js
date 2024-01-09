import React, { useEffect } from 'react';
import Layout from '../../layout/Layout';

// import applyTheme from '../utils/colorThemeHandler';

const PrivacyPolicyPage = () => {
  //   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  //     applyTheme(); // Update the theme when the preference changes
  //   });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col dark:bg-black dark:text-white min-h-screen">
        <div className="flex-grow max-w-3xl mx-auto p-10 pt-5">
          <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="mb-4">
              This Privacy Policy outlines how we collect, use, and maintain information collected
              from users of our website. We take your privacy very seriously and are committed to
              protecting it through our compliance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p className="mb-4">
              We may collect personal information such as names, email addresses, calendar
              information and other details provided voluntarily by users when they sigin in to
              CanvasLy through Google.
            </p>
            <p className="mb-4">
              Additionally, we may automatically collect certain information about your device,
              including IP addresses, browser types, and browsing patterns for analytical purposes
              and to ensure proper functioning of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Information</h2>
            <p className="mb-4">
              We use the collected information to provide and improve our services, customize user
              experience, and analyze usage patterns.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Disclosure of Information</h2>
            <p className="mb-4">
              We do not sell, trade, or rent users' personal information to others. Everything is
              kept in house to ensure your privacy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Protect Your Information</h2>
            <p className="mb-4">
              All traffic to the site is in encrypted via SSL. We also never receive or store your
              Google account password. We only receive your email address and name.
            </p>
          </section>

          {/* Add more sections as needed for your privacy policy content */}
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;
