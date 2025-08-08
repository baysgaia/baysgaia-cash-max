import { Request, Response, NextFunction } from 'express';
import { SubsidyService } from '../services/subsidyService';
import { logger } from '../utils/logger';

const subsidyService = new SubsidyService();

export const getAllSubsidies = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const subsidies = await subsidyService.getAllSubsidies();
    res.json({
      success: true,
      data: subsidies,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get subsidies', error);
    next(error);
  }
};

export const getSubsidyDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Subsidy ID is required'
      });
    }
    
    const subsidy = await subsidyService.getSubsidyById(id);
    
    if (!subsidy) {
      return res.status(404).json({
        success: false,
        error: 'Subsidy not found'
      });
    }
    
    return res.json({
      success: true,
      data: subsidy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get subsidy details', error);
    return next(error);
  }
};

export const updateSubsidyStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Subsidy ID is required'
      });
    }
    
    const updatedSubsidy = await subsidyService.updateSubsidyStatus(id, status);
    
    return res.json({
      success: true,
      data: updatedSubsidy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to update subsidy status', error);
    return next(error);
  }
};

export const getFundingSimulation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount = 10000000 } = req.query;
    const simulation = await subsidyService.generateFundingSimulation(Number(amount));
    
    res.json({
      success: true,
      data: simulation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to generate funding simulation', error);
    next(error);
  }
};

export const getApplicationChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Subsidy ID is required'
      });
    }
    
    const checklist = await subsidyService.getApplicationChecklist(id);
    
    return res.json({
      success: true,
      data: checklist,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get application checklist', error);
    return next(error);
  }
};