import { useRef } from 'react'

export default function InvoiceForm({ data, setData, onReset }) {
  const fileInputRef = useRef(null)

  const update = (path, value) => {
    setData(prev => {
      const copy = structuredClone(prev)
      const keys = path.split('.')
      let cur = copy
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
      cur[keys[keys.length - 1]] = value
      return copy
    })
  }

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', qty: 1, price: 0, tax: 0, discount: 0 }],
    }))
  }

  const removeItem = (idx) => {
    setData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))
  }

  const handleLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('branding.logo', reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {/* Style settings */}
      <section className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Style</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-gray-700">Theme Color
            <select value={data.style.accent} onChange={e => update('style.accent', e.target.value)} className="mt-1 w-full rounded border-gray-300">
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="mono">Black & White</option>
            </select>
          </label>
          <label className="text-sm text-gray-700">Font
            <select value={data.style.font} onChange={e => update('style.font', e.target.value)} className="mt-1 w-full rounded border-gray-300">
              <option value="inter">Inter</option>
              <option value="manrope">Manrope</option>
              <option value="ibm">IBM Plex Sans</option>
            </select>
          </label>
          <label className="text-sm text-gray-700 col-span-2">Logo Position
            <select value={data.style.logoPosition} onChange={e => update('style.logoPosition', e.target.value)} className="mt-1 w-full rounded border-gray-300">
              <option value="left">Top-left</option>
              <option value="center">Top-center</option>
            </select>
          </label>
        </div>
      </section>

      {/* From */}
      <section className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">From (Supplier)</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Business Name" value={data.from.businessName} onChange={e=>update('from.businessName', e.target.value)} />
          <input className="input" placeholder="Trading As (optional)" value={data.from.tradingAs} onChange={e=>update('from.tradingAs', e.target.value)} />
          <input className="input" placeholder="Contact Name" value={data.from.contact} onChange={e=>update('from.contact', e.target.value)} />
          <input className="input" placeholder="Phone" value={data.from.phone} onChange={e=>update('from.phone', e.target.value)} />
          <input className="input" placeholder="Email" value={data.from.email} onChange={e=>update('from.email', e.target.value)} />
          <input className="input" placeholder="Website (optional)" value={data.from.website} onChange={e=>update('from.website', e.target.value)} />
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>Upload Logo</button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              {data.branding.logo && <span className="text-xs text-gray-600">Logo added</span>}
            </div>
          </div>
        </div>
      </section>

      {/* To */}
      <section className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">To (Client)</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Client Name" value={data.to.name} onChange={e=>update('to.name', e.target.value)} />
          <input className="input" placeholder="Client Address (optional)" value={data.to.address} onChange={e=>update('to.address', e.target.value)} />
          <input className="input" placeholder="Client Email (optional)" value={data.to.email} onChange={e=>update('to.email', e.target.value)} />
        </div>
      </section>

      {/* Invoice details */}
      <section className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Invoice Details</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Invoice Title" value={data.invoice.title} onChange={e=>update('invoice.title', e.target.value)} />
          <input className="input" placeholder="Invoice Number" value={data.invoice.number} onChange={e=>update('invoice.number', e.target.value)} />
          <input type="date" className="input" value={data.invoice.date} onChange={e=>update('invoice.date', e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm text-gray-700 col-span-2">
              <input type="checkbox" className="mr-2" checked={data.invoice.dueUponReceipt} onChange={e=>update('invoice.dueUponReceipt', e.target.checked)} />Upon receipt
            </label>
            <input type="date" className="input col-span-2" disabled={data.invoice.dueUponReceipt} value={data.invoice.dueDate} onChange={e=>update('invoice.dueDate', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Project */}
      <section className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Project & Reference</h3>
        <input className="input mb-2" placeholder="Project Name / Description" value={data.project.name} onChange={e=>update('project.name', e.target.value)} />
        <input className="input" placeholder="Reference" value={data.project.reference} onChange={e=>update('project.reference', e.target.value)} />
      </section>

      {/* Items */}
      <section className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Line Items</h3>
          <button type="button" className="btn" onClick={addItem}>Add item</button>
        </div>
        <div className="space-y-3">
          {data.items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input className="input col-span-5" placeholder="Description" value={it.description} onChange={e=>{
                const val = e.target.value
                setData(prev=>{const copy=structuredClone(prev);copy.items[idx].description=val;return copy})
              }} />
              <input type="number" className="input col-span-2" placeholder="Qty" value={it.qty} onChange={e=>{
                const val = Number(e.target.value);setData(prev=>{const copy=structuredClone(prev);copy.items[idx].qty=val;return copy})
              }} />
              <input type="number" className="input col-span-2" placeholder="Unit Price" value={it.price} onChange={e=>{
                const val = Number(e.target.value);setData(prev=>{const copy=structuredClone(prev);copy.items[idx].price=val;return copy})
              }} />
              <input type="number" className="input col-span-1" placeholder="Tax %" value={it.tax} onChange={e=>{
                const val = Number(e.target.value);setData(prev=>{const copy=structuredClone(prev);copy.items[idx].tax=val;return copy})
              }} />
              <input type="number" className="input col-span-1" placeholder="Disc %" value={it.discount} onChange={e=>{
                const val = Number(e.target.value);setData(prev=>{const copy=structuredClone(prev);copy.items[idx].discount=val;return copy})
              }} />
              <button type="button" className="text-red-600 text-sm col-span-1" onClick={()=>removeItem(idx)}>Remove</button>
            </div>
          ))}
        </div>
      </section>

      {/* Bank */}
      <section className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Bank Details</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Bank Name" value={data.bank.bankName} onChange={e=>update('bank.bankName', e.target.value)} />
          <input className="input" placeholder="Account Name" value={data.bank.accountName} onChange={e=>update('bank.accountName', e.target.value)} />
          <input className="input" placeholder="Account Number" value={data.bank.accountNumber} onChange={e=>update('bank.accountNumber', e.target.value)} />
          <input className="input" placeholder="Mobile/Alt Account (optional)" value={data.bank.mobile} onChange={e=>update('bank.mobile', e.target.value)} />
          <input className="input" placeholder="Currency (e.g., TZS)" value={data.bank.currency} onChange={e=>update('bank.currency', e.target.value)} />
          <input className="input" placeholder="SWIFT / Routing Code (optional)" value={data.bank.swift} onChange={e=>update('bank.swift', e.target.value)} />
          <input className="input sm:col-span-2" placeholder="Payment Reference Note" value={data.bank.paymentNote} onChange={e=>update('bank.paymentNote', e.target.value)} />
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-lg border bg-white p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
        <textarea className="input min-h-[96px]" placeholder="Bullet style notes (one per line)" value={data.notes} onChange={e=>update('notes', e.target.value)} />
      </section>

      <div className="flex items-center gap-3">
        <button type="button" className="btn-primary" onClick={data.onDownload}>Download PDF</button>
        <button type="button" className="btn" onClick={onReset}>Reset Invoice</button>
      </div>
    </div>
  )
}
