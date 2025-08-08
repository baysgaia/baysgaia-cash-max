import { Request, Response, NextFunction } from 'express';
import { RiskManagementService } from '../services/riskManagementService';
import { logger } from '../utils/logger';

const riskService = new RiskManagementService();

export const getAllRisks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const risks = await riskService.getAllRisks();
    res.json({
      success: true,
      data: risks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get risks', error);
    next(error);
  }
};

export const getRiskMatrix = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const matrix = await riskService.getRiskMatrix();
    res.json({
      success: true,
      data: matrix,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get risk matrix', error);
    next(error);
  }
};

export const getActiveAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await riskService.getActiveAlerts();
    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get active alerts', error);
    next(error);
  }
};

export const updateRiskAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { impact, probability } = req.body;
    
    const updatedRisk = await riskService.updateRiskAssessment(id, impact, probability);
    
    res.json({
      success: true,
      data: updatedRisk,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to update risk assessment', error);
    next(error);
  }
};

export const getGovernancePolicies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const policies = await riskService.getGovernancePolicies();
    res.json({
      success: true,
      data: policies,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get governance policies', error);
    next(error);
  }
};

export const getComplianceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await riskService.getComplianceStatus();
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get compliance status', error);
    next(error);
  }
};

export const generateRiskReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await riskService.generateRiskReport();
    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to generate risk report', error);
    next(error);
  }
};