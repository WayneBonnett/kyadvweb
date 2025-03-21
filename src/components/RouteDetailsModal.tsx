import { AdventureIcons } from "./AdventureIcons";

interface Route {
  name: string;
  description: string;
  date: string;
  downloadUrl: string;
  distance: string;
  elevation: {
    min: number;
    max: number;
    gain: number;
  };
}

interface RouteDetailsModalProps {
  route: Route;
  onClose: () => void;
}

export default function RouteDetailsModal({
  route,
  onClose,
}: RouteDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-adventure">{route.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6">{route.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <AdventureIcons.Distance className="w-5 h-5 mr-2 text-green-700" />
              <span className="font-semibold">Distance</span>
            </div>
            <p className="text-gray-600">{route.distance}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <AdventureIcons.Elevation className="w-5 h-5 mr-2 text-green-700" />
              <span className="font-semibold">Elevation</span>
            </div>
            <p className="text-gray-600">
              {route.elevation.min}ft - {route.elevation.max}ft
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <AdventureIcons.Mountain className="w-5 h-5 mr-2 text-green-700" />
              <span className="font-semibold">Gain</span>
            </div>
            <p className="text-gray-600">{route.elevation.gain}ft</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <AdventureIcons.Weather className="w-5 h-5 mr-2 text-green-700" />
              <span className="font-semibold">Added</span>
            </div>
            <p className="text-gray-600">{route.date}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <a href={route.downloadUrl} className="btn-primary" download>
            Download GPX
          </a>
        </div>
      </div>
    </div>
  );
}
