import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static instance: GameManager | null = null;
  private currentLevel: number = 0;
  private readonly levelList: string[] = ["Level_1"];

  public static getInstance(): GameManager | null {
    return GameManager.instance;
  }

  public static createInstance(): GameManager {
    if (GameManager.instance) {
      return GameManager.instance;
    }

    const node = new Node("GameManager");
    director.addPersistRootNode(node);
    GameManager.instance = node.addComponent(GameManager);
    return GameManager.instance;
  }

  onLoad(): void {
    if (GameManager.instance && GameManager.instance !== this) {
      this.node.destroy();
      return;
    }

    GameManager.instance = this;
    director.addPersistRootNode(this.node);
  }

  onDestroy(): void {
    if (GameManager.instance === this) {
      GameManager.instance = null;
    }
  }

  public startGame(): void {
    this.currentLevel = 0;
    director.loadScene(this.levelList[this.currentLevel]);
  }

  public reloadCurrentScene(): void {
    director.loadScene(director.getScene()!.name);
  }

  public loadNextLevel(): void {
    if (!this.levelList || this.levelList.length === 0) {
      return;
    }

    this.currentLevel++;

    if (this.currentLevel < this.levelList.length) {
      director.loadScene(this.levelList[this.currentLevel]);
    } else {
      director.loadScene("MainMenu");
    }
  }
}
