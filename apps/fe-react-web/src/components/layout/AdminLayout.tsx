import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface AdminLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    headerActions?: React.ReactNode;
    className?: string;
}

export function AdminLayout({ title, description, children, headerActions, className }: AdminLayoutProps) {
    return (
        <div className={cn("min-h-screen bg-gray-50 p-6", className)}>
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header Section */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                {description && <p className="text-sm text-gray-600">{description}</p>}
                            </div>
                            {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
                        </div>
                    </CardHeader>
                </Card>

                {/* Content Section */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}

interface AdminFilterBarProps {
    children: React.ReactNode;
    className?: string;
}

export function AdminFilterBar({ children, className }: AdminFilterBarProps) {
    return (
        <div className={cn("border-b bg-gray-50/50 p-6", className)}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">{children}</div>
        </div>
    );
}

interface AdminTableContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function AdminTableContainer({ children, className }: AdminTableContainerProps) {
    return <div className={cn("overflow-hidden", className)}>{children}</div>;
}

interface AdminEmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export function AdminEmptyState({ title, description, icon, action }: AdminEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="mb-4 text-gray-400">{icon}</div>}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

interface AdminLoadingStateProps {
    message?: string;
}

export function AdminLoadingState({ message = "Đang tải dữ liệu..." }: AdminLoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-600">{message}</p>
        </div>
    );
}

interface AdminErrorStateProps {
    title: string;
    message?: string;
    onRetry?: () => void;
}

export function AdminErrorState({ title, message, onRetry }: AdminErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                    Thử lại
                </button>
            )}
        </div>
    );
}
