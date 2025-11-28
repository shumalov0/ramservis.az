import { cars } from '@/lib/data';
import Link from 'next/link';

export default function URLsPage() {
  const baseUrl = 'https://www.ramservis.az';

  const staticRoutes = [
    { path: '', name: 'Ana səhifə', priority: 'Yüksək' },
    { path: '/about', name: 'Haqqımızda', priority: 'Orta' },
    { path: '/cars', name: 'Avtomobillər', priority: 'Yüksək' },
    { path: '/services', name: 'Xidmətlər', priority: 'Orta' },
    { path: '/booking', name: 'Rezervasiya', priority: 'Orta' },
    { path: '/contact', name: 'Əlaqə', priority: 'Orta' },
  ];

  const carRoutes = cars.map((car) => ({
    path: `/car/${car.id}`,
    name: `${car.brand} ${car.model}`,
    priority: 'Yüksək',
  }));

  const allRoutes = [...staticRoutes, ...carRoutes];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Sayt URL-ləri
          </h1>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Ümumi URL sayı:</strong> {allRoutes.length}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  <strong>Statik səhifələr:</strong> {staticRoutes.length} | 
                  <strong className="ml-2">Avtomobil səhifələri:</strong> {carRoutes.length}
                </p>
              </div>
              <div className="flex gap-2">
                <Link 
                  href="/visitor-stats" 
                  target="_blank"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  📊 Sayğac
                </Link>
                <Link 
                  href="/admin/visitor-settings"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  ⚙️ Parametrlər
                </Link>
              </div>
            </div>
          </div>

          {/* Statik səhifələr */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              📄 Statik Səhifələr
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">№</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Səhifə</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">URL</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Prioritet</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Test</th>
                  </tr>
                </thead>
                <tbody>
                  {staticRoutes.map((route, index) => (
                    <tr key={route.path} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                        {route.name}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-blue-600 dark:text-blue-400">
                        {baseUrl}{route.path}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          route.priority === 'Yüksək' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {route.priority}
                        </span>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <Link 
                          href={route.path || '/'} 
                          target="_blank"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Aç →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Avtomobil səhifələri */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              🚗 Avtomobil Səhifələri
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">№</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Avtomobil</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">URL</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Prioritet</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Test</th>
                  </tr>
                </thead>
                <tbody>
                  {carRoutes.map((route, index) => (
                    <tr key={route.path} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-medium">
                        {route.name}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-blue-600 dark:text-blue-400">
                        {baseUrl}{route.path}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {route.priority}
                        </span>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        <Link 
                          href={route.path} 
                          target="_blank"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Aç →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
