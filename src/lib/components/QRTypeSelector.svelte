<script>
  import { qrType } from '../../stores';
  import { QR_TYPES } from '../constants';

  function selectType(type) {
    qrType.set(type);
  }

  $: isOrders = $qrType === QR_TYPES.ORDERS;
  $: isBox = $qrType === QR_TYPES.BOX;
  $: isCustom = $qrType === QR_TYPES.CUSTOM;
</script>

<div id="qr-type-container">
  <button
    class="qr-type-btn"
    class:picked-color={isOrders}
    type="button"
    on:click={() => selectType(QR_TYPES.ORDERS)}
  >
    Orders
  </button>
  <button
    class="qr-type-btn"
    class:picked-color={isBox}
    type="button"
    on:click={() => selectType(QR_TYPES.BOX)}
  >
    Box
  </button>
  <button
    class="qr-type-btn"
    class:picked-color={isCustom}
    type="button"
    on:click={() => selectType(QR_TYPES.CUSTOM)}
  >
    Custom
  </button>
</div>

<style>
  #qr-type-container {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .qr-type-btn {
    cursor: pointer;
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgb(41, 41, 41);
  }

  .picked-color {
    background-color: rgb(210, 68, 68) !important;
    color: white !important;
  }
</style>

