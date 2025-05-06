import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  isReportBug?: boolean;
}

//@ts-ignore
const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY as string;
//@ts-ignore
const discord = import.meta.env.VITE_DISCORD_WEBHOOK as string;

const ContactForm: React.FC<ContactFormProps> = ({
  isOpen,
  onClose,
  isReportBug,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: isReportBug ? "Report bug" : "General",
    message: "",
  });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Refs for focusing on error fields
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters.";
    if (!captchaValue) newErrors.captcha = "Please complete the CAPTCHA.";
    return newErrors;
  };

  const focusFirstError = (errs: { [key: string]: string }) => {
    if (errs.name && nameRef.current) nameRef.current.focus();
    else if (errs.email && emailRef.current) emailRef.current.focus();
    else if (errs.message && messageRef.current) messageRef.current.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);
    setIsSubmitting(true);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      focusFirstError(validationErrors);
      return;
    }

    try {
      // Discord webhook message
      const discordMessage = {
        embeds: [
          {
            title: `New Contact Form Submission: ${formData.subject}`,
            color: 0xe0ac54,
            fields: [
              { name: "Name", value: formData.name, inline: true },
              { name: "Email", value: formData.email, inline: true },
              { name: "Subject", value: formData.subject, inline: true },
              { name: "Message", value: formData.message },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const discordResponse = await fetch(discord, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordMessage),
      });

      if (!discordResponse.ok) {
        console.error("Discord webhook failed:", await discordResponse.text());
        throw new Error(
          `Discord webhook failed with status: ${discordResponse.status}`
        );
      }

      setSubmitSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "General", message: "" });
      setErrors({});
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
      setTimeout(() => {
        setSubmitSuccess(null);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again later.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
            aria-label="Close contact form"
          >
            <img src="/Close.png" alt="Close" className="w-4 h-4" />
          </button>

          <form
            onSubmit={handleSubmit}
            className="p-8"
            noValidate
            aria-live="polite"
          >
            <h2 className="text-2xl font-bold text-[#e0ac54] mb-6">
              Contact Us
            </h2>

            {submitSuccess && (
              <div className="mb-4 text-green-500 text-center font-semibold">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="mb-4 text-red-500 text-center font-semibold">
                {submitError}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="contact-name"
                className="block text-[#e0ac54] mb-2 text-sm font-medium"
              >
                Name
              </label>
              <input
                id="contact-name"
                ref={nameRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full p-2 bg-[#2a2a2a] text-white rounded border ${
                  errors.name ? "border-red-500" : "border-[#4a2d00]"
                } 
                         focus:border-[#e0ac54] focus:outline-none transition-colors`}
                autoComplete="off"
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? "contact-name-error" : undefined
                }
              />
              {errors.name && (
                <div
                  id="contact-name-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.name}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="contact-email"
                className="block text-[#e0ac54] mb-2 text-sm font-medium"
              >
                Email
              </label>
              <input
                id="contact-email"
                ref={emailRef}
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full p-2 bg-[#2a2a2a] text-white rounded border ${
                  errors.email ? "border-red-500" : "border-[#4a2d00]"
                } 
                         focus:border-[#e0ac54] focus:outline-none transition-colors`}
                autoComplete="off"
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
              />
              {errors.email && (
                <div
                  id="contact-email-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="contact-subject"
                className="block text-[#e0ac54] mb-2 text-sm font-medium"
              >
                Subject
              </label>
              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full p-2 bg-[#2a2a2a] text-white rounded border border-[#4a2d00] 
                         focus:border-[#e0ac54] focus:outline-none transition-colors"
              >
                <option value="General">General</option>
                <option value="Report bug">Report Bug</option>
                <option value="Suggest feature">Suggest Feature</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="contact-message"
                className="block text-[#e0ac54] mb-2 text-sm font-medium"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                ref={messageRef}
                name="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className={`w-full p-2 bg-[#2a2a2a] text-white rounded border ${
                  errors.message ? "border-red-500" : "border-[#4a2d00]"
                } 
                         focus:border-[#e0ac54] focus:outline-none transition-colors h-32 resize-none`}
                autoComplete="off"
                aria-invalid={!!errors.message}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
              />
              {errors.message && (
                <div
                  id="contact-message-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.message}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={recaptchaKey}
                  onChange={(value) => setCaptchaValue(value)}
                  theme="dark"
                />
              </div>
              {errors.captcha && (
                <div className="text-red-500 text-sm text-center mt-1">
                  {errors.captcha}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#e0ac54] text-white py-2 px-4 rounded font-semibold
                       hover:bg-[#F1D5BD] transition-colors flex items-center justify-center"
              disabled={!captchaValue || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
