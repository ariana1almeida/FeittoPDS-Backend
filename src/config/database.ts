import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("🗄️ Prisma conectado com MongoDB com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar com MongoDB via Prisma:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log("🗄️ Prisma desconectado do MongoDB com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao desconectar Prisma:", error);
  }
};

// Função para graceful shutdown - apenas para SIGINT e SIGTERM
process.on("SIGINT", async () => {
  console.log("🔄 Recebido SIGINT. Desconectando do banco de dados...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🔄 Recebido SIGTERM. Desconectando do banco de dados...");
  await disconnectDatabase();
  process.exit(0);
});
