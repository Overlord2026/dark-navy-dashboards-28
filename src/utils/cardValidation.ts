
// Implements the Luhn algorithm for credit card validation
export const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const getCardType = (cardNumber: string): string => {
  const number = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6(?:011|5)/.test(number)) return 'Discover';
  return 'Unknown';
};

export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  }
  return value;
};

export const maskCardNumber = (cardNumber: string): string => {
  const last4 = cardNumber.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

// Updated to make all parameters optional with default values
export const validateCard = (values: {
  cardNumber?: string;
  cardName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
} = {}) => {
  const errors: Record<string, string> = {};
  
  // Card number validation
  if (values.cardNumber && !validateLuhn(values.cardNumber)) {
    errors.cardNumber = "Invalid card number";
  }

  // Name validation
  if (!values.cardName || /\d/.test(values.cardName)) {
    errors.cardName = "Name cannot be blank or contain numbers";
  }

  // Expiry date validation
  if (values.expiryMonth && values.expiryYear) {
    const today = new Date();
    const expiry = new Date(
      parseInt(`20${values.expiryYear}`), 
      parseInt(values.expiryMonth) - 1
    );
    
    if (expiry < today) {
      errors.expiryYear = "Expiry date must be in the future";
    }
  }

  // CVV validation
  if (values.cardNumber && values.cvv) {
    const cvvLength = getCardType(values.cardNumber) === 'American Express' ? 4 : 3;
    if (!values.cvv || values.cvv.length !== cvvLength) {
      errors.cvv = `CVV must be ${cvvLength} digits`;
    }
  }

  return errors;
};
