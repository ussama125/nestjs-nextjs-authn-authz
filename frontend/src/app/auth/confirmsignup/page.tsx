"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import useApiRequest from "@/hooks/useApiRequest";
import { Card } from "@/components/Card";
import Link from "next/link";
import { useEffect } from "react";

export default function SignupPage() {
  const router = useRouter();
  const { notify } = useNotification();
  const { loading, error, makeRequest } = useApiRequest();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  useEffect(() => {
    confirmSignup();
  }, []);

  const confirmSignup = async () => {
    try {
      await makeRequest(`/auth/confirm-signup/${id}`, "POST", {
        verificationToken: token,
      });
      notify("Account verified. You can now sign in.", "success");
      router.push("/auth/login");
    } catch (error) {
      // console.error(error);
      notify(error, "error");
    }
  };

  return (
    <Card>
      {!loading && !error && (
        <div>
          <h2>Congratulations</h2>
          <h5 className="mt-1">
            Your account has been verified. Now you can{" "}
            <Link href={"/auth/login"} className="text-url">
              Sign In
            </Link>
          </h5>
        </div>
      )}
    </Card>
  );
}
