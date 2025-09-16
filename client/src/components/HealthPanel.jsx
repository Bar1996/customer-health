import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function scoreColor(score) {
  if (score >= 80) return "text-green-600 font-bold"
  if (score >= 50) return "text-yellow-500 font-semibold"
  return "text-red-600 font-bold"
}

export default function HealthPanel({ customer, health }) {
  if (!health) return null

  // הופכים את האובייקט factors למערך שמתאים ל־Recharts
  const chartData = Object.entries(health.factors).map(([key, value]) => ({
    factor: key,
    value,
  }))

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Customer #{customer.id} Health</h2>
      <p className="mb-4">
        Score:{" "}
        <span className={scoreColor(health.score)}>
          {health.score}
        </span>
      </p>

      {/* תרשים עמודות */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="factor" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* רשימת Breakdown רגילה */}
      <ul className="list-disc ml-5 text-gray-700">
        <li>Logins: {health.factors.logins}</li>
        <li>Features used: {health.factors.features}</li>
        <li>API calls: {health.factors.apiCalls}</li>
        <li>Support tickets: {health.factors.tickets}</li>
        <li>Late invoices: {health.factors.lateInvoices}</li>
      </ul>
    </div>
  )
}