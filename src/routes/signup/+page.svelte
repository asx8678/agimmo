<script lang="ts">
	import { Card, Input, Alert } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { untrack } from 'svelte';

	import FormField from '$lib/components/FormField.svelte';
	import LoadingButton from '$lib/components/LoadingButton.svelte';

	let { data } = $props();
	const sf = superForm(untrack(() => data.form));
	const { form, errors, enhance, submitting, message } = sf;
</script>

<div class="mx-auto grid min-h-[calc(100vh-12rem)] max-w-md place-items-center">
	<Card size="xl" class="w-full rounded-2xl border-0 bg-white/80 p-6 shadow-xl ring-1 ring-gray-200/70 backdrop-blur dark:bg-gray-950/60 dark:ring-gray-800 sm:p-7">
		<header class="space-y-1">
			<h1 class="text-2xl font-semibold tracking-tight">Create your account</h1>
			<p class="text-sm text-gray-600 dark:text-gray-300">Start exploring with Agimmo.</p>
		</header>

		{#if $errors._errors?.length}
			<div class="mt-4">
				<Alert color="red">{$errors._errors[0]}</Alert>
			</div>
		{/if}

		{#if $message}
			<div class="mt-4">
				<Alert color="red">{$message}</Alert>
			</div>
		{/if}

		<form method="POST" use:enhance class="mt-6 space-y-4">
			<FormField name="email" label="Email" errors={$errors.email}>
				<Input id="email" class="agi-control" name="email" type="email" autocomplete="email" bind:value={$form.email} required />
			</FormField>

			<FormField name="password" label="Password" errors={$errors.password}>
				<Input
					id="password"
					class="agi-control"
					name="password"
					type="password"
					autocomplete="new-password"
					bind:value={$form.password}
					required
				/>
			</FormField>

			<LoadingButton type="submit" class="w-full" loading={$submitting}>Create account</LoadingButton>
		</form>

		<p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
			Already have an account?
			<a class="agi-link" href="/signin">Sign in</a>
		</p>
	</Card>
</div>
