

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Calculator, TrendingUp, AlertTriangle, Activity, Shield, Users } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Calculator,
      title: "BU Calculator",
      description: "Calculate bread units and insulin dosage for better glucose management.",
      link: "/bu-calculator",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Sugar Tracking",
      description: "Log and monitor your blood sugar levels throughout the day.",
      link: "/sugar-input",
      color: "text-blue-600"
    },
    {
      icon: AlertTriangle,
      title: "Symptoms Checker",
      description: "Identify and understand diabetes-related symptoms and warning signs.",
      link: "/symptoms",
      color: "text-orange-600"
    }
  ];

  const stats = [
    { icon: Users, value: "463M", label: "People with diabetes worldwide" },
    { icon: Activity, value: "1 in 10", label: "Adults have diabetes" },
    { icon: Shield, value: "90%", label: "Can be prevented with lifestyle changes" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
     
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Heart className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            Welcome to DiabetesCare
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive diabetes management platform. Track your blood sugar, 
            calculate insulin dosages, monitor symptoms, and take control of your health journey.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-900 mb-2">{stat.value}</div>
                  <div className="text-blue-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-50 p-3 rounded-full">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-blue-900">{feature.title}</CardTitle>
                  <CardDescription className="text-blue-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to={feature.link}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Section */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 text-2xl">Living Well with Diabetes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-3">Daily Management Tips</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Monitor blood sugar levels regularly</li>
                  <li>• Take medications as prescribed</li>
                  <li>• Maintain a healthy, balanced diet</li>
                  <li>• Stay physically active</li>
                  <li>• Manage stress effectively</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-3">Warning Signs to Watch</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Frequent urination and excessive thirst</li>
                  <li>• Unexplained weight loss</li>
                  <li>• Fatigue and weakness</li>
                  <li>• Blurred vision</li>
                  <li>• Slow-healing wounds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;