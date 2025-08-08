import { Request, Response, NextFunction } from 'express';
import { ProjectManagementService } from '../services/projectManagementService';
import { logger } from '../utils/logger';

const projectService = new ProjectManagementService();

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getProject();
    res.json({
      success: true,
      data: project,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get project', error);
    next(error);
  }
};

export const getAllPhases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const phases = await projectService.getAllPhases();
    res.json({
      success: true,
      data: phases,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get phases', error);
    next(error);
  }
};

export const getCurrentPhase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const phase = await projectService.getCurrentPhase();
    res.json({
      success: true,
      data: phase,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get current phase', error);
    next(error);
  }
};

export const updateObjectiveProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { currentValue } = req.body;
    
    const updatedObjective = await projectService.updateObjectiveProgress(id, currentValue);
    
    res.json({
      success: true,
      data: updatedObjective,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to update objective progress', error);
    next(error);
  }
};

export const getProjectTimeline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timeline = await projectService.getProjectTimeline();
    res.json({
      success: true,
      data: timeline,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get project timeline', error);
    next(error);
  }
};

export const generateProjectReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await projectService.generateProjectReport();
    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to generate project report', error);
    next(error);
  }
};

export const getGanttChartData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ganttData = await projectService.getGanttChartData();
    res.json({
      success: true,
      data: ganttData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get Gantt chart data', error);
    next(error);
  }
};