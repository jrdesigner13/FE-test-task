import { makeAutoObservable, runInAction } from 'mobx';

export type CurrencyPair = {
  rate?: number;
  ask?: number;
  bid?: number;
  diff24h?: number;
};

export type ApiResponse = {
  [baseCurrency: string]: {
    [quoteCurrency: string]: CurrencyPair;
  };
};

export type TransformedData = {
  baseCurrency: string;
  pairs: [string, CurrencyPair][];
};

class CryptoStore {
  cryptoRates: ApiResponse | null = null;
  error: string = '';
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get transformedData(): TransformedData[] {
    if (!this.cryptoRates) return [];
    return Object.entries(this.cryptoRates).map(([baseCurrency, pairs]) => ({
      baseCurrency,
      pairs: Object.entries(pairs)
    }));
  }

  async fetchCryptoRates() {
    this.loading = true;
    this.error = '';
    try {
      const response = await fetch('https://app.youhodler.com/api/v3/rates/extended');
      if (!response.ok) {
        throw new Error('Failed to fetch crypto rates');
      }
      const data: ApiResponse = await response.json();
      runInAction(() => {
        this.cryptoRates = data;
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : 'An error occurred';
        this.loading = false;
      });
    }
  }
}

export const cryptoStore = new CryptoStore();