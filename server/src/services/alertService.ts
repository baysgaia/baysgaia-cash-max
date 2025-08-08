/**
 * アラート通知サービス
 */

import { logger } from '../utils/logger';

export interface Alert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'CASH_FLOW' | 'KPI' | 'SYSTEM' | 'COMPLIANCE' | 'RISK';
  title: string;
  message: string;
  details?: any;
  triggeredAt: Date;
  requiresCEOApproval?: boolean;
}

class AlertService {
  private alerts: Alert[] = [];

  /**
   * アラート発生
   */
  async triggerAlert(alert: Omit<Alert, 'id' | 'triggeredAt'>): Promise<Alert> {
    const newAlert: Alert = {
      ...alert,
      id: `ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggeredAt: new Date(),
    };

    this.alerts.push(newAlert);
    logger.warn(`Alert triggered: ${newAlert.type} - ${newAlert.title}`);

    // Critical アラートの場合は即座に通知
    if (alert.type === 'CRITICAL') {
      await this.sendCriticalNotification(newAlert);
    }

    // CEO承認が必要な場合
    if (alert.requiresCEOApproval) {
      await this.notifyCEO(newAlert);
    }

    return newAlert;
  }

  /**
   * アラート一覧取得
   */
  getAlerts(filter?: { type?: string; resolved?: boolean }): Alert[] {
    let filtered = [...this.alerts];

    if (filter?.type) {
      filtered = filtered.filter(alert => alert.type === filter.type);
    }

    // 最新順にソート
    return filtered.sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
  }

  /**
   * KPIアラートチェック
   */
  async checkKPIAlerts(kpiData: any) {
    // 現金残高改善率チェック
    if (kpiData.cashBalanceGrowth < 0.1 && kpiData.cashBalanceGrowth < 0.2) {
      await this.triggerAlert({
        type: 'WARNING',
        category: 'KPI',
        title: '現金残高改善率が目標を下回っています',
        message: `現在の改善率: ${(kpiData.cashBalanceGrowth * 100).toFixed(1)}% (目標: 20%)`,
        details: { current: kpiData.cashBalanceGrowth, target: 0.2 },
      });
    }

    // プロセス自動化率チェック
    if (kpiData.automationRate < 0.5 && kpiData.automationRate < 0.7) {
      await this.triggerAlert({
        type: 'WARNING',
        category: 'KPI',
        title: 'プロセス自動化率が目標を下回っています',
        message: `現在の自動化率: ${(kpiData.automationRate * 100).toFixed(1)}% (目標: 70%)`,
        details: { current: kpiData.automationRate, target: 0.7 },
      });
    }

    // 資金予測精度チェック
    if (kpiData.forecastAccuracy < 0.9) {
      await this.triggerAlert({
        type: 'CRITICAL',
        category: 'KPI',
        title: '資金予測精度が危険水準です',
        message: `現在の精度: ${(kpiData.forecastAccuracy * 100).toFixed(1)}% (目標: 95%以上)`,
        details: { current: kpiData.forecastAccuracy, target: 0.95 },
        requiresCEOApproval: true,
      });
    }
  }

  /**
   * キャッシュフローアラートチェック
   */
  async checkCashFlowAlerts(balance: number, previousBalance: number) {
    const changeRate = (balance - previousBalance) / previousBalance;

    // 現金残高が急激に減少
    if (changeRate < -0.1) {
      await this.triggerAlert({
        type: 'CRITICAL',
        category: 'CASH_FLOW',
        title: '現金残高が急激に減少しています',
        message: `前日比 ${(changeRate * 100).toFixed(1)}% 減少`,
        details: { currentBalance: balance, previousBalance, changeRate },
        requiresCEOApproval: true,
      });
    }

    // 現金残高が閾値を下回る
    const threshold = 5000000; // 500万円
    if (balance < threshold) {
      await this.triggerAlert({
        type: 'CRITICAL',
        category: 'CASH_FLOW',
        title: '現金残高が危険水準に達しました',
        message: `現在の残高: ${balance.toLocaleString()}円 (閾値: ${threshold.toLocaleString()}円)`,
        details: { balance, threshold },
        requiresCEOApproval: true,
      });
    }
  }

  /**
   * リスクアラート
   */
  async checkRiskAlerts(risks: any[]) {
    const criticalRisks = risks.filter(risk => risk.severity === 'CRITICAL');
    
    if (criticalRisks.length > 0) {
      await this.triggerAlert({
        type: 'CRITICAL',
        category: 'RISK',
        title: `${criticalRisks.length}件の重大リスクが検出されました`,
        message: criticalRisks.map(r => r.title).join(', '),
        details: { risks: criticalRisks },
        requiresCEOApproval: true,
      });
    }
  }

  /**
   * システムアラート
   */
  async triggerSystemAlert(error: Error, context?: string) {
    await this.triggerAlert({
      type: 'WARNING',
      category: 'SYSTEM',
      title: 'システムエラーが発生しました',
      message: error.message,
      details: { error: error.stack, context },
    });
  }

  /**
   * Critical通知送信（実装予定）
   */
  private async sendCriticalNotification(alert: Alert) {
    logger.error(`CRITICAL ALERT: ${alert.title}`);
    // TODO: メール/SMS/Slack通知の実装
    // 現在はログ出力のみ
  }

  /**
   * CEO通知（実装予定）
   */
  private async notifyCEO(alert: Alert) {
    logger.warn(`CEO APPROVAL REQUIRED: ${alert.title}`);
    // TODO: CEO専用通知チャネルへの送信
    // 現在はログ出力のみ
  }

  /**
   * アラート解決
   */
  resolveAlert(alertId: string) {
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index !== -1) {
      this.alerts.splice(index, 1);
      logger.info(`Alert resolved: ${alertId}`);
    }
  }
}

export const alertService = new AlertService();