export default function CustomerTable({ customers, onSelect }) {
  return (
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-3">ID</th>
          <th className="p-3">Name</th>
          <th className="p-3">Segment</th>
          <th className="p-3">Created At</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c, i) => (
          <tr
            key={c.id}
            className={`border-b ${
              i % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-gray-100 transition`}
          >
            <td className="p-3">{c.id}</td>
            <td className="p-3">{c.name}</td>
            <td className="p-3">{c.segment}</td>
            <td className="p-3">
              {new Date(c.created_at).toLocaleDateString()}
            </td>
            <td className="p-3">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
