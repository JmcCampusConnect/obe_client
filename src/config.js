const localHostname = import.meta.env.VITE_LOCAL_HOSTNAME || '192.168.10.38';
const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://192.168.10.38:5001';
const PUBLIC_API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://61.1.189.85:5001';

const API_URL = (typeof window !== 'undefined' && window.location && window.location.hostname === localHostname)
  ? LOCAL_API_URL
  : PUBLIC_API_URL;

export default API_URL;
export { API_URL };