<script lang="ts">
    import { selectedConversation } from "$lib/stores/sms";
    import { api } from "$lib/utils/api";

  let messages = $state([]);
  let loading = $state(true);

  selectedConversation.subscribe( async conversation => {
    const response = await api.get(`/api/sms?port=${conversation?.port}&sender=${conversation?.sender}`)
    loading = false;
    messages = response.data.messages;
  });
</script>