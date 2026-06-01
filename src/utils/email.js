import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_RECEIPT = import.meta.env.VITE_EMAILJS_TEMPLATE_RECEIPT
const TEMPLATE_REMINDER = import.meta.env.VITE_EMAILJS_TEMPLATE_REMINDER
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function sendReceiptEmail({ toEmail, toName, amount, method, date, transactionId, totalPaid }) {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_RECEIPT,
      {
        to_email: toEmail,
        to_name: toName,
        amount: `Rs. ${Number(amount).toLocaleString()}`,
        method,
        date,
        transaction_id: transactionId,
        total_paid: `Rs. ${Number(totalPaid).toLocaleString()}`,
        society_name: 'Khanana Welfare Society',
        year: new Date().getFullYear(),
      },
      PUBLIC_KEY
    )
    return { success: true }
  } catch (err) {
    console.error('Receipt email failed:', err)
    return { success: false, error: err }
  }
}

export async function sendReminderEmail({ toEmail, toName, month, year, amount, dueDate }) {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_REMINDER,
      {
        to_email: toEmail,
        to_name: toName,
        month,
        year,
        amount: `Rs. ${Number(amount).toLocaleString()}`,
        due_date: dueDate,
        pay_url: window.location.origin + '/pay',
        society_name: 'Khanana Welfare Society',
      },
      PUBLIC_KEY
    )
    return { success: true }
  } catch (err) {
    console.error('Reminder email failed:', err)
    return { success: false, error: err }
  }
}
