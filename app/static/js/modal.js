function openDynamicPopup(subitem) {
  // Setze den Titel
  document.getElementById('dynamicModalLabel').innerText = subitem.description;

  // Setze den Identifier, falls vorhanden
  const identifierBox = document.getElementById('dynamicIdentifierBox');
  const modalContent = document.getElementById('dynamicModalContent');
  if (subitem.identifier) {
      identifierBox.classList.remove('d-none');
      modalContent.value = subitem.identifier;
  } else {
      identifierBox.classList.add('d-none');
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

  // Konfiguriere die Alternativen
  const alternativesList = document.getElementById('dynamicAlternativesList');
  alternativesList.innerHTML = ''; // Clear existing alternatives
  if (subitem.alternatives && subitem.alternatives.length > 0) {
      subitem.alternatives.forEach(alt => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
          listItem.innerHTML = `
            <span>
              <i class="${alt.icon.class}"></i> ${alt.name}
            </span>
            <button class="btn btn-outline-secondary btn-sm" onclick='openDynamicPopup(${JSON.stringify(alt)})'>Open</button>
          `;
          alternativesList.appendChild(listItem);
      });
  } else {
      const noAltItem = document.createElement('li');
      noAltItem.classList.add('list-group-item');
      noAltItem.innerText = 'No alternatives available.';
      alternativesList.appendChild(noAltItem);
  }

  // Kopierfunktion für den Identifier
  document.getElementById('dynamicCopyButton').addEventListener('click', function () {
      modalContent.select();
      navigator.clipboard.writeText(modalContent.value).then(() => {
          alert('Identifier copied to clipboard!');
      });
  });

  // Modal anzeigen
  const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
  modal.show();
}
