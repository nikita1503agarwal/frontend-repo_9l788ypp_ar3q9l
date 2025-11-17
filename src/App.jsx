import { useMemo, useState } from 'react'
import HeaderHero from './components/HeaderHero'
import InvoiceForm from './components/InvoiceForm'
import InvoicePreview from './components/InvoicePreview'
import { downloadInvoicePDF } from './components/pdf'

const sample = {
  style: { accent: 'blue', font: 'inter', logoPosition: 'left' },
  branding: { logo: '' },
  from: {
    businessName: 'Dimiro Networks',
    tradingAs: '59 Shift',
    contact: 'Naimah Kunambi',
    phone: '0623 580 603',
    email: 'naimakunambi@gmail.com',
    website: ''
  },
  to: {
    name: 'Showtime Tanzania',
    address: '',
    email: ''
  },
  invoice: {
    title: 'Invoice – First Installment',
    number: '001',
    date: '2025-11-17',
    dueUponReceipt: true,
    dueDate: ''
  },
  project: {
    name: 'Digital Transformation – Website, SEO, CRM, Social Media & AI Integration',
    reference: 'Memorandum of Understanding dated 2 November 2025'
  },
  items: [
    { description: 'Digital Transformation Project – First Installment (1 of 3)', qty: 1, price: 2400000, tax: 0, discount: 0 },
  ],
  bank: {
    bankName: 'Selcom Microfinance Bank Tanzania Limited',
    accountName: 'NAIMAN PASCAL KUNAMBI',
    accountNumber: '55251 03068 129',
    mobile: '255 623 580 603',
    currency: 'TZS',
    swift: 'ACTZIZTZ',
    paymentNote: "Please include the reference 'Showtime – Invoice 001' on the payment."
  },
  notes: [
    'This invoice is issued in line with the signed Memorandum of Understanding between Dimiro Networks (59 Shift) and Showtime Tanzania.',
    'Late payments may attract a 2% monthly interest on overdue amounts as per the MOU.',
    'Work will commence/kickoff meeting will be held on Saturday, [insert exact date], subject to receipt of this first installment.'
  ].join('\n')
}

export default function App() {
  const [data, setData] = useState(sample)

  const fontClass = useMemo(() => ({
    inter: 'font-sans',
    manrope: 'font-[var(--font-manrope)]',
    ibm: 'font-[var(--font-ibm-plex)]',
  }[data.style.font] || 'font-sans'), [data.style.font])

  const onReset = () => setData(sample)

  const onDownload = async () => {
    await downloadInvoicePDF(`invoice-${data.invoice.number || 'oneshot'}.pdf`)
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${fontClass}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <HeaderHero accent={data.style.accent} fontClass={fontClass} />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="order-1">
            <InvoiceForm data={{...data, onDownload}} setData={setData} onReset={onReset} />
          </div>
          <div className="order-2">
            <InvoicePreview data={data} />
          </div>
        </div>
      </div>

      {/* Utility styles */}
      <style>{`
        .input { @apply w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300; }
        .btn { @apply inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50; }
        .btn-primary { @apply inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-700; }
      `}</style>
    </div>
  )
}
