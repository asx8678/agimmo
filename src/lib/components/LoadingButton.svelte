<script lang="ts">
	import { Button, Spinner } from 'flowbite-svelte';

	let { loading = false, disabled, children, ...restProps } = $props<{
		loading?: boolean;
		disabled?: boolean;
		children: any;
		[key: string]: unknown;
	}>();
</script>

<Button {...restProps} disabled={Boolean(disabled) || loading}>
	{#if loading}
		<Spinner size="4" class="me-2" />
	{/if}
	{@render children?.()}
</Button>

