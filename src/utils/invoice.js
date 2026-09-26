import { exportFile } from 'quasar'
import { APP_NAME } from '@/config'
import { formatDateTime } from '@/utils/dates'
import { formatMoneyPlain } from '@/utils/money'

const taxLabel = (order) => `VAT (${Math.round(order.taxRate * 1000) / 10}%)`
const seatLabel = (order) => [order.table && `Table ${order.table}`, order.seat && `Seat ${order.seat}`].filter(Boolean).join(', ')

/* ------------------------------------------------------------------ */
/* Plain text invoice                                                  */
/* ------------------------------------------------------------------ */
const WIDTH = 42

function wrap(text, width) {
  const lines = []
  let current = ''
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    if (!current) current = word
    else if (current.length + 1 + word.length <= width) current += ` ${word}`
    else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

const center = (s) => (s.length >= WIDTH ? s : ' '.repeat(Math.floor((WIDTH - s.length) / 2)) + s)
const rule = (ch = '-') => ch.repeat(WIDTH)
const pair = (left, right) => {
  const gap = WIDTH - left.length - right.length
  return gap >= 1 ? left + ' '.repeat(gap) + right : `${left} ${right}`
}

export function buildInvoiceText(order, restaurant) {
  const out = []
  out.push(center(restaurant?.name || APP_NAME))
  if (restaurant?.address) wrap(restaurant.address, WIDTH - 4).forEach((l) => out.push(center(l)))
  if (restaurant?.phone) out.push(center(`Tel: ${restaurant.phone}`))
  if (order.branch) out.push(center(`Branch: ${order.branch}`))
  out.push(rule())
  out.push(pair('Invoice', order.invoiceNo))
  out.push(pair('Date', formatDateTime(order.createdAt)))
  out.push(pair('Customer', order.customer.name))
  if (order.customer.phone) out.push(pair('Phone', order.customer.phone))
  if (seatLabel(order)) out.push(pair('Seating', seatLabel(order)))
  out.push(rule())

  for (const line of order.lines) {
    wrap(line.name, WIDTH).forEach((l) => out.push(l))
    out.push(pair(`  ${line.qty} x ${formatMoneyPlain(line.price)}`, formatMoneyPlain(line.amount)))
  }

  out.push(rule())
  out.push(pair('Subtotal', formatMoneyPlain(order.subtotal)))
  out.push(pair(taxLabel(order), formatMoneyPlain(order.tax)))
  out.push(rule('='))
  out.push(pair('TOTAL', formatMoneyPlain(order.total)))
  out.push(rule('='))
  out.push(center('Thank you for dining with us!'))
  out.push(center('Computer generated invoice'))
  return out.join('\n') + '\n'
}

export function downloadInvoiceText(order, restaurant) {
  const result = exportFile(`${order.invoiceNo}.txt`, buildInvoiceText(order, restaurant), {
    mimeType: 'text/plain;charset=utf-8',
  })
  if (result !== true) throw new Error('The browser blocked the download.')
}

/* ------------------------------------------------------------------ */
/* Print — opens a small receipt-styled window and triggers print()    */
/* ------------------------------------------------------------------ */
const esc = (s) =>
  String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])

function buildInvoiceHtml(order, restaurant) {
  const rows = order.lines
    .map(
      (l) => `
      <div class="line">
        <div class="name">${esc(l.name)}</div>
        <div class="qty">${l.qty} &times; ${esc(formatMoneyPlain(l.price))}</div>
        <div class="amt">${esc(formatMoneyPlain(l.amount))}</div>
      </div>`,
    )
    .join('')

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${esc(order.invoiceNo)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; color: #16140f; width: 300px; margin: 16px auto; font-size: 12px; }
  .center { text-align: center; }
  .name-h { font-weight: 700; font-size: 14px; }
  .muted { color: #555; }
  .rule { border: none; border-top: 1px dashed #999; margin: 8px 0; }
  .rule.solid { border-top: 2px solid #16140f; }
  .row { display: flex; justify-content: space-between; }
  .line { display: grid; grid-template-columns: 1fr auto; gap: 0 6px; margin: 5px 0; }
  .line .name { grid-column: 1 / -1; }
  .line .qty { color: #555; }
  .line .amt { text-align: right; }
  .total { font-weight: 700; font-size: 14px; }
  .logo { max-width: 80px; max-height: 80px; display: block; margin: 0 auto 6px; }
  @media print { body { margin: 0 auto; } }
</style></head>
<body onload="window.print()">
  ${restaurant?.logo ? `<img class="logo" src="${restaurant.logo}" />` : ''}
  <div class="center name-h">${esc(restaurant?.name || 'Resto POS')}</div>
  ${restaurant?.address ? `<div class="center muted">${esc(restaurant.address)}</div>` : ''}
  ${restaurant?.phone ? `<div class="center muted">Tel: ${esc(restaurant.phone)}</div>` : ''}
  ${order.branch ? `<div class="center muted">Branch: ${esc(order.branch)}</div>` : ''}
  <hr class="rule" />
  <div class="row"><span>Invoice</span><span>${esc(order.invoiceNo)}</span></div>
  <div class="row"><span>Date</span><span>${esc(formatDateTime(order.createdAt))}</span></div>
  <div class="row"><span>Customer</span><span>${esc(order.customer.name)}</span></div>
  ${order.customer.phone ? `<div class="row"><span>Phone</span><span>${esc(order.customer.phone)}</span></div>` : ''}
  ${seatLabel(order) ? `<div class="row"><span>Seating</span><span>${esc(seatLabel(order))}</span></div>` : ''}
  <hr class="rule" />
  ${rows}
  <hr class="rule" />
  <div class="row"><span>Subtotal</span><span>${esc(formatMoneyPlain(order.subtotal))}</span></div>
  <div class="row"><span>${esc(taxLabel(order))}</span><span>${esc(formatMoneyPlain(order.tax))}</span></div>
  <hr class="rule solid" />
  <div class="row total"><span>TOTAL</span><span>${esc(formatMoneyPlain(order.total))}</span></div>
  <hr class="rule solid" />
  <div class="center muted">Thank you for dining with us!</div>
</body></html>`
}

export function printInvoice(order, restaurant) {
  const win = window.open('', '_blank', 'width=380,height=640')
  if (!win) throw new Error('The browser blocked the print window pop-up.')
  win.document.write(buildInvoiceHtml(order, restaurant))
  win.document.close()
}

/* ------------------------------------------------------------------ */
/* PDF invoice (80 mm receipt slip, height fitted to the content)      */
/* ------------------------------------------------------------------ */
// Standard PDF fonts only cover Latin characters, so anything else is replaced with "?".
const pdfSafe = (s) => String(s ?? '').replace(/[^\x20-\x7E\xA0-\xFF]/g, '?')

function drawSlip(doc, order, restaurant, width) {
  const M = 5
  const right = width - M
  const mid = width / 2
  const LH = 3.9
  let y = 8

  const dashed = () => {
    doc.setDrawColor(120)
    doc.setLineDashPattern([0.8, 0.8], 0)
    doc.line(M, y, right, y)
    doc.setLineDashPattern([], 0)
    y += LH
  }
  const centered = (text) => {
    doc.splitTextToSize(pdfSafe(text), width - M * 2).forEach((l) => {
      doc.text(l, mid, y, { align: 'center' })
      y += LH
    })
  }
  const row = (left, value) => {
    doc.text(pdfSafe(left), M, y)
    doc.text(pdfSafe(value), right, y, { align: 'right' })
    y += LH
  }

  doc.setFont('courier', 'normal')
  doc.setTextColor(30)

  if (restaurant?.logo) {
    try {
      const props = doc.getImageProperties(restaurant.logo)
      let h = 16
      let w = (h * props.width) / props.height
      if (w > 40) {
        w = 40
        h = (w * props.height) / props.width
      }
      doc.addImage(restaurant.logo, props.fileType, mid - w / 2, y, w, h)
      y += h + 4
    } catch {
      /* a broken logo should never block the invoice */
    }
  }

  doc.setFont('courier', 'bold')
  doc.setFontSize(11)
  y += 1
  centered(restaurant?.name || APP_NAME)
  doc.setFont('courier', 'normal')
  doc.setFontSize(8)
  if (restaurant?.address) centered(restaurant.address)
  if (restaurant?.phone) centered(`Tel: ${restaurant.phone}`)
  if (order.branch) centered(`Branch: ${order.branch}`)
  y += 1
  dashed()

  row('Invoice', order.invoiceNo)
  row('Date', formatDateTime(order.createdAt))
  row('Customer', order.customer.name)
  if (order.customer.phone) row('Phone', order.customer.phone)
  if (seatLabel(order)) row('Seating', seatLabel(order))
  dashed()

  for (const line of order.lines) {
    doc.splitTextToSize(pdfSafe(line.name), width - M * 2).forEach((l) => {
      doc.text(l, M, y)
      y += LH
    })
    doc.setTextColor(100)
    row(`  ${line.qty} x ${formatMoneyPlain(line.price)}`, formatMoneyPlain(line.amount))
    doc.setTextColor(30)
  }
  dashed()

  row('Subtotal', formatMoneyPlain(order.subtotal))
  row(taxLabel(order), formatMoneyPlain(order.tax))
  y += 0.5
  doc.setFont('courier', 'bold')
  doc.setFontSize(10)
  row('TOTAL', formatMoneyPlain(order.total))
  doc.setFont('courier', 'normal')
  doc.setFontSize(8)
  y += 1
  dashed()
  doc.setTextColor(100)
  centered('Thank you for dining with us!')
  centered('Computer generated invoice')

  return y + M
}

export async function downloadInvoicePdf(order, restaurant) {
  // jsPDF is large, so it is only fetched when someone actually downloads a PDF.
  const { jsPDF } = await import('jspdf')
  const width = 80

  // Pass 1 measures the content, pass 2 draws it on a page that fits exactly.
  const probe = new jsPDF({ unit: 'mm', format: [width, 1000] })
  const height = Math.max(70, Math.ceil(drawSlip(probe, order, restaurant, width)))

  const doc = new jsPDF({ unit: 'mm', format: [width, height] })
  doc.setProperties({ title: `${order.invoiceNo} - ${restaurant?.name || APP_NAME}` })
  drawSlip(doc, order, restaurant, width)
  doc.save(`${order.invoiceNo}.pdf`)
}
