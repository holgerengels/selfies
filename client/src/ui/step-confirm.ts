import {LitElement, html, css} from 'lit';
import {customElement} from "lit/decorators.js";
import { store } from '../store';
import '@material/mwc-button';
import '@material/mwc-textfield';

@customElement("step-confirm")
export class Login extends LitElement {

  _logout(e) {
    console.log(e);
    store.dispatch.shell.logout();
  }

  _maybeEnter(e) {
    if (e.code === "Enter") {
      this._logout(e);
    }
  }

  static get styles() {
    // language=CSS
    return [ css`
      .content {
        display: grid;
        grid-template-columns: 1fr 280px 1fr;
        grid-template-rows: 32px min-content min-content 1fr;
        row-gap: 16px;
      }
      label {
        text-align: center;
      }
      `,
    ];
  }

  render() {
    // language=HTML
    return html`
      <div class="content" @keyup="${this._maybeEnter}">
        <div></div><div></div><div></div>
        <div></div><label>Dein Selfie wurde gespeichert.<br/><br/>Vielen Dank!</label><div></div>
        <div></div><mwc-button label="Abmelden" @click="${this._logout}"></mwc-button>
      </div>
    `;
  }
}
