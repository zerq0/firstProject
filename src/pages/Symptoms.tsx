
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, Heart, Zap, Droplets, Scale, Clock, Phone } from "lucide-react";

const Symptoms = () => {
  const commonSymptoms = [
    {
      icon: Droplets,
      title: "Frequent Urination",
      description: "Needing to urinate more often than usual, especially at night",
      severity: "common",
      color: "text-blue-600"
    },
    {
      icon: Droplets,
      title: "Excessive Thirst",
      description: "Feeling unusually thirsty and drinking more fluids than normal",
      severity: "common",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Fatigue",
      description: "Feeling tired, weak, or lacking energy despite adequate rest",
      severity: "common",
      color: "text-yellow-600"
    },
    {
      icon: Scale,
      title: "Unexplained Weight Loss",
      description: "Losing weight without trying, despite eating normally",
      severity: "warning",
      color: "text-orange-600"
    },
    {
      icon: Eye,
      title: "Blurred Vision",
      description: "Difficulty seeing clearly or experiencing vision changes",
      severity: "warning",
      color: "text-purple-600"
    },
    {
      icon: Heart,
      title: "Slow Healing Wounds",
      description: "Cuts, bruises, or infections that heal slowly or poorly",
      severity: "warning",
      color: "text-red-600"
    }
  ];

  const emergencySymptoms = [
    {
      title: "Diabetic Ketoacidosis (DKA)",
      symptoms: ["Nausea and vomiting", "Abdominal pain", "Fruity breath odor", "Rapid breathing", "Confusion"],
      action: "Seek immediate medical attention"
    },
    {
      title: "Severe Hypoglycemia",
      symptoms: ["Confusion or unconsciousness", "Seizures", "Unable to eat or drink", "Severe shaking"],
      action: "Call emergency services immediately"
    },
    {
      title: "Hyperosmolar Syndrome",
      symptoms: ["Extreme dehydration", "High fever", "Hallucinations", "Weakness on one side"],
      action: "Emergency medical care required"
    }
  ];

  const managementTips = [
    "Monitor blood sugar levels regularly",
    "Take medications as prescribed by your doctor",
    "Maintain a healthy diet with balanced carbohydrates",
    "Exercise regularly with your doctor's approval",
    "Stay hydrated and maintain good hygiene",
    "Keep regular medical appointments",
    "Learn to recognize your personal warning signs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-orange-900 mb-4">Diabetes Symptoms Guide</h1>
          <p className="text-lg text-orange-700">
            Learn to recognize and understand diabetes-related symptoms and warning signs
          </p>
        </div>

        {/* Emergency Warning */}
        <Card className="border-red-300 bg-red-50 mb-8">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Symptoms
            </CardTitle>
            <CardDescription className="text-red-700">
              If you experience any of these symptoms, seek immediate medical attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {emergencySymptoms.map((emergency, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-2">{emergency.title}</h3>
                  <ul className="text-sm text-red-700 mb-3 space-y-1">
                    {emergency.symptoms.map((symptom, idx) => (
                      <li key={idx}>• {symptom}</li>
                    ))}
                  </ul>
                  <div className="text-xs font-semibold text-red-800 bg-red-100 p-2 rounded">
                    {emergency.action}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Symptoms */}
        <Card className="border-orange-200 mb-8">
          <CardHeader>
            <CardTitle className="text-orange-900">Common Diabetes Symptoms</CardTitle>
            <CardDescription>
              Early warning signs that may indicate diabetes or blood sugar issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commonSymptoms.map((symptom, index) => {
                const Icon = symptom.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className={`h-8 w-8 ${symptom.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{symptom.title}</h3>
                          <Badge 
                           
                            className="text-xs"
                          >
                            {symptom.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{symptom.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Management Tips */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Symptom Management</CardTitle>
              <CardDescription>
                Steps to help manage and prevent diabetes symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {managementTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-green-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* When to See a Doctor */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">When to Seek Medical Help</CardTitle>
              <CardDescription>
                Important guidelines for medical consultation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">See your doctor if you experience:</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Any combination of common symptoms</li>
                  <li>• Symptoms that persist or worsen</li>
                  <li>• Blood sugar consistently outside target range</li>
                  <li>• New or unusual symptoms</li>
                  <li>• Difficulty managing your condition</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Regular check-ups include:</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• HbA1c tests every 3-6 months</li>
                  <li>• Annual eye examinations</li>
                  <li>• Foot care assessments</li>
                  <li>• Blood pressure monitoring</li>
                  <li>• Kidney function tests</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>Remember:</strong> This information is for educational purposes only. 
                  Always consult with healthcare professionals for proper diagnosis and treatment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Symptoms;
