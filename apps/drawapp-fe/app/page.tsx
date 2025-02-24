import React from 'react';
import { 
  Pencil, 
  Share2, 
  Cloud, 
  Shapes, 
  Palette, 
  Users, 
  ArrowRight,
  Github,
  CheckCircle2,
  Globe2,
  Shield,
  Zap
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 z-0" />
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shapes className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Excelidraw</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#solutions" className="text-gray-600 hover:text-gray-900 transition-colors">Solutions</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden md:block text-gray-700 hover:text-indigo-600 transition-colors">
                Sign In
              </button>
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
              <span className="text-sm font-medium text-indigo-600">Now with real-time collaboration</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Transform Your Ideas into
              <span className="text-indigo-600"> Beautiful Diagrams</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              The professional whiteboarding platform that empowers teams to create, collaborate, and communicate with intuitive diagramming tools. Start creating without any barriers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center group">
                Start Drawing Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-colors flex items-center justify-center">
                <Github className="mr-2 h-5 w-5" /> View on GitHub
              </button>
            </div>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                No Credit Card
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Free Forever
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Enterprise Ready
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1589561253898-768105ca91a8?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Excelidraw Interface" 
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Create</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features that help you bring your ideas to life, designed for professionals and teams who value efficiency and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Pencil className="h-8 w-8 text-indigo-600" />}
              title="Intuitive Drawing"
              description="Create precise diagrams with our smart drawing tools and shape recognition"
            />
            <FeatureCard 
              icon={<Share2 className="h-8 w-8 text-indigo-600" />}
              title="Instant Sharing"
              description="Share your work with a single click and collaborate in real-time"
            />
            <FeatureCard 
              icon={<Cloud className="h-8 w-8 text-indigo-600" />}
              title="Cloud Sync"
              description="Access your work from anywhere with automatic cloud synchronization"
            />
            <FeatureCard 
              icon={<Shapes className="h-8 w-8 text-indigo-600" />}
              title="Rich Libraries"
              description="Choose from thousands of pre-made shapes and templates"
            />
            <FeatureCard 
              icon={<Palette className="h-8 w-8 text-indigo-600" />}
              title="Professional Styling"
              description="Customize every aspect to match your brand identity"
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-indigo-600" />}
              title="Team Collaboration"
              description="Work together seamlessly with real-time multiplayer features"
            />
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div id="solutions" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Solutions for Every Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you&apos;re a startup or an enterprise, Excelidraw adapts to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SolutionCard
              icon={<Zap className="h-8 w-8 text-purple-500" />}
              title="Startups"
              description="Quick ideation and rapid prototyping tools to bring your vision to life"
              features={["Unlimited projects", "Basic collaboration", "Export options"]}
            />
            <SolutionCard
              icon={<Globe2 className="h-8 w-8 text-blue-500" />}
              title="Business"
              description="Advanced features for growing teams and complex projects"
              features={["Team workspaces", "Advanced security", "Priority support"]}
              featured={true}
            />
            <SolutionCard
              icon={<Shield className="h-8 w-8 text-green-500" />}
              title="Enterprise"
              description="Custom solutions with enterprise-grade security and control"
              features={["Custom integration", "Dedicated support", "SLA guarantee"]}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto">
            Join thousands of teams who trust Excelidraw for their diagramming and collaboration needs. Start for free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="w-full sm:w-auto bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg font-medium">
              Get Started for Free
            </button>
            <button className="w-full sm:w-auto bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-medium">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Solutions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Enterprise</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shapes className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Excelidraw</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 Excelidraw. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 hover:border-indigo-600 transition-all duration-300 hover:shadow-lg group">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-indigo-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function SolutionCard({ icon, title, description, features, featured = false }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div className={`
      p-8 rounded-xl border transition-all duration-300 hover:shadow-xl
      ${featured ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}
    `}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;