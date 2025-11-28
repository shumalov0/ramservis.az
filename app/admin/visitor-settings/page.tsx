'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VisitorSettingsPage() {
  const [fakeCount, setFakeCount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Düzgün password (istəsən dəyişə bilərsən)
  const CORRECT_PASSWORD = 'ramservis2024';

  useEffect(() => {
    // Əvvəl daxil olubmu yoxla
    const savedAuth = localStorage.getItem('visitor_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('visitor_admin_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('❌ Yanlış şifrə!');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('visitor_admin_auth');
  };

  // Əgər daxil olmayıbsa, password səhifəsini göstər
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Daxil olmaq üçün şifrəni daxil edin
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifrə
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrəni daxil edin"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  autoFocus
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Daxil Ol
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                ← Ana səhifəyə qayıt
              </Link>
            </div>

            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                💡 Default şifrə: <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">ramservis2024</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/visitor-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fake_count: parseInt(fakeCount) }),
      });

      if (response.ok) {
        setMessage('✅ Rəqəm uğurla yeniləndi!');
        setFakeCount('');
      } else {
        setMessage('❌ Xəta baş verdi!');
      }
    } catch (error) {
      setMessage('❌ Xəta baş verdi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/admin/urls" 
            className="text-blue-600 hover:underline"
          >
            ← URL-lərə qayıt
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2"
          >
            🚪 Çıxış
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Ziyarətçi Sayğacı Parametrləri
          </h1>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  📊 Sayğac Səhifəsi
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Ziyarətçi sayğacını görmək üçün
                </p>
              </div>
              <a 
                href="/visitor-stats" 
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Aç →
              </a>
            </div>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ℹ️ Necə işləyir?
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Heç bir rəqəm əlavə etməsən: Hər gün avtomatik 15-50 arası fake rəqəm göstərir</li>
              <li>• Rəqəm əlavə etsən: Sənin yazdığın rəqəmi göstərir</li>
              <li>• Supabase-ə qoşulmalısan ki, rəqəm saxlansın</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fake Ziyarətçi Sayı
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={fakeCount}
                onChange={(e) => setFakeCount(e.target.value)}
                placeholder="Məsələn: 42"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Yenilənir...' : 'Rəqəmi Yenilə'}
            </button>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('✅') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                {message}
              </div>
            )}
          </form>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🔧 Supabase Quraşdırma
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>1. Supabase-də <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">visitor_settings</code> cədvəli yarat:</p>
              <pre className="bg-blue-100 dark:bg-blue-800 p-3 rounded text-xs overflow-x-auto">
{`CREATE TABLE visitor_settings (
  id INT PRIMARY KEY DEFAULT 1,
  fake_count INT,
  use_real BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);`}
              </pre>
              <p>2. <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code> faylına əlavə et:</p>
              <pre className="bg-blue-100 dark:bg-blue-800 p-3 rounded text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key`}
              </pre>
              <p>3. <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">app/api/visitor-count/route.ts</code> faylında comment-ləri sil</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
