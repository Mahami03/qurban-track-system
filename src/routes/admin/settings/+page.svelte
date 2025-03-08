<script>
    import { db } from "$lib/firebase";
    import { doc, getDoc, setDoc } from "firebase/firestore";
    import { onMount } from "svelte";

    let settings = {
        orgName: "",
        orgPhone: "",
        orgTitle: "",
    };

    async function loadSettings() {
        const settingsDoc = await getDoc(doc(db, "settings", "institution"));
        if (settingsDoc.exists()) {
            settings = settingsDoc.data();
        }
    }

    async function saveSettings() {
        await setDoc(doc(db, "settings", "institution"), settings);
        alert("Settings saved successfully!");
    }

    onMount(loadSettings);
</script>

<div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Institution Settings</h1>
    <div class="card max-w-lg">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Organization Details
        </h2>
        <form on:submit|preventDefault={saveSettings} class="space-y-6">
            <div>
                <label
                    for="orgName"
                    class="block text-sm font-medium text-gray-700"
                    >Organization Name</label
                >
                <input
                    id="orgName"
                    bind:value={settings.orgName}
                    placeholder="Qurban Foundation"
                    class="input mt-1"
                />
            </div>
            <div>
                <label
                    for="orgPhone"
                    class="block text-sm font-medium text-gray-700"
                    >Phone Number</label
                >
                <input
                    id="orgPhone"
                    bind:value={settings.orgPhone}
                    placeholder="+1 234 567 890"
                    class="input mt-1"
                />
            </div>
            <div>
                <label
                    for="orgTitle"
                    class="block text-sm font-medium text-gray-700">Title</label
                >
                <input
                    id="orgTitle"
                    bind:value={settings.orgTitle}
                    placeholder="Helping Hands"
                    class="input mt-1"
                />
            </div>
            <button type="submit" class="btn btn-primary w-full"
                >Save Settings</button
            >
        </form>
    </div>
</div>

<style global>
    @import "../../../app.css";
</style>
