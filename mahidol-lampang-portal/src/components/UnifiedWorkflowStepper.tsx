import React from 'react';
import { ActivityWorkflowStatus } from '../types';
import { AdminWorkflowStepper } from './AdminWorkflowStepper';

interface UnifiedWorkflowStepperProps {
  currentStep: number; // 1 to 9
  status: ActivityWorkflowStatus;
  onStepClick?: (step: number) => void;
  maxStepAllowed?: number;
}

export const UnifiedWorkflowStepper: React.FC<UnifiedWorkflowStepperProps> = ({
  currentStep,
  status,
  onStepClick,
  maxStepAllowed = 9,
}) => {
  return (
    <AdminWorkflowStepper
      currentStep={currentStep}
      status={status}
      onStepClick={onStepClick}
      maxStepAllowed={maxStepAllowed}
      maxStepReached={maxStepAllowed}
    />
  );
};
