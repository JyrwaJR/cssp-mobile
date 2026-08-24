export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login/',
    LOGOUT: '/logout/',
    VALIDATE_TOKEN: '/api/validate_token/',
    CURRENT_USER: '/current-user/',
  },

  USER: {
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
    MANUAL: 'https://shillong.meg.nic.in/manual.html',
    POLICY: 'https://shillong.meg.nic.in/privacy_policy.html',
  },
} as const;
