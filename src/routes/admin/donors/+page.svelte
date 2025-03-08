<script>
    import { db } from "$lib/firebase";
    import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let donors = [];
    let loading = true;

    async function loadDonors() {
        loading = true;
        const querySnapshot = await getDocs(collection(db, "donors"));
        donors = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        loading = false;
    }

    async function deleteDonor(id) {
        if (confirm("Are you sure you want to delete this donor?")) {
            await deleteDoc(doc(db, "donors", id));
            loadDonors();
        }
    }

    onMount(loadDonors);
</script>

<div class="max-w-5xl mx-auto py-6">
    <h1
        class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 tracking-tight"
    >
        Donor Management
    </h1>

    <div
        class="card bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden"
        in:fade={{ duration: 300 }}
    >
        <h2
            class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 p-6 bg-gray-50 dark:bg-gray-800"
        >
            Registered Donors
        </h2>
        {#if loading}
            <div class="flex justify-center items-center h-64">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 dark:border-indigo-300"
                ></div>
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100"
                        >
                            <th class="p-4 rounded-tl-lg font-semibold">Name</th
                            >
                            <th class="p-4 font-semibold">Surname</th>
                            <th class="p-4 font-semibold">Email</th>
                            <th class="p-4 font-semibold">Phone</th>
                            <th class="p-4 rounded-tr-lg font-semibold"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#each donors as donor}
                            <tr
                                class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <td class="p-4">{donor.name}</td>
                                <td class="p-4">{donor.surname}</td>
                                <td class="p-4">{donor.email}</td>
                                <td class="p-4">{donor.phone}</td>
                                <td class="p-4">
                                    <button
                                        on:click={() => deleteDonor(donor.id)}
                                        class="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 px-4 py-2 rounded-md transition-colors animate-pulse-hover"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            {#if donors.length === 0}
                <p
                    class="text-gray-600 dark:text-gray-300 text-center mt-4 p-6"
                >
                    No donors registered yet.
                </p>
            {/if}
        {/if}
    </div>
</div>

<style global>
    @import "../../../app.css";
    .animate-pulse-hover:hover {
        animation: pulse 0.5s ease-in-out;
    }
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
