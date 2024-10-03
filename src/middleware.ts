export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/auth/reset-password",
    "/auth/reset-password/:path",
  ],
};

console.log("Middleware applied on /dashboard");
