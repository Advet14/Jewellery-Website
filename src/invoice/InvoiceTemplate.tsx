import React, { forwardRef, useEffect, useState, useRef } from 'react';
import type { Bill } from '../types/bill';
import { INVOICE_CANVAS, INVOICE_COORDINATES } from './invoiceCoordinates';
import invoiceMasterImg from '../assets/invoice-master.png';
import { generateQrDataUrl } from '../utils/qr';
import { formatINR } from '../utils/calculations';

interface InvoiceTemplateProps {
  bill: Bill;
  scaleMode?: 'fit-container' | 'fixed';
  className?: string;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ bill, scaleMode = 'fit-container', className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState<number>(1);
    const [qrDataUrl, setQrDataUrl] = useState<string>('');

    // Generate dynamic QR code if verificationId is present
    useEffect(() => {
      let isMounted = true;
      if (bill.verificationId) {
        generateQrDataUrl(bill.verificationId).then((url) => {
          if (isMounted) setQrDataUrl(url);
        });
      }
      return () => {
        isMounted = false;
      };
    }, [bill.verificationId]);

    // Proportional auto-scaling for mobile & responsive screens
    useEffect(() => {
      if (scaleMode !== 'fit-container') return;

      const updateScale = () => {
        if (!containerRef.current) return;
        const availableWidth = containerRef.current.clientWidth;
        if (availableWidth > 0) {
          // Scale to fit container width, max 1.0 (never artificially enlarge beyond native 1045px)
          const newScale = Math.min(1, availableWidth / INVOICE_CANVAS.width);
          setScale(newScale);
        }
      };

      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }, [scaleMode]);

    // Format date for Indian invoice display (DD/MM/YYYY)
    const formattedDate = (() => {
      if (!bill.billDate) return '';
      try {
        const parts = bill.billDate.split('-');
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return bill.billDate;
      } catch {
        return bill.billDate;
      }
    })();

    return (
      <div
        ref={containerRef}
        className={`w-full flex justify-center overflow-hidden ${className}`}
        style={{
          // Reserve correct responsive height when scaled
          height: scaleMode === 'fit-container' ? `${INVOICE_CANVAS.height * scale}px` : undefined,
        }}
      >
        {/* Scaled Wrapper */}
        <div
          style={{
            width: `${INVOICE_CANVAS.width}px`,
            height: `${INVOICE_CANVAS.height}px`,
            transform: scaleMode === 'fit-container' ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
          className="shrink-0"
        >
          {/* Exact Master Canvas */}
          <div
            id="printable-invoice-canvas"
            ref={ref}
            className="relative select-none"
            style={{
              width: `${INVOICE_CANVAS.width}px`,
              height: `${INVOICE_CANVAS.height}px`,
              backgroundColor: '#ffffff',
            }}
          >
            {/* 1. MASTER INVOICE BACKGROUND IMAGE */}
            <img
              src={invoiceMasterImg}
              alt="Jay Ambe Jewellers Invoice Master Template"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ width: `${INVOICE_CANVAS.width}px`, height: `${INVOICE_CANVAS.height}px` }}
            />

            {/* 2. DYNAMIC QR CODE OVERLAY (QR IMAGE ONLY - NO TEXT, NO CAPTION) */}
            {qrDataUrl && (
              <div
                style={{
                  position: 'absolute',
                  left: `${INVOICE_COORDINATES.qrCode.innerLeft}px`,
                  top: `${INVOICE_COORDINATES.qrCode.innerTop}px`,
                  width: `${INVOICE_COORDINATES.qrCode.innerWidth}px`,
                  height: `${INVOICE_COORDINATES.qrCode.innerHeight}px`,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={qrDataUrl}
                  alt="Bill Verification QR"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>
            )}

            {/* 3. DYNAMIC CUSTOMER NAME */}
            <div
              style={{
                position: 'absolute',
                left: `${INVOICE_COORDINATES.customerName.left}px`,
                top: `${INVOICE_COORDINATES.customerName.top}px`,
                width: `${INVOICE_COORDINATES.customerName.width}px`,
                height: `${INVOICE_COORDINATES.customerName.height}px`,
                fontSize: `${INVOICE_COORDINATES.customerName.fontSize}px`,
                lineHeight: '1.2',
                color: '#111827',
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {bill.customerName}
            </div>

            {/* 4. DYNAMIC CUSTOMER MOBILE */}
            <div
              style={{
                position: 'absolute',
                left: `${INVOICE_COORDINATES.customerMobile.left}px`,
                top: `${INVOICE_COORDINATES.customerMobile.top}px`,
                width: `${INVOICE_COORDINATES.customerMobile.width}px`,
                height: `${INVOICE_COORDINATES.customerMobile.height}px`,
                fontSize: `${INVOICE_COORDINATES.customerMobile.fontSize}px`,
                lineHeight: '1.2',
                color: '#111827',
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                letterSpacing: '0.5px',
              }}
            >
              {bill.mobile}
            </div>

            {/* 5. DYNAMIC CUSTOMER ADDRESS */}
            <div
              style={{
                position: 'absolute',
                left: `${INVOICE_COORDINATES.customerAddress.left}px`,
                top: `${INVOICE_COORDINATES.customerAddress.top}px`,
                width: `${INVOICE_COORDINATES.customerAddress.width}px`,
                height: `${INVOICE_COORDINATES.customerAddress.height}px`,
                fontSize: `${INVOICE_COORDINATES.customerAddress.fontSize}px`,
                lineHeight: '1.25',
                color: '#111827',
                fontWeight: 500,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'flex-start',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              <span className="line-clamp-2">{bill.address}</span>
            </div>

            {/* 6. DYNAMIC BILL NUMBER */}
            <div
              style={{
                position: 'absolute',
                left: `${INVOICE_COORDINATES.billNumber.left}px`,
                top: `${INVOICE_COORDINATES.billNumber.top}px`,
                width: `${INVOICE_COORDINATES.billNumber.width}px`,
                height: `${INVOICE_COORDINATES.billNumber.height}px`,
                fontSize: `${INVOICE_COORDINATES.billNumber.fontSize}px`,
                lineHeight: '1.2',
                color: '#111827',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {bill.billNumber}
            </div>

            {/* 7. DYNAMIC DATE */}
            <div
              style={{
                position: 'absolute',
                left: `${INVOICE_COORDINATES.billDate.left}px`,
                top: `${INVOICE_COORDINATES.billDate.top}px`,
                width: `${INVOICE_COORDINATES.billDate.width}px`,
                height: `${INVOICE_COORDINATES.billDate.height}px`,
                fontSize: `${INVOICE_COORDINATES.billDate.fontSize}px`,
                lineHeight: '1.2',
                color: '#111827',
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {formattedDate}
            </div>

            {/* 8. JEWELLERY PHOTO INSIDE EXISTING ORNAMENT DETAILS BOX ONLY */}
            {bill.jewelleryPhoto && (
              <div
                style={{
                  position: 'absolute',
                  left: `${INVOICE_COORDINATES.ornamentDetails.left + 5}px`,
                  top: `${INVOICE_COORDINATES.ornamentDetails.top + 5}px`,
                  width: `${INVOICE_COORDINATES.ornamentDetails.width - 10}px`,
                  height: `${INVOICE_COORDINATES.ornamentDetails.height - 10}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderRadius: `${INVOICE_COORDINATES.ornamentDetails.borderRadius}px`,
                  backgroundColor: '#ffffff',
                }}
              >
                <img
                  src={bill.jewelleryPhoto}
                  alt="Purchased Jewellery Ornament"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}

            {/* 9. DYNAMIC JEWELLERY ITEMS TABLE ROWS */}
            {bill.items.map((item, index) => {
              const rowCoord = INVOICE_COORDINATES.tableRows[index];
              if (!rowCoord) return null; // Supported up to available rows

              return (
                <React.Fragment key={item.id || index}>
                  {/* Sr. No. */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${INVOICE_COORDINATES.tableColumns.srNo.left}px`,
                      top: `${rowCoord.top}px`,
                      width: `${INVOICE_COORDINATES.tableColumns.srNo.width}px`,
                      height: `${rowCoord.height}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#111827',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${INVOICE_COORDINATES.tableColumns.description.left}px`,
                      top: `${rowCoord.top}px`,
                      width: `${INVOICE_COORDINATES.tableColumns.description.width}px`,
                      height: `${rowCoord.height}px`,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: `${INVOICE_COORDINATES.tableColumns.description.paddingLeft}px`,
                      paddingRight: '10px',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#111827',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </div>

                  {/* Weight */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${INVOICE_COORDINATES.tableColumns.weight.left}px`,
                      top: `${rowCoord.top}px`,
                      width: `${INVOICE_COORDINATES.tableColumns.weight.width}px`,
                      height: `${rowCoord.height}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: `${INVOICE_COORDINATES.tableColumns.weight.paddingRight}px`,
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#111827',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {item.weight > 0 ? `${item.weight.toFixed(2)} g` : ''}
                  </div>

                  {/* Rate */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${INVOICE_COORDINATES.tableColumns.rate.left}px`,
                      top: `${rowCoord.top}px`,
                      width: `${INVOICE_COORDINATES.tableColumns.rate.width}px`,
                      height: `${rowCoord.height}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: `${INVOICE_COORDINATES.tableColumns.rate.paddingRight}px`,
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#111827',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {item.rate > 0 ? formatINR(item.rate, false) : ''}
                  </div>

                  {/* Amount */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${INVOICE_COORDINATES.tableColumns.amount.left}px`,
                      top: `${rowCoord.top}px`,
                      width: `${INVOICE_COORDINATES.tableColumns.amount.width}px`,
                      height: `${rowCoord.height}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: `${INVOICE_COORDINATES.tableColumns.amount.paddingRight}px`,
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111827',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {item.amount > 0 ? formatINR(item.amount, false) : ''}
                  </div>
                </React.Fragment>
              );
            })}

            {/* 10. FINAL TOTAL AMOUNT OVERLAY */}
            <div
              style={{
                position: 'absolute',
                left: `${INVOICE_COORDINATES.totalAmount.left}px`,
                top: `${INVOICE_COORDINATES.totalAmount.top}px`,
                width: `${INVOICE_COORDINATES.totalAmount.width}px`,
                height: `${INVOICE_COORDINATES.totalAmount.height}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: `${INVOICE_COORDINATES.totalAmount.paddingRight}px`,
                fontSize: `${INVOICE_COORDINATES.totalAmount.fontSize}px`,
                fontWeight: 800,
                color: '#06231a',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {formatINR(bill.finalTotal, false)}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
