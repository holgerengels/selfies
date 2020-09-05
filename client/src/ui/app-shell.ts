import {css, customElement, html, property} from "lit-element";
import {connect, RoutingState} from '@captaincodeman/rdx'
import { store, State } from '../store'
import '@material/mwc-drawer';
import '@material/mwc-snackbar';
import './index'
import {LitElement} from "lit-element";

@customElement('app-shell')
export class AppShellElement extends connect(store, LitElement) {
  @property()
  private _drawerOpen: boolean = false;
  @property()
  private _messages: string[] = [];
  @property()
  private _page: string = '';

  set route(val: RoutingState) {
    if (val.page !== this._page) {
      this._page = val.page
    }
  }

  mapState(state: State) {
    return {
      route: state.routing,
      _messages: state.shell.messages,
    }
  }

  static get styles() {
    // language=CSS
    return [css`
      :host {
        display: contents;
        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: #c67100;
      }
      main {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      .drawer-content {
        display: flex;
        flex-direction: column;
      }
      .drawer-content a {
        margin: 8px 16px;
        font-weight: 400;
        text-decoration: none;
      }
      a {
        margin: 8px 16px;
        text-decoration: underline;
      }
      a[disabled] {
        pointer-events: none;
      }
      [hidden] {
        display: none !important;
      }
   `];
  }

  render() {
    // language=HTML
    return html`
      <mwc-drawer id="drawer" hasheader type="dismissible" ?open="${this._drawerOpen}">
        <span slot="title">Menü</span>
        <div class="drawer-content">
          <a ?selected="${this._page === 'selfie'}" href="/app/selfie">Selfie</a>
          <a ?selected="${this._page === 'report'}" href="/app/report" disabled>Report</a>
        </div>
        <main slot="appContent" class="main-content" role="main" @drawer="${() => this._drawerOpen = !this._drawerOpen}">
          <selfie-view ?hidden="${this._page !== 'selfie'}"></selfie-view>
          <report-view ?hidden="${this._page !== 'report'}"></report-view>
        </main>
      </mwc-drawer>

      ${this._messages.map((message, i) => html`
        <mwc-snackbar id="snackbar" labeltext="${message}" ?open="${i === 0}" style="bottom: 100px"></mwc-snackbar>
      `)}
    `;
  }
}
