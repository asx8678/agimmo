<script lang="ts">
	import { Button, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import { page } from '$app/state';

	type ShellUser = {
		id: string;
		email: string;
	} | null;

	let { user, children } = $props<{ user: ShellUser; children: any }>();
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
	<Navbar class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
		<NavBrand href="/" class="gap-2">
			<span class="text-xl font-semibold tracking-tight">Codex Agadir</span>
		</NavBrand>

		<div class="flex items-center gap-2 md:order-2">
			{#if user}
				<span class="hidden text-sm text-gray-600 dark:text-gray-300 md:block">{user.email}</span>
				<form method="POST" action="/api/auth/signout">
					<Button type="submit" color="light">Sign out</Button>
				</form>
			{:else}
				<Button href="/signin" color="light">Sign in</Button>
				<Button href="/signup">Get started</Button>
			{/if}
			<NavHamburger />
		</div>

		<NavUl class="mt-4 md:mt-0" activeUrl={page.url.pathname}>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/pricing">Pricing</NavLi>
			{#if user}
				<NavLi href="/dashboard">Dashboard</NavLi>
				<NavLi href="/billing">Billing</NavLi>
			{/if}
		</NavUl>
	</Navbar>

	<main class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
		{@render children?.()}
	</main>
</div>
