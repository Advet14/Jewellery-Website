import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Edit3, Download, Printer, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { InvoiceTemplate } from '../invoice/InvoiceTemplate';
import type { Bill } from '../types/bill';
import { billService } from '../services/billService';
import { formatINR } from '../utils/calculations';
import { INVOICE_CANVAS, INVOICE_COORDINATES } from '../invoice/invoiceCoordinates';
import invoiceMasterImg from '../assets/invoice-master.png';
import { generateQrDataUrl } from '../utils/qr';

export const InvoicePreview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billIdParam = searchParams.get('id');

  const [bill, setBill] = useState<Bill | null>(
    (location.state?.bill as Bill) || null
  );
  const [loading, setLoading] = useState(!bill);
  const [loadError, setLoadError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bill) {
      let active = true;
      const fetchBill = async () => {
        setLoading(true);
        setLoadError('');
        try {
          if (billIdParam) {
            const found = await billService.getBill(billIdParam);
            if (found) {
              if (active) setBill(found);
              return;
            }
          }
          const allBills = await billService.getBills();
          if (active && allBills.length > 0) setBill(allBills[0]);
        } catch (error) {
          console.error('Could not load invoice:', error);
          if (active) setLoadError(error instanceof Error ? error.message : 'Could not load this invoice.');
        } finally {
          if (active) setLoading(false);
        }
      };
      void fetchBill();
      return () => { active = false; };
    }
  }, [bill, billIdParam]);

  const handleEdit = () => {
    if (!bill) return;
    navigate('/create-bill', { state: { bill } });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!bill) return;
    setDownloading(true);

    try {
      // Create off-screen canvas with native 1045 x 1505 dimensions for high fidelity PNG export
      const canvas = document.createElement('canvas');
      canvas.width = INVOICE_CANVAS.width;
      canvas.height = INVOICE_CANVAS.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // 1. Draw Master Template Background
      const masterImg = new Image();
      masterImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        masterImg.onload = resolve;
        masterImg.onerror = reject;
        masterImg.src = invoiceMasterImg;
      });
      ctx.drawImage(masterImg, 0, 0, INVOICE_CANVAS.width, INVOICE_CANVAS.height);

      // 2. Draw Dynamic QR Code if present
      if (bill.verificationId) {
        const qrUrl = await generateQrDataUrl(bill.verificationId);
        if (qrUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.onerror = resolve;
            qrImg.src = qrUrl;
          });
          ctx.drawImage(
            qrImg,
            INVOICE_COORDINATES.qrCode.innerLeft,
            INVOICE_COORDINATES.qrCode.innerTop,
            INVOICE_COORDINATES.qrCode.innerWidth,
            INVOICE_COORDINATES.qrCode.innerHeight
          );
        }
      }

      // 3. Draw Customer Jewellery Photo inside Ornament Details Box
      if (bill.jewelleryPhoto) {
        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          photoImg.onload = resolve;
          photoImg.onerror = resolve;
          photoImg.src = bill.jewelleryPhoto!;
        });

        const targetX = INVOICE_COORDINATES.ornamentDetails.left + 5;
        const targetY = INVOICE_COORDINATES.ornamentDetails.top + 5;
        const targetW = INVOICE_COORDINATES.ornamentDetails.width - 10;
        const targetH = INVOICE_COORDINATES.ornamentDetails.height - 10;

        // Calculate aspect ratio fit (contain)
        const imgRatio = photoImg.width / photoImg.height;
        const boxRatio = targetW / targetH;
        let drawW = targetW;
        let drawH = targetH;
        let drawX = targetX;
        let drawY = targetY;

        if (imgRatio > boxRatio) {
          drawH = targetW / imgRatio;
          drawY = targetY + (targetH - drawH) / 2;
        } else {
          drawW = targetH * imgRatio;
          drawX = targetX + (targetW - drawW) / 2;
        }

        ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
      }

      // Helper font styling
      ctx.fillStyle = '#111827';
      ctx.font = '600 23px "Plus Jakarta Sans", sans-serif';

      // 4. Draw Customer Name
      ctx.fillText(bill.customerName, INVOICE_COORDINATES.customerName.left, INVOICE_COORDINATES.customerName.top + 24);

      // 5. Draw Customer Mobile
      ctx.fillText(bill.mobile, INVOICE_COORDINATES.customerMobile.left, INVOICE_COORDINATES.customerMobile.top + 24);

      // 6. Draw Customer Address
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(bill.address, INVOICE_COORDINATES.customerAddress.left, INVOICE_COORDINATES.customerAddress.top + 22, INVOICE_COORDINATES.customerAddress.width);

      // 7. Draw Bill Number
      ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(bill.billNumber, INVOICE_COORDINATES.billNumber.left, INVOICE_COORDINATES.billNumber.top + 24);

      // 8. Draw Date
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      const formattedDate = (() => {
        try {
          const parts = bill.billDate.split('-');
          return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : bill.billDate;
        } catch {
          return bill.billDate;
        }
      })();
      ctx.fillText(formattedDate, INVOICE_COORDINATES.billDate.left, INVOICE_COORDINATES.billDate.top + 24);

      // 9. Draw Table Items
      bill.items.forEach((item, index) => {
        const row = INVOICE_COORDINATES.tableRows[index];
        if (!row) return;
        const textY = row.top + 38;

        // Sr. No. (centered)
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(index + 1), INVOICE_COORDINATES.tableColumns.srNo.left + INVOICE_COORDINATES.tableColumns.srNo.width / 2, textY);

        // Description (left)
        ctx.textAlign = 'left';
        ctx.fillText(item.description, INVOICE_COORDINATES.tableColumns.description.left + INVOICE_COORDINATES.tableColumns.description.paddingLeft, textY, INVOICE_COORDINATES.tableColumns.description.width - 20);

        // Weight (right)
        ctx.textAlign = 'right';
        if (item.weight > 0) {
          ctx.fillText(`${item.weight.toFixed(2)} g`, INVOICE_COORDINATES.tableColumns.weight.left + INVOICE_COORDINATES.tableColumns.weight.width - INVOICE_COORDINATES.tableColumns.weight.paddingRight, textY);
        }

        // Rate (right)
        if (item.rate > 0) {
          ctx.fillText(formatINR(item.rate, false), INVOICE_COORDINATES.tableColumns.rate.left + INVOICE_COORDINATES.tableColumns.rate.width - INVOICE_COORDINATES.tableColumns.rate.paddingRight, textY);
        }

        // Amount (right)
        ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
        if (item.amount > 0) {
          ctx.fillText(formatINR(item.amount, false), INVOICE_COORDINATES.tableColumns.amount.left + INVOICE_COORDINATES.tableColumns.amount.width - INVOICE_COORDINATES.tableColumns.amount.paddingRight, textY);
        }
      });

      // 10. Draw Total Amount (right)
      ctx.textAlign = 'right';
      ctx.fillStyle = '#06231a';
      ctx.font = '800 25px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        formatINR(bill.finalTotal, false),
        INVOICE_COORDINATES.totalAmount.left + INVOICE_COORDINATES.totalAmount.width - INVOICE_COORDINATES.totalAmount.paddingRight,
        INVOICE_COORDINATES.totalAmount.top + 32
      );

      // Trigger high-res file download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Jay-Ambe-Jewellers-Bill-${bill.billNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: trigger print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!bill) return;

    const cleanedMobile = bill.mobile.replace(/\D/g, '').slice(-10);
    const text = encodeURIComponent(
      `*Jay Ambe Jewellers — Invoice Receipt*\n\n` +
      `Bill No: *${bill.billNumber}*\n` +
      `Date: ${bill.billDate}\n` +
      `Customer: ${bill.customerName}\n` +
      `Total Amount: *${formatINR(bill.finalTotal)}*\n` +
      `Verification ID: ${bill.verificationId}\n\n` +
      `Verify online at:\nhttps://verify.jayambejewellers.in/v/${bill.verificationId}\n\n` +
      `Shop: Near Ahirsamajwadi, Main Chowk, Kidana - Gandhidham\nContact: 92656 59480 / 99796 25153`
    );

    const waUrl = cleanedMobile
      ? `https://api.whatsapp.com/send?phone=91${cleanedMobile}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Also copy to clipboard for convenience
    navigator.clipboard?.writeText(decodeURIComponent(text)).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf6] flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#c59b27] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-playfair text-lg text-[#06231a] font-semibold">Loading Invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-[#fcfaf6] flex flex-col">
        <SiteHeader />
        <div className="flex-1 max-w-xl mx-auto px-4 py-12 text-center space-y-4">
          <h2 className="font-playfair text-2xl font-bold text-[#06231a]">Invoice Not Found</h2>
          <p role={loadError ? 'alert' : undefined} className="text-sm text-gray-600">
            {loadError || 'No bill data is currently available to preview.'}
          </p>
          <button
            onClick={() => navigate('/create-bill')}
            className="px-6 py-3 rounded-xl bg-[#06231a] text-white font-semibold text-sm hover:bg-[#0b3e2f] transition-all"
          >
            Create New Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-[#1a2e26] flex flex-col antialiased selection:bg-[#c59b27]/20">
      <div className="no-print">
        <SiteHeader />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation Bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#06231a] hover:text-[#c59b27] transition-colors p-2 -ml-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <span className="text-xs uppercase tracking-wider font-semibold text-[#c59b27] bg-[#faeed2] px-3 py-1 rounded-full border border-[#d4af37]/30">
            Bill #{bill.billNumber} • {bill.status}
          </span>
        </div>

        {/* Invoice Action Bar */}
        <div className="no-print bg-white rounded-2xl p-4 sm:p-5 border border-[#d4af37]/40 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Edit Bill */}
            <button
              type="button"
              onClick={handleEdit}
              className="min-h-[44px] flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl border border-[#d8ccb6] bg-[#fbf9f5] hover:bg-[#faeed2] text-[#06231a] text-xs sm:text-sm font-semibold transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4 text-[#9a781b]" />
              <span>Edit Bill</span>
            </button>

            {/* Download Invoice */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="min-h-[44px] flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-[#06231a] text-white text-xs sm:text-sm font-semibold hover:bg-[#0b3e2f] transition-all active:scale-95 disabled:opacity-60"
            >
              <Download className="w-4 h-4 text-[#d4af37]" />
              <span>{downloading ? 'Downloading...' : 'Download'}</span>
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl border border-[#06231a] bg-white text-[#06231a] text-xs sm:text-sm font-semibold hover:bg-[#f6f2e9] transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#06231a]" />
              <span>Print</span>
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="min-h-[44px] flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-[#128c7e] text-white text-xs sm:text-sm font-semibold hover:bg-[#075e54] transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 text-white" />
              <span>WhatsApp</span>
            </button>
          </div>

          {copiedNotification && (
            <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs text-[#06231a] bg-[#ecfdf5] border border-green-200 py-1.5 px-3 rounded-lg font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>WhatsApp message summary copied to clipboard!</span>
            </div>
          )}
        </div>

        {/* Master Invoice Template Display Area */}
        <div id="printable-invoice-area" className="w-full flex justify-center py-2">
          <div className="w-full max-w-[1045px] bg-white rounded-xl shadow-xl overflow-hidden border border-[#d4af37]/30">
            <InvoiceTemplate ref={invoiceRef} bill={bill} scaleMode="fit-container" />
          </div>
        </div>

        {/* Mobile Guidance Tip */}
        <p className="no-print text-center text-xs text-gray-500 font-sans-ui pb-4">
          Invoice design is locked to the official master template and proportionally fitted.
        </p>
      </main>

      <footer className="w-full border-t border-[#e8dfcf] py-4 text-center text-xs text-[#808d87] no-print">
        <p>© 2026 Jay Ambe Jewellers. All rights reserved.</p>
      </footer>
    </div>
  );
};
