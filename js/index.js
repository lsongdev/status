import { ready } from 'https://lsong.org/scripts/dom.js';
import { h, render, useState, useEffect } from 'https://lsong.org/scripts/components/react.js';

const T = {
  success: 'Operational',
  failed: 'Disrupted'
};

const parseCSV = text => {
  const [head, ...lines] = text.split('\n');
  const columns = head.split(',');
  return lines
    .filter(Boolean)
    .map(line => line.split(',').reduce((row, col, i) => {
      row[columns[i]] = col;
      return row;
    }, {}));
};

const getReport = async () => {
  const res = await fetch(`report.csv?t=` + Date.now());
  const text = await res.text();
  const data = parseCSV(text);
  console.log(data);
  return data;
};

const Services = ({ services }) => {
  return h('section', null, [
    h('h2', null, "Services"),
    h('ul', null, [
      services.map(service => h('li', { className: "service" }, [
        service.name,
        h('span', { className: `service-${service.result}` }, T[service.result])
      ]))
    ])
  ]);
};

const Status = ({n}) => {
  const status = (n > 0 ? "failed-bg" : 'success-bg');
  return h('div', { className: `banner ${status}` }, n ? `${n} Outage(s)` : "All Systems Operational")
}

const Incidents = () => {
  return h('div', { className: "" }, [
    h('h2', {}, "Incidents"),
    h('ul', { className: "" }, [
      h("li", {}, "2021/02/01 08:00 - Site unavailable. Resolved after 5 minutes of downtime."),
      h("li", {}, "2021/01/01 09:00 - User may have problem with API. Incident resolved after 1 hour."),
    ])
  ])
};

const App = () => {
  const [services, setData] = useState([]);
  useEffect(() => {
    getReport().then(setData);
  }, []);
  return h('div', null, [
    h(Status, { n: services.filter(x => x.result === 'failed').length }),
    h(Services, { services }),
    h(Incidents),
  ])
}

ready(() => {
  const app = document.getElementById('app');
  render(h(App), app);
});