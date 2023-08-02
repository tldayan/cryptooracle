import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

class Needle {
  constructor(len, radius1) {
    this.len = len;
    this.radius = radius1;
  }

  drawOn(el, perc) {
    el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
    return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
  }

  animateOn(el, perc) {
    var self = this;
    return el
      .transition()
      .delay(500)
      .ease(d3.easeElastic)
      .duration(3000)
      .selectAll('.needle')
      .tween('progress', function () {
        return function (percentOfPercent) {
          var progress = percentOfPercent * perc;
          return d3.select(this).attr('d', self.mkCmd(progress));
        };
      });
  }

  mkCmd(perc) {
    var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
    thetaRad = this.percToRad(perc / 2); // half circle
    centerX = 0;
    centerY = 0;
    topX = centerX - this.len * Math.cos(thetaRad);
    topY = centerY - this.len * Math.sin(thetaRad);
    leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
    leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
    rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
    rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
    return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
  }

  percToRad(perc) {
    return this.degToRad(this.percToDeg(perc));
  }

  percToDeg(perc) {
    return perc * 360;
  }

  degToRad(deg) {
    return deg * Math.PI / 180;
  }
}

const GaugeChart = () => {

  const [percent, setPercent] = useState(0);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);


  useEffect(() => {
    const el = d3.select(chartRef.current);
    const barWidth = 40;
    const numSections = 3;
    const sectionPerc = 1 / numSections / 2;
    const padRad = 0.05;
    const chartInset = 10;
    let currentPercent = 0.75;


    const fetchIndex = async() => {

        const response = await fetch('https://api.alternative.me/fng/?limit=1')

        const data = await response.json()

        setPercent(data.data[0]["value"] / 100)

        }

    fetchIndex()

    const width = el.node().offsetWidth;
    const height = width;
    const radius = Math.min(width, height) / 2;

    const svg = el
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const chart = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    //gauge bg
    for (let sectionIndx = 1; sectionIndx <= numSections; sectionIndx++) {
      let needle = new Needle(); // Create an instance of the Needle class
      let arcStartRad = needle.percToRad(currentPercent); // Call the method on the instance
      let arcEndRad = arcStartRad + needle.percToRad(sectionPerc); // Call the method on the instance
      currentPercent += sectionPerc;
      let startPadRad = sectionIndx === 1 ? 0 : padRad / 2;
      let endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
      const arcGenerator = d3.arc()
        .outerRadius(radius - chartInset)
        .innerRadius(radius - chartInset - barWidth)
        .startAngle(arcStartRad + startPadRad)
        .endAngle(arcEndRad - endPadRad);

      chart
        .append('path')
        .attr('class', `arc chart-color${sectionIndx}`)
        .attr('d', arcGenerator);
    }

    let needle = new Needle(90, 15);
    needle.drawOn(chart, 0);
    chartInstanceRef.current = chart; 

    return () => {
      svg.remove();
    };
  }, []); 

  useEffect(() => {
    // Updat gauge when the percent changes
    const chart = chartInstanceRef.current;
    if (chart) {
      let needle = new Needle(90, 15);
      needle.animateOn(chart, percent);
    }
  }, [percent]);

  return <div className='index_container'><div className="chart-gauge" ref={chartRef}></div><p className='index_percent'>{(percent * 100).toFixed((0))}</p></div>;
};

export default GaugeChart;