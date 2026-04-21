import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div about="contact">
      {" "}
      <div className="px-4 py-10 md:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#31859c]">
              Contact Us
            </h1>

            <p className="text-gray-600 mb-6">We’d love to hear from you 💙</p>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Email:</strong> support@Venora-store.com
              </p>
              <p>
                <strong>Phone:</strong> +20 109 547 5596
              </p>
              <p>
                <strong>Address:</strong> Cairo, Egypt
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#31859c]/10 p-6 rounded-2xl shadow-sm space-y-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-[#31859c]"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-[#31859c]"
            />

            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows="4"
              className="w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-[#31859c]"
            />

            <button
              type="submit"
              className="w-full bg-[#31859c] text-white py-3 rounded-lg hover:bg-[#2b7488] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
