import api from '@/services/api';

// Re-export shared tenant-aware Axios instance to ensure consistent headers across all modules
const AxiosConfig = api;

export default AxiosConfig;
