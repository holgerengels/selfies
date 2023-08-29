import {LitElement, html, css} from 'lit';
import {customElement} from "lit/decorators.js";
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
      .content {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: 32px min-content 1fr;
        row-gap: 16px;
        background-color: var(--mdc-theme-surface);
      }
      a {
        color: var(--app-primary-color);
        margin: 8px 16px;
        font-weight: 500;
        text-decoration: none;
      }
      a:hover {
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
      <div class="content">
        <div></div><div></div><div></div>

        <div></div><a href="/app/selfie">Ich will ein Selfie machen!</a><div></div>

        <div></div><div></div><div></div>
    `;
  }
}
