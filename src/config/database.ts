import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://root:example@localhost:27017/feittopds?authSource=admin";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB desconectado com sucesso!");
  } catch (error) {
    console.error("Erro ao desconectar MongoDB:", error);
  }
};

// Event listeners para monitorar a conexão
mongoose.connection.on("connected", () => {
  console.log("Mongoose conectado ao MongoDB");
});

mongoose.connection.on("error", (error) => {
  console.error("Erro na conexão do Mongoose:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose desconectado do MongoDB");
});
