import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, ArrowLeft, RotateCcw } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { CustomerDetailsForm } from '../components/CustomerDetailsForm';
import { JewelleryPhotoUpload } from '../components/JewelleryPhotoUpload';
import { JewelleryItemsEditor } from '../components/JewelleryItemsEditor';
import { BillTotals } from '../components/BillTotals';
import type { Bill, BillItem } from '../types/bill';
import { billService } from '../services/billService';
import { calculateSubtotal, calculateFinalTotal } from '../utils/calculations';
import { validateBillForm } from '../utils/validation';
import type { BillFormErrors } from '../utils/validation';
import { generateVerificationId } from '../utils/qr';

export const CreateBill: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we are editing an existing bill (passed via location.state or query param)
  const existingBill = location.state?.bill as Bill | undefined;

  const [billId] = useState<string>(existingBill?.id || '');
  const [verificationId] = useState<string>(
    existingBill?.verificationId || generateVerificationId()
  );
  const [customerName, setCustomerName] = useState<string>(existingBill?.customerName || '');
  const [mobile, setMobile] = useState<string>(existingBill?.mobile || '');
  const [address, setAddress] = useState<string>(existingBill?.address || '');
  const [billNumber, setBillNumber] = useState<string>(existingBill?.billNumber || '');
  const [billDate, setBillDate] = useState<string>(
    existingBill?.billDate || new Date().toISOString().split('T')[0]
  );
  const [jewelleryPhoto, setJewelleryPhoto] = useState<string | undefined>(
    existingBill?.jewelleryPhoto
  );
  const [items, setItems] = useState<BillItem[]>(
    existingBill?.items || [
      {
        id: 'initial-item',
        description: '',
        weight: 0,
        rate: 0,
        amount: 0,
      },
    ]
  );
  const [discount, setDiscount] = useState<number>(existingBill?.discount || 0);
  const [errors, setErrors] = useState<BillFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Initialize next bill number if not editing
  useEffect(() => {
    if (!existingBill && !billNumber) {
      billService.getNextBillNumber()
        .then(setBillNumber)
        .catch((error: unknown) => {
          console.error('Could not load next bill number:', error);
          setSaveError(error instanceof Error ? error.message : 'Could not load the next bill number.');
        });
    }
  }, [existingBill, billNumber]);

  // Dynamic calculations
  const subtotal = calculateSubtotal(items);
  const finalTotal = calculateFinalTotal(subtotal, discount);

  const handleCustomerChange = (field: string, value: string) => {
    if (field === 'customerName') setCustomerName(value);
    else if (field === 'mobile') setMobile(value);
    else if (field === 'address') setAddress(value);
    else if (field === 'billNumber') setBillNumber(value);
    else if (field === 'billDate') setBillDate(value);

    // Clear specific error on typing
    if (errors[field as keyof BillFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset this bill form?')) {
      setCustomerName('');
      setMobile('');
      setAddress('');
      setJewelleryPhoto(undefined);
      setDiscount(0);
      setItems([
        {
          id: `item-${Date.now()}-1`,
          description: '',
          weight: 0,
          rate: 0,
          amount: 0,
        },
      ]);
      setErrors({});
      billService.getNextBillNumber().then(setBillNumber);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateBillForm({
      customerName,
      mobile,
      address,
      billNumber,
      billDate,
      items,
      discount,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSaveError('');
    const photoToSave = existingBill && jewelleryPhoto === existingBill.jewelleryPhoto
      ? existingBill.jewelleryPhotoPath
      : jewelleryPhoto;

    try {
      let savedBill: Bill;
      if (billId) {
        // Update existing bill
        const updated = await billService.updateBill(billId, {
          billNumber,
          verificationId,
          customerName,
          mobile,
          address,
          billDate,
          jewelleryPhoto: photoToSave,
          items,
          subtotal,
          discount,
          finalTotal,
        });
        if (!updated) throw new Error('This bill no longer exists or you do not have permission to update it.');
        savedBill = updated;
      } else {
        // Create new bill
        savedBill = await billService.createBill({
          billNumber,
          verificationId,
          customerName,
          mobile,
          address,
          billDate,
          jewelleryPhoto: photoToSave,
          items,
          subtotal,
          discount,
          finalTotal,
          status: 'ACTIVE',
        });
      }

      // Navigate to Invoice Preview with the saved bill
      navigate(`/preview?id=${savedBill.id}`, { state: { bill: savedBill } });
    } catch (err) {
      console.error('Error saving bill:', err);
      setSaveError(err instanceof Error ? err.message : 'Could not save the bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#1a2e26] flex flex-col antialiased selection:bg-[#c59b27]/20">
      <SiteHeader />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Navigation & Page Title */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#06231a] hover:text-[#c59b27] transition-colors p-2 -ml-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>

        {/* Heading */}
        <div className="text-center sm:text-left border-b border-[#e5dfd3] pb-4">
          <span className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold">
            Jay Ambe Jewellers
          </span>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#06231a] mt-1">
            {billId ? 'Edit Bill' : 'Create New Bill'}
          </h1>
          <p className="text-xs text-[#73827c] mt-1">
            Enter customer details, jewellery items, and upload photo for the official invoice.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {saveError}
            </div>
          )}
          {/* Section 1: Customer Details */}
          <CustomerDetailsForm
            customerName={customerName}
            mobile={mobile}
            address={address}
            billNumber={billNumber}
            billDate={billDate}
            errors={errors}
            onChange={handleCustomerChange}
          />

          {/* Section 2: Jewellery Photograph */}
          <JewelleryPhotoUpload
            photo={jewelleryPhoto}
            onPhotoChange={setJewelleryPhoto}
          />

          {/* Section 3: Jewellery Items */}
          <JewelleryItemsEditor
            items={items}
            onChange={setItems}
            error={errors.items}
          />

          {/* Section 4: Bill Summary & Totals */}
          <BillTotals
            subtotal={subtotal}
            discount={discount}
            finalTotal={finalTotal}
            onDiscountChange={setDiscount}
            error={errors.discount}
          />

          {/* Action Button: Preview Invoice */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[56px] py-4 px-6 rounded-2xl bg-gradient-to-r from-[#06231a] via-[#092e22] to-[#06231a] text-white font-playfair text-lg sm:text-xl font-bold border border-[#c59b27]/60 shadow-lg hover:shadow-xl hover:border-[#dfb743] flex items-center justify-center space-x-3 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
            >
              <Eye className="w-5 h-5 text-[#d4af37]" />
              <span>{isSubmitting ? 'Generating Invoice...' : 'Preview Invoice'}</span>
            </button>
          </div>
        </form>
      </main>

      <footer className="w-full border-t border-[#e8dfcf] py-4 text-center text-xs text-[#808d87] no-print">
        <p>© 2026 Jay Ambe Jewellers. All rights reserved.</p>
      </footer>
    </div>
  );
};
