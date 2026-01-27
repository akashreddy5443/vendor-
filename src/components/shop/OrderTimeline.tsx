import { CheckCircle, Circle, Clock, Package, Truck, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderTimelineProps {
    status: string
    className?: string
}

export function OrderTimeline({ status, className }: OrderTimelineProps) {
    const steps = [
        { id: 'pending', label: 'Order Placed', icon: Clock },
        { id: 'processing', label: 'Processing', icon: Package },
        { id: 'shipped', label: 'Shipped', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle },
    ]

    // Handle cancelled separately or as a final state override
    if (status === 'cancelled') {
        return (
            <div className={cn("w-full py-6", className)}>
                <div className="flex items-center justify-center p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 gap-2">
                    <XCircle className="h-6 w-6" />
                    <span className="font-bold">Order Cancelled</span>
                </div>
            </div>
        )
    }

    const currentStepIndex = steps.findIndex(s => s.id === status)
    // If status is not found (e.g. 'paid' which equates to processing for us maybe?), map it
    // Mapping commonly used statuses to our timeline keys
    let effectiveIndex = currentStepIndex
    if (status === 'paid') effectiveIndex = 1 // Treat paid as processing start
    if (status === 'confirmed') effectiveIndex = 1
    if (effectiveIndex === -1) effectiveIndex = 0 // Default to start

    return (
        <div className={cn("w-full py-6", className)}>
            <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 rounded-full -z-10" />

                {/* Progress Bar Active */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500"
                    style={{ width: `${(effectiveIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index <= effectiveIndex
                    const isCurrent = index === effectiveIndex
                    const Icon = step.icon

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 bg-background",
                                isCompleted ? "border-blue-600 text-blue-600 bg-blue-600/10" : "border-gray-600 text-gray-600"
                            )}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className={cn(
                                "text-xs font-medium absolute -bottom-6 w-32 text-center",
                                isCompleted ? "text-blue-500" : "text-muted-foreground",
                                isCurrent && "font-bold text-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
            {/* Spacer for bottom labels */}
            <div className="h-8" />
        </div>
    )
}
