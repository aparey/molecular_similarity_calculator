import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SimilarityGaugeProps {
  similarity: number;
  size?: number;
}

const SimilarityGauge: React.FC<SimilarityGaugeProps> = ({ similarity, size = 200 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2 * 0.8;
    const centerX = width / 2;
    const centerY = height / 2;

    // Define color scale
    const colorScale = d3.scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(['#EF4444', '#F59E0B', '#10B981']);

    // Create arc for the gauge
    const arcGenerator = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // Background arc
    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', arcGenerator() as string)
      .attr('fill', '#E5E7EB');

    // Value arc
    const valueArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + similarity * Math.PI);

    svg.append('path')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('d', valueArc() as string)
      .attr('fill', colorScale(similarity));

    // Add text
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '1.5rem')
      .attr('font-weight', 'bold')
      .text(`${Math.round(similarity * 100)}%`);

    // Add label
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 25)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '0.875rem')
      .attr('fill', '#6B7280')
      .text('Similarity');

    // Add ticks
    const tickData = [0, 0.25, 0.5, 0.75, 1];
    const tickArc = d3.arc()
      .innerRadius(radius * 1.05)
      .outerRadius(radius * 1.05)
      .startAngle(d => -Math.PI / 2 + d * Math.PI)
      .endAngle(d => -Math.PI / 2 + d * Math.PI);

    const tickGroup = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    tickData.forEach(d => {
      tickGroup.append('text')
        .attr('x', (radius * 1.15) * Math.cos(-Math.PI / 2 + d * Math.PI))
        .attr('y', (radius * 1.15) * Math.sin(-Math.PI / 2 + d * Math.PI))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '0.75rem')
        .attr('fill', '#6B7280')
        .text(`${d * 100}%`);

      tickGroup.append('line')
        .attr('x1', radius * Math.cos(-Math.PI / 2 + d * Math.PI))
        .attr('y1', radius * Math.sin(-Math.PI / 2 + d * Math.PI))
        .attr('x2', radius * 1.05 * Math.cos(-Math.PI / 2 + d * Math.PI))
        .attr('y2', radius * 1.05 * Math.sin(-Math.PI / 2 + d * Math.PI))
        .attr('stroke', '#9CA3AF')
        .attr('stroke-width', 1);
    });

  }, [similarity, size]);

  return (
    <div className="flex items-center justify-center">
      <svg ref={svgRef} width={size} height={size} className="overflow-visible"></svg>
    </div>
  );
};

export default SimilarityGauge;