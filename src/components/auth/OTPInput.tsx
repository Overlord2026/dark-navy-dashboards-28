import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpArray = value.split('').slice(0, length);
  while (otpArray.length < length) {
    otpArray.push('');
  }

  useEffect(() => {
    if (activeIndex >= 0 && inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const handleInputChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    
    const newOtp = [...otpArray];
    newOtp[index] = digit;
    
    const newValue = newOtp.join('');
    onChange(newValue);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otpArray];
      
      if (otpArray[index]) {
        // Clear current input
        newOtp[index] = '';
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = '';
        setActiveIndex(index - 1);
      }
      
      onChange(newOtp.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handleFocus = (index: number) => {
    if (disabled) return;
    setActiveIndex(index);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    onChange(digits);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(digits.length, length - 1);
    setActiveIndex(nextIndex);
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otpArray.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold border rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "bg-background text-foreground border-border",
            digit && "border-primary",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};