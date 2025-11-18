'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { Shield, Zap, Lock, TrendingUp, Database, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-midnight-300 to-midnight-100 bg-clip-text text-transparent">
            Privacy-Preserving AI Training Data Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-midnight-200">
            Built on Midnight Network with native ZK proofs for complete privacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-midnight-600 hover:bg-midnight-500 rounded-lg text-lg font-semibold transition"
            >
              Browse Marketplace
            </Link>
            <Link
              href="/creator"
              className="px-8 py-4 bg-white text-midnight-900 hover:bg-midnight-100 rounded-lg text-lg font-semibold transition"
            >
              Start Selling Data
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-3 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-12 h-12" />}
            title="Native Privacy"
            description="Built-in ZK proofs on Midnight Network ensure complete privacy for both creators and AI companies"
          />
          <FeatureCard
            icon={<Lock className="w-12 h-12" />}
            title="Shielded Transactions"
            description="All payments and usage tracking happens privately without revealing sensitive details"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12" />}
            title="Automated Payments"
            description="Smart contracts automatically release payments to creators when content is accessed"
          />
          <FeatureCard
            icon={<Database className="w-12 h-12" />}
            title="Verifiable Usage"
            description="Prove compliance without revealing who accessed what or when using zero-knowledge proofs"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12" />}
            title="Real-time Analytics"
            description="Track your earnings and usage stats in real-time while maintaining privacy"
          />
          <FeatureCard
            icon={<Check className="w-12 h-12" />}
            title="Trustless Licensing"
            description="No intermediaries - smart contracts enforce license terms automatically"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">For Creators</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                <span>Upload your content and set per-use pricing</span>
              </li>
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <span>Content is hashed and registered on Midnight blockchain</span>
              </li>
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                <span>AI companies discover and purchase licenses</span>
              </li>
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
                <span>Earn automatically when content is accessed</span>
              </li>
            </ol>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">For AI Companies</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                <span>Browse marketplace and find training data</span>
              </li>
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <span>Purchase license with shielded transaction</span>
              </li>
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                <span>Access content via API with ZK proof generation</span>
              </li>
              <li className="flex items-start">
                <span className="bg-midnight-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
                <span>Maintain privacy while proving compliance</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-midnight-800 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-midnight-200">
            Join the privacy-preserving AI training data revolution
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-8 py-4 bg-midnight-600 hover:bg-midnight-500 text-white rounded-lg text-lg font-semibold transition"
          >
            Explore Marketplace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-midnight-700 py-8 text-center text-midnight-300">
        <p>Built on Midnight Network with ❤️ for privacy</p>
        <p className="mt-2">Powered by Zero-Knowledge Proofs</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition">
      <div className="text-midnight-300 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-midnight-200">{description}</p>
    </div>
  );
}
