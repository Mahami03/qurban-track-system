<script>
    import { db } from "$lib/firebase";
    import {
        collection,
        query,
        where,
        getDocs,
        doc,
        updateDoc,
        getDoc,
    } from "firebase/firestore";
    import { user } from "$lib/stores";
    import { onMount } from "svelte";

    let sacrifices = [];
    let loading = true;
    let error = "";
    let showProfileModal = false;
    let donorProfile = { name: "", surname: "", phone: "" };
    let totalSacrifices = 0;
    let statusBreakdown = { Pending: 0, Slaughtered: 0, Distributed: 0 };

    async function loadSacrifices() {
        if (!$user) return;
        loading = true;
        error = "";
        try {
            const q = query(
                collection(db, "sacrifices"),
                where("donorId", "==", $user.uid),
            );
            const querySnapshot = await getDocs(q);
            sacrifices = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            totalSacrifices = sacrifices.length;
            statusBreakdown = sacrifices.reduce(
                (acc, s) => {
                    acc[s.status] = (acc[s.status] || 0) + 1;
                    return acc;
                },
                { Pending: 0, Slaughtered: 0, Distributed: 0 },
            );
        } catch (err) {
            error = "Failed to load your sacrifices. Please try again later.";
        } finally {
            loading = false;
        }
    }

    async function loadProfile() {
        const donorDoc = await getDoc(doc(db, "donors", $user.uid));
        if (donorDoc.exists()) {
            donorProfile = donorDoc.data();
        }
    }

    async function saveProfile() {
        try {
            await updateDoc(doc(db, "donors", $user.uid), donorProfile);
            showProfileModal = false;
        } catch (err) {
            error = "Failed to update profile: " + err.message;
        }
    }

    onMount(() => {
        loadSacrifices();
        loadProfile();
    });

    // Helper function to get status color class
    function getStatusColor(status) {
        switch (status) {
            case "Pending":
                return "bg-red-500";
            case "Slaughtered":
                return "bg-yellow-500";
            case "Distributed":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    }
</script>

<div class="max-w-5xl mx-auto relative">
    <header
        class="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">
            My Sacrifices
        </h1>
        <button
            on:click={() => (showProfileModal = !showProfileModal)}
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Profile"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-gray-700 dark:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        </button>
    </header>

    {#if showProfileModal}
        <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div
                class="card w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            >
                <h2
                    class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4"
                >
                    Edit Profile
                </h2>
                <form on:submit|preventDefault={saveProfile} class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >Name</label
                        >
                        <input
                            bind:value={donorProfile.name}
                            placeholder="Name"
                            class="input mt-1"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >Surname</label
                        >
                        <input
                            bind:value={donorProfile.surname}
                            placeholder="Surname"
                            class="input mt-1"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                            >Phone</label
                        >
                        <input
                            bind:value={donorProfile.phone}
                            placeholder="Phone"
                            class="input mt-1"
                        />
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" class="btn btn-primary flex-1"
                            >Save</button
                        >
                        <button
                            on:click={() => (showProfileModal = false)}
                            class="btn btn-danger flex-1">Cancel</button
                        >
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
            class="card bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg shadow-md"
        >
            <h3
                class="text-lg font-semibold text-indigo-800 dark:text-indigo-200"
            >
                Total Sacrifices
            </h3>
            <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                {totalSacrifices}
            </p>
        </div>
        <div
            class="card bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-md"
        >
            <h3
                class="text-lg font-semibold text-yellow-800 dark:text-yellow-200"
            >
                Pending
            </h3>
            <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                {statusBreakdown.Pending}
            </p>
        </div>
        <div
            class="card bg-orange-100 dark:bg-orange-900 p-4 rounded-lg shadow-md"
        >
            <h3
                class="text-lg font-semibold text-orange-800 dark:text-orange-200"
            >
                Slaughtered
            </h3>
            <p class="text-3xl font-bold text-orange-600 dark:text-orange-300">
                {statusBreakdown.Slaughtered}
            </p>
        </div>
        <div
            class="card bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-md"
        >
            <h3
                class="text-lg font-semibold text-green-800 dark:text-green-200"
            >
                Distributed
            </h3>
            <p class="text-3xl font-bold text-green-600 dark:text-green-300">
                {statusBreakdown.Distributed}
            </p>
        </div>
    </div>

    {#if loading}
        <p class="text-gray-600 dark:text-gray-300 text-center">
            Loading your sacrifices...
        </p>
    {:else if error}
        <p class="text-red-500 text-center">{error}</p>
    {:else if sacrifices.length === 0}
        <div class="card text-center py-10 bg-white dark:bg-gray-800">
            <p class="text-gray-600 dark:text-gray-300 text-lg">
                No sacrifices found yet.
            </p>
            <p class="text-gray-500 dark:text-gray-400 mt-2">
                Contact an admin to add your sacrifice details.
            </p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each sacrifices as sacrifice}
                <div
                    class="card hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
                >
                    <img
                        src={sacrifice.photoUrl}
                        alt="Sacrifice"
                        class="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div class="p-4">
                        <h2
                            class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2"
                        >
                            {sacrifice.type.charAt(0).toUpperCase() +
                                sacrifice.type.slice(1)}
                        </h2>
                        <p class="text-gray-600 dark:text-gray-300">
                            <strong>Country:</strong>
                            {sacrifice.country}
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            <strong>In Whose Name:</strong>
                            {sacrifice.inWhoseName}
                        </p>
                        <div class="flex items-center gap-2">
                            <span
                                class="text-gray-600 dark:text-gray-300 font-medium"
                                >Status:</span
                            >
                            <span
                                class="{getStatusColor(
                                    sacrifice.status,
                                )} h-4 w-4 rounded-full inline-block"
                                title={sacrifice.status}
                            ></span>
                        </div>
                        <a
                            href={sacrifice.videoUrl}
                            target="_blank"
                            class="btn btn-primary mt-4 inline-block"
                            >Watch Video</a
                        >
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style global>
    @import "../../app.css";
</style>
