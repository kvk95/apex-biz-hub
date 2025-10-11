import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy login function for demonstration; replace with your auth logic
async function fakeLogin({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin@example.com" && password === "password") {
        resolve(true);
      } else {
        reject("Invalid email or password");
      }
    }, 1000);
  });
}

// Array of login images
const loginImages = ["login1.jpg", "login2.jpg", "login3.jpg"];
// Select a random image
const loginImageUrl1 = `/images/${loginImages[Math.floor(Math.random() * loginImages.length)]}`;
const loginImageUrl = `/images/ph1.png`;


function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  // Public folder image path 
  const loginImageAlt = "Login Illustration";

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Inside LoginPage's handleSubmit, replace navigate call with onLoginSuccess:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrorMessage("");
    try {
      await fakeLogin({ email, password });
      setPending(false);
      onLoginSuccess(); // Notify App that login succeeded
      navigate("/"); // Redirect to the main layout after successful login
    } catch (error) {
      setErrorMessage(typeof error === "string" ? error : "Login failed");
      setPending(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-3 glass-holder">
      <div className="hidden bg-muted lg:block relative"> 
      </div>
      <div className="flex items-center justify-center py-12 " style={{paddingTop:"3px"}}>
        <div className="mx-auto grid w-[350px] gap-6 glass-card">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {/* Replace Icons.logo with your own logo or text here if needed */}
              <h1 className="text-3xl font-bold font-headline">NyaBuy</h1>
            </div>
            <p className="text-balance ">
              Enter your email below to login to your account
            </p>
          </div>
          {/* Pass down onLoginSuccess prop to LoginForm */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="/auth/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            {errorMessage && (
              <div
                className="flex items-end space-x-1 text-destructive text-sm"
                aria-live="polite"
                aria-atomic="true"
              >
                <p>{errorMessage}</p>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative"> 
      </div>
    </div>
  );
}

export default LoginPage;
