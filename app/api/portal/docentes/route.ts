import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_BACKEND_URL no está definida." },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const targetUrl = `${backendUrl}/api/portal/docentes?${searchParams.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error proxy docentes:", error);

    return NextResponse.json(
      { message: "Error al conectar con el backend de docentes." },
      { status: 500 }
    );
  }
}