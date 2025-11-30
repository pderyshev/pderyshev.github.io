import { ReactNode } from 'react';

export interface IFormProps {
  title?: ReactNode;
  inputs: ReactNode[];
  buttons: ReactNode[];
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  children?: React.ReactNode;
}