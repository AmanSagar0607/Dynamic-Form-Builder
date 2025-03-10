import React, { useState } from 'react';
import { FormField, FormData, FormErrors } from '../types/form';
import { AlertCircle, GripVertical  } from 'lucide-react';
// import {  Sun, Moon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DynamicFormProps {
  schema: FormField[];
  onSubmit: (data: FormData) => void;
  renderSection?: (section: FormField, fields: React.ReactNode) => React.ReactNode;
  renderSubmit?: (handleSubmit: (e: React.FormEvent) => void) => React.ReactNode;
  className?: string;
}

const SortableField: React.FC<{ field: FormField; children: React.ReactNode }> = ({ field, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id || field.name });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div {...attributes} {...listeners} className="absolute left-0 top-0 h-full flex items-center cursor-move px-2 opacity-50 hover:opacity-100">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
};

export const DynamicForm: React.FC<DynamicFormProps> = ({
  schema: initialSchema,
  onSubmit,
  renderSection,
  renderSubmit,
  className,
}) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [schema, setSchema] = useState(initialSchema);
  const [isDarkMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const validateField = (field: FormField, value: any): string => {
    if (field.required && !value && value !== false) return 'This field is required';
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
    if (field.validation?.pattern && value && !new RegExp(field.validation.pattern).test(value)) {
      return field.validation.message || 'Invalid format';
    }
    return '';
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    const field = schema.find((f) => f.name === fieldName);
    if (field) setErrors((prev) => ({ ...prev, [fieldName]: validateField(field, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    let hasErrors = false;

    const validateFields = (fields: FormField[]) => {
      fields.forEach((field) => {
        if (field.type === 'section' && field.fields) {
          validateFields(field.fields);
        } else {
          const error = validateField(field, formData[field.name]);
          if (error) {
            newErrors[field.name] = error;
            hasErrors = true;
          }
        }
      });
    };

    validateFields(schema);
    if (hasErrors) return setErrors(newErrors);
    onSubmit(formData);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSchema((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  //   document.documentElement.classList.toggle('dark');
  // };

  const renderField = (field: FormField) => {
    const error = errors[field.name];
    const baseInputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
      error ? 'border-red-500' : 'border-gray-300'
    } ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`;

    const content = (
      <>
        {field.type !== 'checkbox' && (
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {/* {field.label} */}
            {field.required && <span className="text-red-500">*</span>}
          </label>
        )}
        {(() => {
          switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'date':
            case 'number':
              return (
                <input
                  type={field.type}
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={baseInputClasses}
                />
              );
            case 'select':
              return (
                <select
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={baseInputClasses}
                >
                  <option value="">{field.placeholder || 'Select an option'}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              );
            case 'checkbox':
              return (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={formData[field.name] || false}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded ${
                      isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'
                    }`}
                  />
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </span>
                </label>
              );
            case 'radio':
              return (
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={formData[field.name] === option.value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300'
                        }`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{option.label}</span>
                    </label>
                  ))}
                </div>
              );
            case 'textarea':
              return (
                <textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows={field.rows || 3}
                  className={baseInputClasses}
                />
              );
            case 'section':
              const fieldsContent = field.fields?.map((subField) => (
                <SortableField key={subField.id || subField.name} field={subField}>
                  {renderField(subField)}
                </SortableField>
              ));

              if (renderSection) {
                return renderSection(field, fieldsContent || []);
              }

              return (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{field.label}</h3>
                  {field.description && (
                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{field.description}</p>
                  )}
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={field.fields?.map((f) => f.id || f.name) || []} strategy={verticalListSortingStrategy}>
                      {fieldsContent}
                    </SortableContext>
                  </DndContext>
                </div>
              );
            default:
              return null;
          }
        })()}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </>
    );

    return field.type === 'section' ? (
      <div key={field.id || field.name} className="mb-6">
        {content}
      </div>
    ) : (
      <SortableField key={field.id || field.name} field={field}>
        <div className="mb-4">{content}</div>
      </SortableField>
    );
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* <button
          onClick={toggleDarkMode}
          className={`fixed top-4 right-4 p-2 rounded-full ${
            isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-800'
          } shadow-lg hover:shadow-xl transition-all duration-200`}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button> */}
        <form onSubmit={handleSubmit} className={className}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={schema.map((field) => field.id || field.name)} strategy={verticalListSortingStrategy}>
              {schema.map(renderField)}
            </SortableContext>
          </DndContext>
          {renderSubmit ? (
            renderSubmit(handleSubmit)
          ) : (
            <button
              type="submit"
              className={`w-full px-4 rounded-md transition-colors duration-200 ${
                isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};