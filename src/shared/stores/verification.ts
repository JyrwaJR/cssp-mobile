import * as SecureStore from 'expo-secure-store';

const REG_STATUS_KEY = 'regStatus';
const HAS_DLC = 'hasDlc';

export const VerificationStoreManager = {
  async updateRegStatus(value: string) {
    return await SecureStore.setItemAsync(REG_STATUS_KEY, value);
  },
  async getRegStatus() {
    return await SecureStore.getItemAsync(REG_STATUS_KEY);
  },
  async getDlc() {
    return await SecureStore.getItemAsync(HAS_DLC);
  },
  async updateDlc(value: string) {
    return await SecureStore.setItemAsync(HAS_DLC, value);
  },
};
