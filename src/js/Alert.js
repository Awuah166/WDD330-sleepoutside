export default class Alert {
  async init() {
    try {
      const response = await fetch('/json/alerts.json');

      if (!response.ok) {
        return;
      }

      const alerts = await response.json();

      if (!Array.isArray(alerts) || alerts.length === 0) {
        return;
      }

      const mainElement = document.querySelector('main');

      if (!mainElement) {
        return;
      }

      const alertSection = document.createElement('section');
      alertSection.className = 'alert-list';

      alerts.forEach((alert) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = alert.message;
        paragraph.style.background = alert.background || 'transparent';
        paragraph.style.color = alert.color || 'inherit';
        alertSection.appendChild(paragraph);
      });

      mainElement.prepend(alertSection);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to load alerts', error);
    }
  }
}
