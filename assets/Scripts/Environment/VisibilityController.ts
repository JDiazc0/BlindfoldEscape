import { _decorator, CCFloat, Component, Node, Sprite, tween, Color } from "cc";
const { ccclass, property } = _decorator;

@ccclass("VisibilityController")
export class VisibilityController extends Component {
  @property({ type: CCFloat })
  public visibilityTime: number = 5;

  private sprite: Sprite | null = null;
  private currentTween: any = null;

  protected onLoad(): void {
    this.sprite = this.getComponent(Sprite);
    this.disableVisibilty(this.visibilityTime);
  }

  private disableVisibilty(time: number) {
    if (!this.sprite) return;

    if (this.currentTween) {
      this.currentTween.stop();
    }

    const startColor = this.sprite.color.clone();
    startColor.a = 0;
    this.sprite.color = startColor;

    const targetColor = startColor.clone();
    targetColor.a = 255;

    this.currentTween = tween(this.sprite)
      .to(time, { color: targetColor })
      .start();
  }

  public enableVisibility() {
    if (!this.sprite) return;

    if (this.currentTween) {
      this.currentTween.stop();
    }

    const resetColor = this.sprite.color.clone();
    resetColor.a = 0;
    this.sprite.color = resetColor;

    this.disableVisibilty(1);
  }
}
