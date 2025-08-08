import { Router } from 'express';
import { alertService } from '../services/alertService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// アラート一覧取得
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, resolved } = req.query;
    const alerts = alertService.getAlerts({
      type: type as string,
      resolved: resolved === 'true',
    });

    res.json({ alerts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// アラート解決
router.post('/:id/resolve', authenticate, requireAdmin, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Alert ID is required' });
      return;
    }
    alertService.resolveAlert(id);
    res.json({ message: 'Alert resolved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// テスト用：アラート手動発生
router.post('/test', authenticate, requireAdmin, async (_req, res) => {
  try {
    const alert = await alertService.triggerAlert({
      type: 'WARNING',
      category: 'SYSTEM',
      title: 'テストアラート',
      message: 'これはテスト用のアラートです',
      details: { test: true },
    });

    res.json({ alert });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;