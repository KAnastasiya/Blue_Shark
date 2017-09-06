(function() {
  class XChart extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const doc = document.currentScript.ownerDocument;
      const temp = doc.querySelector('template');
      const instance = temp.content.cloneNode(true);
      shadowRoot.appendChild(instance);
    }

    connectedCallback() {
      this.chart = this.shadowRoot.querySelector('.chart');
      this.svg = this.chart.querySelector('svg');
      this.draw();
    }

    draw() {
      const percent = this.getAttribute('percent');
      this.drawCircles(percent);
      this.drawPercent(percent);
      this.setTitle();
    }

    drawCircles(percent) {
      const circleList = this.svg.querySelectorAll('circle');
      const strokeWidth = this.getAttribute('stroke-width');
      const circumference = 439.6; // PI * 2R
      const circleStrokeDasharray = parseFloat(percent) * circumference / 100; // (X% * circumference) / 100%

      if (strokeWidth) {
        Array.from(circleList).forEach(circle => circle.setAttribute('stroke-width', strokeWidth));
      }

      circleList[1].setAttribute(
        'stroke-dasharray',
        `${circleStrokeDasharray} ${circumference - circleStrokeDasharray}`
      );
    }

    drawPercent(percent) {
      const text = this.svg.querySelector('text');
      const textX = percent.length === 4 ? '25' : percent.length === 3 ? '40' : '55';
      text.innerHTML = percent;
      text.setAttribute('x', textX);
    }

    setTitle() {
      this.chart.querySelector('p').innerHTML = this.innerHTML;
    }
  }

  window.customElements.define('x-chart', XChart);
})();
