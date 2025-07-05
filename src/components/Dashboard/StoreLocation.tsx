"use client";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

const StoreLocation = () => {
  const storeInfo = {
    name: "MR Bike Modz",
    address:
      "Anitha, Uma, Maheswari tample, VRC Centre, Nellore, Andhra Pradesh 524001",
    phone: "+91 6304187805",
    email: "mrbikemodz@gmail.com",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.6430441279726!2d79.9784839!3d14.4477234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4c8d1d0bbbf1bb%3A0x6a69e6cfacfdad0!2sMR%20BIKE%20MODZ!5e0!3m2!1sen!2sin!4v1751658759962!5m2!1sen!2sin",
  };

  const handleDirections = () => {
    window.open(storeInfo.mapUrl, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${storeInfo.phone}`, "_self");
  };

  const handleEmail = () => {
    window.open(`mailto:${storeInfo.email}`, "_self");
  };

  return (
    <section id="store-location" className="py-16 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Visit Our Store
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Come experience our premium bike parts and accessories in person at
            our flagship store
          </p>
        </div>

        <div className="flex justify-center w-full">
          {/* Store Information */}
          <div className="space-y-8 flex gap-6 lg:gap-16 items-center justify-between w-full lg:w-[80vw] flex-wrap">
            <div className="space-y-6 grow-2 w-full lg:w-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg w-full">
                <h3 className="text-xl font-bold text-white mb-4">
                  Store Location
                </h3>

                {/* Map iframe */}
                <div className="relative w-full h-80 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.6430441279726!2d79.9784839!3d14.4477234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4c8d1d0bbbf1bb%3A0x6a69e6cfacfdad0!2sMR%20BIKE%20MODZ!5e0!3m2!1sen!2sin!4v1751658759962!5m2!1sen!2sin"
                    loading="lazy"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MR Bike Modz Store Location"
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm mb-3">
                    Located at Nellore , AndhraPradesh
                  </p>
                  <button
                    onClick={handleDirections}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Open in Google Maps →
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-lg grow-1">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MapPin className="h-6 w-6 text-red-400 mr-3" />
                Store Location
              </h3>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Address</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {storeInfo.address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <button
                      onClick={handleCall}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      {storeInfo.phone}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <button
                      onClick={handleEmail}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      {storeInfo.email}
                    </button>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Business Hours
                    </h4>
                    <p className="text-gray-300">{storeInfo.hours}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={handleDirections}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Navigation className="h-5 w-5" />
                  <span>Get Directions</span>
                </button>

                <button
                  onClick={handleCall}
                  className="w-full border border-red-600 text-red-400 hover:bg-red-600 hover:text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLocation;
