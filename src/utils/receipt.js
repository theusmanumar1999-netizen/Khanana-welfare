// Generates a receipt as a downloadable image using Canvas API
export function generateReceiptImage({ memberName, fatherName, amount, method, date, transactionId, area }) {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 520
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#080e16'
  ctx.fillRect(0, 0, 800, 520)

  // Gold top border
  const grad = ctx.createLinearGradient(0, 0, 800, 0)
  grad.addColorStop(0, 'transparent')
  grad.addColorStop(0.5, '#c9a84c')
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 800, 3)

  // Society logo circle
  ctx.beginPath()
  ctx.arc(400, 80, 36, 0, Math.PI * 2)
  ctx.fillStyle = '#c9a84c'
  ctx.fill()
  ctx.fillStyle = '#080e16'
  ctx.font = 'bold 28px serif'
  ctx.textAlign = 'center'
  ctx.fillText('K', 400, 90)

  // Society name
  ctx.fillStyle = '#f0d060'
  ctx.font = 'bold 22px serif'
  ctx.textAlign = 'center'
  ctx.fillText('Khanana Welfare Society', 400, 140)

  // PAYMENT RECEIPT title
  ctx.fillStyle = '#c9a84c'
  ctx.font = 'bold 13px sans-serif'
  ctx.letterSpacing = '4px'
  ctx.fillText('PAYMENT RECEIPT', 400, 168)

  // Divider
  ctx.strokeStyle = 'rgba(201,168,76,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(60, 185)
  ctx.lineTo(740, 185)
  ctx.stroke()

  // Amount — big
  ctx.fillStyle = '#c9a84c'
  ctx.font = 'bold 48px serif'
  ctx.textAlign = 'center'
  ctx.fillText(`Rs. ${Number(amount).toLocaleString()}`, 400, 248)

  // Status badge
  ctx.fillStyle = 'rgba(0,200,100,0.15)'
  ctx.beginPath()
  ctx.roundRect(320, 260, 160, 32, 16)
  ctx.fill()
  ctx.fillStyle = '#00c864'
  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('✓ VERIFIED', 400, 281)

  // Details grid
  const details = [
    ['Member Name', memberName],
    ['Father Name', fatherName || '—'],
    ['Payment Method', method],
    ['Date', date],
    ['Area', area || '—'],
    ['Transaction ID', '#' + transactionId],
  ]

  ctx.textAlign = 'left'
  details.forEach(([label, value], i) => {
    const col = i % 2 === 0 ? 80 : 430
    const row = 320 + Math.floor(i / 2) * 52

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '11px sans-serif'
    ctx.fillText(label.toUpperCase(), col, row)

    // Value
    ctx.fillStyle = '#e8dcc8'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(value, col, row + 20)
  })

  // Bottom divider
  ctx.strokeStyle = 'rgba(201,168,76,0.2)'
  ctx.beginPath()
  ctx.moveTo(60, 470)
  ctx.lineTo(740, 470)
  ctx.stroke()

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Khanana Village · Est. 2024 · Developed by Usman Umar, Copenhagen Denmark', 400, 495)

  return canvas
}

export function downloadReceipt(data) {
  const canvas = generateReceiptImage(data)
  const link = document.createElement('a')
  link.download = `KWS-Receipt-${data.transactionId}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
