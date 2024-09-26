export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

console.log("Middleware applied on /dashboard");
