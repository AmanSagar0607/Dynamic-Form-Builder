export interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'tel' | 'date' | 'number' | 'section';
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  fields?: FormField[];
  description?: string;
  rows?: number;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface TabProps {
  label: string | React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export type TabType = 'form' | 'schema' | 'result';