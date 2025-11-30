export interface IInput {
  className?: string;
  type: string;
  name: string;
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}