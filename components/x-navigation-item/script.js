(function() {
  class XNavigationItem extends HTMLElement {
    static get observedAttributes() {
      return ['selected'];
    }

    constructor() {
      super();

      this.onClick = this.onClick.bind(this);

      this.attachShadow({ mode: 'open' });
      const doc = document.currentScript.ownerDocument;
      const temp = doc.querySelector('template');
      const instance = temp.content.cloneNode(true);
      this.shadowRoot.appendChild(instance);

      this.item = this.shadowRoot.querySelector('.item');
    }

    connectedCallback() {
      this.setData();
      this.item.addEventListener('click', this.onClick);
    }

    disconnectedCallback() {
      this.item.removeEventListener('click', this.onClick);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (newVal) {
        this.item.classList.add('current');
        const hash = `#${this.getAttribute('value')}`;
        history.replaceState({ page: `${hash}` }, '', `${hash}`);
      } else {
        this.item.classList.remove('current');
      }
    }

    setData() {
      this.item.setAttribute('href', `#${this.getAttribute('value')}`);
      this.item.textContent = this.textContent;
      this.selected = !!this.selected;
    }

    onClick() {
      event.preventDefault();

      if (!this.selected) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      }
    }

    get selected() {
      return this.hasAttribute('selected');
    }

    set selected(value) {
      if (value) {
        this.setAttribute('selected', true);
      } else {
        this.removeAttribute('selected');
      }
    }

    set mobile(value) {
      if (value) {
        this.setAttribute('mobile', true);
      } else {
        this.removeAttribute('mobile');
      }
    }
  }

  window.customElements.define('x-navigation-item', XNavigationItem);
})();
