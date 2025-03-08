<script>
    import { db } from "$lib/firebase";
    import {
        collection,
        getDocs,
        addDoc,
        deleteDoc,
        doc,
        updateDoc,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let sacrifices = [];
    let donors = [];
    let newSacrifice = {
        photoUrl: "",
        videoUrl: "",
        country: "",
        inWhoseName: "",
        type: "votive",
        donorId: "",
        status: "Pending",
    };
    let editingSacrifice = null;
    let errorMessage = "";
    let loading = true;
    const sacrificeTypes = ["votive", "akika", "gratitude", "healing", "wajib"];
    const statuses = ["Pending", "Slaughtered", "Distributed"];

    function isValidUrl(url) {
        const pattern = /^(https?:\/\/[^\s]+)$/;
        return pattern.test(url);
    }

    async function loadSacrifices() {
        loading = true;
        const querySnapshot = await getDocs(collection(db, "sacrifices"));
        sacrifices = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        loading = false;
    }

    async function loadDonors() {
        const querySnapshot = await getDocs(collection(db, "donors"));
        donors = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        if (donors.length > 0) newSacrifice.donorId = donors[0].id;
    }

    async function addSacrifice() {
        if (
            !newSacrifice.photoUrl ||
            !newSacrifice.videoUrl ||
            !newSacrifice.donorId
        ) {
            errorMessage =
                "Please provide a photo URL, video URL, and select a donor.";
            return;
        }
        if (
            !isValidUrl(newSacrifice.photoUrl) ||
            !isValidUrl(newSacrifice.videoUrl)
        ) {
            errorMessage =
                "Please enter valid URLs starting with http:// or https://";
            return;
        }

        try {
            const sacrificeData = {
                photoUrl: newSacrifice.photoUrl,
                videoUrl: newSacrifice.videoUrl,
                country: newSacrifice.country,
                inWhoseName: newSacrifice.inWhoseName,
                type: newSacrifice.type,
                donorId: newSacrifice.donorId,
                status: newSacrifice.status,
            };
            await addDoc(collection(db, "sacrifices"), sacrificeData);
            newSacrifice = {
                photoUrl: "",
                videoUrl: "",
                country: "",
                inWhoseName: "",
                type: "votive",
                donorId: donors[0]?.id || "",
                status: "Pending",
            };
            errorMessage = "";
            loadSacrifices();
        } catch (error) {
            errorMessage = `Failed to add sacrifice: ${error.message}`;
        }
    }

    async function deleteSacrifice(id) {
        await deleteDoc(doc(db, "sacrifices", id));
        loadSacrifices();
    }

    function startEditing(sacrifice) {
        editingSacrifice = { ...sacrifice };
    }

    async function saveEdit() {
        if (
            !editingSacrifice.photoUrl ||
            !editingSacrifice.videoUrl ||
            !editingSacrifice.donorId
        ) {
            errorMessage =
                "Please provide a photo URL, video URL, and select a donor.";
            return;
        }
        if (
            !isValidUrl(editingSacrifice.photoUrl) ||
            !isValidUrl(editingSacrifice.videoUrl)
        ) {
            errorMessage =
                "Please enter valid URLs starting with http:// or https://";
            return;
        }

        try {
            await updateDoc(doc(db, "sacrifices", editingSacrifice.id), {
                photoUrl: editingSacrifice.photoUrl,
                videoUrl: editingSacrifice.videoUrl,
                country: editingSacrifice.country,
                inWhoseName: editingSacrifice.inWhoseName,
                type: editingSacrifice.type,
                donorId: editingSacrifice.donorId,
                status: editingSacrifice.status,
            });
            editingSacrifice = null;
            errorMessage = "";
            loadSacrifices();
        } catch (error) {
            errorMessage = `Failed to update sacrifice: ${error.message}`;
        }
    }

    function cancelEdit() {
        editingSacrifice = null;
        errorMessage = "";
    }

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

    onMount(() => {
        loadSacrifices();
        loadDonors();
    });
</script>

<div class="max-w-5xl mx-auto py-6">
    <h1
        class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 tracking-tight"
    >
        Sacrifice Management
    </h1>

    <div
        class="card mb-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden"
        in:fade={{ duration: 300 }}
    >
        <h2
            class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 p-6 bg-gray-50 dark:bg-gray-800"
        >
            Add New Sacrifice
        </h2>
        <form
            on:submit|preventDefault={addSacrifice}
            class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-900"
        >
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >Photo URL</label
                >
                <input
                    bind:value={newSacrifice.photoUrl}
                    placeholder="https://example.com/photo.jpg"
                    class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >Video URL</label
                >
                <input
                    bind:value={newSacrifice.videoUrl}
                    placeholder="https://example.com/video.mp4"
                    class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >Country</label
                >
                <input
                    bind:value={newSacrifice.country}
                    placeholder="Country"
                    class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >In Whose Name</label
                >
                <input
                    bind:value={newSacrifice.inWhoseName}
                    placeholder="In Whose Name"
                    class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >Type</label
                >
                <select
                    bind:value={newSacrifice.type}
                    class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                    {#each sacrificeTypes as type}
                        <option value={type}
                            >{type.charAt(0).toUpperCase() +
                                type.slice(1)}</option
                        >
                    {/each}
                </select>
            </div>
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >Donor</label
                >
                <select
                    bind:value={newSacrifice.donorId}
                    class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                    {#each donors as donor}
                        <option value={donor.id}
                            >{donor.name}
                            {donor.surname} ({donor.email})</option
                        >
                    {/each}
                </select>
            </div>
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >Status</label
                >
                <select
                    bind:value={newSacrifice.status}
                    class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                    {#each statuses as status}
                        <option value={status}>{status}</option>
                    {/each}
                </select>
            </div>
            <button
                type="submit"
                class="btn bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 md:col-span-2 py-3 rounded-md transition-colors shadow-md animate-pulse-hover"
            >
                Add Sacrifice
            </button>
            {#if errorMessage}
                <p
                    class="text-red-500 dark:text-red-400 text-sm mt-2 col-span-2"
                >
                    {errorMessage}
                </p>
            {/if}
        </form>
    </div>

    <!-- Edit Modal -->
    {#if editingSacrifice}
        <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            in:fade={{ duration: 200 }}
        >
            <div
                class="card w-full max-w-2xl p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl animate-slide-up"
            >
                <h2
                    class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6"
                >
                    Edit Sacrifice
                </h2>
                <form
                    on:submit|preventDefault={saveEdit}
                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >Photo URL</label
                        >
                        <input
                            bind:value={editingSacrifice.photoUrl}
                            placeholder="https://example.com/photo.jpg"
                            class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >Video URL</label
                        >
                        <input
                            bind:value={editingSacrifice.videoUrl}
                            placeholder="https://example.com/video.mp4"
                            class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >Country</label
                        >
                        <input
                            bind:value={editingSacrifice.country}
                            placeholder="Country"
                            class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >In Whose Name</label
                        >
                        <input
                            bind:value={editingSacrifice.inWhoseName}
                            placeholder="In Whose Name"
                            class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >Type</label
                        >
                        <select
                            bind:value={editingSacrifice.type}
                            class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                            {#each sacrificeTypes as type}
                                <option value={type}
                                    >{type.charAt(0).toUpperCase() +
                                        type.slice(1)}</option
                                >
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >Donor</label
                        >
                        <select
                            bind:value={editingSacrifice.donorId}
                            class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                            {#each donors as donor}
                                <option value={donor.id}
                                    >{donor.name}
                                    {donor.surname} ({donor.email})</option
                                >
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                            >Status</label
                        >
                        <select
                            bind:value={editingSacrifice.status}
                            class="input w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                            {#each statuses as status}
                                <option value={status}>{status}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="md:col-span-2 flex gap-4">
                        <button
                            type="submit"
                            class="btn bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 flex-1 py-3 rounded-md transition-colors shadow-md animate-pulse-hover"
                        >
                            Save Changes
                        </button>
                        <button
                            on:click={cancelEdit}
                            class="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 flex-1 py-3 rounded-md transition-colors shadow-md animate-pulse-hover"
                        >
                            Cancel
                        </button>
                    </div>
                    {#if errorMessage}
                        <p
                            class="text-red-500 dark:text-red-400 text-sm mt-2 col-span-2"
                        >
                            {errorMessage}
                        </p>
                    {/if}
                </form>
            </div>
        </div>
    {/if}

    <div
        class="card bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden"
        in:fade={{ duration: 300 }}
    >
        <h2
            class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 p-6 bg-gray-50 dark:bg-gray-800"
        >
            Sacrifice List
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
                            <th class="p-4 rounded-tl-lg font-semibold"
                                >Photo</th
                            >
                            <th class="p-4 font-semibold">Video</th>
                            <th class="p-4 font-semibold">Country</th>
                            <th class="p-4 font-semibold">In Whose Name</th>
                            <th class="p-4 font-semibold">Type</th>
                            <th class="p-4 font-semibold">Status</th>
                            <th class="p-4 rounded-tr-lg font-semibold"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#each sacrifices as sacrifice}
                            <tr
                                class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <td class="p-4">
                                    <img
                                        src={sacrifice.photoUrl}
                                        alt="Sacrifice"
                                        class="w-16 h-16 object-cover rounded-md"
                                    />
                                </td>
                                <td class="p-4">
                                    <a
                                        href={sacrifice.videoUrl}
                                        target="_blank"
                                        class="text-indigo-600 dark:text-indigo-300 hover:underline"
                                        >View</a
                                    >
                                </td>
                                <td class="p-4">{sacrifice.country}</td>
                                <td class="p-4">{sacrifice.inWhoseName}</td>
                                <td class="p-4">{sacrifice.type}</td>
                                <td class="p-4">
                                    <span
                                        class="{getStatusColor(
                                            sacrifice.status,
                                        )} h-4 w-4 rounded-full inline-block"
                                        title={sacrifice.status}
                                    ></span>
                                </td>
                                <td class="p-4 flex gap-2">
                                    <button
                                        on:click={() => startEditing(sacrifice)}
                                        class="btn bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 px-4 py-2 rounded-md transition-colors animate-pulse-hover"
                                        >Edit</button
                                    >
                                    <button
                                        on:click={() =>
                                            deleteSacrifice(sacrifice.id)}
                                        class="btn bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 px-4 py-2 rounded-md transition-colors animate-pulse-hover"
                                        >Delete</button
                                    >
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>

<style global>
    @import "../../../app.css";
    .animate-pulse-hover:hover {
        animation: pulse 0.5s ease-in-out;
    }
    .animate-slide-up {
        animation: slideUp 0.3s ease-out;
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
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
