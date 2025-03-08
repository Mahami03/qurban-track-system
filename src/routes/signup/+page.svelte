<script>
    import { auth, db } from "$lib/firebase";
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { doc, setDoc } from "firebase/firestore";
    import { goto } from "$app/navigation";
    import "../../app.css";
    import { fade } from "svelte/transition";

    let email = "";
    let password = "";
    let name = "";
    let surname = "";
    let phone = "";
    let error = "";
    let loading = false;

    async function signup() {
        if (!email || !password || !name || !surname || !phone) {
            error = "Please fill in all fields.";
            return;
        }
        loading = true;
        error = "";
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const uid = userCredential.user.uid;
            await setDoc(doc(db, "donors", uid), {
                email,
                name,
                surname,
                phone,
            });
            goto("/");
        } catch (err) {
            console.error("Signup error:", err);
            error = err.message;
        } finally {
            loading = false;
        }
    }

    // Benefits of signing up
    const benefits = [
        { text: "Track your Qurban contributions effortlessly.", icon: "📊" },
        { text: "Join a community of generous donors.", icon: "👥" },
        { text: "Support meaningful sacrifices worldwide.", icon: "🌍" },
    ];
</script>

<div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
>
    <div
        class="flex w-full max-w-4xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        in:fade={{ duration: 300 }}
    >
        <!-- Left Side: Signup Form -->
        <div class="w-1/2 p-8">
            <div class="mb-8">
                <h1
                    class="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight"
                >
                    Join Qurban Tracker
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                    Create your donor account
                </p>
            </div>
            <form on:submit|preventDefault={signup} class="space-y-6">
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
                        placeholder="you@example.com"
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
                        placeholder="•••••••• (min 6 characters)"
                        class="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label
                        for="name"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Name</label
                    >
                    <input
                        id="name"
                        type="text"
                        bind:value={name}
                        placeholder="Muhammad"
                        class="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label
                        for="surname"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Surname</label
                    >
                    <input
                        id="surname"
                        type="text"
                        bind:value={surname}
                        placeholder="Adem"
                        class="mt-1 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label
                        for="phone"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >Phone</label
                    >
                    <input
                        id="phone"
                        type="tel"
                        bind:value={phone}
                        placeholder="+1234567890"
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
                    Sign Up
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
                Already have an account? <a
                    href="/"
                    class="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >Sign in</a
                >
            </p>
        </div>

        <!-- Right Side: Benefits -->
        <div
            class="w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 p-8 text-white flex flex-col justify-center"
        >
            <h2 class="text-2xl font-semibold mb-6">
                Why Join Qurban Tracker?
            </h2>
            <div class="space-y-6">
                {#each benefits as benefit}
                    <div
                        in:fade={{
                            duration: 300,
                            delay: benefits.indexOf(benefit) * 100,
                        }}
                        class="flex items-start gap-3"
                    >
                        <span class="text-2xl">{benefit.icon}</span>
                        <p class="text-lg">{benefit.text}</p>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style global>
    @import "../../app.css";
</style>
