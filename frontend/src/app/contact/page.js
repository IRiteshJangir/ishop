'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'United States (US)',
    subject: '',
    message: '',
    newsletterAgreement: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'United States (US)',
        subject: '',
        message: '',
        newsletterAgreement: false,
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-gray-400">Shop</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Contact</span>
        </nav>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
          READY TO WORK WITH US
        </h1>

        {/* 2-Column: Form + Office Locations */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Form (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Contact us for all your questions and opinions
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Our support team typically responds within 2-4 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-800">Message Delivered Successfully!</h4>
                <p className="text-xs text-emerald-700">Thank you for reaching out. We will get in touch with you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Country / Region *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary text-slate-800"
                  >
                    <option>United States (US)</option>
                    <option>United Kingdom (UK)</option>
                    <option>Canada</option>
                    <option>Germany</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject (Optional)</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Note about your order, e.g. special note for delivery"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      name="newsletterAgreement"
                      checked={formData.newsletterAgreement}
                      onChange={handleChange}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>
                      I want to receive news and updates once in a while. By submitting, I&apos;m agreed to the <Link href="/about" className="text-primary underline">Terms &amp; Conditions</Link>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md"
                >
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>

          {/* Right: Branch Info & Team Image (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 text-xs text-gray-600">
              {/* US Headquarters */}
              <div className="space-y-1.5 border-b border-gray-100 pb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  UNITED STATES (HEAD QUATER)
                </span>
                <p className="font-bold text-slate-900 text-sm">152 Thatcher Road St, Mahatten, 10463, US</p>
                <p className="text-gray-500">(+025) 3886 25 16</p>
                <p className="text-primary font-medium">hello@swattechmart.com</p>
              </div>

              {/* UK Branch */}
              <div className="space-y-1.5 border-b border-gray-100 pb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  UNITED KINGDOM (BRANCH)
                </span>
                <p className="font-bold text-slate-900 text-sm">12 Buckingham Rd, Thornthwaite, HG3 4TY, UK</p>
                <p className="text-gray-500">(+718) 895-5350</p>
                <p className="text-primary font-medium">contact@swattechmart.co.uk</p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-1">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Team / Office Photograph (matching contact.jpg) */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
                alt="SWOO Tech Mart Team"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>

        </section>

        {/* FIND US ON GOOGLE MAP (Bottom of page 4) */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
            FIND US ON GOOGLE MAP
          </h3>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1680000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
