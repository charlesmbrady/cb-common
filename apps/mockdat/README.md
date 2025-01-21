.
├─ src/
│ ├─ context/
│ │ └─ MockdatContext.js // The context + provider
│ ├─ components/
│ │ ├─ MockdatWizard.js // Renders all steps based on step value
│ │ ├─ SelectRecordType.js
│ │ ├─ SelectFields.js
│ │ ├─ SelectQuantity.js
│ │ ├─ PreviewData.js
│ │ └─ SelectOutput.js
│ └─ pages/
│ └─ index.js // (Next.js) Renders <MockdatWizard />
├─ package.json
├─ ...other config files...
