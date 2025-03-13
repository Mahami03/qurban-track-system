<script>
    import { db } from "$lib/firebase";
    import { collection, getDocs } from "firebase/firestore";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let donorCount = 0;
    let sacrificeCount = 0;
    let loading = true;
    let sacrificeStatusData = { Pending: 0, Slaughtered: 0, Distributed: 0 };
    let recentSacrifices = [];
    let topDonors = [];
    let pendingActions = [];

    async function loadStats() {
        loading = true;
        const donorsSnapshot = await getDocs(collection(db, "donors"));
        const sacrificesSnapshot = await getDocs(collection(db, "sacrifices"));

        donorCount = donorsSnapshot.size;
        sacrificeCount = sacrificesSnapshot.size;

        sacrificeStatusData = sacrificesSnapshot.docs.reduce(
            (acc, doc) => {
                const status = doc.data().status || "Pending";
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            },
            { Pending: 0, Slaughtered: 0, Distributed: 0 },
        );

        recentSacrifices = sacrificesSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .slice(-5)
            .reverse();

        const donorContributions = {};
        sacrificesSnapshot.docs.forEach((doc) => {
            const donorId = doc.data().donorId || "Unknown";
            donorContributions[donorId] =
                (donorContributions[donorId] || 0) + 1;
        });
        topDonors = donorsSnapshot.docs
            .map((doc) => ({
                id: doc.id,
                name: doc.data().name || "Anonymous",
                count: donorContributions[doc.id] || 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        pendingActions = sacrificesSnapshot.docs
            .filter((doc) => doc.data().status === "Pending")
            .map((doc) => ({
                id: doc.id,
                type: doc.data().type,
                inWhoseName: doc.data().inWhoseName,
            }))
            .slice(0, 3);

        loading = false;
    }

    onMount(loadStats);
</script>

<div class="max-w-7xl mx-auto py-6 px-4">
    <h1
        class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 md:mb-10 tracking-tight"
        in:fade={{ duration: 300 }}
    >
        Admin Dashboard
    </h1>

    {#if loading}
        <div class="flex justify-center items-center h-64">
            <div
                class="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-4 border-indigo-600 dark:border-indigo-300"
            ></div>
        </div>
    {:else}
        <!-- Overview Stats -->
        <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
        >
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 hover:shadow-xl transition-all"
                in:fade={{ duration: 300, delay: 100 }}
            >
                <div class="flex items-center gap-3 md:gap-4">
                    <span class="text-2xl md:text-3xl">👥</span>
                    <div>
                        <p
                            class="text-xs md:text-sm text-gray-500 dark:text-gray-400"
                        >
                            Total Donors
                        </p>
                        <p
                            class="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-300"
                        >
                            {donorCount}
                        </p>
                    </div>
                </div>
            </div>
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 hover:shadow-xl transition-all"
                in:fade={{ duration: 300, delay: 200 }}
            >
                <div class="flex items-center gap-3 md:gap-4">
                    <span class="text-2xl md:text-3xl">🐑</span>
                    <div>
                        <p
                            class="text-xs md:text-sm text-gray-500 dark:text-gray-400"
                        >
                            Total Sacrifices
                        </p>
                        <p
                            class="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-300"
                        >
                            {sacrificeCount}
                        </p>
                    </div>
                </div>
            </div>
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 hover:shadow-xl transition-all"
                in:fade={{ duration: 300, delay: 300 }}
            >
                <div class="flex items-center gap-3 md:gap-4">
                    <span class="text-2xl md:text-3xl">⏳</span>
                    <div>
                        <p
                            class="text-xs md:text-sm text-gray-500 dark:text-gray-400"
                        >
                            Pending Actions
                        </p>
                        <p
                            class="text-2xl md:text-3xl font-extrabold text-red-600 dark:text-red-400"
                        >
                            {sacrificeStatusData.Pending}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <!-- Status Breakdown -->
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 hover:shadow-xl transition-all"
                in:fade={{ duration: 300, delay: 400 }}
            >
                <h2
                    class="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4"
                >
                    Sacrifice Status
                </h2>
                <div class="space-y-3 md:space-y-4">
                    <div class="flex items-center gap-2 md:gap-3">
                        <span
                            class="bg-red-500 h-3 w-3 md:h-4 md:w-4 rounded-full"
                        ></span>
                        <p
                            class="text-sm md:text-base text-gray-600 dark:text-gray-300"
                        >
                            Pending: <span class="font-bold"
                                >{sacrificeStatusData.Pending}</span
                            >
                        </p>
                    </div>
                    <div class="flex items-center gap-2 md:gap-3">
                        <span
                            class="bg-yellow-500 h-3 w-3 md:h-4 md:w-4 rounded-full"
                        ></span>
                        <p
                            class="text-sm md:text-base text-gray-600 dark:text-gray-300"
                        >
                            Slaughtered: <span class="font-bold"
                                >{sacrificeStatusData.Slaughtered}</span
                            >
                        </p>
                    </div>
                    <div class="flex items-center gap-2 md:gap-3">
                        <span
                            class="bg-green-500 h-3 w-3 md:h-4 md:w-4 rounded-full"
                        ></span>
                        <p
                            class="text-sm md:text-base text-gray-600 dark:text-gray-300"
                        >
                            Distributed: <span class="font-bold"
                                >{sacrificeStatusData.Distributed}</span
                            >
                        </p>
                    </div>
                </div>
            </div>

            <!-- Recent Sacrifices -->
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 hover:shadow-xl transition-all lg:col-span-2"
                in:fade={{ duration: 300, delay: 500 }}
            >
                <h2
                    class="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4"
                >
                    Recent Sacrifices
                </h2>
                {#if recentSacrifices.length > 0}
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm md:text-base">
                            <thead>
                                <tr
                                    class="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                                >
                                    <th
                                        class="p-2 md:p-3 rounded-tl-lg font-semibold"
                                        >Type</th
                                    >
                                    <th class="p-2 md:p-3 font-semibold"
                                        >Country</th
                                    >
                                    <th class="p-2 md:p-3 font-semibold"
                                        >Status</th
                                    >
                                    <th
                                        class="p-2 md:p-3 rounded-tr-lg font-semibold"
                                        >Name</th
                                    >
                                </tr>
                            </thead>
                            <tbody>
                                {#each recentSacrifices as sacrifice}
                                    <tr
                                        class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td class="p-2 md:p-3"
                                            >{sacrifice.type || "N/A"}</td
                                        >
                                        <td class="p-2 md:p-3"
                                            >{sacrifice.country || "N/A"}</td
                                        >
                                        <td class="p-2 md:p-3">
                                            <span
                                                class="{sacrifice.status ===
                                                'Pending'
                                                    ? 'bg-red-500'
                                                    : sacrifice.status ===
                                                        'Slaughtered'
                                                      ? 'bg-yellow-500'
                                                      : 'bg-green-500'} h-2 w-2 md:h-3 md:w-3 rounded-full inline-block"
                                                title={sacrifice.status ||
                                                    "Pending"}
                                            ></span>
                                        </td>
                                        <td class="p-2 md:p-3"
                                            >{sacrifice.inWhoseName ||
                                                "N/A"}</td
                                        >
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {:else}
                    <p
                        class="text-gray-600 dark:text-gray-300 text-center py-3 md:py-4 text-sm md:text-base"
                    >
                        No recent sacrifices yet.
                    </p>
                {/if}
            </div>

            <!-- Top Donors -->
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 hover:shadow-xl transition-all lg:col-span-2"
                in:fade={{ duration: 300, delay: 600 }}
            >
                <h2
                    class="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4"
                >
                    Top Donors
                </h2>
                {#if topDonors.length > 0}
                    <div class="space-y-3 md:space-y-4">
                        {#each topDonors as donor}
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 md:gap-3">
                                    <span class="text-lg md:text-2xl">🏅</span>
                                    <p
                                        class="text-sm md:text-base text-gray-700 dark:text-gray-300"
                                    >
                                        {donor.name}
                                    </p>
                                </div>
                                <p
                                    class="text-indigo-600 dark:text-indigo-400 font-semibold text-sm md:text-base"
                                >
                                    {donor.count} sacrifices
                                </p>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p
                        class="text-gray-600 dark:text-gray-300 text-center py-3 md:py-4 text-sm md:text-base"
                    >
                        No donor data available.
                    </p>
                {/if}
            </div>

            <!-- Pending Actions -->
            <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 md:p-6 hover:shadow-xl transition-all"
                in:fade={{ duration: 300, delay: 700 }}
            >
                <h2
                    class="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 md:mb-4"
                >
                    Pending Actions
                </h2>
                {#if pendingActions.length > 0}
                    <div class="space-y-3 md:space-y-4">
                        {#each pendingActions as action}
                            <div class="flex items-center justify-between">
                                <div>
                                    <p
                                        class="text-sm md:text-base text-gray-700 dark:text-gray-300"
                                    >
                                        {action.type || "N/A"}
                                    </p>
                                    <p
                                        class="text-xs md:text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        {action.inWhoseName || "N/A"}
                                    </p>
                                </div>
                                <a
                                    href={`/admin/sacrifices/${action.id}`}
                                    class="text-indigo-600 dark:text-indigo-400 hover:underline text-sm md:text-base"
                                    >View</a
                                >
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p
                        class="text-gray-600 dark:text-gray-300 text-center py-3 md:py-4 text-sm md:text-base"
                    >
                        No pending actions.
                    </p>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style global>
    @import "../../app.css";
</style>
