'use client'
import { UserCircle } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UserProfile() {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const checkAndUpdateSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Check if user has a subscription
            const { data: userData, error: fetchError } = await supabase
                .from('users')
                .select('subscription')
                .eq('user_id', user.id)
                .single()

            if (fetchError) {
                console.error('Error fetching user:', fetchError)
                return
            }

            // If no subscription is set, update it to 'Free'
            if (!userData?.subscription) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ subscription: 'Free' })
                    .eq('user_id', user.id)

                if (updateError) {
                    console.error('Error updating subscription:', updateError)
                }
            }
        }

        checkAndUpdateSubscription()
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <UserCircle className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={async () => {
                    await supabase.auth.signOut()
                    router.push("/")
                }}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}