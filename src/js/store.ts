import { createStore } from 'framework7/lite';

export interface LoanState {
  loanId: string;
  deviceId: string;
  deviceName: string;
  totalAmount: number;
  weeksTotal: number;
  weeksRemaining: number;
  nextPaymentDate: string;
  weeklyAmount: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'oxxo' | 'bank_transfer';
  status: 'completed' | 'pending';
}

export interface CreditProfile {
  customerId: string;
  creditTier: 'new' | 'bronze' | 'silver' | 'gold';
  isNewToCredit: boolean;
  country: string;
  creditLimit: number;
  creditScore: number;
}

export interface UserSession {
  userId: string | null;
  name: string;
  email: string;
  /** Contact phone for applications / identification (demo). */
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/** Persisted phone credit applications (demo; keyed in profile by user email). */
export interface CreditApplicationRecord {
  id: string;
  submittedAt: string;
  deviceId: string;
  deviceName: string;
  email: string;
  phone: string;
  weeksSelected: number;
  requestedAmount: number;
  incomeBracket: string;
}

const USER_SESSION_KEY = 'pbp_user_session';
const CREDIT_APPLICATIONS_KEY = 'pbp_credit_applications';

function loadCreditApplications(): CreditApplicationRecord[] {
  try {
    const raw = localStorage.getItem(CREDIT_APPLICATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CreditApplicationRecord[];
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    /* ignore */
  }
  return [];
}

function saveCreditApplications(apps: CreditApplicationRecord[]): void {
  localStorage.setItem(CREDIT_APPLICATIONS_KEY, JSON.stringify(apps));
}

function emptyUserSession(): UserSession {
  return {
    userId: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  };
}

function loadUserSession(): UserSession {
  const empty = emptyUserSession();
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserSession>;
      return { ...empty, ...parsed, phone: parsed.phone ?? '' };
    }
  } catch {
    /* ignore */
  }
  return empty;
}

export type CreditApplicationInput = Omit<CreditApplicationRecord, 'id' | 'submittedAt'>;

interface RootState {
  onboardingDone: boolean;
  creditProfile: CreditProfile;
  activeLoan: LoanState | null;
  paymentHistory: PaymentRecord[];
  selectedDeviceId: string | null;
  user: UserSession;
  creditApplications: CreditApplicationRecord[];
}

const store = createStore({
  state: {
    onboardingDone: localStorage.getItem('pbp_onboarding') === 'true',
    creditProfile: {
      customerId: `cust_${Math.random().toString(36).slice(2, 10)}`,
      creditTier: 'new',
      isNewToCredit: true,
      country: 'MX',
      creditLimit: 0,
      creditScore: 420,
    } as CreditProfile,
    activeLoan: null as LoanState | null,
    paymentHistory: [] as PaymentRecord[],
    selectedDeviceId: null as string | null,
    user: loadUserSession(),
    creditApplications: loadCreditApplications(),
  },

  getters: {
    onboardingDone: ({ state }: { state: RootState }) => state.onboardingDone,
    creditProfile: ({ state }: { state: RootState }) => state.creditProfile,
    activeLoan: ({ state }: { state: RootState }) => state.activeLoan,
    paymentHistory: ({ state }: { state: RootState }) => state.paymentHistory,
    selectedDeviceId: ({ state }: { state: RootState }) => state.selectedDeviceId,
    user: ({ state }: { state: RootState }) => state.user,
    creditApplications: ({ state }: { state: RootState }) => state.creditApplications,
  },

  actions: {
    completeOnboarding({ state }: { state: RootState }) {
      state.onboardingDone = true;
      localStorage.setItem('pbp_onboarding', 'true');
    },
    setSelectedDevice({ state }: { state: RootState }, deviceId: string) {
      state.selectedDeviceId = deviceId;
    },
    approveLoan({ state }: { state: RootState }, loan: LoanState) {
      state.activeLoan = loan;
      state.creditProfile.creditLimit = loan.totalAmount;
      state.creditProfile.creditTier = 'bronze';
    },
    recordPayment({ state }: { state: RootState }, payment: PaymentRecord) {
      state.paymentHistory.unshift(payment);
      if (state.activeLoan) {
        state.activeLoan.weeksRemaining = Math.max(0, state.activeLoan.weeksRemaining - 1);
      }
    },
    resetStore({ state }: { state: RootState }) {
      state.onboardingDone = false;
      state.activeLoan = null;
      state.paymentHistory = [];
      state.creditProfile.creditTier = 'new';
      state.creditProfile.creditLimit = 0;
      localStorage.removeItem('pbp_onboarding');
    },
    setUserSession({ state }: { state: RootState }, session: UserSession) {
      state.user = { ...emptyUserSession(), ...session, phone: session.phone ?? '' };
      if (session.userId) {
        state.creditProfile.customerId = session.userId;
      }
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(state.user));
    },
    clearUserSession({ state }: { state: RootState }) {
      state.user = emptyUserSession();
      localStorage.removeItem(USER_SESSION_KEY);
    },
    recordCreditApplication({ state }: { state: RootState }, input: CreditApplicationInput) {
      const record: CreditApplicationRecord = {
        ...input,
        id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        submittedAt: new Date().toISOString(),
      };
      state.creditApplications = [record, ...state.creditApplications];
      saveCreditApplications(state.creditApplications);
    },
  },
});

export default store;
