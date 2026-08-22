export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login/',
    LOGOUT: '/logout',
    VALIDATE_TOKEN: '/api/validate_token/',
  },

  USER: {
    CURRENT_USER: '/current-user',
    REGISTRATION_STATUS: '/get_registration_status/',
    CREATE_PENSIONER: '/api/create_pensioner/',
    CHANGE_PASSWORD: '/api/change_password/',
  },

  VERIFICATION: {
    VERIFICATION: '/api/verification/',
    STATUS: '/api/verification_status/',
  },

  DLC: {
    CREATE: '/api/lc/',
  },

  DOCUMENTATION: {
    MANUAL: '/manual.html',
  },

  CSSP: {
    ENCRYPT: '/api/cssp/encrypt',
    DECRYPT: '/api/cssp/decrypt',
    FORMAT_PASSWORD: '/api/cssp/format-password',
  },
} as const;
