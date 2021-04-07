const {createConverter} = require("convert-svg-to-png");
const path = require("path");
const sharp = require('sharp');
const D3Node = require("d3-node");
const {d3} = require("d3-node");

// Set up global variables which can be changed
const width = 400;
const height = 400;
const fileName = "../static/data/UK.json";
const activeFillColor = "#149E9C";
const getRegion = feature => feature.properties.region; // helper func to grab the region of each feature
const getId = feature => feature.properties.PCON11CD; // helper func to grab the unique feature ID of each feature

const convertSvgFiles = async () => {
   // Entry point into main convert GeoJSON to PNG function
    const converter = createConverter();

    try {
        // Load the GeoJSON file which can be located locally (or via a link)
        const file = path.join(__dirname, fileName);
        const json = require(file);

        // Find all the unique regions in our data set, while keeping the features attached to the nested data
        const regions = d3.nest()
            .key(d => getRegion(d))
            .entries(json.features);

        // Go through each region and create a generic FeatureCollection for the polygons within that region
        for (const region of regions) {
        
            // Using the FeatureCollection, center the region with the selected geographic projection
            const projection = d3.geoMercator()
                .fitSize([width, height], {
                    "type": "FeatureCollection",
                    "name": "UK_2",
                    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
                    "features": region.values
                });
            const path = d3.geoPath(projection);
            
            // Go through each feature, or constituency, within the region, 
            // and render it as SVG with the feature highlighted
            const features = region.values;
            for (let feature of features) {
                const renderedSVG = await renderSVG(features, feature, path);
                try {
                    // Using the `sharp` library, take the rendered SVG string and generate a PNG
                    await sharp(Buffer.from(renderedSVG.svgString))
                        .extract({
                            left: 0, 
                            top: renderedSVG.y1, 
                            width: width, 
                            height: renderedSVG.y2 - renderedSVG.y1
                        })
                        .png()
                        .toFile(`./PNGS/${getId(feature)}.png`);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    } finally {
        await converter.destroy();
        process.exit();
    }
};

const renderSVG = async (features, feature, path) => {
    // Use D3 on the back-end to create an SVG of the FeatureCollection
    const d3N = new D3Node();
    const svg = d3N.createSVG(width, height);

    svg
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .style("stroke", "black")
        .style("fill", d => getId(d) === getId(feature) ? activeFillColor : "white")
        .style("shape-rendering", "crispEdges")
        .style("stroke-width", "1px")
        .attr("d", path);

    // Use the bounds of the feature to make sure our images don't have any extra white space around them
    let y1, y2;
    features.forEach(feature => {
        const bound = path.bounds(feature);
        if (!y1 || bound[0][1] < y1) y1 = bound[0][1];
        if (!y2 || bound[1][1] > y2) y2 = bound[1][1];
    });

    const svgString = d3N.svgString();

    return {
             svgString, 
             y1: Math.floor(Math.max(y1, 0)), 
             y2: Math.floor(y2)
           };
};

// Run the application to convert the SVG files
convertSvgFiles()
  .then();