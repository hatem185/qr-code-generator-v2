<script>
  import { showLoadingIndicator } from '../../stores';
</script>

{#if $showLoadingIndicator}
  <div class="lds-dual-ring dont-print" id="loading-indicator"></div>
{/if}

<style>
  #loading-indicator {
    margin: auto;
  }

  .lds-dual-ring {
    display: block;
    width: 80px;
    height: 80px;
  }

  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid rgb(210, 68, 68);
    border-color: rgb(210, 68, 68) transparent rgb(210, 68, 68) transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

