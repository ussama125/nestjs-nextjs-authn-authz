"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNotification } from "@/contexts/NotificationContext";
import Link from "next/link";
import useApiRequest from "@/hooks/useApiRequest";
import { Card } from "@/components/Card";
import { Console } from "console";

export default function SignupPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { notify } = useNotification();
  const { loading, error, makeRequest } = useApiRequest();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    try {
      await makeRequest("/auth/signup", "POST", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      notify("Account created. You can now log in.", "success");
      router.push("/auth/login");
    } catch (error) {
      // console.error(error);
      notify(error, "error");
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Card>
      <div>
        <h2>Create a new account</h2>
        <h5 className="mt-1">Enter the following information to sign up</h5>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mt-4">
            <div className="pr-2">
              <label className="label-1">First Name</label>
              <input
                className="w-full h-[40px] text-gray-700 rounded-full input-text px-4 py-2 mt-2"
                type="text"
                name="firstName"
                placeholder="First name"
                required
              />
            </div>
            <div className="pl-2">
              <label className="label-1">Last Name</label>
              <input
                className="w-full h-[40px] text-gray-700 rounded-full input-text px-4 py-2 mt-2"
                type="text"
                name="lastName"
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="label-1">Email</label>
            <input
              className="w-[400px] h-[40px] text-gray-700 rounded-full input-text px-4 py-2 mt-2"
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="mt-2 relative">
            <label className="label-1">Password</label>
            <input
              className="w-[400px] h-[40px] text-gray-700 rounded-full input-text px-4 py-2 mt-2"
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
              title="Password must contain at least one letter, one number and one special character"
            />
            <div
              className="absolute top-[42px] right-[15px] pr-3 flex items-center cursor-pointer text-sm leading-5"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <EyeSlashIcon className="w-5 h-5"></EyeSlashIcon>
              ) : (
                <EyeIcon className="w-5 h-5"></EyeIcon>
              )}
            </div>
          </div>
          <div className="mt-2 relative">
            <label className="label-1">Confirm Password</label>
            <input
              className="w-[400px] h-[40px] text-gray-700 rounded-full input-text px-4 py-2 mt-2"
              type={passwordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              required
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
              title="Password must contain at least one letter, one number and one special character"
            />
            <div
              className="absolute top-[42px] right-[15px] pr-3 flex items-center cursor-pointer text-sm leading-5"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <EyeSlashIcon className="w-5 h-5"></EyeSlashIcon>
              ) : (
                <EyeIcon className="w-5 h-5"></EyeIcon>
              )}
            </div>
          </div>

          <div>
            <button
              className="w-[400px] h-[40px] text-center text-white rounded-full bg-orange mt-6"
              type="submit"
            >
              <h3>Sign up</h3>
            </button>
            <h5 className="text-center mt-4">
              Already a member?{" "}
              <Link href={"/auth/login"} className="text-url">
                Sign In
              </Link>
            </h5>
          </div>
        </form>
      </div>
    </Card>
  );
}
