<script lang="ts">
	import { Button, Spinner } from 'flowbite-svelte';

	let { loading = false, disabled, class: className, children, ...restProps } = $props<{
		loading?: boolean;
		disabled?: boolean;
		class?: string;
		children: any;
		[key: string]: unknown;
	}>();
</script>

<Button
	{...restProps}
	class={'agi-btn-primary ' + (className ?? '')}
	disabled={Boolean(disabled) || loading}
>
	{#if loading}
		<Spinner size="4" class="me-2" />
	{/if}
	{@render children?.()}
</Button>
