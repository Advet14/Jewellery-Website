import React, { forwardRef, useEffect, useState, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { Bill } from '../types/bill';
import { INVOICE_CANVAS, INVOICE_COORDINATES } from './invoiceCoordinates';
import invoiceMasterImg from '../assets/invoice-master.png';
import { generateQrDataUrl } from '../utils/qr';
import { formatINR } from '../utils/calculations';

// true  = text fields ke peeche white background, taaki master image ki dotted lines chhup jaayein
// false = background transparent (agar mask se design kat raha ho)
const MASK_BACKGROUND_DOTS = true;

const FONT = "'Plus Jakarta Sans', sans-serif";

const maskStyle: CSSProperties = MASK_BACKGROUND_DOTS
  ? { backgroundColor: '#ffffff' }
  : {};

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

    // Generate dynamic QR code when verification ID is available
    useEffect(() => {
      let isMounted = true;

      if (bill.verificationId) {
        generateQrDataUrl(bill.verificationId).then((url) => {
          if (isMounted) setQrDataUrl(url);
        });
      } else {
        setQrDataUrl('');
      }

      return () => {
        isMounted = false;
      };
    }, [bill.verificationId]);

    // Responsive scaling
    useEffect(() => {
      if (scaleMode !== 'fit-container') return;

      const updateScale = () => {
        if (!containerRef.current) return;
        const availableWidth = containerRef.current.clientWidth;
        if (availableWidth > 0) {
          setScale(Math.min(1, availableWidth / INVOICE_CANVAS.width));
        }
      };

      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }, [scaleMode]);

    // Format date as DD/MM/YYYY
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

    // Single-line text field: hard clip, never "..."
    const textField = (
      c: { left: number; top: number; width: number; height: number; fontSize: number },
      fontWeight: number,
      extra: CSSProperties = {}
    ): CSSProperties => ({
      position: 'absolute',
      left: `${c.left}px`,
      top: `${c.top}px`,
      width: `${c.width}px`,
      height: `${c.height}px`,
      fontSize: `${c.fontSize}px`,
      lineHeight: '1.2',
      color: '#111827',
      fontWeight,
      fontFamily: FONT,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'clip',
      letterSpacing: '0',
      ...maskStyle,
      ...extra,
    });

    // Table cell base style
    const cellStyle = (
      left: number,
      width: number,
      rowTop: number,
      rowHeight: number,
      extra: CSSProperties = {}
    ): CSSProperties => ({
      position: 'absolute',
      left: `${left}px`,
      top: `${rowTop}px`,
      width: `${width}px`,
      height: `${rowHeight}px`,
      display: 'flex',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: 600,
      color: '#111827',
      fontFamily: FONT,
      lineHeight: '1.2',
      ...extra,
    });

    return (
      <div
        ref={containerRef}
        className={`w-full flex justify-center overflow-hidden ${className}`}
        style={{
          height:
            scaleMode === 'fit-container'
              ? `${INVOICE_CANVAS.height * scale}px`
              : undefined,
        }}
      >
        {/* Scaled invoice wrapper */}
        <div
          style={{
            width: `${INVOICE_CANVAS.width}px`,
            height: `${INVOICE_CANVAS.height}px`,
            transform:
              scaleMode === 'fit-container' ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
          className="shrink-0"
        >
          {/* Exact invoice canvas */}
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
            {/* 1. MASTER INVOICE BACKGROUND */}
            <img
              src={invoiceMasterImg}
              alt="Jay Ambe Jewellers Invoice Master Template"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                width: `${INVOICE_CANVAS.width}px`,
                height: `${INVOICE_CANVAS.height}px`,
              }}
            />

            {/* 2. QR CODE */}
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

            {/* 3. CUSTOMER NAME */}
            <div
              style={textField(INVOICE_COORDINATES.customerName, 600)}
              title={bill.customerName}
            >
              {bill.customerName}
            </div>

            {/* 4. CUSTOMER MOBILE */}
            <div
              style={textField(INVOICE_COORDINATES.customerMobile, 600, {
                letterSpacing: '0.5px',
              })}
            >
              {bill.mobile}
            </div>

            {/* 5. CUSTOMER ADDRESS (no line-clamp, no ellipsis) */}
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
                fontFamily: FONT,
                overflow: 'hidden',
                textOverflow: 'clip',
                wordBreak: 'break-word',
                ...maskStyle,
              }}
              title={bill.address}
            >
              {bill.address}
            </div>

            {/* 6. BILL NUMBER */}
            <div style={textField(INVOICE_COORDINATES.billNumber, 700)}>
              {bill.billNumber}
            </div>

            {/* 7. DATE */}
            <div style={textField(INVOICE_COORDINATES.billDate, 600)}>
              {formattedDate}
            </div>

            {/* 8. JEWELLERY PHOTO */}
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
                    display: 'block',
                  }}
                />
              </div>
            )}

            {/* 9. JEWELLERY ITEMS */}
            {bill.items.map((item, index) => {
              const rowCoord = INVOICE_COORDINATES.tableRows[index];
              if (!rowCoord) return null;

              const cols = INVOICE_COORDINATES.tableColumns;

              return (
                <React.Fragment key={item.id || index}>
                  {/* Sr. No. */}
                  <div
                    style={cellStyle(
                      cols.srNo.left,
                      cols.srNo.width,
                      rowCoord.top,
                      rowCoord.height,
                      { justifyContent: 'center' }
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Description (hard clip, no "...") */}
                  <div
                    style={cellStyle(
                      cols.description.left,
                      cols.description.width,
                      rowCoord.top,
                      rowCoord.height,
                      {
                        paddingLeft: `${cols.description.paddingLeft}px`,
                        paddingRight: '10px',
                        fontSize: '18px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'clip',
                        letterSpacing: '0',
                      }
                    )}
                    title={item.description}
                  >
                    {item.description}
                  </div>

                  {/* Weight */}
                  <div
                    style={cellStyle(
                      cols.weight.left,
                      cols.weight.width,
                      rowCoord.top,
                      rowCoord.height,
                      {
                        justifyContent: 'flex-end',
                        paddingRight: `${cols.weight.paddingRight}px`,
                      }
                    )}
                  >
                    {item.weight > 0 ? `${item.weight.toFixed(2)} g` : ''}
                  </div>

                  {/* Rate */}
                  <div
                    style={cellStyle(
                      cols.rate.left,
                      cols.rate.width,
                      rowCoord.top,
                      rowCoord.height,
                      {
                        justifyContent: 'flex-end',
                        paddingRight: `${cols.rate.paddingRight}px`,
                      }
                    )}
                  >
                    {item.rate > 0 ? formatINR(item.rate, false) : ''}
                  </div>

                  {/* Amount */}
                  <div
                    style={cellStyle(
                      cols.amount.left,
                      cols.amount.width,
                      rowCoord.top,
                      rowCoord.height,
                      {
                        justifyContent: 'flex-end',
                        paddingRight: `${cols.amount.paddingRight}px`,
                        fontWeight: 700,
                      }
                    )}
                  >
                    {item.amount > 0 ? formatINR(item.amount, false) : ''}
                  </div>
                </React.Fragment>
              );
            })}

            {/* 10. FINAL TOTAL */}
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
                fontFamily: FONT,
                lineHeight: '1.2',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'clip',
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