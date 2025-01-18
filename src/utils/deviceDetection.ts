export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'iphone', 'ipad', 'android', 'phone', 'mobile',
    'webos', 'ipod', 'blackberry', 'windows phone'
  ];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

export const isIOSDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}; 