import { Request, Response } from "express";
import { prisma } from "../config/database";
import { ServiceService } from "../services/service.service";
import { Profession, ServiceStatus } from "@prisma/client";

const serviceService = ServiceService.getInstance(prisma);

export const createService = async (req: Request, res: Response) => {
  try {
    const { picture, title, description, category, firebaseUid } = req.body;

    if (!picture || !title || !description || !category || !firebaseUid) {
      return res.status(400).json({ error: "É necessário preencher todos os campos" });
    }

    if (!Object.values(Profession).includes(category)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const newService = await serviceService.createService({
      picture,
      title,
      description,
      category,
      firebaseUid: firebaseUid,
    });

    return res.status(201).json(newService);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllServicesAvailableByProviderId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({error: "ID do provedor é obrigatório"});
        }

        const services = await serviceService.getAllServicesAvailableByProviderId(id);
        return res.json(services);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({error: error.message});
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
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({error: "ID do cliente é obrigatório"});
        }

        const services = await serviceService.getServicesByClientId(id);
        return res.json(services);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({error: error.message});
    }
};

export const getServicesByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Categoria é obrigatória" });
    }

    // Validar se a categoria é válida
    if (!Object.values(Profession).includes(category as Profession)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const services = await serviceService.getServicesByCategory(category as Profession);
    return res.json(services);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { picture, title, description, category } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    // Validar se a categoria é válida (se fornecida)
    if (category && !Object.values(Profession).includes(category)) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    const updatedService = await serviceService.updateService(id, {
      picture,
      title,
      description,
      category,
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
