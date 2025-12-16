<script lang="ts">
	import { Label } from 'flowbite-svelte';

	let { name, label, errors, children } = $props<{
		name: string;
		label: string;
		errors?: string[] | undefined;
		children: any;
	}>();
</script>

<div class="space-y-1">
	<Label for={name} class="text-sm font-medium">{label}</Label>
	{@render children?.()}
	{#if errors?.length}
		<p class="text-sm text-red-600 dark:text-red-400">{errors[0]}</p>
	{/if}
</div>

