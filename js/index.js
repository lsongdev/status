import { ready } from 'https://lsong.org/scripts/dom.js';
import { h, render, useState, useEffect } from 'https://lsong.org/scripts/components/react.js';

const services = [
  {
    name: 'Google',
    status: 'success'
  },
  {
    name: 'Google DNS',
    status: 'success'
  }
];

const T = {
  success: 'Operational',
};

const Services = () => {
  return h('section', null, [
    h('h2', null, "Services"),
    h('ul', null, [
      services.map(service => h('li', { className: "service" }, [
        service.name,
        h('span', { className: `service-${service.status}` }, T[service.status])
      ]))
    ])
  ]);
};

const Status = () => {
  return h('div', { className: "banner success-bg" }, "All Systems Operational")
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
  const [] = useState();
  useEffect(() => {
    console.log('App is ready');
  }, []);
  return h('div', null, [
    h(Status),
    h(Services),
    h(Incidents),
  ])
}

ready(() => {
  const app = document.getElementById('app');
  render(h(App), app);
});