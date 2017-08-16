(function () {
  const componentDocument = document.currentScript.ownerDocument;
  const componentTemplate = componentDocument.querySelector('template').content;

  window.XChart = class XChart extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this.chart = componentTemplate.querySelector('.chart');
      this.draw();
      this.onPageResize = this.onPageResize.bind(this);
      window.addEventListener('resize', this.onPageResize);

      this.shadowRoot.appendChild(componentTemplate.cloneNode(true));
    }

    draw() {
      this.drawChart();
      this.chart.querySelector('h3').innerHTML = this.innerHTML;
      this.chart.querySelector('p').innerHTML = this.getAttribute('percent');
    }

    drawChart() {
      this.svg = this.chart.querySelector('svg');
      this.setParams();
      this.setSvgAttributes();

      const circle = this.chart.querySelector('.circle');
      const circleValue = parseFloat(this.getAttribute('percent'));
      const circleStrokeDasharray = circleValue * this.circumference / 100;
      this.svg.innerHTML = this.drawCircle() + this.drawCircle(circleStrokeDasharray);
    }

    setParams() {
      this.svgSize = this.getBoundingClientRect().width;
      this.strokeWidth = 10;
      this.circleRadius = this.svgSize / 2 - this.strokeWidth * 2;
      this.circleCenterX = -this.svgSize / 2;
      this.circleCenterY = this.svgSize / 2;
      this.circumference = Math.PI * this.circleRadius * 2;
    }

    setSvgAttributes() {
      this.svg.setAttribute('width', this.svgSize);
      this.svg.setAttribute('height', this.svgSize);
      this.svg.setAttribute('viewBox', `0 0 ${this.svgSize} ${this.svgSize}`);
    }

    drawCircle(strokeDasharray = this.circumference) {
      return ('<circle ' +
        'stroke-width="' + this.strokeWidth + '" ' +
        'stroke-dasharray="' + strokeDasharray + '" ' +
        'r="' + this.circleRadius + '" ' +
        'cx="' + this.circleCenterX + '" ' +
        'cy="' + this.circleCenterY + '"' +
      '/>');
    }

    onPageResize() {
      this.drawChart();
    }
  };

  window.customElements.define('x-chart', window.XChart);
}());
