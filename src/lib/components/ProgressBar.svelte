<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	let { current, total }: Props = $props();

	let percentage = $derived(total > 0 ? (current / total) * 100 : 0);
</script>

<div class="w-full h-2 bg-base-200 rounded-full overflow-hidden">
	<div
		class="h-full bg-primary transition-all duration-300 ease-out"
		style="width: {percentage}%"
	></div>
</div>
<div class="flex justify-between text-xs text-base-content/50 mt-1 font-medium">
	<span>{current} completed</span>
	<span>{total} total</span>
</div>
