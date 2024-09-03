export const indicationPrintStyles = `
#download-button {
  display: none;
}

.print-display-none {
  display: none;
}

.print .MuiPaper-root {
  padding: 2rem 0;
  box-shadow: none;
}

@media all {
  .page-break {
    display: none;
  }
}

@media print {
  html,
  body {
    height: initial !important;
    overflow: initial !important;
  }
  .page-break {
    margin-top: 1rem;
    display: block;
    page-break-before: always;
  }
}

@page {
  size: auto;
}

`;
