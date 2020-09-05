import {LitElement, customElement, property, html, css, query} from 'lit-element'
import { connect } from '@captaincodeman/rdx'
import { store, State } from '../store';
import '@material/mwc-icon-button';
import '@material/mwc-textfield';
import { IconButton } from '@material/mwc-icon-button';

@customElement("cam-snap")
export class Snap extends connect(store, LitElement) {
  @property()
  private _live: boolean = true;

  @query('#canvas')
  // @ts-ignore
  private _canvas: HTMLCanvasElement;
  @query('#video')
  // @ts-ignore
  private _video: HTMLVideoElement;
  @query('#frame')
  // @ts-ignore
  private _frame: HTMLDivElement;
  @query('#snap')
  // @ts-ignore
  private _snap: IconButton;

  @property()
  // @ts-ignore
  private value?: string;

  mapState(state: State) {
    return {
      _step: state.selfie.step,
    }
  }

  firstUpdated() {
    const constraints = { video: true };

    const errBack = function(error) {
      console.log("Video capture error: ", error.code);
      console.log(error);
    };

    navigator.getUserMedia(constraints, function(stream) {
      // @ts-ignore
      this._video.srcObject = stream;
      // @ts-ignore
      var playPromise = this._video.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          console.log("gut");
        }).catch(function(error) {
          console.log("schlecht " + error);
        });
      }
    }.bind(this), errBack);

    this._snap.focus();
  }

  _start() {
    this.value = undefined;
    this.dispatchEvent(new CustomEvent('snap', {bubbles: true, composed: true, detail: {snap: undefined}}));
    this._live = true;
    this._snap.focus();
  }

  _shot() {
    const context = this._canvas.getContext("2d");
    if (!context) return;

    context.drawImage(this._video, 120, 40, 400, 400, 0, 0, 200, 200);
    this.value = this._canvas.toDataURL('image/png');
    this.dispatchEvent(new CustomEvent('snap', {bubbles: true, composed: true, detail: {snap: this.value}}));
    this._live = false;
  }

  _clear() {
    const context = this._canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    var img = new Image();
    img.onload = function () {
      context.drawImage(img, 0, 0);
    };
    img.src = "nophotoavailable.png";
  }

  static get styles() {
    // language=CSS
    return [ css`
      .container {
        position: relative;
        left: 0px; top: 0px; width: 640px; height: 480px;
      }
      .container[disabled] {
        pointer-events: none;
        opacity: 0.5;
      }
      canvas {
        position: absolute;
        left: 120px; top: 40px; width: 400px; height: 400px;
      }
      video {
        position: absolute;
        left: 0px; top: 0px; width: 640px; height: 480px;
        transform: rotateY(180deg);
      }
      #frame {
        position: absolute;
        left: 120px; top: 40px; right: 120px; bottom: 40px;
        border: 2px dotted white;
        background-image: url('bio.svg');
      }
      `,
    ];
  }

  render() {
    // language=HTML
    return html`
      <div class="container" ?live="${this._live}">
      <canvas id="canvas" ?hidden="${this._live}" width="200" height="200"></canvas>
      <video id="video" autoplay ?hidden="${!this._live}"></video>
      <div id="frame" ?hidden="${!this._live}"></div>
      <div style="display: flex; flex-direction: column">
        <mwc-icon-button id="snap" @click="${this._shot}" icon="camera" ?disabled="${!this._live}"></mwc-icon-button>
      </div>
    </div>
    `;
  }
}
