function openDynamicPopup(subitem) {
  // Setze den Titel
  document.getElementById('dynamicModalLabel').innerText = subitem.description;

  // Setze den Identifier, falls vorhanden
  const modalContent = document.getElementById('dynamicModalContent');
  if (subitem.identifier) {
      modalContent.value = subitem.identifier;
  } else {
      modalContent.value = '';
  }

  // Konfiguriere die Warnbox
  const warningBox = document.getElementById('dynamicModalWarning');
  if (subitem.warning) {
      warningBox.classList.remove('d-none');
      document.getElementById('dynamicModalWarningText').innerText = subitem.warning;
  } else {
      warningBox.classList.add('d-none');
  }

  // Konfiguriere die Infobox
  const infoBox = document.getElementById('dynamicModalInfo');
  if (subitem.info) {
      infoBox.classList.remove('d-none');
      document.getElementById('dynamicModalInfoText').innerText = subitem.info;
  } else {
      infoBox.classList.add('d-none');
  }

  // Konfiguriere den Link
  const linkBox = document.getElementById('dynamicModalLink');
  const linkHref = document.getElementById('dynamicModalLinkHref');
  if (subitem.url) {
      linkBox.classList.remove('d-none');
      linkHref.href = subitem.url;
  } else {
      linkBox.classList.add('d-none');
      linkHref.href = '#';
  }

  // Kopierfunktion für den Identifier
  document.getElementById('dynamicCopyButton').addEventListener('click', function () {
      modalContent.select();
      navigator.clipboard.writeText(modalContent.value)
          .then(() => alert('Content copied to clipboard!'))
          .catch(() => alert('Failed to copy content.'));
  });

  // Modal anzeigen
  const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
  modal.show();
}
