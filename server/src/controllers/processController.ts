import { Request, Response, NextFunction } from 'express';
import { ProcessAutomationService } from '../services/processAutomationService';
import { logger } from '../utils/logger';

const processService = new ProcessAutomationService();

export const getAllProcesses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const processes = await processService.getAllProcesses();
    res.json({
      success: true,
      data: processes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get processes', error);
    next(error);
  }
};

export const getProcessDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const process = await processService.getProcessById(id);
    
    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Process not found'
      });
    }
    
    res.json({
      success: true,
      data: process,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get process details', error);
    next(error);
  }
};

export const getAutomationOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await processService.getAutomationOpportunities();
    res.json({
      success: true,
      data: opportunities,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get automation opportunities', error);
    next(error);
  }
};

export const getAutomationROI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roi = await processService.calculateAutomationROI();
    res.json({
      success: true,
      data: roi,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to calculate automation ROI', error);
    next(error);
  }
};

export const getWorkflowTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await processService.getWorkflowTemplates();
    res.json({
      success: true,
      data: templates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get workflow templates', error);
    next(error);
  }
};

export const applyWorkflowTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { templateId } = req.body;
    
    const updatedProcess = await processService.applyWorkflowTemplate(id, templateId);
    
    res.json({
      success: true,
      data: updatedProcess,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to apply workflow template', error);
    next(error);
  }
};