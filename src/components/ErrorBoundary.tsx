import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-muted-foreground mb-4">页面加载出错，请重试</p>
          <Button variant="outline" onClick={() => this.setState({ hasError: false })}>
            重试
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
