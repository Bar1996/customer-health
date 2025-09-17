import { useState } from "react";
import Modal from "./Modal";
import { addEvent } from "../services/api"; // 👈 שימוש בפונקציה מהשירות

export default function AddEventModal({
  isOpen,
  onClose,
  customerId,
  onEventAdded,
}) {
  const [eventType, setEventType] = useState("login");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await addEvent(customerId, eventType, date); // 👈 קריאה דרך השירות
      onEventAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        Add Event for Customer #{customerId}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="login">Login</option>
            <option value="feature_usage">Feature Usage</option>
            <option value="api_call">API Call</option>
            <option value="support_ticket">Support Ticket</option>
            <option value="invoice_late">Late Invoice</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Event"}
        </button>
      </form>
    </Modal>
  );
}
