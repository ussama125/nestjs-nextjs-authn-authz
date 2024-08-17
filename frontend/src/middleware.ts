export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/leads", "/feedbacks", "/sources", "/settings"],
};
