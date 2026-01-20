<script>
  import { alertMessage } from '../../stores';

  $: showAlert = $alertMessage.message !== "";
</script>

{#if showAlert}
  <div class="alert-message dont-print {$alertMessage.type}" id="alert-message">
    {$alertMessage.message}
  </div>
{/if}

<style>
  .alert-message {
    margin: auto;
    margin-bottom: 16px;
    max-width: 350px;
    border-radius: 8px;
    border: 2px solid black;
    padding: 16px;
    color: black;
    font-size: 14px;
  }

  .alert-error {
    background-color: #e0454571;
    border-color: #e04545 !important;
  }

  .alert-success {
    background-color: #4fe04571;
    border-color: #45e071 !important;
  }
</style>

