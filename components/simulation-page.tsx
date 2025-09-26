"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PredictionChart } from "@/components/prediction-chart"
import { Play, Save, RotateCcw, TrendingUp, AlertTriangle, Clock } from "lucide-react"

interface SimulationParameters {
  rainfall: number
  vibration: number
  slopeAngle: number
  soilMoisture: number
  temperature: number
  blastingActivity: number
}

interface PredictionResult {
  riskProbability: number
  timeToFailure: number // in hours
  confidenceLevel: number
  riskFactors: {
    environmental: number
    geological: number
    operational: number
  }
  recommendations: string[]
}

interface Scenario {
  id: string
  name: string
  parameters: SimulationParameters
  result: PredictionResult
  timestamp: Date
}

export function SimulationPage() {
  const [parameters, setParameters] = useState<SimulationParameters>({
    rainfall: 45,
    vibration: 30,
    slopeAngle: 35,
    soilMoisture: 60,
    temperature: 25,
    blastingActivity: 20,
  })

  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([])
  const [selectedZone, setSelectedZone] = useState("Zone B")
  const [timeHorizon, setTimeHorizon] = useState("24h")

  // Simulate AI prediction calculation
  const runSimulation = async () => {
    setIsRunning(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate risk based on parameters (simplified AI model simulation)
    const environmentalRisk =
      (parameters.rainfall * 0.4 + parameters.soilMoisture * 0.3 + parameters.temperature * 0.3) / 100
    const geologicalRisk = (parameters.slopeAngle * 0.6 + parameters.vibration * 0.4) / 100
    const operationalRisk = parameters.blastingActivity / 100

    const overallRisk = (environmentalRisk * 0.4 + geologicalRisk * 0.4 + operationalRisk * 0.2) * 100

    // Calculate time to failure based on risk level
    const timeToFailure = Math.max(0.5, 48 - (overallRisk / 100) * 46)

    // Generate recommendations based on parameters
    const recommendations = []
    if (parameters.rainfall > 70) recommendations.push("Implement drainage measures")
    if (parameters.vibration > 60) recommendations.push("Reduce blasting intensity")
    if (parameters.slopeAngle > 40) recommendations.push("Consider slope stabilization")
    if (parameters.soilMoisture > 80) recommendations.push("Monitor soil saturation levels")
    if (overallRisk > 75) recommendations.push("Evacuate workers immediately")

    const predictionResult: PredictionResult = {
      riskProbability: Math.min(95, Math.max(5, overallRisk)),
      timeToFailure,
      confidenceLevel: Math.random() * 20 + 75, // 75-95%
      riskFactors: {
        environmental: environmentalRisk * 100,
        geological: geologicalRisk * 100,
        operational: operationalRisk * 100,
      },
      recommendations: recommendations.length > 0 ? recommendations : ["Continue normal monitoring"],
    }

    setResult(predictionResult)
    setIsRunning(false)
  }

  const saveScenario = () => {
    if (!result) return

    const scenario: Scenario = {
      id: Date.now().toString(),
      name: `Scenario ${savedScenarios.length + 1}`,
      parameters: { ...parameters },
      result: { ...result },
      timestamp: new Date(),
    }

    setSavedScenarios((prev) => [scenario, ...prev.slice(0, 9)]) // Keep last 10 scenarios
  }

  const resetParameters = () => {
    setParameters({
      rainfall: 45,
      vibration: 30,
      slopeAngle: 35,
      soilMoisture: 60,
      temperature: 25,
      blastingActivity: 20,
    })
    setResult(null)
  }

  const loadScenario = (scenario: Scenario) => {
    setParameters(scenario.parameters)
    setResult(scenario.result)
  }

  const getRiskLevel = (probability: number) => {
    if (probability >= 80) return { level: "Critical", color: "text-red-500", bg: "bg-red-500" }
    if (probability >= 60) return { level: "High", color: "text-orange-500", bg: "bg-orange-500" }
    if (probability >= 40) return { level: "Medium", color: "text-yellow-500", bg: "bg-yellow-500" }
    return { level: "Low", color: "text-green-500", bg: "bg-green-500" }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prediction & Simulation</h1>
          <p className="text-muted-foreground">AI-powered rockfall risk prediction and what-if analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Zone A">Zone A</SelectItem>
              <SelectItem value="Zone B">Zone B</SelectItem>
              <SelectItem value="Zone C">Zone C</SelectItem>
              <SelectItem value="Zone D">Zone D</SelectItem>
              <SelectItem value="Zone E">Zone E</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6h">6 Hours</SelectItem>
              <SelectItem value="12h">12 Hours</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="48h">48 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameter Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Parameters</CardTitle>
              <CardDescription>Adjust environmental and operational conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rainfall (mm)</label>
                  <div className="mt-2">
                    <Slider
                      value={[parameters.rainfall]}
                      onValueChange={(value) => setParameters((prev) => ({ ...prev, rainfall: value[0] }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span>
                      <span className="font-medium">{parameters.rainfall}mm</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Vibration (Hz)</label>
                  <div className="mt-2">
                    <Slider
                      value={[parameters.vibration]}
                      onValueChange={(value) => setParameters((prev) => ({ ...prev, vibration: value[0] }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span>
                      <span className="font-medium">{parameters.vibration}Hz</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Slope Angle (degrees)</label>
                  <div className="mt-2">
                    <Slider
                      value={[parameters.slopeAngle]}
                      onValueChange={(value) => setParameters((prev) => ({ ...prev, slopeAngle: value[0] }))}
                      max={60}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0°</span>
                      <span className="font-medium">{parameters.slopeAngle}°</span>
                      <span>60°</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Soil Moisture (%)</label>
                  <div className="mt-2">
                    <Slider
                      value={[parameters.soilMoisture]}
                      onValueChange={(value) => setParameters((prev) => ({ ...prev, soilMoisture: value[0] }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span className="font-medium">{parameters.soilMoisture}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Temperature (°C)</label>
                  <div className="mt-2">
                    <Slider
                      value={[parameters.temperature]}
                      onValueChange={(value) => setParameters((prev) => ({ ...prev, temperature: value[0] }))}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0°C</span>
                      <span className="font-medium">{parameters.temperature}°C</span>
                      <span>50°C</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Blasting Activity (%)</label>
                  <div className="mt-2">
                    <Slider
                      value={[parameters.blastingActivity]}
                      onValueChange={(value) => setParameters((prev) => ({ ...prev, blastingActivity: value[0] }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span className="font-medium">{parameters.blastingActivity}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={runSimulation} disabled={isRunning} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? "Running..." : "Run Simulation"}
                </Button>
                <Button onClick={resetParameters} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Scenarios</CardTitle>
              <CardDescription>Previously run simulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => loadScenario(scenario)}
                  >
                    <div>
                      <p className="text-sm font-medium">{scenario.name}</p>
                      <p className="text-xs text-muted-foreground">{scenario.timestamp.toLocaleString()}</p>
                    </div>
                    <Badge
                      variant={
                        scenario.result.riskProbability >= 80
                          ? "destructive"
                          : scenario.result.riskProbability >= 60
                            ? "secondary"
                            : "default"
                      }
                    >
                      {scenario.result.riskProbability.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              {/* Risk Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className={`text-4xl font-bold mb-2 ${getRiskLevel(result.riskProbability).color}`}>
                      {result.riskProbability.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Risk Probability</p>
                    <Badge variant="outline" className="mt-2">
                      {getRiskLevel(result.riskProbability).level}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold mb-2 text-orange-500">{result.timeToFailure.toFixed(1)}h</div>
                    <p className="text-sm text-muted-foreground">Time to Failure</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Estimated</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold mb-2 text-blue-500">{result.confidenceLevel.toFixed(0)}%</div>
                    <p className="text-sm text-muted-foreground">Confidence Level</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs">AI Model</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Factors Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Factor Analysis</CardTitle>
                  <CardDescription>Breakdown of contributing risk factors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Environmental Risk</span>
                        <span className="font-medium">{result.riskFactors.environmental.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${result.riskFactors.environmental}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Geological Risk</span>
                        <span className="font-medium">{result.riskFactors.geological.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${result.riskFactors.geological}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Operational Risk</span>
                        <span className="font-medium">{result.riskFactors.operational.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${result.riskFactors.operational}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>Suggested actions based on simulation results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prediction Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Probability Timeline</CardTitle>
                  <CardDescription>Predicted risk evolution over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <PredictionChart riskProbability={result.riskProbability} timeHorizon={timeHorizon} />
                </CardContent>
              </Card>

              {/* Save Scenario */}
              <div className="flex justify-end">
                <Button onClick={saveScenario}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Scenario
                </Button>
              </div>
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Run AI Simulation</h3>
                <p className="text-muted-foreground">Adjust parameters and click "Run Simulation" to see predictions</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
