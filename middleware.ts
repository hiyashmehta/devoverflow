import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	publicRoutes: ["/"],
});

export const config = {
	runtime: "edge",
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
