function openDynamicPopup(subitem) {
  // Schließe alle offenen Modals
  closeAllModals();

  // Setze den Titel mit Icon, falls vorhanden
  const modalTitle = document.getElementById('dynamicModalLabel');
  if (subitem.icon && subitem.icon.class) {
    modalTitle.innerHTML = `<i class="${subitem.icon.class}"></i> ${subitem.name}`;
  } else {
    modalTitle.innerText = subitem.name;
  }

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

  // Konfiguriere die Warnbox mit Markdown
  const warningBox = document.getElementById('dynamicModalWarning');
  if (subitem.warning) {
    warningBox.classList.remove('d-none');
    document.getElementById('dynamicModalWarningText').innerHTML = marked.parse(subitem.warning);
  } else {
    warningBox.classList.add('d-none');
  }

  // Konfiguriere die Infobox mit Markdown
  const infoBox = document.getElementById('dynamicModalInfo');
  if (subitem.info) {
    infoBox.classList.remove('d-none');
    document.getElementById('dynamicModalInfoText').innerHTML = marked.parse(subitem.info);
  } else {
    infoBox.classList.add('d-none');
  }

  // Zeige die Beschreibung, falls keine URL vorhanden ist
  const descriptionText = document.getElementById('dynamicDescriptionText');
  if (!subitem.url && subitem.description) {
    descriptionText.classList.remove('d-none');
    descriptionText.innerText = subitem.description;
  } else {
    descriptionText.classList.add('d-none');
    descriptionText.innerText = '';
  }

  // Konfiguriere den Link oder die Beschreibung
  const linkBox = document.getElementById('dynamicModalLink');
  const linkHref = document.getElementById('dynamicModalLinkHref');
  if (subitem.url) {
    linkBox.classList.remove('d-none');
    linkHref.href = subitem.url;
    linkHref.innerText = subitem.description || "Open Link";
  } else {
    linkBox.classList.add('d-none');
    linkHref.href = '#';
  }

  // Konfiguriere die Alternativen
  const alternativesSection = document.getElementById('dynamicAlternativesSection');
  const alternativesList = document.getElementById('dynamicAlternativesList');
  alternativesList.innerHTML = ''; // Clear existing alternatives
  if (subitem.alternatives && subitem.alternatives.length > 0) {
    alternativesSection.classList.remove('d-none');
    subitem.alternatives.forEach(alt => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      listItem.innerHTML = `
        <span>
          <i class="${alt.icon.class}"></i> ${alt.name}
        </span>
        <button class="btn btn-outline-secondary btn-sm">Open</button>
      `;
      listItem.querySelector('button').addEventListener('click', () => openDynamicPopup(alt));
      alternativesList.appendChild(listItem);
    });
  } else {
    alternativesSection.classList.add('d-none');
  }

  // Kopierfunktion für den Identifier
  const copyButton = document.getElementById('dynamicCopyButton');
  copyButton.onclick = () => {
    modalContent.select();
    navigator.clipboard.writeText(modalContent.value).then(() => {
      alert('Identifier copied to clipboard!');
    });
  };

  // Modal anzeigen
  const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
  modal.show();
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal.show'); // Alle offenen Modals finden
  modals.forEach(modal => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
          modalInstance.hide(); // Modal ausblenden
      }
  });

  // Entferne die "modal-backdrop"-Elemente
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());

  // Entferne die Klasse, die den Hintergrund ausgraut
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}
