import type { Bill } from '../types/bill';
import { MOCK_BILLS } from '../data/mockBills';

const STORAGE_KEY = 'jaj_bills_store';

function loadStoredBills(): Bill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read bills from localStorage, using mock data:', e);
  }
  // Initialize with mock bills
  saveStoredBills(MOCK_BILLS);
  return MOCK_BILLS;
}

function saveStoredBills(bills: Bill[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
  } catch (e) {
    console.warn('Could not save bills to localStorage:', e);
  }
}

let memoryBills: Bill[] = loadStoredBills();

export const billService = {
  async getBills(): Promise<Bill[]> {
    memoryBills = loadStoredBills();
    return [...memoryBills];
  },

  async getBill(idOrBillNoOrVerificationId: string): Promise<Bill | null> {
    memoryBills = loadStoredBills();
    const query = idOrBillNoOrVerificationId.trim().toLowerCase();
    const found = memoryBills.find(
      (b) =>
        b.id.toLowerCase() === query ||
        b.billNumber.toLowerCase() === query ||
        b.verificationId.toLowerCase() === query
    );
    return found ? { ...found } : null;
  },

  async createBill(data: Omit<Bill, 'id' | 'createdAt'>): Promise<Bill> {
    memoryBills = loadStoredBills();
    const id = `bill-${Date.now()}`;
    const newBill: Bill = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    memoryBills = [newBill, ...memoryBills];
    saveStoredBills(memoryBills);
    return { ...newBill };
  },

  async updateBill(id: string, updates: Partial<Bill>): Promise<Bill | null> {
    memoryBills = loadStoredBills();
    const index = memoryBills.findIndex((b) => b.id === id || b.billNumber === id);
    if (index === -1) return null;

    const updated: Bill = {
      ...memoryBills[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    memoryBills[index] = updated;
    saveStoredBills(memoryBills);
    return { ...updated };
  },

  async deleteDraft(id: string): Promise<boolean> {
    memoryBills = loadStoredBills();
    const initialLen = memoryBills.length;
    memoryBills = memoryBills.filter((b) => b.id !== id && b.billNumber !== id);
    if (memoryBills.length !== initialLen) {
      saveStoredBills(memoryBills);
      return true;
    }
    return false;
  },

  async getNextBillNumber(): Promise<string> {
    memoryBills = loadStoredBills();
    const numericBillNos = memoryBills
      .map((b) => parseInt(b.billNumber, 10))
      .filter((n) => !isNaN(n));
    if (numericBillNos.length === 0) return '1001';
    const max = Math.max(...numericBillNos);
    return String(max + 1);
  },
};
