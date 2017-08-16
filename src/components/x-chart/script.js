(function () {
  const componentDocument = document.currentScript.ownerDocument;
  const componentTemplate = componentDocument.querySelector('template').content;

  window.XChart = class XChart extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this.chart = componentTemplate.querySelector('.chart');
      this.svg = this.chart.querySelector('svg');

      this.chart.querySelector('h3').innerHTML = this.innerHTML;

      const percent = this.getAttribute('percent');
      this.svg.querySelector('text').innerHTML = percent;

      const circleList = this.svg.querySelectorAll('circle');
      const strokeWidth = this.getAttribute('stroke-width');

      if (strokeWidth) {
        Array.from(circleList).forEach(circle => circle.setAttribute('stroke-width', strokeWidth));
      }

      const circumference = 465; // PI * 2R
      const circleStrokeDasharray = parseFloat(percent) * circumference / 100;
      circleList[1].setAttribute('stroke-dasharray', circleStrokeDasharray);

      this.shadowRoot.appendChild(componentTemplate.cloneNode(true));
    }
  };

  window.customElements.define('x-chart', window.XChart);
}());
