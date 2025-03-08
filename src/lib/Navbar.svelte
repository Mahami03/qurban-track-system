<script>
    import { user, isAdmin } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { signOut } from "firebase/auth";
    import { auth } from "$lib/firebase";
    import { page } from "$app/stores";

    export let darkMode;
    export let toggleDarkMode;

    function logout() {
        signOut(auth);
        goto("/");
    }

    $: showSidebar = $page.url.pathname.startsWith("/admin");
</script>

<header
    class="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center"
>
    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        {#if $isAdmin && showSidebar}Admin Panel{:else}Donor Portal{/if}
    </h2>
    <div class="flex gap-4">
        <button
            on:click={toggleDarkMode}
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {#if darkMode}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-700 dark:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            {:else}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-700 dark:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            {/if}
        </button>
        <button on:click={logout} class="btn btn-danger">Logout</button>
    </div>
</header>
