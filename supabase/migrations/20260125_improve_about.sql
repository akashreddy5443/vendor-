UPDATE public.pages
SET content = '<div class="space-y-16">
    <!-- Hero Section -->
    <div class="text-center space-y-6">
        <h2 class="text-sm font-bold uppercase tracking-[0.2em] text-orange-500 animate-in fade-in slide-in-from-bottom-4 duration-700">About TechDev Store</h2>
        <p class="text-4xl md:text-6xl font-black tracking-tight text-white animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Helping Developers <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Build The Future</span>
        </p>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            We curate the best tools, gadgets, and accessories for coding enthusiasts. Quality logic deserves quality gear.
        </p>
    </div>

    <!-- Creator Card -->
    <div class="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 animate-in zoom-in-95 duration-700 delay-300">
        <div class="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            
            <div class="order-2 md:order-1 space-y-6 text-center md:text-left">
                <div>
                     <span class="inline-flex items-center rounded-full bg-orange-900/30 px-3 py-1 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20 mb-4">
                        Content Creator
                    </span>
                    <h3 class="text-3xl font-bold text-white mb-2">TechDeveloper</h3>
                    <p class="text-gray-400 italic">
                        "I built this store to solve a simple problem: finding high-quality, aesthetic gear for my setup was too hard. Now it''s just one click away."
                    </p>
                </div>

                <div class="pt-6 border-t border-zinc-800/50">
                    <p class="text-sm font-bold text-white uppercase tracking-wider mb-3">Connect</p>
                    <div class="flex gap-4 justify-center md:justify-start">
                         <a href="#" class="p-2 rounded-full bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white transition-all"><i class="lucide-instagram w-5 h-5"></i></a>
                         <a href="#" class="p-2 rounded-full bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white transition-all"><i class="lucide-youtube w-5 h-5"></i></a>
                         <a href="#" class="p-2 rounded-full bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white transition-all"><i class="lucide-twitter w-5 h-5"></i></a>
                    </div>
                </div>
            </div>

            <div class="order-1 md:order-2 flex justify-center">
                <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-800 group hover:border-orange-500/50 transition-colors duration-500">
                     <!-- Placeholder for Creator Image - User can manage this in Admin Media -->
                     <div class="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-zinc-700 group-hover:text-zinc-600 transition-colors">
                        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                     </div>
                </div>
            </div>

        </div>
    </div>
</div>'
WHERE slug = 'about';
