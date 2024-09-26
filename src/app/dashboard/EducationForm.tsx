const EducationForm: React.FC = () => {
  return (
    <form className="space-y-4">
      <div>
        <label
          htmlFor="school"
          className="block text-sm font-medium text-gray-700"
        >
          School
        </label>
        <input
          type="text"
          id="school"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="degree"
          className="block text-sm font-medium text-gray-700"
        >
          Degree
        </label>
        <input
          type="text"
          id="degree"
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      {/* Add more fields */}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Save
      </button>
    </form>
  );
};

export default EducationForm;
