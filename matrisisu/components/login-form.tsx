"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Smartphone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function LoginForm() {
  const {setUser, isAuthenticated} = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    return "";
  };

  const validatePassword = (pass: string) => {
    if (!pass) return "Password is required";
    if (pass.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const phoneValidation = validatePhone(phoneNumber);
    const passwordValidation = validatePassword(password);

    setPhoneError(phoneValidation);
    setPasswordError(passwordValidation);

    if (!phoneValidation && !passwordValidation) {
      try {
        const response = await axios.post<{user:any, token:any}>(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
          phone: phoneNumber,
          password,
        });

        if (response.status === 200) {
          if(response.data && response.data.user && response.data.token){
            
            setUser(response.data.user, response.data.token);
          }
          console.log("Login Successful", response.data);
          window.location.pathname  = "/";
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          try {
            const doctorResponse = await axios.post<{user:any, token:any}>(`${process.env.NEXT_PUBLIC_API_URL}/doctor/login`, {
              phone: phoneNumber,
              password,
            });

            if (doctorResponse.status === 200) {
              if(doctorResponse.data && doctorResponse.data.user && doctorResponse.data.token){
                
                setUser(doctorResponse.data.user, doctorResponse.data.token);
              }
              console.log("Doctor Login Successful", doctorResponse.data);
              window.location.pathname  = "/";
            }
          } catch (doctorError: any) {
            setApiError("Invalid credentials. Please try again.");
          }
        } else {
          setApiError("Invalid credentials. Please try again.");
        }
      }
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
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
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>

          {apiError && <p className="text-sm text-destructive">{apiError}</p>}

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me for 30 days</Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button type="submit" className="w-full rounded-full">
            Sign in
          </Button>

          <p className="text-center text-sm">
            {"Don't have an account?"} <a href="/signup" className="text-primary hover:underline">Sign up</a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}