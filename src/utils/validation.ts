// Validation utilities
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email.trim()) {
    return { valid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
};

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username.trim()) {
    return { valid: false, error: 'Username is required' };
  }
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  return { valid: true };
};

export const validatePhoneNumber = (phone: string): { valid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { valid: false, error: 'Phone number is required' };
  }
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  return { valid: true };
};

export const validateFullName = (name: string): { valid: boolean; error?: string } => {
  if (!name.trim()) {
    return { valid: false, error: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  return { valid: true };
};

export const validateUrl = (url: string): { valid: boolean; error?: string } => {
  if (!urlRegex.test(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  return { valid: true };
};

export const validateZipCode = (zipCode: string): { valid: boolean; error?: string } => {
  if (!zipCode.trim()) {
    return { valid: false, error: 'Zip code is required' };
  }
  if (!/^\d{5,10}$/.test(zipCode.replace(/\D/g, ''))) {
    return { valid: false, error: 'Invalid zip code format' };
  }
  return { valid: true };
};

export const validateAddressLine = (address: string): { valid: boolean; error?: string } => {
  if (!address.trim()) {
    return { valid: false, error: 'Address is required' };
  }
  if (address.trim().length < 5) {
    return { valid: false, error: 'Address must be at least 5 characters long' };
  }
  return { valid: true };
};

export const validateCity = (city: string): { valid: boolean; error?: string } => {
  if (!city.trim()) {
    return { valid: false, error: 'City is required' };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(city)) {
    return { valid: false, error: 'City name is invalid' };
  }
  return { valid: true };
};

export const validateState = (state: string): { valid: boolean; error?: string } => {
  if (!state.trim()) {
    return { valid: false, error: 'State is required' };
  }
  return { valid: true };
};

export const validateCountry = (country: string): { valid: boolean; error?: string } => {
  if (!country.trim()) {
    return { valid: false, error: 'Country is required' };
  }
  return { valid: true };
};

export const validateCouponCode = (code: string): { valid: boolean; error?: string } => {
  if (!code.trim()) {
    return { valid: false, error: 'Coupon code is required' };
  }
  if (!/^[A-Z0-9]{3,20}$/.test(code)) {
    return { valid: false, error: 'Invalid coupon code format' };
  }
  return { valid: true };
};

export const validateCardNumber = (cardNumber: string): { valid: boolean; error?: string } => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length !== 16) {
    return { valid: false, error: 'Card number must be 16 digits' };
  }
  return { valid: true };
};

export const validateCVV = (cvv: string): { valid: boolean; error?: string } => {
  const cleaned = cvv.replace(/\D/g, '');
  if (cleaned.length !== 3 && cleaned.length !== 4) {
    return { valid: false, error: 'CVV must be 3 or 4 digits' };
  }
  return { valid: true };
};

export const validateExpiryDate = (expiryDate: string): { valid: boolean; error?: string } => {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return { valid: false, error: 'Expiry date must be in MM/YY format' };
  }
  return { valid: true };
};
