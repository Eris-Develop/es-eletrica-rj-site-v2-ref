import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Área de APIs da ES Elétrica RJ pronta para futuras integrações.',
    integrations: ['WhatsApp API', 'E-mail', 'Google OAuth', 'Google Analytics', 'Pagamento', 'IA', 'CRM'],
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ status: 'received', received: body });
}
