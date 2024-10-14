const width = window.innerWidth;
const height = window.innerHeight * 0.7;
const timelineHeight = window.innerHeight * 0.2;

const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const timelineSvg = d3.select("#timeline")
    .append("svg")
    .attr("width", width)
    .attr("height", timelineHeight);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(30))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("cluster", forceCluster());

d3.json("network_data.json").then(data => {
    const nodes = data.nodes.map(d => Object.create(d));
    const links = data.links.map(d => Object.create(d));
    const events = data.events;

    const startDate = new Date(d3.min(nodes, d => d.timestamp));
    const endDate = new Date(d3.max(events, d => d.date));

    const timeScale = d3.scaleTime()
        .domain([startDate, endDate])
        .range([50, width - 50]);

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", "link")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6);

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", d => color(d.cluster));

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    // Timeline
    const timelineAxis = d3.axisBottom(timeScale)
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat("%b %d"));

    timelineSvg.append("g")
        .attr("class", "timeline-axis")
        .attr("transform", `translate(0, ${timelineHeight - 30})`)
        .call(timelineAxis);

    timelineSvg.selectAll(".timeline-axis text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

    timelineSvg.selectAll(".event-marker")
        .data(events)
        .join("circle")
        .attr("class", "event-marker")
        .attr("cx", d => timeScale(new Date(d.date)))
        .attr("cy", timelineHeight - 30)
        .attr("r", 5);

    const eventLabels = timelineSvg.selectAll(".event-label")
        .data(events)
        .join("text")
        .attr("class", "event-label")
        .attr("x", d => timeScale(new Date(d.date)))
        .attr("y", timelineHeight - 40)
        .attr("text-anchor", "middle")
        .text(d => d.event);

    // Wrap long labels
    eventLabels.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/);
        const lineHeight = 1.1;
        const y = text.attr("y");
        const x = text.attr("x");
        const dy = parseFloat(text.attr("dy") || 0);
        
        text.text(null);

        for (let i = 0; i < words.length; i++) {
            const tspan = text.append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", i * lineHeight + dy + "em")
                .text(words[i]);
        }
    });

    // Animation
    const duration = 20000; // 20 seconds for full animation

    d3.timer((elapsed) => {
        const t = Math.min(1, elapsed / duration);
        const currentDate = new Date(startDate.getTime() + t * (endDate.getTime() - startDate.getTime()));

        node.attr("opacity", d => new Date(d.timestamp) <= currentDate ? 1 : 0);
        link.attr("opacity", d => new Date(d.timestamp) <= currentDate ? 0.6 : 0);

        timelineSvg.selectAll(".timeline-progress")
            .data([currentDate])
            .join("line")
            .attr("class", "timeline-progress")
            .attr("x1", d => timeScale(d))
            .attr("y1", 0)
            .attr("x2", d => timeScale(d))
            .attr("y2", timelineHeight - 30)
            .attr("stroke", "#ff6b6b")
            .attr("stroke-width", 2);

        return t === 1;
    });
});

// Custom force to cluster nodes
function forceCluster() {
    const strength = 0.2;
    let nodes;

    function force(alpha) {
        const centroids = d3.rollup(nodes, v => ({
            x: d3.mean(v, d => d.x),
            y: d3.mean(v, d => d.y)
        }), d => d.cluster);

        nodes.forEach(d => {
            const centroid = centroids.get(d.cluster);
            d.vx += (centroid.x - d.x) * strength * alpha;
            d.vy += (centroid.y - d.y) * strength * alpha;
        });
    }

    force.initialize = _ => nodes = _;

    return force;
}