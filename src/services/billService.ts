import type { Bill, BillItem, BillStatus } from '../types/bill';
import { supabase } from '../lib/supabase';

const TABLE = 'bills';
const PHOTO_BUCKET = 'jewellery-photos';
const SIGNED_URL_TTL_SECONDS = 60 * 60;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface BillRow {
  id: string;
  bill_number: string;
  verification_id: string;
  customer_name: string;
  mobile: string;
  address: string;
  bill_date: string;
  jewellery_photo: string | null;
  items: BillItem[];
  subtotal: number | string;
  discount: number | string;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number | string | null;
  final_total: number | string;
  status: BillStatus;
  created_at: string;
  updated_at: string | null;
}

export interface BillVerification {
  billNumber: string;
  billDate: string;
  status: BillStatus;
}

function numeric(value: number | string | null): number | undefined {
  if (value === null) return undefined;
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String(error.message);
    const code = 'code' in error ? String(error.code) : '';
    return code ? `${code}: ${message}` : message;
  }
  return 'Unknown Supabase error';
}

function reportError(operation: string, error: unknown): never {
  if (import.meta.env.DEV) console.error(`Supabase ${operation} failed:`, error);
  const message = getErrorMessage(error);
  if (message.includes('23505') || message.toLowerCase().includes('duplicate key')) {
    throw new Error('That bill number or verification ID is already in use. Refresh the bill number and try again.');
  }
  throw new Error(`Could not ${operation}: ${message}`);
}

function isDataUrl(value: string): boolean {
  return value.startsWith('data:image/');
}

function fileExtension(contentType: string): string {
  switch (contentType.toLowerCase()) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    default:
      throw new Error('Unsupported jewellery photo type. Use PNG, JPG, or WebP.');
  }
}

async function uploadPhoto(photo: string, billNumber: string): Promise<string> {
  if (!isDataUrl(photo)) return photo;

  const blob = await fetch(photo).then((response) => response.blob());
  if (!blob.type.startsWith('image/')) {
    throw new Error('The selected jewellery photo is not a supported image.');
  }
  if (blob.size > 10 * 1024 * 1024) {
    throw new Error('Jewellery photos must be 10 MB or smaller.');
  }

  const safeBillNumber = billNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `jewellery/${safeBillNumber}-${Date.now()}-${crypto.randomUUID()}.${fileExtension(blob.type)}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, {
    cacheControl: '3600',
    contentType: blob.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

async function removePhoto(path: string | null | undefined): Promise<void> {
  if (!path || path.startsWith('http') || isDataUrl(path)) return;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).remove([path]);
  if (error && import.meta.env.DEV) console.error('Could not remove replaced jewellery photo:', error);
}

async function mapRows(rows: BillRow[]): Promise<Bill[]> {
  const paths = rows.map((row) => row.jewellery_photo).filter((path): path is string => Boolean(path));
  let signedUrls: string[] = [];

  if (paths.length > 0) {
    const { data, error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    if (error) throw error;
    signedUrls = (data ?? []).map((item) => item.signedUrl ?? '');
    if (signedUrls.some((url) => !url)) {
      throw new Error('Could not create a temporary URL for a jewellery photo. Check Storage policies.');
    }
  }

  let signedUrlIndex = 0;
  return rows.map((row) => {
    const photoPath = row.jewellery_photo ?? undefined;
    const photoUrl = photoPath ? signedUrls[signedUrlIndex++] : undefined;
    return {
      id: row.id,
      billNumber: row.bill_number,
      verificationId: row.verification_id,
      customerName: row.customer_name,
      mobile: row.mobile,
      address: row.address,
      billDate: row.bill_date,
      jewelleryPhoto: photoUrl,
      jewelleryPhotoPath: photoPath,
      items: row.items ?? [],
      subtotal: numeric(row.subtotal) ?? 0,
      discount: numeric(row.discount) ?? 0,
      discountType: row.discount_type ?? undefined,
      discountValue: numeric(row.discount_value),
      finalTotal: numeric(row.final_total) ?? 0,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? undefined,
    };
  });
}

async function mapRow(row: BillRow): Promise<Bill> {
  return (await mapRows([row]))[0];
}

function toDatabaseFields(data: Partial<Bill>, photoPath?: string | null) {
  const fields: Record<string, unknown> = {};
  if (data.billNumber !== undefined) fields.bill_number = data.billNumber;
  if (data.verificationId !== undefined) fields.verification_id = data.verificationId;
  if (data.customerName !== undefined) fields.customer_name = data.customerName;
  if (data.mobile !== undefined) fields.mobile = data.mobile;
  if (data.address !== undefined) fields.address = data.address;
  if (data.billDate !== undefined) fields.bill_date = data.billDate;
  if (data.items !== undefined) fields.items = data.items;
  if (data.subtotal !== undefined) fields.subtotal = data.subtotal;
  if (data.discount !== undefined) fields.discount = data.discount;
  if (data.discountType !== undefined || data.discount !== undefined) {
    fields.discount_type = data.discountType ?? 'fixed';
  }
  if (data.discountValue !== undefined || data.discount !== undefined) {
    fields.discount_value = data.discountValue ?? data.discount ?? 0;
  }
  if (data.finalTotal !== undefined) fields.final_total = data.finalTotal;
  if (data.status !== undefined) fields.status = data.status;
  if (photoPath !== undefined) fields.jewellery_photo = photoPath;
  return fields;
}

async function getPhotoPath(id: string): Promise<string | null> {
  const column = UUID_PATTERN.test(id) ? 'id' : 'bill_number';
  const { data, error } = await supabase
    .from(TABLE)
    .select('jewellery_photo')
    .eq(column, id)
    .maybeSingle();
  if (error) throw error;
  return data?.jewellery_photo ?? null;
}

export const billService = {
  async getBills(): Promise<Bill[]> {
    try {
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return await mapRows((data ?? []) as BillRow[]);
    } catch (error) {
      return reportError('fetch bills', error);
    }
  },

  async getBill(idOrBillNoOrVerificationId: string): Promise<Bill | null> {
    const query = idOrBillNoOrVerificationId.trim();
    if (!query) return null;

    try {
      const columns = UUID_PATTERN.test(query)
        ? ['id', 'bill_number', 'verification_id'] as const
        : ['bill_number', 'verification_id'] as const;
      for (const column of columns) {
        const { data, error } = await supabase.from(TABLE).select('*').eq(column, query).maybeSingle();
        if (error) throw error;
        if (data) return await mapRow(data as BillRow);
      }
      return null;
    } catch (error) {
      return reportError('fetch bill', error);
    }
  },

  async verifyBill(verificationId: string): Promise<BillVerification | null> {
    const { data, error } = await supabase.rpc('verify_bill', {
      p_verification_id: verificationId.trim(),
    });
    if (error) return reportError('verify bill', error);
    const row = (data as Array<{ bill_number: string; bill_date: string; status: BillStatus }> | null)?.[0];
    if (!row) return null;
    return { billNumber: row.bill_number, billDate: row.bill_date, status: row.status };
  },

  async createBill(data: Omit<Bill, 'id' | 'createdAt'>): Promise<Bill> {
    let uploadedPhotoPath: string | undefined;
    let inserted = false;
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error('You must be signed in to create a bill. Please sign in and try again.');

      uploadedPhotoPath = data.jewelleryPhoto ? await uploadPhoto(data.jewelleryPhoto, data.billNumber) : undefined;
      const { data: row, error } = await supabase
        .from(TABLE)
        .insert({
          ...toDatabaseFields(data, uploadedPhotoPath ?? null),
          created_by: userData.user.id,
        })
        .select('*')
        .single();
      if (error) throw error;
      inserted = true;
      return await mapRow(row as BillRow);
    } catch (error) {
      if (uploadedPhotoPath && !inserted) await removePhoto(uploadedPhotoPath);
      return reportError('create bill', error);
    }
  },

  async updateBill(id: string, updates: Partial<Bill>): Promise<Bill | null> {
    let uploadedPhotoPath: string | undefined;
    let updated = false;
    try {
      const previousPhotoPath = await getPhotoPath(id);
      let nextPhotoPath: string | null | undefined;
      if (Object.prototype.hasOwnProperty.call(updates, 'jewelleryPhoto')) {
        nextPhotoPath = updates.jewelleryPhoto
          ? await uploadPhoto(updates.jewelleryPhoto, updates.billNumber ?? id)
          : null;
        if (nextPhotoPath && isDataUrl(updates.jewelleryPhoto ?? '')) uploadedPhotoPath = nextPhotoPath;
      }

      const { data, error } = await supabase
        .from(TABLE)
        .update({ ...toDatabaseFields(updates, nextPhotoPath), updated_at: new Date().toISOString() })
        .eq(UUID_PATTERN.test(id) ? 'id' : 'bill_number', id)
        .select('*')
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        if (uploadedPhotoPath) await removePhoto(uploadedPhotoPath);
        return null;
      }

      updated = true;
      const result = await mapRow(data as BillRow);
      if (nextPhotoPath !== undefined && previousPhotoPath !== nextPhotoPath) await removePhoto(previousPhotoPath);
      return result;
    } catch (error) {
      if (uploadedPhotoPath && !updated) await removePhoto(uploadedPhotoPath);
      return reportError('update bill', error);
    }
  },

  async deleteDraft(id: string): Promise<boolean> {
    try {
      const photoPath = await getPhotoPath(id);
      const { data, error } = await supabase
        .from(TABLE)
        .delete()
        .eq(UUID_PATTERN.test(id) ? 'id' : 'bill_number', id)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) return false;
      await removePhoto(photoPath);
      return true;
    } catch (error) {
      return reportError('delete bill', error);
    }
  },

  async getNextBillNumber(): Promise<string> {
    try {
      const { data, error } = await supabase.from(TABLE).select('bill_number');
      if (error) throw error;
      const max = (data ?? []).reduce((highest, row) => {
        const value = Number.parseInt(row.bill_number, 10);
        return Number.isFinite(value) ? Math.max(highest, value) : highest;
      }, 1000);
      return String(max + 1);
    } catch (error) {
      return reportError('generate next bill number', error);
    }
  },
};