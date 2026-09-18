import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { requireAdmin } from "@/lib/admin";
import { getItemById } from "@/lib/items";

export const runtime = "nodejs";

async function loadGoogleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
  ).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Could not resolve font: ${family}`);

  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const item = await getItemById(id);
  if (!item || item.images.length === 0) {
    return NextResponse.json({ error: "Piece not found." }, { status: 404 });
  }

  const [interBold, interRegular, logoFile] = await Promise.all([
    loadGoogleFont("Inter", 600),
    loadGoogleFont("Inter", 400),
    readFile(join(process.cwd(), "public", "logo-white.png")),
  ]);
  const logoDataUri = `data:image/png;base64,${logoFile.toString("base64")}`;

  const [primary, ...rest] = item.images;
  const thumbnails = rest.slice(0, 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#1c1712",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary.url}
          alt=""
          width={1080}
          height={1350}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          alt=""
          width={220}
          height={116}
          style={{ position: "absolute", top: 48, left: 48, opacity: 0.92 }}
        />

        {thumbnails.length > 0 && (
          <div style={{ position: "absolute", bottom: 240, right: 48, display: "flex", gap: 14 }}>
            {thumbnails.map((thumb, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={thumb.url}
                alt=""
                width={140}
                height={140}
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 4,
                  border: "3px solid #fbf7ef",
                }}
              />
            ))}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            padding: "48px 56px 56px",
            background:
              "linear-gradient(to top, rgba(28,23,18,0.92) 0%, rgba(28,23,18,0.55) 55%, rgba(28,23,18,0) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: 44,
              color: "#fbf7ef",
              lineHeight: 1.15,
            }}
          >
            {item.name}
          </div>
          {item.size && (
            <div
              style={{
                display: "flex",
                marginTop: 20,
                fontFamily: "Inter",
                fontSize: 28,
                color: "#fbf7ef",
              }}
            >
              Size {item.size}
            </div>
          )}
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontFamily: "Inter",
              fontSize: 28,
              color: "#fbf7ef",
            }}
          >
            Retail ${item.estRetail.toLocaleString()}&nbsp;&nbsp;YXmember $
            {item.price.toLocaleString()}
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: "Inter", data: interBold, weight: 600, style: "normal" },
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
