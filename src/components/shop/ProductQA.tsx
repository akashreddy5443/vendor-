'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitQuestion, submitAnswer } from '@/app/actions/qa'
import { format } from 'date-fns'
import { MessageSquare, ThumbsUp, ChevronDown, ChevronUp, Flag } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner or similar toast
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Answer {
    id: string
    answer: string
    is_staff: boolean
    created_at: string
    user_id: string
    user?: {
        full_name: string
    }
}

interface Question {
    id: string
    question: string
    created_at: string
    user_id: string
    answers: Answer[]
    user?: {
        full_name: string
    }
}

interface ProductQAProps {
    productId: string
}

export function ProductQA({ productId }: ProductQAProps) {
    const [questions, setQuestions] = useState<Question[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAsking, setIsAsking] = useState(false)
    const [newQuestion, setNewQuestion] = useState('')

    // For answering
    const [answeringId, setAnsweringId] = useState<string | null>(null)
    const [newAnswer, setNewAnswer] = useState('')

    const supabase = createClient()

    useEffect(() => {
        fetchQuestions()
    }, [productId])

    const fetchQuestions = async () => {
        setIsLoading(true)
        // Join fetch for ease, or two fetches. 
        // Supabase join syntax:
        const { data, error } = await supabase
            .from('product_questions')
            .select(`
                *,
                user:users(full_name),
                answers:product_answers(
                    *,
                    user:users(full_name)
                )
            `)
            .eq('product_id', productId)
            .order('created_at', { ascending: false })

        if (!error && data) {
            // Sort answers by is_staff desc, then created_at desc
            const sorted = data.map((q: any) => ({
                ...q,
                answers: q.answers?.sort((a: any, b: any) => {
                    // Staff answers first
                    if (a.is_staff && !b.is_staff) return -1
                    if (!a.is_staff && b.is_staff) return 1
                    // Then newest first
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })
            }))
            setQuestions(sorted)
        }
        setIsLoading(false)
    }

    const handleAskSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await submitQuestion(productId, newQuestion)
            setNewQuestion('')
            setIsAsking(false)
            toast.success('Question submitted!', { description: 'It will appear shortly.' })
            fetchQuestions()
        } catch (err: any) {
            toast.error('Failed to submit', { description: err.message })
        }
    }

    const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
        e.preventDefault()
        try {
            await submitAnswer(questionId, newAnswer, productId)
            setNewAnswer('')
            setAnsweringId(null)
            toast.success('Answer submitted!')
            fetchQuestions()
        } catch (err: any) {
            toast.error('Failed to submit answer', { description: err.message })
        }
    }

    return (
        <div className="py-8 bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Customer Questions & Answers</h2>
                    <p className="text-zinc-400 text-sm">Have a doubt? Ask the community and our experts.</p>
                </div>
                <button
                    onClick={() => setIsAsking(!isAsking)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md font-medium transition-colors border border-zinc-700"
                >
                    {isAsking ? 'Cancel' : 'Ask a Question'}
                </button>
            </div>

            {/* Ask Form */}
            <AnimatePresence>
                {isAsking && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 overflow-hidden"
                    >
                        <form onSubmit={handleAskSubmit} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                            <label className="block text-sm font-medium mb-2">Your Question</label>
                            <textarea
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:outline-none min-h-[100px]"
                                placeholder="e.g., Does this support 4K 120Hz?"
                                required
                                minLength={10}
                            />
                            <div className="mt-2 flex justify-end">
                                <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-md font-bold">
                                    Post Question
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8">
                {questions.map((q) => (
                    <div key={q.id} className="group">
                        {/* Question Block */}
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <MessageSquare className="h-5 w-5 text-zinc-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-zinc-100 flex items-start gap-2">
                                    <span className="text-orange-500 font-black">Q:</span>
                                    {q.question}
                                </h3>
                                <div className="text-xs text-zinc-500 mt-1 flex gap-2">
                                    <span>{q.user?.full_name || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{format(new Date(q.created_at), 'MMM d, yyyy')}</span>
                                </div>

                                {/* Answers List */}
                                <div className="mt-4 space-y-4">
                                    {q.answers?.map((a) => (
                                        <div key={a.id} className={cn("pl-4 border-l-2", a.is_staff ? "border-orange-500/50 bg-orange-950/10 p-2 rounded-r-md" : "border-zinc-700")}>
                                            <div className="text-zinc-300 flex items-start gap-2">
                                                <span className="font-black text-zinc-500">A:</span>
                                                <p className="leading-relaxed text-sm lg:text-base">{a.answer}</p>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2 text-xs">
                                                {a.is_staff ? (
                                                    <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        TechDev Staff
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-500">{a.user?.full_name || 'User'}</span>
                                                )}
                                                <span className="text-zinc-600">•</span>
                                                <span className="text-zinc-600">{format(new Date(a.created_at), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Answer Toggle/Form */}
                                <div className="mt-4">
                                    {!answeringId || answeringId !== q.id ? (
                                        <button
                                            onClick={() => setAnsweringId(q.id)}
                                            className="text-sm text-zinc-400 hover:text-orange-500 font-medium transition-colors flex items-center gap-1"
                                        >
                                            <ChevronDown className="h-3 w-3" /> Answer this question
                                        </button>
                                    ) : (
                                        <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <form onSubmit={(e) => handleAnswerSubmit(e, q.id)}>
                                                <textarea
                                                    value={newAnswer}
                                                    onChange={(e) => setNewAnswer(e.target.value)}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2 text-sm text-white focus:outline-none focus:border-orange-500 min-h-[80px]"
                                                    placeholder="Write your answer here..."
                                                    required
                                                />
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button type="submit" className="bg-white text-black hover:bg-zinc-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                                                        Post Answer
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setAnsweringId(null); setNewAnswer('') }}
                                                        className="text-zinc-500 hover:text-white px-3 py-1.5 text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                ))}

                {questions.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-zinc-500">
                        <p>No questions yet. Be the first to ask!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
