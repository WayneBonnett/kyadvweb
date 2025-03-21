import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-800/70" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-bg.jpg')",
            }}
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Kentucky ADV Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover motorcycle adventures and GPX routes in Kentucky
          </p>
          <div className="space-x-4">
            <Link href="/routes" className="btn-primary">
              Explore Routes
            </Link>
            <Link href="/blog" className="btn-secondary">
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="adventure-card text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-green-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">GPX Routes</h3>
              <p className="text-gray-600">
                Download detailed GPX routes for your next adventure
              </p>
            </div>
            <div className="adventure-card text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-green-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Adventure Stories</h3>
              <p className="text-gray-600">
                Read about real adventures and experiences
              </p>
            </div>
            <div className="adventure-card text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-green-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Knowledge</h3>
              <p className="text-gray-600">
                Discover hidden gems and local favorites
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our collection of GPX routes and start planning your next
            ride
          </p>
          <Link href="/routes" className="btn-primary">
            Browse Routes
          </Link>
        </div>
      </section>
    </main>
  );
}
