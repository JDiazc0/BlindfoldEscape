import {
  _decorator,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Node,
} from "cc";
import { VisibilityController } from "./VisibilityController";
const { ccclass, property } = _decorator;

@ccclass("PowerUp")
export class PowerUp extends Component {
  @property({ type: VisibilityController })
  public visibilityNode: VisibilityController = null;

  private collider: Collider2D | null = null;

  onLoad() {
    this.collider = this.getComponent(Collider2D);

    if (this.collider) {
      this.collider.sensor = true;

      this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (otherCollider.node.name === "Player") {
      this.visibilityNode.enableVisibility();
      this.node.destroy();
    }
  }

  onDestroy() {
    if (this.collider) {
      this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }
}
