'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
    id: string
    title: string
    slug: string
    price: number
    product_images: { cloudinary_url: string }[]
}

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    products?: Product[]
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! I'm your AI Shopping Assistant. Ask me about Laptops, Phones, or Audio gear!"
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            })

            if (!response.ok) throw new Error('Failed to fetch')

            const data = await response.json()

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content,
                products: data.products
            }])

        } catch (error: any) {
            console.error('Chat error:', error)
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-[400px] h-[600px] mb-4 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-white/50 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-200/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">TechDev AI</h3>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {messages.map((m) => (
                                <div key={m.id} className={cn("flex flex-col gap-2", m.role === 'user' ? "items-end" : "items-start")}>

                                    {/* Text Bubble */}
                                    <div className={cn(
                                        "flex gap-3 max-w-[90%]",
                                        m.role === 'user' ? "flex-row-reverse" : ""
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                            m.role === 'user'
                                                ? "bg-slate-900 text-white"
                                                : "bg-white border border-slate-100 text-indigo-600"
                                        )}>
                                            {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={cn(
                                            "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                            m.role === 'user'
                                                ? "bg-slate-900 text-white rounded-tr-none"
                                                : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                                        )}>
                                            {m.content}
                                        </div>
                                    </div>

                                    {/* Product Carousel */}
                                    {m.products && m.products.length > 0 && (
                                        <div className="w-full pl-11 overflow-x-auto pb-4 scrollbar-none flex gap-3 snap-x snap-mandatory">
                                            {m.products.map(product => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.slug}`}
                                                    className="snap-start shrink-0 w-[180px] bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer"
                                                >
                                                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                                        {product.product_images?.[0]?.cloudinary_url ? (
                                                            <Image
                                                                src={product.product_images[0].cloudinary_url}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <ShoppingBag className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="p-3">
                                                        <h4 className="font-semibold text-slate-900 text-xs line-clamp-2 min-h-[2.5em] mb-1">
                                                            {product.title}
                                                        </h4>
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-indigo-600 text-sm">
                                                                ₹{product.price.toLocaleString('en-IN')}
                                                            </span>
                                                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                                <ChevronRight className="w-3 h-3" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-indigo-600">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
                            <div className="flex gap-2 relative">
                                <input
                                    className="flex-1 bg-slate-50 border-0 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all placeholder:text-slate-400"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about laptops, phones..."
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-900 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:bg-slate-800 transition-all group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                    {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                </div>
            </motion.button>
        </div>
    )
}
