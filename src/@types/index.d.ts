// eslint-disable-next-line spaced-comment
/// <reference types="html2pdf.js" />

// i18next.d.ts
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

declare module 'html2pdf.js';
declare module 'react-signature-pad-wrapper';
declare module 'react-pivottable/PivotTableUI';
declare module 'react-pivottable/TableRenderers';
declare module 'react-pivottable/PlotlyRenderers';
declare module 'react-pivottable/Utilities';
declare module '@linways/table-to-excel';
declare module '@otplib/preset-browser';
