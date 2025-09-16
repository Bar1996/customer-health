export default function CustomerTable({ customers, onSelect, onAddEvent }) {
  return (
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Segment</th>
          <th className="p-3 text-left">Created At</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c, i) => (
          <tr
            key={c.id}
            className={`h-16 border-b ${
              i % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-gray-100 transition`}
          >
            <td className="p-3 text-left">{c.id}</td>
            <td className="p-3 text-left">{c.name}</td>
            <td className="p-3 text-left">{c.segment}</td>
            <td className="p-3 text-left">
              {new Date(c.created_at).toLocaleDateString()}
            </td>
            <td className="p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => onSelect(c.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 text-white hover:bg-brand-600 transition cursor-pointer shadow-sm"
                >
                  <span>View</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => onAddEvent(c.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition cursor-pointer shadow-sm"
                >
                  <span>Add Event</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
