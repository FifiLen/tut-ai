import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

import { clerkPublicRouteMatchers } from "@/lib/clerk"

const isPublicRoute = createRouteMatcher(clerkPublicRouteMatchers)

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
}
