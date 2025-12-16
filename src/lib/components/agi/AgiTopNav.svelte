<script lang="ts">
	import { Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	type User = {
		id: string;
		email: string;
	} | null;

	let { user } = $props<{ user: User }>();

	const activeUrl = $derived(page.url.pathname);
	const accountBtnId = 'agi-account-btn';

	const signOut = async () => {
		try {
			await fetch('/api/auth/signout', { method: 'POST' });
		} finally {
			await goto('/signin');
		}
	};
</script>

<Navbar class="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/70">
	<NavBrand href="/" class="gap-2">
		<span class="text-lg font-semibold tracking-tight">Agimmo</span>
	</NavBrand>

	<div class="flex items-center gap-2 md:order-2">
		<Button href="/list-property" class="hidden md:inline-flex bg-gradient-to-r from-emerald-600 to-sky-600 text-white hover:from-emerald-500 hover:to-sky-500">
			List a property
		</Button>

		{#if user}
			<Button id={accountBtnId} color="light" class="hidden md:inline-flex">
				<span class="max-w-[16rem] truncate text-sm">{user.email}</span>
			</Button>
			<Dropdown triggeredBy={'#' + accountBtnId} placement="bottom-end" class="w-56">
				<DropdownHeader>
					<div class="text-sm font-medium text-gray-900 dark:text-gray-100">Account</div>
					<div class="truncate text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
				</DropdownHeader>
				<DropdownItem href="/dashboard">Dashboard</DropdownItem>
				<DropdownItem href="/billing">Billing</DropdownItem>
				<DropdownDivider />
				<DropdownItem onclick={signOut}>Sign out</DropdownItem>
			</Dropdown>
		{:else}
			<Button href="/signin" color="light" class="hidden md:inline-flex">Sign in</Button>
		{/if}

		<NavHamburger />
	</div>

	<NavUl class="mt-4 md:mt-0" activeUrl={activeUrl}>
		<NavLi href="/">Browse</NavLi>
		<NavLi href="/list-property" class="md:hidden">List a property</NavLi>
		{#if user}
			<NavLi href="/dashboard" class="md:hidden">Account</NavLi>
		{:else}
			<NavLi href="/signin" class="md:hidden">Sign in</NavLi>
		{/if}
	</NavUl>
</Navbar>

