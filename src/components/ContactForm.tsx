import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  isReportBug?: boolean; 
}
//@ts-ignore
const webHook = import.meta.env.VITE_DISCORD_WEBHOOK as string;
//@ts-ignore
const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY as string;
const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose, isReportBug }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: isReportBug ? 'Report bug' : 'General',
    message: ''
  });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaValue) {
      alert('Please complete the CAPTCHA');
      return;
    }

    const webhookUrl = webHook;
    
    const payload = {
      embeds: [{
        title: `New FAQ Form Submission - ${formData.subject}`,
        fields: [
          { name: 'Name', value: formData.name },
          { name: 'Email', value: formData.email },
          { name: 'Subject', value: formData.subject },
          { name: 'Message', value: formData.message }
        ],
        color: 0xe0ac54
      }]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: 'General', message: '' });
        recaptchaRef.current?.reset();
        setCaptchaValue(null);
        onClose();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md mx-4">
        <div className="relative bg-[#1a1a1a] rounded-lg border-2 border-[#e0ac54] shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors"
          >
            <img src="/Close.png" alt="Close" className="w-4 h-4" />
          </button>

          <form onSubmit={handleSubmit} className="p-8">
            <h2 className="text-2xl font-bold text-[#e0ac54] mb-6">Contact Us</h2>

            <div className="mb-4">
              <label className="block text-[#e0ac54] mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 bg-[#2a2a2a] text-white rounded border border-[#4a2d00] 
                         focus:border-[#e0ac54] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#e0ac54] mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 bg-[#2a2a2a] text-white rounded border border-[#4a2d00] 
                         focus:border-[#e0ac54] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#e0ac54] mb-2 text-sm font-medium">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full p-2 bg-[#2a2a2a] text-white rounded border border-[#4a2d00] 
                         focus:border-[#e0ac54] focus:outline-none transition-colors"
              >
                <option value="General">General</option>
                <option value="Report bug">Report Bug</option>
                <option value="Suggest feature">Suggest Feature</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[#e0ac54] mb-2 text-sm font-medium">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full p-2 bg-[#2a2a2a] text-white rounded border border-[#4a2d00] 
                         focus:border-[#e0ac54] focus:outline-none transition-colors h-32 resize-none"
                required
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey= {recaptchaKey}
                  onChange={(value) => setCaptchaValue(value)}
                  theme="dark"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#e0ac54] text-white py-2 px-4 rounded font-semibold
                       hover:bg-[#F1D5BD] transition-colors"
              disabled={!captchaValue}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;