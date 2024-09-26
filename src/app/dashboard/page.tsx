// import React from "react";

// function Dashboard() {
//   return <div>Dashboard</div>;
// }

// export default Dashboard;

"use client";
import React, { useState } from "react";
import PersonalInfoForm from "./PersonalInfoForm";
import EducationForm from "./EducationForm";
import ExperienceForm from "./ExperienceForm";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("Personal Info");

  const renderSection = () => {
    switch (activeSection) {
      case "Personal Info":
        return <PersonalInfoForm />;
      case "Education":
        return <EducationForm />;
      case "Experience":
        return <ExperienceForm />;
      // Add more cases for other sections as needed
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar */}
      <div className="sm:w-1/4 w-full bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        <ul className="space-y-2">
          <li
            onClick={() => setActiveSection("Personal Info")}
            className={`cursor-pointer p-3 rounded ${
              activeSection === "Personal Info" ? "bg-gray-600" : ""
            }`}
          >
            Personal Info
          </li>
          <li
            onClick={() => setActiveSection("Education")}
            className={`cursor-pointer p-3 rounded ${
              activeSection === "Education" ? "bg-gray-600" : ""
            }`}
          >
            Education
          </li>
          <li
            onClick={() => setActiveSection("Experience")}
            className={`cursor-pointer p-3 rounded ${
              activeSection === "Experience" ? "bg-gray-600" : ""
            }`}
          >
            Experience
          </li>
          {/* Add more navigation items */}
        </ul>
      </div>

      {/* Main content area */}
      <div className="w-full sm:w-3/4 p-8">
        <h1 className="text-3xl font-bold mb-6">{activeSection}</h1>
        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard;
