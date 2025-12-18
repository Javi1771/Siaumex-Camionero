'use client';

import { CheckCircle2, CreditCard, TrendingUp, FileText } from 'lucide-react';

interface ProgressStepsProps {
  currentStyles: any;
  currentStep: number;
}

const steps = [
  { number: 1, title: 'Información', icon: CreditCard },
  { number: 2, title: 'Movimiento', icon: TrendingUp },
  { number: 3, title: 'Documentos', icon: FileText },
];

export function ProgressSteps({ currentStyles, currentStep }: ProgressStepsProps) {
  return (
    <div className={`${currentStyles.card} rounded-2xl p-6`}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.number;
          const isComplete = currentStep > step.number;
          
          return (
            <div key={step.number} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all mb-2 border-2 ${
                    isComplete
                      ? currentStyles.stepComplete
                      : isActive
                      ? currentStyles.stepActive
                      : currentStyles.stepInactive
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isActive || isComplete ? currentStyles.header : currentStyles.subtitle
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-7 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-0.5 ${
                    isComplete ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}