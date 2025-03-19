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

  function toggleBox(boxId, textId, content) {
    const box = document.getElementById(boxId);
    if (content) {
      box.classList.remove('d-none');
      document.getElementById(textId).innerHTML = marked.parse(content);
    } else {
      box.classList.add('d-none');
    }
  }
  
  toggleBox('dynamicModalWarning', 'dynamicModalWarningText', subitem.warning);
  toggleBox('dynamicModalInfo', 'dynamicModalInfoText', subitem.info);

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
    if (subitem.iframe) {
      linkHref.classList.add('iframe');
      // Attach an event listener that prevents the default behavior and
      // opens the URL in an iframe when clicked.
      linkHref.addEventListener('click', function(event) {
        event.preventDefault();
        openIframe(subitem.url);
        closeAllModals()
      });
    }
  } else {
    linkBox.classList.add('d-none');
    linkHref.href = '#';
  }
  function populateSection(sectionId, listId, items, onClickHandler) {
    const section = document.getElementById(sectionId);
    const list = document.getElementById(listId);
    list.innerHTML = '';
  
    if (items && items.length > 0) {
      section.classList.remove('d-none');
      items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.innerHTML = `
          <span>
            <i class="${item.icon.class}"></i> ${item.name}
          </span>
          <button class="btn btn-outline-secondary btn-sm">Open</button>
        `;
        listItem.querySelector('button').addEventListener('click', () => onClickHandler(item));
        list.appendChild(listItem);
      });
    } else {
      section.classList.add('d-none');
    }
  }
  
  populateSection('dynamicAlternativesSection', 'dynamicAlternativesList', subitem.alternatives, openDynamicPopup);
  populateSection('dynamicChildrenSection', 'dynamicChildrenList', subitem.children, openDynamicPopup);  

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
