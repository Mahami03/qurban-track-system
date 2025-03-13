<script>
    import { user, isAdmin } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { signOut } from "firebase/auth";
    import { auth } from "$lib/firebase";
    import { page } from "$app/stores";
    import "../app.css";
    import { onMount } from "svelte";
    import Navbar from "$lib/Navbar.svelte";

    let darkMode = false;
    let sidebarOpen = false; // For mobile toggle

    onMount(() => {
        const savedMode = localStorage.getItem("darkMode");
        darkMode = savedMode === "true";
        document.documentElement.classList.toggle("dark", darkMode);
    });

    function toggleDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem("darkMode", darkMode);
        document.documentElement.classList.toggle("dark", darkMode);
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    const adminLinks = [
        { name: "Dashboard", path: "/admin", icon: "🏠" },
        { name: "Donors", path: "/admin/donors", icon: "👥" },
        { name: "Sacrifices", path: "/admin/sacrifices", icon: "🐑" },
        { name: "Settings", path: "/admin/settings", icon: "⚙️" },
    ];

    $: showSidebar = $page.url.pathname.startsWith("/admin");
</script>

<div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
>
    <div class="flex flex-col md:flex-row h-screen">
        {#if showSidebar}
            <!-- Sidebar (Hidden on mobile, toggled with button) -->
            <aside
                class="{sidebarOpen
                    ? 'block'
                    : 'hidden'} md:block w-full md:w-64 bg-indigo-700 text-white dark:bg-indigo-900 flex-shrink-0 shadow-lg fixed md:static top-0 left-0 h-full z-20"
            >
                <div class="p-4 md:p-6 flex items-center justify-between">
                    <h1
                        class="text-xl md:text-2xl font-bold flex items-center gap-2"
                    >
                        <span>🕌</span> Qurban
                    </h1>
                    <button
                        on:click={toggleSidebar}
                        class="md:hidden text-white focus:outline-none"
                    >
                        <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <nav class="mt-2 md:mt-4">
                    <ul>
                        {#each adminLinks as link}
                            <li>
                                <a
                                    href={link.path}
                                    class="flex items-center gap-2 md:gap-3 py-2 md:py-3 px-4 md:px-6 hover:bg-indigo-800 dark:hover:bg-indigo-700 transition-colors duration-200 {$page
                                        .url.pathname === link.path
                                        ? 'bg-indigo-800 dark:bg-indigo-700'
                                        : ''}"
                                >
                                    <span class="text-lg md:text-xl"
                                        >{link.icon}</span
                                    >
                                    <span class="text-sm md:text-base"
                                        >{link.name}</span
                                    >
                                </a>
                            </li>
                        {/each}
                    </ul>
                </nav>
            </aside>
        {/if}

        <div class="flex-1 flex flex-col">
            {#if $user}
                <Navbar
                    {darkMode}
                    {toggleDarkMode}
                    toggleSidebar={showSidebar ? toggleSidebar : null}
                />
            {/if}
            <main
                class="flex-1 p-4 md:p-6 overflow-auto bg-gray-50 dark:bg-gray-900"
            >
                <slot />
            </main>
        </div>
    </div>
</div>
