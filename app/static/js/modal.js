function openDynamicPopup(subitem) {
  closeAllModals();
  const modalTitle = document.getElementById('dynamicModalLabel');
  if (subitem.icon && subitem.icon.class) {
    modalTitle.innerHTML = `<i class="${subitem.icon.class}"></i> ${subitem.name}`;
  } else {
    modalTitle.innerText = subitem.name;
  }

  const identifierBox = document.getElementById('dynamicIdentifierBox');
  const modalContent = document.getElementById('dynamicModalContent');
  if (subitem.identifier) {
    identifierBox.classList.remove('d-none');
    modalContent.value = subitem.identifier;
  } else {
    identifierBox.classList.add('d-none');
    modalContent.value = '';
  }

  const warningBox = document.getElementById('dynamicModalWarning');
  if (subitem.warning) {
    warningBox.classList.remove('d-none');
    document.getElementById('dynamicModalWarningText').innerHTML = marked.parse(subitem.warning);
  } else {
    warningBox.classList.add('d-none');
  }

  const infoBox = document.getElementById('dynamicModalInfo');
  if (subitem.info) {
    infoBox.classList.remove('d-none');
    document.getElementById('dynamicModalInfoText').innerHTML = marked.parse(subitem.info);
  } else {
    infoBox.classList.add('d-none');
  }

  const descriptionText = document.getElementById('dynamicDescriptionText');
  if (!subitem.url && subitem.description) {
    descriptionText.classList.remove('d-none');
    descriptionText.innerText = subitem.description;
  } else {
    descriptionText.classList.add('d-none');
    descriptionText.innerText = '';
  }

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

  const alternativesSection = document.getElementById('dynamicAlternativesSection');
  const alternativesList = document.getElementById('dynamicAlternativesList');
  alternativesList.innerHTML = '';
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

  const childrenSection = document.createElement('div');
  childrenSection.classList.add('mt-4');
  childrenSection.innerHTML = `<h6>Options:</h6><ul class="list-group" id="dynamicChildrenList"></ul>`;

  const childrenList = childrenSection.querySelector('#dynamicChildrenList');
  if (subitem.children && subitem.children.length > 0) {
    subitem.children.forEach(child => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      listItem.innerHTML = `
        <span>
          <i class="${child.icon.class}"></i> ${child.name}
        </span>
        <button class="btn btn-outline-secondary btn-sm">Open</button>
      `;
      listItem.querySelector('button').addEventListener('click', () => openDynamicPopup(child));
      childrenList.appendChild(listItem);
    });
    document.querySelector('.modal-body').appendChild(childrenSection);
  }

  const copyButton = document.getElementById('dynamicCopyButton');
  copyButton.onclick = () => {
    modalContent.select();
    navigator.clipboard.writeText(modalContent.value).then(() => {
      alert('Identifier copied to clipboard!');
    });
  };

  const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
  modal.show();
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal.show');
  modals.forEach(modal => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
          modalInstance.hide();
      }
  });
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}
