import {LitElement, html, css} from 'lit';
import {customElement, property, query} from "lit/decorators.js";
import { connect } from '@captaincodeman/rdx'
import { store, State } from '../store';
import '@material/mwc-button';
import '@material/mwc-textfield';
import { TextField } from '@material/mwc-textfield';

@customElement("step-login")
export class Login extends connect(store, LitElement) {
  @property()
  private _userid: string = '';
  @property()
  private _password: string = '';
  @property()
  private _roles: string[] = [];
  @query('#userid')
  // @ts-ignore
  private _useridField: TextField;

  mapState(state: State) {
    return {
      _roles: state.shell.roles,
    }
  }

  firstUpdated() {
    //this._useridField.focus();
  }

  updated(changedProperties) {
    if (changedProperties.has("_roles") && this._roles.length === 0) {
      this._userid = '';
      this._password = '';
      //this._useridField.focus();
    }
  }

  _login(e) {
    console.log(e);
    store.dispatch.shell.login({userid: this._userid, password: this._password});
  }

  _maybeEnter(e) {
    if (e.keyCode === 13) {
      this._login(e);
    }
  }

  static get styles() {
    // language=CSS
    return [ css`
      .content {
        display: grid;
        grid-template-columns: 1fr 280px 1fr;
        grid-template-rows: 32px min-content min-content min-content 1fr;
        row-gap: 16px;
      }
      .content
      `,
    ];
  }

  render() {
    // language=HTML
    return html`
      <div class="content" @keyup="${this._maybeEnter}">
        <div></div><div></div><div></div>
        <div></div><mwc-textfield id="userid" label="Benutzerkennung" pattern="[a-z0-9.]*" helper="Nur kleine Buchstaben, Ziffern und Punkt" .value=${this._userid} @change="${e => this._userid = e.target.value}"></mwc-textfield><div></div>
        <div></div><mwc-textfield id="password" label="Password" type="password" .value=${this._password} @change="${e => this._password = e.target.value}"></mwc-textfield><div></div>
        <div></div><mwc-button label="Anmelden" @click="${this._login}"></mwc-button>
      </div>
    `;
  }
}
