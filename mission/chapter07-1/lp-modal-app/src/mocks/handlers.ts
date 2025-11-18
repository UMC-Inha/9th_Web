export async function mockLPApi() {
  return new Response(
    JSON.stringify({ message: "LP Created Successfully!" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
