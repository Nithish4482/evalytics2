import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="max-w-xl bg-white shadow-lg rounded-lg p-6">
                        <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">{this.state.error?.message}</pre>
                        <p className="mt-4 text-sm text-gray-600">Check console for details.</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
