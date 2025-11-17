import { useMemo } from 'react'

function currency(num, curr) {
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: curr || 'TZS', currencyDisplay: 'code', maximumFractionDigits: 0 }).format(num).replace(/\s?TZS/, '').trim()
}

export default function InvoicePreview({ data }) {
  const { items, bank, from, to, invoice, project, branding, style } = data

  const calc = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + (it.qty * it.price), 0)
    const taxTotal = items.reduce((s, it) => s + (it.qty * it.price) * (it.tax || 0) / 100, 0)
    const discountTotal = items.reduce((s, it) => s + (it.qty * it.price) * (it.discount || 0) / 100, 0)
    const total = subtotal + taxTotal - discountTotal
    return { subtotal, taxTotal, discountTotal, total }
  }, [items])

  const accentHex = {
    blue: '#1E40AF',
    green: '#047857',
    mono: '#111827',
  }[style.accent] || '#1E40AF'

  const fontClass = {
    inter: 'font-sans',
    manrope: 'font-[var(--font-manrope)]',
    ibm: 'font-[var(--font-ibm-plex)]',
  }[style.font] || 'font-sans'

  return (
    <div className={`bg-white rounded-lg border shadow-sm print:shadow-none ${fontClass}`} id="invoice-area">
      <div className="p-6 border-b flex items-start gap-4">
        {branding.logo && (
          <img src={branding.logo} alt="Logo" className={`h-14 object-contain ${style.logoPosition === 'center' ? 'mx-auto' : ''}`} />
        )}
        <div className={`ml-auto text-right ${style.logoPosition === 'center' && 'w-full text-center ml-0'}`}>
          <div className="text-3xl font-bold text-gray-900">INVOICE</div>
          <div className="text-sm text-gray-500">{invoice.title}</div>
        </div>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-6 border-b">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500" style={{ color: accentHex }}>From</h4>
          <div className="mt-2 text-sm">
            <div className="font-semibold text-gray-900">{from.businessName}{from.tradingAs ? ` (trading as "${from.tradingAs}")` : ''}</div>
            <div className="text-gray-700">{from.contact}</div>
            <div className="text-gray-700">{from.phone}</div>
            <div className="text-gray-700">{from.email}</div>
            {from.website && <div className="text-gray-700">{from.website}</div>}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500" style={{ color: accentHex }}>To</h4>
          <div className="mt-2 text-sm">
            <div className="font-semibold text-gray-900">{to.name}</div>
            {to.address && <div className="text-gray-700">{to.address}</div>}
            {to.email && <div className="text-gray-700">{to.email}</div>}
          </div>
        </div>

        <div className="sm:col-span-2 grid grid-cols-3 gap-4 pt-2">
          <div>
            <div className="text-xs text-gray-500">Invoice Number</div>
            <div className="font-semibold text-gray-900">{invoice.number}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Invoice Date</div>
            <div className="font-semibold text-gray-900">{invoice.date}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Due Date</div>
            <div className="font-semibold text-gray-900">{invoice.dueUponReceipt ? 'Upon receipt' : invoice.dueDate}</div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="text-sm text-gray-700"><span className="font-semibold">Project:</span> {project.name}</div>
        {project.reference && (
          <div className="text-sm text-gray-700"><span className="font-semibold">Reference:</span> {project.reference}</div>
        )}
      </div>

      <div className="p-6 border-b">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Unit Price</th>
              <th className="py-2 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => {
              const line = it.qty * it.price
              return (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 text-gray-800">{it.description}</td>
                  <td className="py-2 text-gray-800">{it.qty}</td>
                  <td className="py-2 text-gray-800">{currency(it.price, bank.currency)}</td>
                  <td className="py-2 text-right text-gray-900 font-medium">{currency(line, bank.currency)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-6 items-start">
        <div className="text-sm text-gray-700">
          <div className="rounded-md border p-4">
            <div className="font-semibold mb-2" style={{ color: accentHex }}>Bank Details</div>
            <div>{bank.bankName}</div>
            <div>{bank.accountName}</div>
            <div>{bank.accountNumber}</div>
            {bank.mobile && <div>{bank.mobile}</div>}
            <div>Currency: {bank.currency}</div>
            {bank.swift && <div>SWIFT: {bank.swift}</div>}
            {bank.paymentNote && <div className="mt-2 text-gray-600 text-xs">{bank.paymentNote}</div>}
          </div>
        </div>
        <div>
          <div className="rounded-md border p-4 bg-gray-50">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>{currency(calc.subtotal, bank.currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Tax</span>
              <span>{currency(calc.taxTotal, bank.currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Discount</span>
              <span>-{currency(calc.discountTotal, bank.currency)}</span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-base font-semibold text-gray-900">
              <span>Amount Due ({bank.currency})</span>
              <span>{currency(calc.total, bank.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="p-6">
          <div className="text-sm font-semibold mb-2" style={{ color: accentHex }}>Notes</div>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {data.notes.split('\n').filter(Boolean).map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
