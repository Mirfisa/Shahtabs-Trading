import React from 'react';
import './BookingForm.css';

const BookingForm: React.FC = () => {
  return (
    <section className="booking-form-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold">BUY YOUR<br/>DREAM CAR<br/>WITH US!</h2>
            <p className="mt-4">+88 018-11000303</p>
            <p>info@shahbab.com.bd</p>
          </div>
          <div>
            <form className="bg-[#FFF8F0] dark:bg-gray-900 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">Name</label>
                  <input type="text" name="name" id="name" className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white" />
                </div>
                <div>
                  <label htmlFor="car-model" className="block text-sm font-medium text-gray-700 dark:text-white">Preferred Car Model</label>
                  <input type="text" name="car-model" id="car-model" className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white">Phone Number</label>
                  <input type="text" name="phone" id="phone" className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
                  <input type="email" name="email" id="email" className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white" />
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 dark:bg-blue-500 dark:hover:bg-blue-600">SUBMIT NOW</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
