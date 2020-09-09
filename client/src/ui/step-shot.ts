import {LitElement, customElement, property, html, css, query} from 'lit-element'
import { connect } from '@captaincodeman/rdx'
import { store } from '../store';
import './cam-snap';
import {Snap} from "./cam-snap";

@customElement("step-shot")
export class Shot extends connect(store, LitElement) {
  @property() private _photo?: string;
  @query('#snap')
  // @ts-ignore
  private _camSnap: Snap;

  _snap(e) {
    this._photo = e.detail.snap;
  }
  _again() {
    this._photo = undefined;
    this._camSnap._start();
  }

  _abort() {
    store.dispatch.shell.logout();
    this._photo = undefined;
    this._camSnap._start();
  }

  _submit() {
    if (!this._photo) return;
    store.dispatch.selfie.send(this._photo);
    this._photo = undefined;
    this._camSnap._start();
  }

  _maybeSnap(e) {
    if (e.code === "Enter" || e.code === "Space") {
      this._snap(e);
    }
  }

  static get styles() {
    // language=CSS
    return [ css`
      .content {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: 32px min-content min-content 1fr;
        row-gap: 16px;
      }
      `,
    ];
  }

  render() {
    // language=HTML
    return html`
      <div class="content" @keyup="${this._maybeSnap}">
        <div></div><div></div><div></div>
        <div style="text-align: right; margin: 12px;">Auslöser →</div>
        <cam-snap id="snap" @snap="${this._snap}"></cam-snap>
        <div></div>
        <div></div>
        <div style="display: grid; grid-template-columns: auto 1fr auto">
          <mwc-button label="Abbrechen" @click="${this._abort}"></mwc-button>
          <mwc-button label="Hm .. Nochmal!" @click="${this._again}" ?disabled="${!this._photo}"></mwc-button>
          <mwc-button label="Top Foto .. Abschicken!" @click="${this._submit}" ?disabled="${!this._photo}"></mwc-button>
        </div>
        <div></div>
      </div>
    `;
  }
}
