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
    <div class="flex h-screen">
        {#if showSidebar}
            <aside
                class="w-64 bg-indigo-700 text-white dark:bg-indigo-900 flex-shrink-0 shadow-lg"
            >
                <div class="p-6">
                    <h1 class="text-2xl font-bold flex items-center gap-2">
                        <span>🕌</span> Qurban
                    </h1>
                </div>
                <nav class="mt-4">
                    <ul>
                        {#each adminLinks as link}
                            <li>
                                <a
                                    href={link.path}
                                    class="flex items-center gap-3 py-3 px-6 hover:bg-indigo-800 dark:hover:bg-indigo-700 transition-colors duration-200 {$page
                                        .url.pathname === link.path
                                        ? 'bg-indigo-800 dark:bg-indigo-700'
                                        : ''}"
                                >
                                    <span>{link.icon}</span>
                                    {link.name}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </nav>
            </aside>
        {/if}

        <div class="flex-1 flex flex-col">
            {#if $user}
                <Navbar {darkMode} {toggleDarkMode} />
            {/if}
            <main class="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
                <slot />
            </main>
        </div>
    </div>
</div>
