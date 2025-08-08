import 'package:flutter/material.dart';

/// ブレークポイント定義
class Breakpoints {
  static const double mobile = 600;
  static const double tablet = 1024;
  static const double desktop = 1440;

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < mobile;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= mobile &&
      MediaQuery.of(context).size.width < desktop;

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= desktop;

  static bool isLargeDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= desktop + 400;
}

/// レスポンシブレイアウトウィジェット
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= Breakpoints.desktop) {
          return desktop ?? tablet ?? mobile;
        } else if (constraints.maxWidth >= Breakpoints.mobile) {
          return tablet ?? mobile;
        } else {
          return mobile;
        }
      },
    );
  }
}

/// レスポンシブ値を取得するウィジェット
class ResponsiveValue<T> {
  final T mobile;
  final T? tablet;
  final T? desktop;

  const ResponsiveValue({
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  T value(BuildContext context) {
    if (Breakpoints.isDesktop(context)) {
      return desktop ?? tablet ?? mobile;
    } else if (Breakpoints.isTablet(context)) {
      return tablet ?? mobile;
    } else {
      return mobile;
    }
  }
}

/// レスポンシブグリッド
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;
  final ResponsiveValue<int> crossAxisCount;
  final double mainAxisSpacing;
  final double crossAxisSpacing;
  final double childAspectRatio;
  final EdgeInsetsGeometry? padding;

  const ResponsiveGrid({
    super.key,
    required this.children,
    required this.crossAxisCount,
    this.mainAxisSpacing = 16.0,
    this.crossAxisSpacing = 16.0,
    this.childAspectRatio = 1.0,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      padding: padding,
      crossAxisCount: crossAxisCount.value(context),
      mainAxisSpacing: mainAxisSpacing,
      crossAxisSpacing: crossAxisSpacing,
      childAspectRatio: childAspectRatio,
      children: children,
    );
  }
}

/// レスポンシブContainer
class ResponsiveContainer extends StatelessWidget {
  final Widget child;
  final ResponsiveValue<EdgeInsetsGeometry>? padding;
  final ResponsiveValue<EdgeInsetsGeometry>? margin;
  final ResponsiveValue<double>? width;
  final ResponsiveValue<double>? height;

  const ResponsiveContainer({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding?.value(context),
      margin: margin?.value(context),
      width: width?.value(context),
      height: height?.value(context),
      child: child,
    );
  }
}