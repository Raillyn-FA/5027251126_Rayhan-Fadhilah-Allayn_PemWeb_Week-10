import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const MAX_INT = 2_147_483_647; // batas tipe Int (32-bit) di PostgreSQL

function parseId(value: unknown): number | null {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > MAX_INT) {
    return null;
  }
  return n;
}

function validateProductInput(
  body: unknown
): { name: string; price: number } | { error: string } {
  const { name, price } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "") {
    return { error: "name wajib diisi (string)" };
  }
  if (
    typeof price !== "number" ||
    !Number.isInteger(price) ||
    price < 0 ||
    price > MAX_INT
  ) {
    return { error: "price wajib diisi (bilangan bulat >= 0)" };
  }
  return { name: name.trim(), price };
}

function isRecordNotFound(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "P2025"
  );
}

export async function getProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  res.status(200).json(products);
}

export async function getProductById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "id harus berupa bilangan bulat positif" });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    res.status(404).json({ message: "Produk tidak ditemukan" });
    return;
  }

  res.status(200).json(product);
}

export async function createProduct(req: Request, res: Response) {
  const input = validateProductInput(req.body);
  if ("error" in input) {
    res.status(400).json({ message: input.error });
    return;
  }

  const product = await prisma.product.create({ data: input });
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const rawId = req.params.id ?? (req.body as { id?: unknown } | undefined)?.id;
  const id = parseId(rawId);
  if (id === null) {
    res.status(400).json({ message: "id wajib diisi (bilangan bulat positif)" });
    return;
  }

  const input = validateProductInput(req.body);
  if ("error" in input) {
    res.status(400).json({ message: input.error });
    return;
  }

  try {
    const product = await prisma.product.update({ where: { id }, data: input });
    res.status(200).json(product);
  } catch (err) {
    if (isRecordNotFound(err)) {
      res.status(404).json({ message: "Produk tidak ditemukan" });
      return;
    }
    throw err;
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "id harus berupa bilangan bulat positif" });
    return;
  }

  try {
    const product = await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: "Produk berhasil dihapus", product });
  } catch (err) {
    if (isRecordNotFound(err)) {
      res.status(404).json({ message: "Produk tidak ditemukan" });
      return;
    }
    throw err;
  }
}
