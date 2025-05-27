import { _decorator, Collider2D, Component, Contact2DType } from "cc";
import { GameManager } from "../Core/GameManager";
const { ccclass } = _decorator;

@ccclass("NextLevelController")
export class NextLevelController extends Component {
  private col: Collider2D | null = null;

  onLoad(): void {
    this.col = this.getComponent(Collider2D);
    if (this.col) {
      this.col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D): void {
    if (otherCollider.node.name === "Player") {
      const gameManager = GameManager.getInstance();
      if (gameManager) {
        gameManager.loadNextLevel();
      } else {
        const newGameManager = GameManager.createInstance();
        newGameManager.loadNextLevel();
      }
    }
  }
}
