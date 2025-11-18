import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Icons replaced with Font Awesome
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Dummy login function for demonstration; replace with your auth logic
async function fakeLogin({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "admin@example.com" && password === "password") {

        //TEMP FIX LOGIN
        const tempAccessToken = crypto.randomUUID();
        const LS_KEY_ACCESS_TOKEN = "-nb-db-at-";
        localStorage.setItem(LS_KEY_ACCESS_TOKEN, tempAccessToken);
        //TEMP FIX LOGIN


        resolve(true);
      } else {
        reject("Invalid email or password");
      }
    }, 1000);
  });
}

// Array of login images
const loginImages = ["ph1.png"];
const loginImageUrl1 = `/assets/images/login/${loginImages[Math.floor(Math.random() * loginImages.length)]
  }`;

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  // Public folder image path
  const loginImageAlt = "Login Illustration";
  const [backgroundImage, setBackgroundImage] = useState("");

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Dynamically change the background image on page load
    const images = [
      "/assets/images/login/bg1.jpg",
      "/assets/images/login/bg2.jpg",
      "/assets/images/login/bg3.jpg",
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBackgroundImage(randomImage);
  }, []);

  // Inside LoginPage's handleSubmit, replace navigate call with onLoginSuccess:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrorMessage("");
    try {
      await fakeLogin({ email, password });
      setPending(false);
      onLoginSuccess(); // Notify App that login succeeded
      navigate("/dashboard/admindb"); // Redirect to the main layout after successful login
    } catch (error) {
      setErrorMessage(typeof error === "string" ? error : "Login failed");
      setPending(false);
    }
  };

  return (
    <div
      className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 glass-holder font-ubuntu "
      style={{
        background: `url(${backgroundImage}) center/cover no-repeat`,
      }}
    >
      <div className="hidden bg-muted lg:block relative"></div>
      <div
        className="flex items-center justify-center py-12 "
        style={{ paddingTop: "3px" }}
      >
        <div className="mx-auto grid w-[350px] gap-6 glass-card shadow-lg">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {/* Replace Icons.logo with your own logo or text here if needed */}
              <h1 className="text-3xl font-bold font-headline">NyaBuy</h1>
            </div>
            <p className="text-balance text-gray-500">
              Enter your email below to login to your account
            </p>
          </div>
          {/* Pass down onLoginSuccess prop to LoginForm */}
          <form onSubmit={handleSubmit} className="grid gap-4 text-gray-500">
            <div className="grid gap-2 text-left">
              <Label htmlFor="email" className="">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-gray-500 ">
                  Password
                </Label>
                <a
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
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
            <Button type="submit" className="w-full theme-color-bg" disabled={pending}>
              {pending && (
                <i
                  className="fa fa-spinner fa-spin mr-2 h-4 w-4"
                  aria-hidden="true"
                />
              )}
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
    </div>
  );
}

export default LoginPage;
