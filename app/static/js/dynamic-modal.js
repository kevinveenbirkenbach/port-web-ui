function openDynamicPopup(subitem) {
    // Set modal title and content
    document.getElementById('dynamicModalLabel').innerText = subitem.description;
    const modalContent = document.getElementById('dynamicModalContent');
    modalContent.value = subitem.address;

    // Add copy functionality
    document.getElementById('dynamicCopyButton').addEventListener('click', function () {
      modalContent.select();
      navigator.clipboard.writeText(modalContent.value)
        .then(() => alert('Content copied to clipboard!'))
        .catch(() => alert('Failed to copy content.'));
    });

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
    modal.show();
  }