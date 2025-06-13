import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Calculator, Info } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const BUCalculator = () => {
  const [carbs, setCarbs] = useState("");
  const [ratio, setRatio] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateInsulin = () => {
    const carbsNum = parseFloat(carbs);
    const ratioNum = parseFloat(ratio);

    if (isNaN(carbsNum) || isNaN(ratioNum) || carbsNum <= 0 || ratioNum <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers for both fields.",
        variant: "destructive",
      });
      return;
    }

    const breadUnits = carbsNum / 12; // 1 BU = 12g carbs
    const insulinDose = breadUnits / ratioNum;
    setResult(Math.round(insulinDose * 100) / 100);
    
    toast({
      title: "Calculation Complete",
      description: `Recommended insulin dose: ${Math.round(insulinDose * 100) / 100} units`,
    });
  };

  const clearCalculation = () => {
    setCarbs("");
    setRatio("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Calculator className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-4">BU Calculator</h1>
          <p className="text-lg text-green-700">
            Calculate your insulin dosage based on carbohydrate intake and insulin-to-carb ratio
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calculator */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Insulin Dose Calculator</CardTitle>
              <CardDescription>
                Enter your carbohydrate intake and insulin ratio to calculate your dose
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbohydrates (grams)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="Enter carbs in grams"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratio">Insulin-to-Carb Ratio (1:X)</Label>
                <Input
                  id="ratio"
                  type="number"
                  placeholder="e.g., 15 for 1:15 ratio"
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={calculateInsulin}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Calculate
                </Button>
                <Button 
                  onClick={clearCalculation}
                  
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Clear
                </Button>
              </div>

              {result !== null && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-900 mb-2">
                        {result} units
                      </div>
                      <div className="text-green-700">Recommended insulin dose</div>
                      <div className="text-sm text-green-600 mt-2">
                        Bread Units: {Math.round((parseFloat(carbs) / 12) * 100) / 100} BU
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Information */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Info className="h-5 w-5 mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">What are Bread Units (BU)?</h3>
                <p className="text-blue-700 text-sm">
                  A bread unit is equivalent to 12 grams of carbohydrates. It's a standardized 
                  way to measure carbohydrate content in food for insulin dosing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Insulin-to-Carb Ratio</h3>
                <p className="text-blue-700 text-sm">
                  This ratio indicates how many grams of carbohydrates one unit of insulin will cover. 
                  For example, a 1:15 ratio means 1 unit of insulin covers 15 grams of carbs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Safety Note</h3>
                <p className="text-blue-700 text-sm">
                  This calculator is for reference only. Always consult with your healthcare provider 
                  before making changes to your insulin dosage. Individual needs may vary.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ Always confirm calculations with your healthcare team
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BUCalculator;
