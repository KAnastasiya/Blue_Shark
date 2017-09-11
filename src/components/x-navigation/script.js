(function() {
  class XNavigation extends HTMLElement {
    static get observedAttributes() {
      return ['mobile'];
    }

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const doc = document.currentScript.ownerDocument;
      const temp = doc.querySelector('template');
      const instance = temp.content.cloneNode(true);
      shadowRoot.appendChild(instance);
    }

    connectedCallback() {
      this.childTagName = 'x-navigation-item';
      this.maxMobileWidth = 1210; // px
      this.addEventListener('change', this.onChange);

      Promise.all([customElements.whenDefined(this.childTagName)]).then(() => {
        if (!this.selectedItem) {
          this.items[0].selected = true;
        }
        this.onResize();
      });

      this.shadowRoot.querySelector('.toggle').addEventListener('click', this.onToggleClick.bind(this));
      window.addEventListener('scroll', this.constructor.debounce(this.onScroll.bind(this), 300));
      window.addEventListener('resize', this.onResize.bind(this));
      document.addEventListener('click', this.onDocumentClick.bind(this));
    }

    disconnectedCallback() {
      this.removeEventListener('change', this.onChange);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      this.items.map(elem => {
        const item = elem;
        return (item.mobile = !!newVal);
      });
    }

    hide() {
      this.opened = false;
    }

    unselectAll() {
      this.items.forEach(elem => {
        const item = elem;
        item.selected = false;
      });
    }

    select(item) {
      this.unselectAll();
      this.constructor.selectItem(item);
    }

    scroll(target) {
      const body = document.body;
      const position = this.constructor.getScrollPosition();
      const targetOffset = document.querySelector(`#${target.getAttribute('value')}`).offsetTop;
      const scrollTranslate = targetOffset > position ? `-${targetOffset - position}` : position - targetOffset;

      body.style.transition = 'transform 1000ms ease';
      body.style.transform = `translate(0, ${scrollTranslate}px)`;

      window.setTimeout(() => {
        body.style.cssText = '';
        window.scrollTo(0, targetOffset);
      }, 900);
    }

    onChange(event) {
      this.select(event.target);
      this.scroll(event.target);
    }

    onToggleClick() {
      this.opened = !this.opened;
    }

    onScroll() {
      this.hide();

      const scrolled = this.items
        .map(item => item.getAttribute('value'))
        .filter(item => document.querySelector(`#${item}`).offsetTop <= this.constructor.getScrollPosition());

      const current = scrolled[scrolled.length - 1] || this.items[0].getAttribute('value');

      this.items.forEach(item => {
        if (item.getAttribute('value') === current) {
          this.select(item);
        }
      });
    }

    onResize() {
      if (window.matchMedia(`(max-width: ${this.maxMobileWidth}px)`).matches) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    }

    onDocumentClick(event) {
      event.stopPropagation();
      if (!event.target.closest('x-navigation')) {
        this.hide();
      }
    }

    get items() {
      return Array.from(this.querySelectorAll(this.childTagName));
    }

    get opened() {
      return this.hasAttribute('opened');
    }

    get selectedItem() {
      return this.items.find(item => item.hasAttribute('selected'));
    }

    set mobile(value) {
      if (value) {
        this.setAttribute('mobile', true);
      } else {
        this.removeAttribute('mobile');
      }
    }

    set opened(value) {
      if (value) {
        this.setAttribute('opened', true);
      } else {
        this.removeAttribute('opened');
      }
    }

    static selectItem(elem) {
      const item = elem;
      item.selected = true;
    }

    static getScrollPosition() {
      let position;
      if (window.pageYOffset) {
        position = window.pageYOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) {
        position = document.documentElement.scrollTop;
      } else if (document.body) {
        position = document.body.scrollTop;
      }

      return Math.ceil(position);
    }

    static debounce(func, wait, immediate) {
      let timeout;
      return function(...args) {
        const callNow = immediate && !timeout;

        const later = () => {
          timeout = null;
          if (!immediate) {
            func.apply(this, args);
          }
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          func.apply(this, args);
        }
      };
    }
  }

  window.customElements.define('x-navigation', XNavigation);
})();
