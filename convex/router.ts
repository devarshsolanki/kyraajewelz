import { httpRouter } from "convex/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/reviews",
  method: "POST",
  handler: (async (ctx: any) => {
    const { productId, rating, comment } = await ctx.request.json();
    await ctx.runMutation(api.reviews.createReview, {
      productId: productId as Id<"products">,
      rating,
      comment,
    });
    return new Response(null, { status: 200 });
  }) as any,
});

http.route({
  path: "/reviews/:productId",
  method: "GET",
  handler: (async (ctx: any) => {
    const productId = ctx.pathSegments; // Extract productId from path
    if (!productId) {
      return new Response("Product ID is required", { status: 400 });
    }
    const reviews = await ctx.runQuery(api.reviews.getReviewsForProduct, {
      productId: productId as Id<"products">,
    });
    return new Response(JSON.stringify(reviews), {
      headers: { "Content-Type": "application/json" },
    });
  }) as any,
});

http.route({
  path: "/reviews/:productId/average-rating",
  method: "GET",
  handler: (async (ctx: any) => {
    const productId = ctx.pathSegments; // Extract productId from path
    if (!productId) {
      return new Response("Product ID is required", { status: 400 });
    }
    const { averageRating, reviewCount } = await ctx.runQuery(
      api.reviews.getAverageRating,
      { productId: productId as Id<"products"> }
    );
    return new Response(JSON.stringify({ averageRating, reviewCount }), {
      headers: { "Content-Type": "application/json" },
    });
  }) as any,
});

http.route({
  path: "/reviews/:productId/can-review",
  method: "GET",
  handler: (async (ctx: any) => {
    const productId = ctx.pathSegments; // Extract productId from path
    if (!productId) {
      return new Response("Product ID is required", { status: 400 });
    }
    const canReview = await ctx.runQuery(api.reviews.canUserReviewProduct, {
      productId: productId as Id<"products">,
    });
    return new Response(JSON.stringify(canReview), {
      headers: { "Content-Type": "application/json" },
    });
  }) as any,
});

// EXPORT DEFAULT so http.ts can import it as the default
export default http;

