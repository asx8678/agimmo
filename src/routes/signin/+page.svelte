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

<div class="mx-auto max-w-md">
	<Card class="border-0 shadow-lg">
		<header class="space-y-1">
			<h1 class="text-2xl font-semibold tracking-tight">Welcome back</h1>
			<p class="text-sm text-gray-600 dark:text-gray-300">Sign in to your dashboard.</p>
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
				<Input id="email" name="email" type="email" autocomplete="email" bind:value={$form.email} required />
			</FormField>

			<FormField name="password" label="Password" errors={$errors.password}>
				<Input id="password" name="password" type="password" autocomplete="current-password" bind:value={$form.password} required />
			</FormField>

			<LoadingButton type="submit" class="w-full" loading={$submitting}>Sign in</LoadingButton>
		</form>

		<p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
			New here?
			<a class="font-medium text-blue-700 hover:underline dark:text-blue-400" href="/signup">Create an account</a>
		</p>
	</Card>
</div>
