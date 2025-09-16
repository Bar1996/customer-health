export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* רקע כהה עם blur */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
  
        {/* חלון תוכן */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 z-10 animate-fadeIn">
          {/* כותרת עם border */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Customer Health</h2>
            <button
              className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
  
          {children}
        </div>
      </div>
    )
  }