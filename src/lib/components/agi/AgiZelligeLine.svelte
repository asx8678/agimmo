<script lang="ts">
	let { class: className } = $props<{ class?: string }>();
</script>

<div aria-hidden="true" class={"agi-zellige-line h-px w-full " + (className ?? '')}></div>

