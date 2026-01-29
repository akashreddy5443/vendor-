import { Check, Clock, Package, Truck, Star, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderTimelineProps {
    status: string
    created_at?: string
}

export function OrderTimeline({ status, created_at }: OrderTimelineProps) {
    // If delivered, show the "Green Banner" style from Meesho
    if (status === 'delivered') {
        return (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Delivered Early</h3>
                        <p className="text-xs text-gray-500">Thu, 22 Jan</p>
                    </div>
                </div>
                <div className="bg-green-100/50 rounded px-3 py-2 text-sm text-green-800 flex items-center gap-2">
                    <span className="text-yellow-600">⚡</span>
                    Yay! Your order was delivered in just 5 days.
                </div>
            </div>
        )
    }

    // For active orders, show a vertical or horizontal tracker
    const steps = [
        { id: 'pending', label: 'Order Placed', icon: Clock },
        { id: 'processing', label: 'Processing', icon: Package },
        { id: 'shipped', label: 'Shipped', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: Check },
    ]

    const getStepStatus = (stepId: string) => {
        const order = ['pending', 'processing', 'shipped', 'delivered']
        const currentIdx = order.indexOf(status)
        const stepIdx = order.indexOf(stepId)

        if (stepIdx < currentIdx) return 'completed'
        if (stepIdx === currentIdx) return 'current'
        return 'upcoming'
    }

    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10" />

                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(step.id)
                    const Icon = step.icon

                    return (
                        <div key={step.id} className="flex flex-col items-center flex-1 bg-white">
                            {/* Icon Circle */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors z-10",
                                stepStatus === 'completed' || stepStatus === 'current'
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-white border-gray-300 text-gray-300"
                            )}>
                                <Icon className="w-4 h-4" />
                            </div>

                            {/* Label */}
                            <span className={cn(
                                "mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wide",
                                (stepStatus === 'completed' || stepStatus === 'current') ? "text-green-600" : "text-gray-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
