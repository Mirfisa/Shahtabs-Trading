import React from 'react';
import './BookingForm.css';

const BookingForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') || '';
    const carModel = formData.get('car-model') || '';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';

    const message = `Hello, I'd like to know about a car!\n\n Name: ${name}\n Preferred Car Model: ${carModel}\n Phone: ${phone}\n Email: ${email}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/8801811030303?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="booking-form-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold text-shadow-sm">BUY YOUR<br />DREAM CAR<br />WITH US!</h2>
            <p className="mt-4 text-shadow-sm">+88 018-11030303</p>
            <p className="text-shadow-sm">info@shahbab.com.bd</p>
          </div>
          <div>
            <form className="bg-[#FFF8F0] p-8 rounded-lg" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-shadow-sm">Name</label>
                  <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="car-model" className="block text-sm font-medium text-gray-700 text-shadow-sm">Preferred Car Model</label>
                  <input type="text" name="car-model" id="car-model" required className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-shadow-sm">Phone Number</label>
                  <input type="tel" name="phone" id="phone" required className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-shadow-sm">Email (Optional)</label>
                  <input type="email" name="email" id="email" className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors">SUBMIT NOW</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
