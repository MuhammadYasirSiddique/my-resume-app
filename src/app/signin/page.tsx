import React from "react";
import SigninForm from "./Form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Signin() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div>
      <SigninForm />
    </div>
  );
}

export default Signin;
