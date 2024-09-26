import React from "react";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi"; // For arrow icons in buttons

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-12 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Build Your Professional Resume Online
          </h1>
          <p className="text-lg md:text-2xl mb-8">
            Create a standout resume in minutes with our user-friendly online
            tool.
          </p>
          <a
            href="#features"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-100 transition duration-300"
          >
            Get Started <FiArrowRight className="inline ml-2" />
          </a>
        </div>
        {/* Decorative Blob Shape */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-opacity-20 bg-gradient-to-b from-blue-400 to-transparent rounded-full mix-blend-overlay pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Image
                width={50}
                height={50}
                src="/icons/customize.svg"
                alt="Customize"
                className="w-12 h-12 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Easy Customization</h3>
              <p className="text-gray-600">
                Personalize every detail of your resume with our simple editing
                tools.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Image
                width={50}
                height={50}
                src="/icons/templates.svg"
                alt="Templates"
                className="w-12 h-12 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Modern Templates</h3>
              <p className="text-gray-600">
                Choose from a variety of modern and professional resume
                templates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Image
                width={50}
                height={50}
                src="/icons/download.svg"
                alt="Download"
                className="w-12 h-12 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Download in Multiple Formats
              </h3>
              <p className="text-gray-600">
                Save your resume in PDF, DOCX, or any format that suits your
                needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to create your resume?
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Sign up now and start building your professional resume with ease!
          </p>
          <a
            href="#"
            className="inline-block px-6 py-3 bg-white text-green-500 font-semibold rounded-md shadow hover:bg-gray-100 transition duration-300"
          >
            Sign Up for Free <FiArrowRight className="inline ml-2" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Resume Builder. All rights
            reserved.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-gray-400">
              Facebook
            </a>
            <a href="#" className="hover:text-gray-400">
              Twitter
            </a>
            <a href="#" className="hover:text-gray-400">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
