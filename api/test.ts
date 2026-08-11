export async function GET() {
  return new Response(JSON.stringify({ name: 'psh', age: 88 }))
}
