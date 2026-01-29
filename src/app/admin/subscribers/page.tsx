import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Calendar } from 'lucide-react'
import { SubscriberActions } from '@/components/admin/SubscriberActions'

export default async function SubscribersPage() {
    const supabase = await createClient()

    const { data: subscribers } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Subscribers</h1>
                    <p className="text-gray-500">View and manage newsletter subscriptions.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-900 font-mono shadow-sm">
                    Total: <span className="text-blue-600 font-bold">{subscribers?.length || 0}</span>
                </div>
            </div>

            <Card className="bg-white border-gray-200 text-gray-900 shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Subscribers</CardTitle>
                    <CardDescription>List of all users who opted into the newsletter.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-gray-100">
                        {subscribers && subscribers.length > 0 ? (
                            subscribers.map((sub: any) => (
                                <div key={sub.id} className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{sub.email}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(sub.subscribed_at).toLocaleDateString()} at {new Date(sub.subscribed_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <SubscriberActions id={sub.id} />
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                No subscribers yet.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
