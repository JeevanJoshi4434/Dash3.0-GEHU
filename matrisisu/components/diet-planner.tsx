"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

type FormData = {
  weight: string
  height: string
  hemoglobin: string
  bloodPressure: string
  pregnancyWeeks: string
  complications: string
  dietPreference: string
  foodAllergies: string
  incomeLevel: string
  foodAvailability: string
  activityLevel: string
}

const initialFormData: FormData = {
  weight: "",
  height: "",
  hemoglobin: "",
  bloodPressure: "",
  pregnancyWeeks: "",
  complications: "",
  dietPreference: "",
  foodAllergies: "",
  incomeLevel: "",
  foodAvailability: "",
  activityLevel: "",
}

export default function DietPlanGenerator() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dietPlan, setDietPlan] = useState<string | null>(null)

  const steps = [
    { name: "Personal", fields: ["weight", "height"] },
    { name: "Health", fields: ["hemoglobin", "bloodPressure", "pregnancyWeeks", "complications"] },
    { name: "Diet", fields: ["dietPreference", "foodAllergies"] },
    { name: "Lifestyle", fields: ["incomeLevel", "foodAvailability", "activityLevel"] },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateCurrentStep = () => {
    const currentFields = steps[currentStep].fields
    return currentFields.every((field) => formData[field as keyof FormData]?.trim())
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      setError(null)
    } else {
      setError("Please fill in all fields before proceeding.")
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    setError(null)
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      setError("Please fill in all fields before submitting.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:4001/api/diet-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate diet plan")
      }

      const data = await response.json()
      setDietPlan(data.dietPlan)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg ">
          <CardHeader className=" rounded-t-lg">
            <CardTitle className="text-2xl text-center">
              Maternal Diet Plan Generator
            </CardTitle>
            <CardDescription className="text-center">
              Fill in your details to receive a personalized diet plan for your pregnancy
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {!dietPlan ? (
              <>
                <div className="mb-6">
                  <Progress value={getProgressPercentage()} className="h-2 bg-gray-100" />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    {steps.map((step, index) => (
                      <span
                        key={step.name}
                        className={`${index <= currentStep ? " font-medium" : ""}`}
                      >
                        {step.name}
                      </span>
                    ))}
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg) *</Label>
                          <Input
                            id="weight"
                            name="weight"
                            type="number"
                            placeholder="e.g., 65"
                            value={formData.weight}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm) *</Label>
                          <Input
                            id="height"
                            name="height"
                            type="number"
                            placeholder="e.g., 165"
                            value={formData.height}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hemoglobin">Hemoglobin (g/dL) *</Label>
                          <Input
                            id="hemoglobin"
                            name="hemoglobin"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 12.5"
                            value={formData.hemoglobin}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bloodPressure">Blood Pressure *</Label>
                          <Input
                            id="bloodPressure"
                            name="bloodPressure"
                            placeholder="e.g., 120/80"
                            value={formData.bloodPressure}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pregnancyWeeks">Pregnancy Weeks *</Label>
                        <Input
                          id="pregnancyWeeks"
                          name="pregnancyWeeks"
                          type="number"
                          placeholder="e.g., 24"
                          value={formData.pregnancyWeeks}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complications">Complications (if any)</Label>
                        <Textarea
                          id="complications"
                          name="complications"
                          placeholder="e.g., Gestational diabetes, hypertension, etc."
                          value={formData.complications}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dietPreference">Diet Preference *</Label>
                        <Select
                          value={formData.dietPreference}
                          onValueChange={(value) => handleSelectChange("dietPreference", value)}
                        >
                          <SelectTrigger id="dietPreference">
                            <SelectValue placeholder="Select your diet preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                            <SelectItem value="pescatarian">Pescatarian</SelectItem>
                            <SelectItem value="lacto-vegetarian">Lacto-Vegetarian</SelectItem>
                            <SelectItem value="ovo-vegetarian">Ovo-Vegetarian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="foodAllergies">Food Allergies (if any)</Label>
                        <Textarea
                          id="foodAllergies"
                          name="foodAllergies"
                          placeholder="e.g., Nuts, dairy, shellfish, etc."
                          value={formData.foodAllergies}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="incomeLevel">Income Level *</Label>
                        <Select
                          value={formData.incomeLevel}
                          onValueChange={(value) => handleSelectChange("incomeLevel", value)}
                        >
                          <SelectTrigger id="incomeLevel">
                            <SelectValue placeholder="Select your income level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="foodAvailability">Food Availability *</Label>
                        <Select
                          value={formData.foodAvailability}
                          onValueChange={(value) => handleSelectChange("foodAvailability", value)}
                        >
                          <SelectTrigger id="foodAvailability">
                            <SelectValue placeholder="Select food availability in your area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="limited">Limited</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="abundant">Abundant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityLevel">Activity Level *</Label>
                        <Select
                          value={formData.activityLevel}
                          onValueChange={(value) => handleSelectChange("activityLevel", value)}
                        >
                          <SelectTrigger id="activityLevel">
                            <SelectValue placeholder="Select your activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary</SelectItem>
                            <SelectItem value="lightly active">Lightly Active</SelectItem>
                            <SelectItem value="moderately active">Moderately Active</SelectItem>
                            <SelectItem value="very active">Very Active</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-4">
                <div className="rounded-lg p-6 mb-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Your Personalized Diet Plan
                  </h3>
                  <div className="prose max-w-none">
                    <ReactMarkdown>{dietPlan}</ReactMarkdown>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDietPlan(null)
                      setFormData(initialFormData)
                      setCurrentStep(0)
                    }}
                  >
                    Create Another Diet Plan
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          {!dietPlan && (
            <CardFooter className="flex justify-between border-t p-6 bg-gray-50 rounded-b-lg">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={!validateCurrentStep()}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading || !validateCurrentStep()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      Generate Diet Plan <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

