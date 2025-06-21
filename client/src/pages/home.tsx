import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bot, Headphones, Shield } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Welcome to <span className="text-primary">BotForge</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Crafting intelligent AI solutions for modern businesses. Transform your operations with our cutting-edge automation tools and expert services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="font-medium">
                Explore Products
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="lg" className="font-medium">
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Solutions</h3>
              <p className="text-slate-600">Advanced automation tools designed to streamline your business processes.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p className="text-slate-600">Expert support team ready to assist you with any questions or issues.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise Security</h3>
              <p className="text-slate-600">Bank-level security measures to protect your data and operations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
