import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bot, Headphones, Shield, Zap, Users, Award } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Welcome to <span className="text-primary">BotForge</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Crafting intelligent AI solutions for modern businesses. Transform your operations with our cutting-edge automation tools and expert services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="font-medium">
                <Zap className="h-5 w-5 mr-2" />
                Explore Products
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="lg" className="font-medium">
                <Headphones className="h-5 w-5 mr-2" />
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose BotForge?</h2>
            <p className="text-lg text-slate-600">Discover the power of next-generation AI automation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-xl border border-slate-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Solutions</h3>
              <p className="text-slate-600">Advanced automation tools designed to streamline your business processes and boost productivity.</p>
            </div>
            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-xl border border-slate-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p className="text-slate-600">Expert support team ready to assist you with any questions or issues at any time.</p>
            </div>
            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-xl border border-slate-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise Security</h3>
              <p className="text-slate-600">Bank-level security measures to protect your data and operations with complete confidence.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-slate-900">10K+</span>
              </div>
              <p className="text-slate-600 font-medium">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-slate-900">50+</span>
              </div>
              <p className="text-slate-600 font-medium">AI Solutions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-slate-900">99.9%</span>
              </div>
              <p className="text-slate-600 font-medium">Uptime</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-slate-900">24/7</span>
              </div>
              <p className="text-slate-600 font-medium">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
