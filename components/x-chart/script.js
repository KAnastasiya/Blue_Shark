(function () {
  const componentDocument = document.currentScript.ownerDocument;
  const componentTemplate = componentDocument.querySelector('template').content;

  window.XChart = class XChart extends HTMLElement {
    constructor(svgSize = 230, strokeWidth = 12) {
      super();
      this.attachShadow({ mode: 'open' });

      this.params = {
        svgSize: svgSize,
        strokeWidth: strokeWidth,
        get circleRadius()  {
          return this.svgSize / 2 - this.strokeWidth * 2
        },
        get circleCenterX() {
          return -this.svgSize / 2
        },
        get circleCenterY() {
          return this.svgSize / 2
        },
        get circumference() {
          return Math.PI * this.circleRadius * 2
        },
      };

      this.chart = componentTemplate.querySelector('.chart');

      this.chart.querySelector('h3').innerHTML = this.innerHTML;
      this.chart.querySelector('p').innerHTML = this.getAttribute('percent');

      const circle = this.chart.querySelector('.circle');
      const circleValue = parseFloat(this.getAttribute('percent'));
      const circleStrokeDasharray = circleValue * this.params.circumference / 100;

      this.svg = this.chart.querySelector('svg');
      this.svg.setAttribute('width', this.params.svgSize);
      this.svg.setAttribute('height', this.params.svgSize);
      this.svg.innerHTML = this.createCircle() + this.createCircle(circleStrokeDasharray);

      this.shadowRoot.appendChild(componentTemplate.cloneNode(true));
    }

    createCircle (strokeDasharray = this.params.circumference) {
      return ('<circle ' +
        'transform="rotate(-90)" ' +
        'stroke-width="' + this.params.strokeWidth + '" ' +
        'stroke-dasharray="' + strokeDasharray + '" ' +
        'fill="rgba(0,0,0,0)" ' +
        'r="' + this.params.circleRadius + '" ' +
        'cx="' + this.params.circleCenterX + '" ' +
        'cy="' + this.params.circleCenterY + '"' +
      '/>');
    }
  };

  window.customElements.define('x-chart', window.XChart);
}());
