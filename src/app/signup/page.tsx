import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignUpForm from "./Form";

async function Signup() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div>
      <SignUpForm />
    </div>
  );
}

export default Signup;
