import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Pesa Mkononi</h1>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-primary text-white hover:bg-primary/90" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Expense Tracker V 3.0</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Pesa Mkononi, Manage your own Money</p>
            <p className="text-sm mb-8">Built for Kenyan Students. 🇰🇪</p>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              <span>Start Saving Now</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Pesa Mkononi?</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your financial data stays on your device. We prioritize your privacy and security.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Get personalized recommendations to optimize your spending and save more.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-gray-600">
                  Set savings goals and track your progress with intuitive visualizations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to take control of your finances?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Kenyan students who are saving smarter with Pesa Mkononi.
            </p>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-bold text-lg mb-2">Pesa Mkononi</p>
          <p className="text-sm text-gray-500">Built for Kenyan Students. 🇰🇪</p>
          <p className="text-xs text-gray-400 mt-4">© {new Date().getFullYear()} Pesa Mkononi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
