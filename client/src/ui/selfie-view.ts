import {LitElement, html, css} from 'lit';
import {customElement, property} from "lit/decorators.js";
import { connect } from '@captaincodeman/rdx'
import { store, State } from '../store';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-top-app-bar';
import './step-login';
import './step-shot';
import './step-confirm';

@customElement("selfie-view")
export class Selfie extends connect(store, LitElement) {
  @property({ type: Number }) private _step = 0
  @property()
  private _username?: string;

  mapState(state: State) {
    return {
      _step: state.selfie.step,
      _username: state.shell.username,
    }
  }

  _selectStep(e) {
    console.log(e);
    store.dispatch.selfie.selectStep(e.detail.index);
  }

  _drawer() {
    this.dispatchEvent(new CustomEvent('drawer', {bubbles: true, composed: true}));
  }

  static get styles() {
    // language=CSS
    return [ css`
      .content {
        display: grid;
        grid-template-rows: min-content 1fr;
      }
      mwc-tab[disabled] {
        pointer-events: none;
      }
      [hidden] {
        display: none;
      }
      `,
    ];
  }

  render() {
    // language=HTML
    return html`
      <mwc-top-app-bar title="lala" @MDCTopAppBar:nav="${this._drawer}">
        <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
        <div slot="title">Selfie erstellen für ${this._username ? this._username : '...'}</div>

        <div class="content">
          <mwc-tab-bar activeIndex="${this._step}">
            <mwc-tab label="Anmelden" ?disabled="${this._step !== 0}"></mwc-tab>
            <mwc-tab label="Selfie erstellen" ?disabled="${this._step !== 1}"></mwc-tab>
            <mwc-tab label="Bestätigung" ?disabled="${this._step !== 2}"></mwc-tab>
          </mwc-tab-bar>
          <step-login ?hidden="${this._step !== 0}" class="content"></step-login>
          <step-shot ?hidden="${this._step !== 1}" class="content"></step-shot>
          <step-confirm ?hidden="${this._step !== 2}" class="content"></step-confirm>
      </div>
    </mwc-top-app-bar>
    `;
  }
}
