export interface YoutubeVideo {
  id: string;
  titulo: string;
  publicado: string;
}

const decodeEntities = (texto: string) =>
  texto
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/**
 * Últimos videos públicos de un canal, leídos del feed RSS de YouTube
 * (no requiere API key). Se cachea una hora. Si falla, devuelve [].
 */
export async function getUltimosVideos(channelId: string, limite = 6): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .map(([, entry]) => ({
        id: entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "",
        titulo: decodeEntities(entry.match(/<title>(.*?)<\/title>/)?.[1] ?? ""),
        publicado: entry.match(/<published>(.*?)<\/published>/)?.[1] ?? "",
      }))
      .filter((video) => video.id)
      .slice(0, limite);
  } catch (error) {
    console.error("Error obteniendo videos de YouTube:", error);
    return [];
  }
}
