import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  getServicesByClient,
  getServicesByCategory,
  updateService,
  updateServiceStatus,
  deleteService,
} from "../controllers/service.controller";

const router = Router();

// Criar um novo serviço
router.post("/", createService);

// Buscar todos os serviços
router.get("/", getAllServices);

// Buscar serviço por ID
router.get("/:id", getServiceById);

// Buscar serviços por cliente
router.get("/client/:clientId", getServicesByClient);

// Buscar serviços por categoria
router.get("/category/:categoria", getServicesByCategory);

// Atualizar um serviço
router.put("/:id", updateService);

// Atualizar status de um serviço
router.patch("/:id/status", updateServiceStatus);

// Deletar um serviço
router.delete("/:id", deleteService);

export default router;
