import type { Request, Response, NextFunction } from "express";

// Penangkap error terakhir. Harus punya 4 parameter agar dikenali Express.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = (err as { status?: number } | null)?.status;
  if (status === 400) {
    res.status(400).json({ message: "Body JSON tidak valid" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
}
