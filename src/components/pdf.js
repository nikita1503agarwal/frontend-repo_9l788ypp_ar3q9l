import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function downloadInvoicePDF(filename = 'invoice.pdf') {
  const el = document.getElementById('invoice-area')
  if (!el) return

  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' })
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF('p', 'pt', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
  const imgWidth = canvas.width * ratio
  const imgHeight = canvas.height * ratio
  const x = (pageWidth - imgWidth) / 2
  const y = 20

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
  pdf.save(filename)
}
