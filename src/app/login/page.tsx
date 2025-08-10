"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlobalThemeToggle } from "@/components/global-theme-toggle"
import { cn } from "@/lib/utils"
import { SocialLogin } from "@/components/social-login"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check user type and redirect accordingly
      const savedOwner = localStorage.getItem('owner')
      const savedStaff = localStorage.getItem('staffMember')
      const savedProvider = localStorage.getItem('softwareProvider')
   
      if (savedProvider) {
        router.push('/provider')
      } else if (savedOwner) {
        router.push('/owner')
      } else if (savedStaff) {
        router.push('/staff-checkin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const success = await login(email, password)
      
      if (success) {
        // Check user type and redirect accordingly
        const savedOwner = localStorage.getItem('owner')
        const savedStaff = localStorage.getItem('staffMember')
        const savedProvider = localStorage.getItem('softwareProvider')
        
        if (savedProvider) {
          toast.success("Welcome Software Provider! Redirecting to provider portal...")
          router.push('/provider')
        } else if (savedOwner) {
          toast.success("Welcome Owner! Redirecting to owner dashboard...")
          router.push('/owner')
        } else if (savedStaff) {
          toast.success("Welcome! Redirecting to staff check-in...")
          router.push('/staff-checkin')
        } else {
          toast.success("Welcome! Redirecting to dashboard...")
          router.push('/dashboard')
        }
      } else {
        toast.error("Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        {mounted && <GlobalThemeToggle />}
      </div>
      
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Acme Inc account
                  </p>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Login"}
                </Button>
                
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                
                <SocialLogin 
                  providers={["apple", "google", "meta"]}
                  onProviderClick={(provider) => console.log(`${provider} login clicked`)}
                  size="md"
                  variant="grid"
                />
                
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
                
                {/* Demo Credentials */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="text-sm font-medium mb-3 text-center">Demo Credentials</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium">Software Provider:</span>
                      <span className="text-muted-foreground">provider@possoftware.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Owner:</span>
                      <span className="text-muted-foreground">owner@company.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Staff:</span>
                      <span className="text-muted-foreground">john.smith@company.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Admin:</span>
                      <span className="text-muted-foreground">admin@company.com</span>
                    </div>
                    <div className="text-center text-muted-foreground mt-2">
                      Password: any password (demo mode)
                    </div>
                  </div>
                </div>
              </div>
            </form>
            
            <div className="bg-muted relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-400/10 dark:to-purple-400/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white dark:text-gray-200">
                  <div className="text-4xl font-bold mb-4">Dashboard POS</div>
                  <div className="text-lg opacity-80">Manage your business with ease</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
} 