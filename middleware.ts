import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/"],
});

export const config = {
	runtime: "experimental-edge",
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
