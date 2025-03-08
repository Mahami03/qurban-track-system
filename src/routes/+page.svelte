<script>
    import { auth } from "$lib/firebase";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { goto } from "$app/navigation";
    import { user, isAdmin } from "$lib/stores";
    import "../app.css";
    import { fade } from "svelte/transition";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function login() {
        if (!email || !password) {
            error = "Please enter both email and password.";
            return;
        }
        loading = true;
        error = "";
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setTimeout(() => {
                if ($isAdmin) {
                    goto("/admin");
                } else {
                    goto("/donor");
                }
            }, 100);
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    // Quotes about Qurban
    const quotes = [
        {
            text: "Qurban is a symbol of sacrifice and devotion, uniting communities in faith.",
            author: "Islamic Tradition",
        },
        {
            text: "Through Qurban, we share blessings and uphold the spirit of generosity.",
            author: "Qurban Tracker Mission",
        },
        {
            text: "Every sacrifice strengthens our bond with compassion and gratitude.",
            author: "Islamic Values",
        },
    ];
</script>

<div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
>
    <div
        class="flex w-full max-w-4xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        in:fade={{ duration: 300 }}
    >
        <!-- Left Side: Login Form -->
        <div class="w-1/2 p-8">
            <div class="mb-8">
                <h1
                    class="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight"
                >
                    Qurban Tracker
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                    Sign in to your account
                </p>
            </div>
            <form on:submit|preventDefault={login} class="space-y-6">
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Email</label
                    >
                    <input
                        id="email"
                        type="email"
                        bind:value={email}
                        placeholder="admin@example.com"
                        class="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Password</label
                    >
                    <input
                        id="password"
                        type="password"
                        bind:value={password}
                        placeholder="••••••••"
                        class="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    class="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-md"
                    disabled={loading}
                >
                    {#if loading}
                        <svg
                            class="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    {/if}
                    Sign In
                </button>
                {#if error}
                    <p
                        class="text-red-500 dark:text-red-400 text-sm"
                        in:fade={{ duration: 200 }}
                    >
                        {error}
                    </p>
                {/if}
            </form>
            <p class="mt-6 text-gray-600 dark:text-gray-400">
                Don’t have an account?
                <a
                    href="/signup"
                    class="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >Sign up</a
                >
            </p>
        </div>

        <!-- Right Side: Quotes -->
        <div
            class="w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 p-8 text-white flex flex-col justify-center"
        >
            <h2 class="text-2xl font-semibold mb-6">About Qurban</h2>
            <div class="space-y-6">
                {#each quotes as quote}
                    <div
                        in:fade={{
                            duration: 300,
                            delay: quotes.indexOf(quote) * 100,
                        }}
                    >
                        <p class="text-lg italic">"{quote.text}"</p>
                        <p class="text-sm text-indigo-200 mt-2">
                            - {quote.author}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style global>
    @import "../app.css";
</style>
