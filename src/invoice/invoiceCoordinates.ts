/**
 * Exact coordinate calibration for Jay Ambe Jewellers master invoice (1045 x 1505 px).
 * All coordinates are defined relative to the master invoice canvas.
 */

export interface CoordinateRegion {
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize?: number;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  paddingLeft?: number;
  paddingRight?: number;
}

export const INVOICE_CANVAS = {
  width: 1045,
  height: 1505,
  aspectRatio: 1045 / 1505,
};

export const INVOICE_COORDINATES = {
  customerName: {
    left: 148,
    top: 480,
    width: 395,
    height: 32,
    fontSize: 23,
    align: 'left' as const,
  },
  customerMobile: {
    left: 148,
    top: 526,
    width: 395,
    height: 32,
    fontSize: 23,
    align: 'left' as const,
  },
  customerAddress: {
    left: 148,
    top: 572,
    width: 395,
    height: 52,
    fontSize: 20,
    align: 'left' as const,
  },
  billNumber: {
    left: 890,
    top: 485,
    width: 115,
    height: 32,
    fontSize: 24,
    align: 'left' as const,
  },
  billDate: {
    left: 870,
    top: 540,
    width: 135,
    height: 32,
    fontSize: 22,
    align: 'left' as const,
  },
  ornamentDetails: {
    left: 558,
    top: 437,
    width: 214,
    height: 212,
    innerPadding: 8,
    borderRadius: 16,
  },
  tableColumns: {
    srNo: {
      left: 34,
      width: 101,
      align: 'center' as const,
    },
    description: {
      left: 135,
      width: 453,
      align: 'left' as const,
      paddingLeft: 14,
    },
    weight: {
      left: 588,
      width: 132,
      align: 'right' as const,
      paddingRight: 14,
    },
    rate: {
      left: 720,
      width: 135,
      align: 'right' as const,
      paddingRight: 14,
    },
    amount: {
      left: 855,
      width: 154,
      align: 'right' as const,
      paddingRight: 14,
    },
  },
  tableRows: [
    { top: 697, height: 59 },
    { top: 756, height: 59 },
    { top: 815, height: 61 },
    { top: 876, height: 58 },
    { top: 934, height: 58 },
    { top: 992, height: 57 },
    { top: 1049, height: 58 },
    { top: 1107, height: 61 },
  ],
  totalAmount: {
    left: 855,
    top: 1195,
    width: 154,
    height: 44,
    fontSize: 25,
    align: 'right' as const,
    paddingRight: 14,
  },
  qrCode: {
    left: 847,
    top: 175,
    width: 152,
    height: 171,
    // Inner QR container
    innerLeft: 852,
    innerTop: 180,
    innerWidth: 142,
    innerHeight: 161,
  },
};
