// Script to set default icons for all categories
// Run with: node scripts/set_default_icons.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Icon mapping based on common category names
const iconMap = {
    // Electronics
    'laptop': 'Laptop',
    'computer': 'Laptop',
    'pc': 'Monitor',
    'phone': 'Smartphone',
    'mobile': 'Smartphone',
    'tablet': 'Tablet',
    'ipad': 'Tablet',
    'monitor': 'Monitor',
    'display': 'Monitor',
    'screen': 'Monitor',

    // Audio
    'audio': 'Headphones',
    'headphone': 'Headphones',
    'earphone': 'Headphones',
    'speaker': 'Speaker',
    'mic': 'Mic',
    'microphone': 'Mic',
    'music': 'Music',

    // Accessories
    'keyboard': 'Keyboard',
    'mouse': 'Mouse',
    'mice': 'Mouse',
    'webcam': 'Camera',
    'camera': 'Camera',
    'printer': 'Printer',

    // Gaming
    'gaming': 'Gamepad2',
    'game': 'Gamepad2',
    'console': 'Gamepad2',

    // Wearables
    'watch': 'Watch',
    'smartwatch': 'Watch',
    'wearable': 'Watch',

    // Storage & Connectivity
    'storage': 'HardDrive',
    'drive': 'HardDrive',
    'ssd': 'HardDrive',
    'hdd': 'HardDrive',
    'usb': 'Usb',
    'cable': 'Usb',
    'router': 'Router',
    'wifi': 'Wifi',
    'network': 'Wifi',

    // Power
    'battery': 'Battery',
    'charger': 'Battery',
    'power': 'Zap',

    // Accessories & Misc
    'accessories': 'Package',
    'accessory': 'Package',
    'misc': 'Package',
    'other': 'ShoppingBag',
    'bag': 'ShoppingBag',
    'case': 'Package',
}

async function setDefaultIcons() {
    console.log('🎨 Setting default icons for categories...\n')

    // Fetch all categories
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, icon')
        .order('name')

    if (error) {
        console.error('❌ Error fetching categories:', error)
        return
    }

    if (!categories || categories.length === 0) {
        console.log('⚠️  No categories found')
        return
    }

    console.log(`Found ${categories.length} categories\n`)

    // Update each category
    for (const category of categories) {
        // Skip if already has an icon
        if (category.icon && category.icon.trim() !== '') {
            console.log(`✓ ${category.name} - Already has icon: ${category.icon}`)
            continue
        }

        // Find matching icon based on name
        const nameLower = category.name.toLowerCase()
        let selectedIcon = 'ShoppingBag' // Default fallback

        // Check each keyword in iconMap
        for (const [keyword, icon] of Object.entries(iconMap)) {
            if (nameLower.includes(keyword)) {
                selectedIcon = icon
                break
            }
        }

        // Update the category
        const { error: updateError } = await supabase
            .from('categories')
            .update({ icon: selectedIcon })
            .eq('id', category.id)

        if (updateError) {
            console.error(`❌ Error updating ${category.name}:`, updateError)
        } else {
            console.log(`✓ ${category.name} → ${selectedIcon}`)
        }
    }

    console.log('\n✅ Default icons set successfully!')
    console.log('💡 You can now customize icons at /admin/categories')
}

setDefaultIcons()
