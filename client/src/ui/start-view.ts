import {LitElement, customElement, html, css} from 'lit-element'
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-top-app-bar';
import './step-login';
import './step-shot';
import './step-confirm';

@customElement("start-view")
export class Start extends LitElement {

  static get styles() {
    // language=CSS
    return [ css`
      a {
        color: var(--app-primary-color);
        margin: 8px 16px;
        text-decoration: underline;
      }
      a[selected] {
        color: var(--app-secondary-color);
      }
      a[disabled] {
        pointer-events: none;
        filter: opacity(.7);
      }
      `,
    ];
  }

  render() {
    // language=HTML
    return html`
          <a href="/app/selfie">Ich will ein Selfie machen!</a>
          <a href="/app/report" disabled>Report</a>
    `;
  }
}
