import  { useState } from 'react';
import { DynamicForm } from './components/DynamicForm';
import { FormData, FormField, TabType } from './types/form';
import { FileJson, Code, CheckCircle } from 'lucide-react';
import { Tab } from './components/Tab';

const formSchema: { title: string; fields: FormField[] } = {
  title: "Personal Information Form",
  fields: [
    {
      id: "personalInfo",
      name: "personalInfo",
      type: "section",
      label: "Personal Information",
      description: "Basic personal details",
      fields: [
        {
          id: "firstName",
          name: "firstName",
          type: "text",
          label: "First Name",
          placeholder: "Enter your first name",
          required: true,
        },
        {
          id: "lastName",
          name: "lastName",
          type: "text",
          label: "Last Name",
          placeholder: "Enter your last name",
          required: true,
        },
        {
          id: "email",
          name: "email",
          type: "email",
          label: "Email Address",
          placeholder: "your.email@example.com",
          required: true,
        },
        {
          id: "phone",
          name: "phone",
          type: "tel",
          label: "Phone Number",
          placeholder: "(123) 456-7890",
          required: false,
        },
        {
          id: "birthDate",
          name: "birthDate",
          type: "date",
          label: "Date of Birth",
          required: false,
        },
      ],
    },
    {
      id: "address",
      name: "address",
      type: "section",
      label: "Address",
      description: "Your current residence",
      fields: [
        {
          id: "street",
          name: "street",
          type: "text",
          label: "Street Address",
          placeholder: "123 Main St",
          required: true,
        },
        {
          id: "city",
          name: "city",
          type: "text",
          label: "City",
          placeholder: "New York",
          required: true,
        },
        {
          id: "state",
          name: "state",
          type: "select",
          label: "State",
          placeholder: "Select a state",
          required: true,
          options: [
            { value: "NY", label: "New York" },
            { value: "CA", label: "California" },
            { value: "TX", label: "Texas" },
            { value: "FL", label: "Florida" },
            { value: "IL", label: "Illinois" },
          ],
        },
        {
          id: "zipCode",
          name: "zipCode",
          type: "text",
          label: "Zip Code",
          placeholder: "10001",
          required: true,
        },
      ],
    },
    {
      id: "education",
      name: "education",
      type: "section",
      label: "Education",
      description: "Your educational background",
      fields: [
        {
          id: "highestDegree",
          name: "highestDegree",
          type: "select",
          label: "Highest Degree",
          placeholder: "Select your highest degree",
          required: true,
          options: [
            { value: "highSchool", label: "High School" },
            { value: "associate", label: "Associate's Degree" },
            { value: "bachelor", label: "Bachelor's Degree" },
            { value: "master", label: "Master's Degree" },
            { value: "doctorate", label: "Doctorate" },
          ],
        },
        {
          id: "university",
          name: "university",
          type: "text",
          label: "University/Institution",
          placeholder: "Harvard University",
          required: false,
        },
        {
          id: "graduationYear",
          name: "graduationYear",
          type: "number",
          label: "Graduation Year",
          placeholder: "2020",
          required: false,
        },
        {
          id: "fieldOfStudy",
          name: "fieldOfStudy",
          type: "text",
          label: "Field of Study",
          placeholder: "Computer Science",
          required: false,
        },
      ],
    },
    {
      id: "workExperience",
      name: "workExperience",
      type: "section",
      label: "Work Experience",
      description: "Your most recent employment",
      fields: [
        {
          id: "currentlyEmployed",
          name: "currentlyEmployed",
          type: "radio",
          label: "Are you currently employed?",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
        },
        {
          id: "employer",
          name: "employer",
          type: "text",
          label: "Current/Most Recent Employer",
          placeholder: "Google Inc.",
          required: false,
        },
        {
          id: "jobTitle",
          name: "jobTitle",
          type: "text",
          label: "Job Title",
          placeholder: "Software Engineer",
          required: false,
        },
        {
          id: "jobDescription",
          name: "jobDescription",
          type: "textarea",
          label: "Job Description",
          placeholder: "Describe your responsibilities and achievements...",
          required: false,
          rows: 3,
        },
        {
          id: "startDate",
          name: "startDate",
          type: "date",
          label: "Start Date",
          required: false,
        },
        {
          id: "endDate",
          name: "endDate",
          type: "date",
          label: "End Date (leave blank if current)",
          required: false,
        },
      ],
    },
    {
      id: "preferences",
      name: "preferences",
      type: "section",
      label: "Preferences",
      description: "Additional information",
      fields: [
        {
          id: "receiveEmails",
          name: "receiveEmails",
          type: "checkbox",
          label: "I would like to receive email updates",
          required: false,
        },
        {
          id: "termsAccepted",
          name: "termsAccepted",
          type: "checkbox",
          label: "I accept the terms and conditions",
          required: true,
        },
      ],
    },
  ],
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleSubmit = (data: FormData) => {
    setFormData(data);
    setActiveTab('result');
  };

  const tabs = [
    { id: 'form' as TabType, label: 'Form', icon: FileJson },
    { id: 'schema' as TabType, label: 'Schema', icon: Code },
    { id: 'result' as TabType, label: 'Result', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 p-4">
              {tabs.map(({ id, label, icon: Icon }) => (
                <Tab
                  key={id}
                  label={
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                  }
                  isActive={activeTab === id}
                  onClick={() => setActiveTab(id)}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'form' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{formSchema.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Fill out the form below. All fields marked with * are required.</p>
                <DynamicForm
                  className="p-8"
                  schema={formSchema.fields}
                  onSubmit={handleSubmit}
                  renderSection={(section, fields) => (
                    <div className="my-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.label}</h2>
                      <div className="space-y-4">{fields}</div>
                    </div>
                  )}
                  renderSubmit={(handleSubmit) => (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleSubmit}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                />
              </div>
            )}

            {activeTab === 'schema' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Form Schema</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">The JSON schema that generates the dynamic form</p>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                  <code className="text-gray-800 dark:text-gray-200">{JSON.stringify(formSchema, null, 2)}</code>
                </pre>
              </div>
            )}

            {activeTab === 'result' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Form Submission Result</h2>
                {formData ? (
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                    <code className="text-gray-800 dark:text-gray-200">{JSON.stringify(formData, null, 2)}</code>
                  </pre>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No form submission yet. Please fill out and submit the form to see the results.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;