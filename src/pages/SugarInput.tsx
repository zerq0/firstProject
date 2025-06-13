import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BloodSugarReading {
  id: string;
  glucose: number;
  time: string;
  type: string;
  notes: string;
}

const SugarInput = () => {
  const [readings, setReadings] = useState<BloodSugarReading[]>([]);
  const [glucose, setGlucose] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const addReading = () => {
    const glucoseNum = parseFloat(glucose);
    
    if (isNaN(glucoseNum) || glucoseNum <= 0 || !type) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid glucose level and select a reading type.",
        variant: "destructive",
      });
      return;
    }

    const newReading: BloodSugarReading = {
      id: Date.now().toString(),
      glucose: glucoseNum,
      time: new Date().toLocaleString(),
      type,
      notes: notes || ""
    };

    setReadings([newReading, ...readings]);
    setGlucose("");
    setType("");
    setNotes("");
    
    toast({
      title: "Reading Added",
      description: `Blood sugar level of ${glucoseNum} mg/dL recorded successfully.`,
    });
  };

  const deleteReading = (id: string) => {
    setReadings(readings.filter(reading => reading.id !== id));
    toast({
      title: "Reading Deleted",
      description: "Blood sugar reading has been removed.",
    });
  };

  const getGlucoseStatus = (glucose: number, type: string) => {
    if (type === "fasting") {
      if (glucose < 70) return { status: "Low", color: "text-red-600 bg-red-50" };
      if (glucose >= 70 && glucose <= 100) return { status: "Normal", color: "text-green-600 bg-green-50" };
      if (glucose > 100 && glucose <= 125) return { status: "Prediabetic", color: "text-yellow-600 bg-yellow-50" };
      return { status: "High", color: "text-red-600 bg-red-50" };
    } else {
      if (glucose < 70) return { status: "Low", color: "text-red-600 bg-red-50" };
      if (glucose >= 70 && glucose <= 140) return { status: "Normal", color: "text-green-600 bg-green-50" };
      if (glucose > 140 && glucose <= 180) return { status: "Elevated", color: "text-yellow-600 bg-yellow-50" };
      return { status: "High", color: "text-red-600 bg-red-50" };
    }
  };

  const averageGlucose = readings.length > 0 
    ? Math.round((readings.reduce((sum, reading) => sum + reading.glucose, 0) / readings.length) * 10) / 10 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Blood Sugar Tracking</h1>
          <p className="text-lg text-blue-700">
            Monitor and log your blood glucose levels throughout the day
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Add New Reading</CardTitle>
              <CardDescription>
                Record your current blood glucose level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
                <Input
                  id="glucose"
                  type="number"
                  placeholder="Enter glucose level"
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Reading Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Select reading type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fasting">Fasting</SelectItem>
                    <SelectItem value="before-meal">Before Meal</SelectItem>
                    <SelectItem value="after-meal">After Meal</SelectItem>
                    <SelectItem value="bedtime">Bedtime</SelectItem>
                    <SelectItem value="random">Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>

              <Button 
                onClick={addReading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reading
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Your Statistics</CardTitle>
              <CardDescription>
                Overview of your recent readings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-900 mb-2">
                  {averageGlucose} mg/dL
                </div>
                <div className="text-green-700">Average Glucose</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  {readings.length}
                </div>
                <div className="text-blue-700">Total Readings</div>
              </div>

              {readings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Target Ranges</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fasting:</span>
                      <span className="text-green-600">70-100 mg/dL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>After Meal:</span>
                      <span className="text-green-600">70-140 mg/dL</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Readings */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Recent Readings</CardTitle>
              <CardDescription>
                Your latest blood glucose measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {readings.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No readings recorded yet. Add your first reading to get started!
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {readings.slice(0, 10).map((reading) => {
                    const status = getGlucoseStatus(reading.glucose, reading.type);
                    return (
                      <div key={reading.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg font-bold">{reading.glucose} mg/dL</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {reading.type.charAt(0).toUpperCase() + reading.type.slice(1).replace('-', ' ')}
                            </div>
                            <div className="text-xs text-gray-500">{reading.time}</div>
                            {reading.notes && (
                              <div className="text-xs text-gray-600 mt-1">{reading.notes}</div>
                            )}
                          </div>
                          <Button
                            onClick={() => deleteReading(reading.id)}
                           
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SugarInput;
