const countyURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

const svg = d3.select('svg');
const tooltip = d3.select('#tooltip');

const createMap = () => {
  svg
    .selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
      const id = countyDataItem['id'];
      const county = educationData.find((item) => {
        return item['fips'] === id;
      });
      const percentage = county['bachelorsOrHigher'];
      if (percentage <= 12) {
        return 'rgba(148, 255, 185, 1)';
      } else if (percentage <= 21) {
        return 'rgba(26, 255, 106, 1)';
      } else if (percentage <= 30) {
        return 'rgba(0, 230, 80, 1)';
      } else if (percentage <= 39) {
        return 'rgba(0, 179, 62, 1)';
      } else if (percentage <= 48) {
        return 'rgba(0, 143, 50, 1)';
      } else if (percentage <= 57) {
        return 'rgba(0, 117, 41, 1)';
      } else {
        return 'rgba(0, 71, 25, 1)';
      }
    })
    .attr('data-fips', (countyDataItem) => {
      return countyDataItem['id'];
    })
    .attr('data-education', (countyDataItem) => {
      const id = countyDataItem['id'];
      const county = educationData.find((item) => {
        return item['fips'] === id;
      });
      const percentage = county['bachelorsOrHigher'];
      return percentage;
    })
    .on('mouseover', (countyDataItem) => {
      tooltip.transition().style('visibility', 'visible');

      const id = countyDataItem['id'];
      const county = educationData.find((item) => {
        return item['fips'] === id;
      });

      tooltip.text(
        `${county['area_name']}, ${county['state']} - ${county['bachelorsOrHigher']} %`
      );

      tooltip.attr('data-education', county['bachelorsOrHigher']);
    })
    .on('mouseout', () => {
      tooltip.transition().style('visibility', 'hidden');
    });
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(log);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    console.log(countyData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        createMap();
      }
    });
  }
});
