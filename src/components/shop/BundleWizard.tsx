'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ShoppingCart, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Product {
    id: string
    title: string
    price: number
    category_id: string
    category?: { name: string }
    product_images?: { cloudinary_url: string }[]
    description?: string
}

interface Category {
    id: string
    name: string
}

interface BundleWizardProps {
    products: Product[]
    categories: Category[]
}

const STEPS = [
    { name: 'Core System', description: 'Start with a powerful Laptop or PC' },
    { name: 'Peripherals', description: 'Add Keyboard, Mouse, and Audio' },
    { name: 'Accessories', description: 'Monitors, Stands, and more' },
    { name: 'Review Bundle', description: 'Check your setup and save' },
]

export function BundleWizard({ products, categories }: BundleWizardProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedItems, setSelectedItems] = useState<Product[]>([])
    const { addItem } = useCart()
    const router = useRouter()

    const handleSelect = (product: Product) => {
        if (selectedItems.find(i => i.id === product.id)) {
            setSelectedItems(selectedItems.filter(i => i.id !== product.id))
        } else {
            // Logic: Only one Core System? Or allow multiple?
            // For Core System (Step 0), maybe enforce single selection?
            if (currentStep === 0) {
                // Remove other core systems if already selected
                const otherCores = selectedItems.filter(i => getCategoryName(i.category_id) !== 'Laptops' && getCategoryName(i.category_id) !== 'Desktops')
                setSelectedItems([...otherCores, product])
            } else {
                setSelectedItems([...selectedItems, product])
            }
        }
    }

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || ''

    // Helper to filter products for current step
    const getStepProducts = () => {
        if (currentStep === 0) {
            return products.filter(p => {
                const cat = getCategoryName(p.category_id).toLowerCase()
                return cat.includes('laptop') || cat.includes('desktop') || cat.includes('computer')
            })
        }
        if (currentStep === 1) {
            return products.filter(p => {
                const cat = getCategoryName(p.category_id).toLowerCase()
                return cat.includes('keyboard') || cat.includes('mouse') || cat.includes('audio') || cat.includes('headphone')
            })
        }
        if (currentStep === 2) {
            return products.filter(p => {
                const cat = getCategoryName(p.category_id).toLowerCase()
                return !cat.includes('laptop') && !cat.includes('desktop') && !cat.includes('keyboard') && !cat.includes('mouse') && !cat.includes('audio') && !cat.includes('headphone')
            })
        }
        return []
    }

    const total = selectedItems.reduce((sum, item) => sum + item.price, 0)
    const discount = selectedItems.length >= 3 ? total * 0.05 : 0
    const finalTotal = total - discount

    const handleAddToCart = () => {
        selectedItems.forEach(item => {
            addItem({
                productId: item.id,
                title: item.title,
                price: item.price,
                image: item.product_images?.[0]?.cloudinary_url || '/placeholder.png',
                maxStock: 99 // Assumption
            }, 1)
        })
        toast.success(`Added ${selectedItems.length} items to cart!`)
        router.push('/cart')
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
            {/* Main Area */}
            <div className="flex-1">
                {/* Steps Header */}
                <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
                    <div className="flex gap-4 min-w-max">
                        {STEPS.map((step, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentStep(idx)}
                                disabled={idx > currentStep + 1} // Can click back, or next if completed
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentStep === idx
                                    ? 'bg-orange-600 text-white'
                                    : idx < currentStep
                                        ? 'bg-zinc-800 text-green-500'
                                        : 'text-zinc-500'
                                    }`}
                            >
                                {idx < currentStep ? <Check className="h-4 w-4" /> : <span className="bg-black/20 w-5 h-5 rounded-full flex items-center justify-center text-xs">{idx + 1}</span>}
                                {step.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {currentStep < 3 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            {getStepProducts().map((product) => {
                                const isSelected = selectedItems.some(i => i.id === product.id)
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSelect(product)}
                                        className={`group relative border rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-orange-500 bg-orange-950/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}
                                    >
                                        <div className="aspect-video relative bg-zinc-950">
                                            {product.product_images?.[0] && (
                                                <Image
                                                    src={product.product_images[0].cloudinary_url}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                                    <div className="bg-orange-500 text-white rounded-full p-2 shadow-lg">
                                                        <Check className="h-6 w-6" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs text-zinc-500 mb-1">{product.category?.name || 'Hardware'}</div>
                                            <h3 className="font-bold text-white line-clamp-1 mb-2">{product.title}</h3>
                                            <div className="text-orange-500 font-bold">{formatPrice(product.price)}</div>
                                        </div>
                                    </div>
                                )
                            })}
                            {getStepProducts().length === 0 && (
                                <div className="col-span-full py-20 text-center text-zinc-500">
                                    <p>No products found in this category.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Review Step
                        <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
                            <h2 className="text-2xl font-bold mb-6">Your Custom Setup</h2>
                            {selectedItems.length === 0 ? (
                                <div className="text-center py-10 text-zinc-500">
                                    Your build is empty. Go back and select some gear!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                                            <div className="h-16 w-16 relative bg-zinc-900 rounded-md overflow-hidden flex-shrink-0">
                                                {item.product_images?.[0] && <Image src={item.product_images[0].cloudinary_url} alt={item.title} fill className="object-cover" />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold">{item.title}</h4>
                                                <p className="text-sm text-zinc-400">{item.category?.name}</p>
                                            </div>
                                            <div className="font-bold">{formatPrice(item.price)}</div>
                                            <button
                                                onClick={() => handleSelect(item)}
                                                className="p-2 text-zinc-500 hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Buttons for Main Filter View */}
                {currentStep < 3 && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors"
                        >
                            Next Step <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Sticky Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-orange-500" />
                        Bundle Summary
                    </h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Selected Items</span>
                            <span className="font-bold">{selectedItems.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Subtotal</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-500">
                                <span>Bundle Discount (5%)</span>
                                <span>-{formatPrice(discount)}</span>
                            </div>
                        )}
                        <div className="border-t border-zinc-800 pt-3 flex justify-between text-lg font-bold text-white">
                            <span>Total</span>
                            <span>{formatPrice(finalTotal)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={selectedItems.length === 0}
                        className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20"
                    >
                        Add All to Cart
                    </button>

                    {selectedItems.length < 3 && (
                        <p className="text-xs text-center mt-3 text-zinc-500">
                            Add {3 - selectedItems.length} more items to unlock 5% discount!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
