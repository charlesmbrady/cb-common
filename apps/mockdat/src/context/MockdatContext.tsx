import React, { createContext, useState, ReactNode } from 'react';

// 1. Define the shape of our context
export interface IMockdatContext {
  recordType: string;
  setRecordType: React.Dispatch<React.SetStateAction<string>>;
  selectedFields: string[];
  setSelectedFields: React.Dispatch<React.SetStateAction<string[]>>;
  recordCount: number;
  setRecordCount: React.Dispatch<React.SetStateAction<number>>;
  previewData: Array<Record<string, any>>;
  setPreviewData: React.Dispatch<
    React.SetStateAction<Array<Record<string, any>>>
  >;
  outputFormat: string;
  setOutputFormat: React.Dispatch<React.SetStateAction<string>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

// 2. Create the context with a default value of null (or partial).
export const MockdatContext = createContext<IMockdatContext | null>(null);

// 3. Define the provider's props
interface MockdatProviderProps {
  children: ReactNode;
}

// 4. Create the provider component
export const MockdatProvider: React.FC<MockdatProviderProps> = ({
  children,
}) => {
  // State that will be shared across all steps
  const [recordType, setRecordType] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [recordCount, setRecordCount] = useState<number>(10);
  const [previewData, setPreviewData] = useState<Array<Record<string, any>>>(
    []
  );
  const [outputFormat, setOutputFormat] = useState<string>('csv');
  const [step, setStep] = useState<number>(1);

  // The context value that will be supplied to any descendants of this provider
  const value: IMockdatContext = {
    recordType,
    setRecordType,
    selectedFields,
    setSelectedFields,
    recordCount,
    setRecordCount,
    previewData,
    setPreviewData,
    outputFormat,
    setOutputFormat,
    step,
    setStep,
  };

  return (
    <MockdatContext.Provider value={value}>{children}</MockdatContext.Provider>
  );
};
