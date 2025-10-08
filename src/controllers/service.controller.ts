import { Request, Response } from "express";
import { prisma } from "../config/database";
import { ServiceRepository } from "../repositories/service.repository";
import { ServiceService } from "../services/service.service";
import { Profession, ServiceStatus } from "@prisma/client";

const serviceService = new ServiceService(new ServiceRepository(prisma));

export const createService = async (req: Request, res: Response) => {
  try {
    const { foto, titulo, descricao, categoria, clientId } = req.body;

    if (!foto || !titulo || !descricao || !categoria || !clientId) {
      return res.status(400).json({ error: "É necessário preencher todos os campos" });
    }

    // Validar se a categoria é válida
    if (!Object.values(Profession).includes(categoria)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const newService = await serviceService.createService({
      foto,
      titulo,
      descricao,
      categoria,
      clientId,
    });

    return res.status(201).json(newService);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await serviceService.getAllServices();
    return res.json(services);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    const service = await serviceService.getServiceById(id);

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    return res.json(service);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getServicesByClient = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ error: "ID do cliente é obrigatório" });
    }

    const services = await serviceService.getServicesByClient(clientId);
    return res.json(services);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getServicesByCategory = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.params;

    if (!categoria) {
      return res.status(400).json({ error: "Categoria é obrigatória" });
    }

    // Validar se a categoria é válida
    if (!Object.values(Profession).includes(categoria as Profession)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const services = await serviceService.getServicesByCategory(categoria as Profession);
    return res.json(services);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { foto, titulo, descricao, categoria } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    // Validar se a categoria é válida (se fornecida)
    if (categoria && !Object.values(Profession).includes(categoria)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const updatedService = await serviceService.updateService(id, {
      foto,
      titulo,
      descricao,
      categoria,
    });

    return res.json(updatedService);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateServiceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status é obrigatório" });
    }

    if (!Object.values(ServiceStatus).includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const updatedService = await serviceService.updateServiceStatus(id, status);
    return res.json(updatedService);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    await serviceService.deleteService(id);
    return res.status(204).send();
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
