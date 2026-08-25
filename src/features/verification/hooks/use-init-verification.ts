import { useQuery } from '@tanstack/react-query';
import { VerificationStoreManager } from '@stores/verification';

type GetVerificationT = {
  data: {
    regStatus: string | null;
    dlc: string | null;
  };
};

async function getVerification(): Promise<GetVerificationT> {
  const regStatus = await VerificationStoreManager.getRegStatus();
  const dlc = await VerificationStoreManager.getDlc();

  return {
    data: {
      dlc,
      regStatus,
    },
  };
}

const getRegStatusMessage = (currentReg: string | null | undefined): string => {
  if (currentReg === '02') {
    return 'Since the photo you submitted was rejected, the app will capture your photo twice.';
  } else if (currentReg === '03') {
    return "Since you haven't submitted your photo, the app will capture your photo twice.";
  }
  return '';
};

export function useInitializeVerification() {
  const query = useQuery({
    queryKey: ['init', 'verification'],
    queryFn: getVerification,
    select: (data) => data.data,
  });

  const regStatus = query.data?.regStatus;
  const dlcStatus = query.data?.dlc;

  return {
    regStatus,
    dlcStatus,
    msg: getRegStatusMessage(regStatus),
    ...query,
  };
}
