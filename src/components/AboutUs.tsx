import React from 'react';

const AboutUs: React.FC = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Image Side */}
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src={`/about_us_combined.png`}
                                alt="Luxury Car Showroom"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="relative">
                            <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-wide">
                                About Us
                            </h2>
                            <div className="h-1.5 w-16 bg-orange-500 mt-2"></div>
                        </div>

                        <p className="text-lg text-gray-700 leading-relaxed text-justify">
                            <span className="font-semibold">Shahtab's Trading</span> is a premier car import and dealership company based in
                            Bangladesh. Renowned for its commitment to quality and customer
                            satisfaction, Shahtab's Trading has established itself as a trusted name in the
                            automotive industry. Specializing in the import and sale of a wide range of car
                            brands, including Toyota, Honda, Nissan, and many more, the company caters
                            to the diverse needs of car enthusiasts and buyers in Bangladesh.
                        </p>

                        <p className="text-lg text-gray-700 leading-relaxed text-justify">
                            Shahtab's Trading aims to provide high-quality vehicles and exceptional
                            customer service, ensuring a seamless and trustworthy car-buying experience.
                            The company is dedicated to maintaining the highest standards of integrity and
                            professionalism in all its operations.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
