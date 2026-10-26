import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Educational / General Question',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold block">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Contact SpaceOps
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-light">
          Have an educational inquiry, spotted a milestone update, or want to suggest a new space mission for our public directory? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl glass-panel border border-[#263449]">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">Message Received</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto font-light">
                Thank you for reaching out to SpaceOps. Our science editorial team will review your message and respond promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 rounded-xl bg-[#111C2E] border border-[#263449] text-xs font-mono text-sky-400"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                    placeholder="e.g. Alex Chen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Topic / Inquiry Type</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                >
                  <option>Educational / General Question</option>
                  <option>Suggest a Space Mission or Spacecraft</option>
                  <option>Report Schedule or Data Correction</option>
                  <option>Media & Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Share your feedback, question, or suggestions with our team..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl glass-panel border border-[#263449] space-y-4">
            <MessageSquare className="w-8 h-8 text-sky-400" />
            <h3 className="text-xl font-bold font-display text-white">Community Engagement</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              We welcome corrections from astronomers, students, and educators. If you observe any inaccuracy in our mission chronologies or launch countdowns, please let us know.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D1422] border border-[#263449] space-y-2 text-xs font-mono text-slate-400">
            <span className="text-sky-400 uppercase font-semibold block mb-1">Response Standard</span>
            <p className="text-slate-300">Inquiries are typically addressed within 24–48 hours by our educational team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
