"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Smartphone, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { GrRestroomWomen } from "react-icons/gr"
import { FaUserNurse } from "react-icons/fa"
import { FaUserDoctor } from "react-icons/fa6"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUser } from "@/hooks/useUser"

export type Loggers = "user" | "asha" | "doctor";

interface SignupResponse {
  user: null;
  token: string;
}

export default function SignupForm() {
  const { setUser, isAuthenticated } = useUser();
  const [showPassword, setShowPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [Cpassword, setCPassword] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("")
  const [type, setType] = useState<Loggers>("user");
  const [Lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if(isAuthenticated){
      router.push('/');
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude.toString());
          setLong(longitude.toString());
        },
        // (error) => {
        //   setLocationError("Unable to retrieve location.");
        // }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  function handleType(type: number) {
    if (type == 1) {
      setType("user")
    } else if (type == 2) {
      setType("asha")
    } else if (type == 3) {
      setType("doctor")
    }
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/
    if (!phone) return "Phone number is required"
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number"
    return ""
  }

  const validatePassword = (pass: string) => {
    if (!pass) return "Password is required"
    if (pass.length < 6) return "Password must be at least 6 characters"
    if(pass != Cpassword) return "Password does not match"
    return ""
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const phoneValidation = validatePhone(phoneNumber)
    const passwordValidation = validatePassword(password)

    setPhoneError(phoneValidation)
    setPasswordError(passwordValidation)

    if (!phoneValidation && !passwordValidation && location) {
      setApiError(null);
      try {
        const endpoint = type === 'doctor' ? 'doctor' : 'user';
        const response = await axios.post<SignupResponse>(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
          phone:phoneNumber,
          password,
          location:{
            type: 'Point',
            coordinates: [long, Lat]
          },
          type,
          name
        });

        if (response.status === 201) {
          if(response.data && response.data.user && response.data.token){
            setUser(response.data.user, response.data.token);
          }
          router.push('/');
        } else {
          setApiError("Signup failed. Please try again.");
        }
      } catch (error) {
        setApiError("An error occurred during signup.");
        console.error("API Error:", error);
      }
    }
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <div className="relative flex gap-3 w-full justify-center">
              <button
                onClick={() => handleType(1)}
                className={`flex items-center justify-center h-12 w-12 rounded-full transition-colors duration-300 cursor-pointer ${type === "user" ? "bg-gray-800 text-white" : "bg-white shadow-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  }`}
              >
                <GrRestroomWomen className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleType(2)}
                className={`flex items-center justify-center h-12 w-12 rounded-full transition-colors duration-300 cursor-pointer ${type === "asha" ? "bg-gray-800 text-white" : "bg-white shadow-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  }`}
              >
                <FaUserNurse className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleType(3)}
                className={`flex items-center justify-center h-12 w-12 rounded-full transition-colors duration-300 cursor-pointer ${type === "doctor" ? "bg-gray-800 text-white" : "bg-white shadow-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  }`}
              >
                <FaUserDoctor className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="pl-10 border-gray-300 rounded-xl"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (phoneError) setPhoneError("");
                }}
              />
            </div>
            {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="pl-10 border-gray-300 rounded-xl"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 rounded-xl border-gray-300"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="cpassword">Confirm Password</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cpassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 rounded-xl border-gray-300"
                value={Cpassword}
                onChange={(e) => {
                  setCPassword(e.target.value)
                  if (passwordError) setPasswordError("")
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me for 30 days
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button type="submit" className="w-full border-gray-300 border-[1px] rounded-full">
            Sign up
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {"Already have an account?"}{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

