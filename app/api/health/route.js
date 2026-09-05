export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "genvilla-frontend",
      release: process.env.RELEASE_ID || "local",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
