import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// キャッシュフローページ
class CashflowPage extends ConsumerWidget {
  const CashflowPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('キャッシュフロー分析'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.account_balance_wallet,
              size: 64,
              color: Colors.green,
            ),
            SizedBox(height: 16),
            Text(
              'キャッシュフロー分析',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              '実装予定: Phase 2',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}